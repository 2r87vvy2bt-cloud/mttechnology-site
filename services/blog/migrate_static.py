#!/usr/bin/env python3
import sqlite3, json, os

DB_PATH = os.getenv("DB_PATH", "blog.db")

with open("static_articles.json", encoding="utf-8") as f:
    ARTICLES = json.load(f)

def sections_to_content(sections):
    parts = []
    for s in sections:
        if s.get("subtitle"):
            parts.append(f'**{s["subtitle"]}**')
        if s.get("description"):
            parts.append(s["description"])
        if s.get("image"):
            parts.append(f'[IMG:{s["image"]}]')
    return "\n\n".join(parts)

with sqlite3.connect(DB_PATH, timeout=10) as db:
    db.execute("PRAGMA journal_mode=WAL")
    try:
        db.execute("ALTER TABLE articles ADD COLUMN source TEXT DEFAULT ''")
        print("Added source column")
    except sqlite3.OperationalError:
        pass

    inserted = 0
    for art in ARTICLES:
        en = art["en"]
        cur = db.execute(
            """INSERT OR IGNORE INTO articles
               (fm_id, title, excerpt, content, image_url, date, link, categories, source, fetched_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))""",
            (art["fm_id"], en["title"], en["excerpt"],
             sections_to_content(en["sections"]),
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
                 sections_to_content(t["sections"])),
            )

    print(f"Inserted {inserted} new articles, translations loaded for all {len(ARTICLES)}")
