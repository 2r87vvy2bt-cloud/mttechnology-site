#!/usr/bin/env python3
"""
Blog service — fetches articles from Fastmarkets WordPress API,
stores them in SQLite with images and categories, translates via MyMemory.
Exposes:
  GET  /posts?lang=en&page=1&per_page=10&category=<id>
  GET  /posts/<id>?lang=en
  POST /posts/<id>/view
  GET  /categories
  GET  /health
"""

import threading
import time
import logging
import sqlite3
import os
import requests
from flask import Flask, jsonify, request, g

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

FASTMARKETS_API   = "https://www.fastmarkets.com/wp-json/wp/v2"
FETCH_INTERVAL         = 86400   # daily
TRANSLATE_RETRY_DELAY  = 30 * 60  # retry translation 30 min after Lingva failure
MAX_PER_CATEGORY  = 20

# Fastmarkets sits behind CloudFront, which answers 403 to the default
# python-requests user agent.
FASTMARKETS_HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "application/json",
}

CATEGORIES = {
    96:   "Battery Materials",
    13:   "Electric Vehicles",
    98:   "Cobalt",
    107:  "Graphite",
    40:   "Black Mass",
    102:  "Ferrous Scrap",
    142:  "Ferro-Molybdenum",
    106:  "Energy Storage",
    140:  "Ferro-Chrome",
    152:  "Ferro-Nickel",
    3988: "Green Steel",
    104:  "Electrification",
    15:   "Freight",
}

SKIP_CATEGORIES = {"Critical Minerals"}

# WP category IDs whose articles must never be stored
SKIP_CATEGORY_IDS = {8}  # 8 = Pricing notice

# Skip posts whose titles contain these phrases
SKIP_TITLE_PHRASES = [
    "pricing notice",
    "proposal to amend",
    "delayed publication",
    "incorrect publication",
    "fastmarkets amends",
    "fastmarkets decides to amend",
    "fastmarkets clarifies",
    "fastmarkets launches",
    "pricing schedule",
]

LINGVA_INSTANCES = [
    "https://lingva.ml",
    "https://lingva.garudalinux.org",
]

LIBRETRANSLATE_URL = os.getenv("LIBRETRANSLATE_URL", "https://libretranslate-production-e076.up.railway.app/translate")

DB_PATH = os.getenv("DB_PATH", "blog.db")

# ── Database ──────────────────────────────────────────────────────────────────

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH, timeout=10)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA journal_mode=WAL")
    return g.db

@app.teardown_appcontext
def close_db(exc=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def init_db():
    with sqlite3.connect(DB_PATH, timeout=10) as db:
        db.execute("PRAGMA journal_mode=WAL")
        db.executescript("""
            CREATE TABLE IF NOT EXISTS articles (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                fm_id      INTEGER UNIQUE NOT NULL,
                title      TEXT NOT NULL,
                excerpt    TEXT,
                content    TEXT,
                image_url  TEXT,
                date       TEXT,
                link       TEXT,
                categories TEXT,
                source     TEXT DEFAULT '',
                fetched_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS translations (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                fm_id      INTEGER NOT NULL,
                lang       TEXT NOT NULL,
                title      TEXT,
                excerpt    TEXT,
                content    TEXT,
                UNIQUE(fm_id, lang)
            );

            CREATE TABLE IF NOT EXISTS views (
                fm_id INTEGER PRIMARY KEY,
                count INTEGER DEFAULT 0
            );
        """)
        # Migrate existing DBs that may lack the source column
        try:
            db.execute("ALTER TABLE articles ADD COLUMN source TEXT DEFAULT ''")
        except sqlite3.OperationalError:
            pass
        # Remove articles from excluded categories
        deleted = db.execute("""DELETE FROM translations WHERE fm_id IN (
            SELECT fm_id FROM articles
            WHERE ',' || categories || ',' LIKE '%,Critical Minerals,%'
        )""").rowcount
        deleted_a = db.execute("""DELETE FROM articles
            WHERE ',' || categories || ',' LIKE '%,Critical Minerals,%'
        """).rowcount
        if deleted_a:
            log.info("Removed %d Critical Minerals articles (%d translations)", deleted_a, deleted)
    log.info("DB initialised at %s", DB_PATH)


def _seed_static_articles():
    import json
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static_articles.json")
    if not os.path.exists(json_path):
        return

    def _sections_to_content(sections):
        parts = []
        for s in sections:
            if s.get("subtitle"):
                parts.append(f'**{s["subtitle"]}**')
            if s.get("description"):
                parts.append(s["description"])
            if s.get("image"):
                parts.append(f'[IMG:{s["image"]}]')
        return "\n\n".join(parts)

    with open(json_path, encoding="utf-8") as f:
        articles = json.load(f)

    inserted = 0
    with sqlite3.connect(DB_PATH, timeout=10) as db:
        for art in articles:
            en = art["en"]
            cur = db.execute(
                """INSERT OR IGNORE INTO articles
                   (fm_id, title, excerpt, content, image_url, date, link, categories, source, fetched_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))""",
                (art["fm_id"], en["title"], en["excerpt"],
                 _sections_to_content(en["sections"]),
                 art["image_url"], art["date"], "", art["categories"], "MT Technology"),
            )
            if cur.rowcount:
                db.execute(
                    "INSERT OR IGNORE INTO views (fm_id, count) VALUES (?, ?)",
                    (art["fm_id"], art["views"]),
                )
                inserted += 1
            for lang in ("ru", "de"):
                t = art[lang]
                db.execute(
                    """INSERT OR REPLACE INTO translations (fm_id, lang, title, excerpt, content)
                       VALUES (?, ?, ?, ?, ?)""",
                    (art["fm_id"], lang, t["title"], t["excerpt"],
                     _sections_to_content(t["sections"])),
                )
    if inserted:
        log.info("Seeded %d static articles", inserted)

# ── Helpers ───────────────────────────────────────────────────────────────────

def _strip_html(html: str) -> str:
    import re, html as _html
    # Extract Flourish interactive charts before stripping scripts
    def _extract_flourish(m):
        vid = re.search(r'data-src=["\']visualisation/(\d+)', m.group(0), re.IGNORECASE)
        return f'\n[CHART:{vid.group(1)}]\n' if vid else '\n'
    text = re.sub(r'<div[^>]*flourish-embed[^>]*>.*?</div>', _extract_flourish,
                  html, flags=re.IGNORECASE | re.DOTALL)
    # Strip executable/invisible content entirely (including body)
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<noscript[^>]*>.*?</noscript>', '', text, flags=re.IGNORECASE | re.DOTALL)
    # Remove iframes, audio embeds, promo blocks and audio figures
    text = re.sub(r'<iframe[^>]*>.*?</iframe>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<audio[^>]*>.*?</audio>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<figure[^>]*class="[^"]*audio[^"]*"[^>]*>.*?</figure>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<div[^>]*PagePromo[^>]*>.*?</div>\s*</div>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<div[^>]*wp-block-media-text[^>]*>.*?</div>\s*</div>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<div[^>]*wp-block-buttons[^>]*>.*?</div>\s*</div>', '', text, flags=re.IGNORECASE | re.DOTALL)
    # Extract inline images from wp-block-image figures as [IMG:url] markers
    def _extract_img(m):
        src = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', m.group(0), re.IGNORECASE)
        return f'\n[IMG:{src.group(1)}]\n' if src else '\n'
    text = re.sub(r'<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>.*?</figure>',
                  _extract_img, text, flags=re.IGNORECASE | re.DOTALL)
    # Mark headings with ** so JS can render them bold
    def _mark_heading(m):
        inner = re.sub(r'<[^>]+>', '', m.group(1)).strip()
        return f'\n**{inner}**\n' if inner else '\n'
    text = re.sub(r'<h[1-6][^>]*>(.*?)</h[1-6]>', _mark_heading, text, flags=re.IGNORECASE | re.DOTALL)
    # Preserve inline bold and italic as markers
    text = re.sub(r'<strong[^>]*>(.*?)</strong>', r'__\1__', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<b[^>]*>(.*?)</b>', r'__\1__', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<em[^>]*>(.*?)</em>', r'_\1_', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<i[^>]*>(.*?)</i>', r'_\1_', text, flags=re.IGNORECASE | re.DOTALL)
    # Add bullet prefix to list items
    text = re.sub(r'<li[^>]*>', '• ', text, flags=re.IGNORECASE)
    # Block-level tags → newline to preserve paragraph structure
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</(p|div|li|ul|ol|blockquote|tr)>', '\n', text, flags=re.IGNORECASE)
    # Remove remaining tags
    text = re.sub(r'<[^>]+>', '', text)
    # Collapse runs of spaces/tabs, keep newlines
    text = re.sub(r'[ \t]+', ' ', text)
    # Max two consecutive newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = _html.unescape(text).strip()
    # Remove boilerplate podcast/promo paragraphs (heading + following paragraph)
    boilerplate = [
        r'\*\*Listen to the full episode\*\*',
        r'\*\*Listen to the podcast\*\*',
        r'\*\*Subscribe to.*?\*\*',
    ]
    for pattern in boilerplate:
        # Remove the heading and the paragraph immediately after it
        text = re.sub(
            pattern + r'\s*\n\n[^\n]+(\n[^\n]+)*?(?=\n\n|\Z)',
            '', text, flags=re.IGNORECASE
        )
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def _clean_title(raw: str) -> str:
    import html as _html
    return _html.unescape(raw)

def _should_skip(title: str) -> bool:
    t = title.lower()
    return any(phrase in t for phrase in SKIP_TITLE_PHRASES)

def _fetch_image_url(media_id: int) -> str:
    if not media_id:
        return ""
    try:
        resp = requests.get(
            f"{FASTMARKETS_API}/media/{media_id}",
            params={"_fields": "source_url,media_details"},
            headers=FASTMARKETS_HEADERS,
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        sizes = data.get("media_details", {}).get("sizes", {})
        for size in ("full", "large", "fm-post-list-z-desktop", "medium", "thumbnail"):
            if size in sizes:
                return sizes[size].get("source_url", "")
        return data.get("source_url", "")
    except Exception as e:
        log.warning("Failed to fetch image %s: %s", media_id, e)
        return ""

def _get_category_names(cat_ids: list) -> list:
    return [CATEGORIES[c] for c in cat_ids if c in CATEGORIES]

# ── Fastmarkets fetching ──────────────────────────────────────────────────────

def fetch_and_store():
    from datetime import datetime, timedelta

    with sqlite3.connect(DB_PATH, timeout=10) as db:
        row = db.execute(
            "SELECT MAX(date) FROM articles WHERE source IS NULL OR source != 'MT Technology'"
        ).fetchone()
        latest_date = row[0]

    after_param = None
    if latest_date:
        after_dt = datetime.strptime(latest_date, '%Y-%m-%d') - timedelta(days=1)
        after_param = after_dt.strftime('%Y-%m-%dT00:00:00')

    seen_ids: set = set()
    to_store = []

    for cat_id in CATEGORIES.keys():
        params = {
            "categories":         str(cat_id),
            "categories_exclude": ",".join(str(i) for i in SKIP_CATEGORY_IDS),
            "per_page":           MAX_PER_CATEGORY,
            "_fields":            "id,title,excerpt,content,date,link,featured_media,categories",
            "orderby":            "date",
            "order":              "desc",
        }
        if after_param:
            params["after"] = after_param
        try:
            resp = requests.get(
                f"{FASTMARKETS_API}/posts",
                params=params,
                headers=FASTMARKETS_HEADERS,
                timeout=15,
            )
            resp.raise_for_status()
            for post in resp.json():
                if post["id"] in seen_ids:
                    continue
                seen_ids.add(post["id"])
                # Defense-in-depth: skip if post slipped through with excluded category IDs
                if SKIP_CATEGORY_IDS.intersection(post.get("categories", [])):
                    continue
                title = _clean_title(post["title"]["rendered"])
                cat_names = _get_category_names(post.get("categories", []))
                if not _should_skip(title) and not SKIP_CATEGORIES.intersection(cat_names):
                    to_store.append(post)
        except Exception as e:
            log.error("Fetch category %s failed: %s", cat_id, e)

    stored = 0
    with sqlite3.connect(DB_PATH, timeout=10) as db:
        for post in to_store:
            title     = _clean_title(post["title"]["rendered"])
            image_url = _fetch_image_url(post.get("featured_media"))
            cat_names = _get_category_names(post.get("categories", []))
            cur = db.execute("""
                INSERT OR IGNORE INTO articles
                    (fm_id, title, excerpt, content, image_url, date, link, categories, fetched_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            """, (
                post["id"], title,
                _strip_html(post["excerpt"]["rendered"]),
                _strip_html(post["content"]["rendered"]),
                image_url, post["date"][:10], post["link"],
                ",".join(cat_names),
            ))
            if cur.rowcount:
                db.execute("INSERT OR IGNORE INTO views (fm_id, count) VALUES (?, 0)", (post["id"],))
                stored += 1

    log.info("Stored %d new articles", stored)

def _translate_one(row, lang: str) -> bool:
    """Translate a single article into lang, save to DB. Returns False if Lingva is down."""
    title   = _translate_text(row["title"],   lang)
    excerpt = _translate_text(row["excerpt"],  lang)
    content = _translate_text(row["content"],  lang)
    if title is None and excerpt is None:
        return False
    with sqlite3.connect(DB_PATH, timeout=10) as db:
        db.execute(
            "INSERT OR REPLACE INTO translations (fm_id, lang, title, excerpt, content) "
            "VALUES (?, ?, ?, ?, ?)",
            (row["fm_id"], lang,
             title   or row["title"],
             excerpt or row["excerpt"],
             content or row["content"])
        )
    return True

def _translate_all_background() -> bool:
    """Translate all untranslated articles. For each article, translate all missing languages.
    Returns True if everything translated (or nothing to do), False if provider was down."""
    langs = ["ru", "de", "bg"]
    try:
        with sqlite3.connect(DB_PATH, timeout=10) as db:
            db.row_factory = sqlite3.Row
            rows = db.execute("""
                SELECT a.* FROM articles a
                WHERE (SELECT COUNT(*) FROM translations t WHERE t.fm_id = a.fm_id) < 3
                ORDER BY a.date DESC
            """).fetchall()
    except Exception as e:
        log.error("Background translation error: %s", e)
        return True

    if not rows:
        return True

    log.info("Background translate: %d articles need translation", len(rows))
    for row in rows:
        with sqlite3.connect(DB_PATH, timeout=10) as db:
            done = {r[0] for r in db.execute(
                "SELECT lang FROM translations WHERE fm_id=?", (row["fm_id"],)
            ).fetchall()}
        missing = [l for l in langs if l not in done]
        for lang in missing:
            ok = _translate_one(row, lang)
            if not ok:
                log.warning("Translation provider unavailable, stopping")
                return False
            time.sleep(15)
    return True

def _next_run_delay() -> float:
    """Seconds until the next scheduled run at 08:00, 12:00, or 18:00 UTC."""
    from datetime import datetime, timezone, timedelta
    now = datetime.now(timezone.utc)
    today = now.date()
    slots = [8, 12, 18]
    for hour in slots:
        t = datetime(today.year, today.month, today.day, hour, 0, 0, tzinfo=timezone.utc)
        if t > now:
            return (t - now).total_seconds()
    # All slots passed today — wait until 08:00 tomorrow
    tomorrow = today + timedelta(days=1)
    t = datetime(tomorrow.year, tomorrow.month, tomorrow.day, 8, 0, 0, tzinfo=timezone.utc)
    return (t - now).total_seconds()

def _translate_with_retry():
    """Run translation; if Lingva is down, retry once after TRANSLATE_RETRY_DELAY."""
    ok = _translate_all_background()
    if not ok:
        log.info("Lingva unavailable — will retry translation in %d min", TRANSLATE_RETRY_DELAY // 60)
        time.sleep(TRANSLATE_RETRY_DELAY)
        log.info("Retrying translation after delay")
        _translate_all_background()

def _remove_excluded_category_articles():
    """One-time cleanup: find stored articles that belong to SKIP_CATEGORY_IDS and delete them."""
    try:
        with sqlite3.connect(DB_PATH, timeout=10) as db:
            fm_ids = [r[0] for r in db.execute("SELECT fm_id FROM articles WHERE source IS NULL OR source != 'MT Technology'").fetchall()]
        if not fm_ids:
            return
        # Batch-query WP API to find which stored articles have excluded category IDs
        to_delete = []
        for i in range(0, len(fm_ids), 100):
            batch = fm_ids[i:i+100]
            try:
                resp = requests.get(
                    f"{FASTMARKETS_API}/posts",
                    params={"include": ",".join(str(x) for x in batch), "per_page": 100, "_fields": "id,categories"},
                    timeout=15,
                )
                if resp.ok:
                    for post in resp.json():
                        if SKIP_CATEGORY_IDS.intersection(post.get("categories", [])):
                            to_delete.append(post["id"])
            except Exception as e:
                log.warning("Excluded category check failed: %s", e)
        if to_delete:
            with sqlite3.connect(DB_PATH, timeout=10) as db:
                placeholders = ",".join("?" * len(to_delete))
                db.execute(f"DELETE FROM translations WHERE fm_id IN ({placeholders})", to_delete)
                deleted = db.execute(f"DELETE FROM articles WHERE fm_id IN ({placeholders})", to_delete).rowcount
                log.info("Removed %d Pricing notice articles", deleted)
    except Exception as e:
        log.error("_remove_excluded_category_articles failed: %s", e)

def _refresh_loop(translate=True):
    _seed_static_articles()
    _remove_excluded_category_articles()
    fetch_and_store()
    if translate:
        _translate_with_retry()
    while True:
        delay = _next_run_delay()
        log.info("Next fetch in %.0f min at next scheduled slot (08/12/18 UTC)", delay / 60)
        time.sleep(delay)
        fetch_and_store()
        if translate:
            _translate_with_retry()

# ── Translation ───────────────────────────────────────────────────────────────

def _libretranslate_chunk(text: str, target_lang: str) -> str | None:
    """Translate via self-hosted LibreTranslate. Returns None on failure."""
    try:
        resp = requests.post(
            LIBRETRANSLATE_URL,
            json={"q": text, "source": "en", "target": target_lang},
            timeout=30,
        )
        if resp.status_code == 200:
            result = resp.json().get("translatedText", "")
            if result and result != text:
                return result
        else:
            log.warning("LibreTranslate HTTP %s: %s", resp.status_code, resp.text[:100])
    except Exception as e:
        log.warning("LibreTranslate failed: %s", e)
    return None

def _mymemory_translate_chunk(text: str, target_lang: str) -> str | None:
    """Translate a single chunk via MyMemory API. Returns None on failure."""
    try:
        resp = requests.get(
            "https://api.mymemory.translated.net/get",
            params={"q": text, "langpair": f"en|{target_lang}"},
            timeout=15,
        )
        if resp.status_code == 200:
            data = resp.json()
            status = data.get("responseStatus")
            if status == 200:
                result = data["responseData"].get("translatedText", "")
                if result and result != text:
                    return result
            else:
                log.warning("MyMemory returned status %s: %s", status, data.get("responseDetails", ""))
        else:
            log.warning("MyMemory HTTP %s", resp.status_code)
    except Exception as e:
        log.warning("MyMemory failed: %s", e)
    return None

def _lingva_translate_chunk(text: str, target_lang: str) -> str | None:
    """Translate a single chunk via Lingva. Returns None on failure."""
    import urllib.parse
    encoded = urllib.parse.quote(text, safe="")
    for base in LINGVA_INSTANCES:
        try:
            resp = requests.get(
                f"{base}/api/v1/en/{target_lang}/{encoded}",
                timeout=15,
            )
            if resp.status_code == 200:
                result = resp.json().get("translation", "")
                if result and result != text:
                    return result
        except Exception as e:
            log.warning("Lingva %s failed: %s", base, e)
    return None

def _translate_chunk(text: str, target_lang: str) -> str | None:
    """Try LibreTranslate first, then MyMemory, then Lingva."""
    result = _libretranslate_chunk(text, target_lang)
    if result is not None:
        return result
    result = _mymemory_translate_chunk(text, target_lang)
    if result is not None:
        return result
    return _lingva_translate_chunk(text, target_lang)

def _translate_text(text: str, target_lang: str) -> str | None:
    """Translate text by batching paragraphs with [N] markers.
    Returns None if all translation providers are unavailable."""
    import re as _re
    if not text:
        return text

    paragraphs = text.split("\n\n")
    translated_paras = [""] * len(paragraphs)
    any_success = False

    # Group paragraphs into batches ≤350 chars, joined with [N] markers
    # Passthrough markers ([IMG:…] [CHART:…]) are never sent to Lingva
    PASSTHROUGH = ('[IMG:', '[CHART:')

    batches = []   # list of (batch_text, [(original_index, para), ...])
    current_indices, current_parts, current_len = [], [], 0
    for idx, para in enumerate(paragraphs):
        if para.startswith(PASSTHROUGH):
            # Flush current batch, then add this para as a no-translate entry
            if current_indices:
                batches.append((current_indices, current_parts))
                current_indices, current_parts, current_len = [], [], 0
            translated_paras[idx] = para   # keep as-is
            continue
        marker = f" [{idx}] "
        addition = len(para) + len(marker)
        if current_len + addition > 350 and current_indices:
            batches.append((current_indices, current_parts))
            current_indices, current_parts, current_len = [], [], 0
        current_indices.append(idx)
        current_parts.append(para)
        current_len += addition

    if current_indices:
        batches.append((current_indices, current_parts))

    for indices, parts in batches:
        # Build marked batch: "para0 [1] para1 [2] para2"
        marked = parts[0]
        for i, part in enumerate(parts[1:], 1):
            marked += f" [{i}] {part}"

        result = _translate_chunk(marked[:400], target_lang)
        if result is not None:
            any_success = True
            # Split back on [N] markers
            pieces = _re.split(r'\s*\[\d+\]\s*', result)
            for i, orig_idx in enumerate(indices):
                translated_paras[orig_idx] = pieces[i] if i < len(pieces) else parts[i]
        else:
            for i, orig_idx in enumerate(indices):
                translated_paras[orig_idx] = parts[i]

    if not any_success:
        return None
    return "\n\n".join(translated_paras)

def get_translation(db, article: sqlite3.Row, lang: str) -> dict:
    """Return cached translation or original English — never blocks on live translation."""
    if lang == "en":
        return dict(article)

    row = db.execute(
        "SELECT title, excerpt, content FROM translations WHERE fm_id=? AND lang=?",
        (article["fm_id"], lang)
    ).fetchone()

    if row:
        return {**dict(article), "title": row["title"], "excerpt": row["excerpt"], "content": row["content"]}

    # Translation not yet ready — return English, background worker will translate soon
    return dict(article)

def _format_article(row: dict, views: int) -> dict:
    source = row.get("source") or "© Fastmarkets"
    return {
        "id":         row["fm_id"],
        "title":      row["title"],
        "excerpt":    row["excerpt"],
        "content":    row["content"],
        "image_url":  row.get("image_url", ""),
        "date":       row["date"],
        "link":       row.get("link") or "",
        "categories": [c for c in (row.get("categories") or "").split(",") if c],
        "views":      views,
        "source":     source,
    }

# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/posts")
def get_posts():
    lang       = request.args.get("lang", "en")
    page       = max(1, int(request.args.get("page", 1)))
    per_page   = min(100, int(request.args.get("per_page", 10)))
    category   = request.args.get("category", "")

    if lang not in ("en", "ru", "de", "bg"):
        lang = "en"

    db = get_db()

    where = "WHERE a.categories LIKE ?" if category else ""
    params_filter = [f"%{category}%"] if category else []

    total = db.execute(
        f"SELECT COUNT(*) FROM articles a {where}", params_filter
    ).fetchone()[0]

    offset = (page - 1) * per_page
    rows = db.execute(
        f"SELECT a.*, COALESCE(v.count, 0) as views FROM articles a "
        f"LEFT JOIN views v ON a.fm_id = v.fm_id "
        f"{where} ORDER BY a.date DESC LIMIT ? OFFSET ?",
        params_filter + [per_page, offset]
    ).fetchall()

    result = [_format_article(get_translation(db, row, lang), row["views"]) for row in rows]
    return jsonify({"total": total, "page": page, "data": result})


@app.route("/posts/<int:fm_id>")
def get_post(fm_id):
    lang = request.args.get("lang", "en")
    if lang not in ("en", "ru", "de", "bg"):
        lang = "en"

    db  = get_db()
    row = db.execute(
        "SELECT a.*, COALESCE(v.count, 0) as views FROM articles a "
        "LEFT JOIN views v ON a.fm_id = v.fm_id WHERE a.fm_id = ?",
        (fm_id,)
    ).fetchone()

    if not row:
        return jsonify({"error": "Not found"}), 404

    translated = get_translation(db, row, lang)
    return jsonify(_format_article(translated, row["views"]))


@app.route("/posts/<int:fm_id>/view", methods=["POST"])
def increment_view(fm_id):
    db = get_db()
    db.execute(
        "INSERT INTO views (fm_id, count) VALUES (?, 1) ON CONFLICT(fm_id) DO UPDATE SET count = count + 1",
        (fm_id,)
    )
    db.commit()
    return jsonify({"ok": True})


@app.route("/translate", methods=["POST"])
def trigger_translate():
    t = threading.Thread(target=_translate_all_background, daemon=True)
    t.start()
    return jsonify({"ok": True, "message": "Translation started in background"})


@app.route("/categories")
def get_categories():
    db   = get_db()
    rows = db.execute("SELECT categories FROM articles WHERE categories != ''").fetchall()
    counts = {}
    for row in rows:
        for cat in row["categories"].split(","):
            cat = cat.strip()
            if cat:
                counts[cat] = counts.get(cat, 0) + 1
    result = [{"name": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: -x[1])]
    return jsonify(result)


@app.route("/health")
def health():
    db    = get_db()
    total = db.execute("SELECT COUNT(*) FROM articles").fetchone()[0]
    trans = db.execute("SELECT COUNT(*) FROM translations").fetchone()[0]
    return jsonify({"status": "ok", "articles": total, "translations": trans})


# ── Startup ───────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    t = threading.Thread(target=_refresh_loop, daemon=True)
    t.start()
    app.run(host="0.0.0.0", port=8083, debug=False)
