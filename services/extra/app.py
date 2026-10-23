#!/usr/bin/env python3
"""Extra metals (staging): hourly scrape of public quotes for metals not covered by prices-prod.
Stores every genuine update in SQLite; same /latest and /history format as prices-history."""
import os, re, sqlite3, threading, time, logging
from datetime import datetime, timezone, timedelta
import requests
from bs4 import BeautifulSoup
import hmac, secrets, html
from collections import defaultdict
from flask import Flask, jsonify, request, session, redirect, Response

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("extra")
DB_PATH = os.getenv("DB_PATH", "/data/extra.db")
POLL = int(os.getenv("POLL_SECONDS", "3600"))
STALE_HOURS = int(os.getenv("STALE_HOURS", "72"))
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"}
# our id -> (TE slug, native unit); CNY quotes are converted to USD at the ECB rate
TE = {"cobalt": ("cobalt", "USD/t"), "molybdenum": ("molybden", "CNY/kg"), "lithium": ("lithium", "CNY/t"),
      "titanium-sponge": ("titanium", "CNY/kg"), "steel-scrap": ("scrap-steel", "USD/t")}
FX = {}
KITCO_BASE = {"copper": "copper", "nickel": "nickel", "aluminium": "aluminum", "zinc": "zinc", "lead": "lead"}
KITCO_PM = {"AU": "gold", "AG": "silver", "PT": "platinum", "PD": "palladium"}
PRIMARY_URL = os.getenv("PRIMARY_URL", "https://prices-history-production.up.railway.app/latest")
DIVERGE = float(os.getenv("DIVERGE_PCT", "2"))
LB_PER_T = 2204.62262

def fx_cny_usd():
    # ECB reference rate (via frankfurter.dev), refreshed every poll
    j = requests.get("https://api.frankfurter.dev/v1/latest?base=CNY&symbols=USD", timeout=20).json()
    FX.update(rate=float(j["rates"]["USD"]), date=j["date"])
    return FX["rate"]

def kitco_quotes():
    out = {}
    for mid, slug in KITCO_BASE.items():
        t = requests.get(f"https://www.kitco.com/price/base-metals/{slug}", headers=UA, timeout=30).text.replace("\\", "")
        m = re.search(r'GetMetalQuoteV3":\{.*?"bid":([\d.]+).*?"unit":"(\w+)"', t)
        if m: out[mid] = (float(m.group(1)) * (LB_PER_T if m.group(2) == "POUND" else 1), "USD/t")
    t = requests.get("https://www.kitco.com/price/precious-metals", headers=UA, timeout=30).text.replace("\\", "")
    for sym, mid in KITCO_PM.items():
        m = re.search(r'"symbol":"%s","currency":"USD".*?"bid":([\d.]+)' % sym, t)
        if m: out[mid] = (float(m.group(1)), "USD/oz")
    return out

def poll_xcheck():
    k = kitco_quotes()
    prim = {x["id"]: x for x in requests.get(PRIMARY_URL, timeout=20).json()}
    ts = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0).isoformat()
    with db() as c:
        for mid, (kv, unit) in k.items():
            p = prim.get(mid, {}).get("price")
            d = round((kv - p) / p * 100, 2) if p else None
            c.execute("INSERT OR REPLACE INTO xcheck VALUES(?,?,?,?,?,?)", (mid, ts, p, round(kv, 2), d, unit))
            if d is not None and abs(d) > DIVERGE: log.warning("DIVERGE %s primary=%s second=%s (%.2f%%)", mid, p, kv, d)
    log.info("xcheck ok: %d metals", len(k))

app = Flask(__name__)
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
app.secret_key = os.getenv("SECRET_KEY") or secrets.token_hex(32)
app.config.update(SESSION_COOKIE_SECURE=True, SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Strict",
                  PERMANENT_SESSION_LIFETIME=timedelta(hours=12))
# Manual metals: id -> (name, default unit). The first three have no public source;
# the rest can be overridden by hand (auto feed pauses while override is on).
MANUAL = {"tungsten-apt": ("Вольфрам (APT 88,5% WO3)", "USD/mtu"), "antimony": ("Сурьма 99,65%", "USD/t"),
          "graphite": ("Графит чешуйчатый 94–95% C", "USD/t"), "molybdenum": ("Молибден", "USD/kg"),
          "lithium": ("Карбонат лития", "USD/t"), "titanium-sponge": ("Титановая губка", "USD/kg"),
          "cobalt": ("Кобальт", "USD/t"), "steel-scrap": ("Стальной лом HMS 1&2", "USD/t")}
UNITS = ["USD/t", "USD/kg", "USD/mtu", "USD/lb", "USD/oz"]
_fails = defaultdict(list)

def fx_cny():
    # ECB reference rates via frankfurter.app
    return float(requests.get("https://api.frankfurter.app/latest?from=CNY&to=USD", timeout=20).json()["rates"]["USD"])

def poll_mt():
    from curl_cffi import requests as cr
    s = cr.Session()
    for mid, path in MT.items():
        try:
            t = s.get(f"https://www.metaltorg.ru/metal_catalog/metallurgicheskoye_syrye_i_polufabrikaty/{path}/", impersonate="chrome124", timeout=60).content.decode("windows-1251", "replace")
            rows = [re.sub(r"\s+", " ", re.sub("<[^>]+>", " | ", r))[:400] for r in re.findall(r"<tr[^>]*>(.*?)</tr>", t, re.S | re.I) if re.search(r"<td[^>]*>\d[\d.,]*<BR>", r, re.I)]
            txt = re.sub(r"\s+", " ", re.sub(r"<script.*?</script>|<style.*?</style>", " ", t, flags=re.S | re.I)); txt = re.sub("<[^>]+>", " ", txt)
            DEBUG[mid] = rows[:15] or [m.group(0) for m in re.finditer(r".{0,160}(?:\d{2,6}[.,]?\d*\s*(?:долл|\$|USD|руб|юан)).{0,160}", txt)][:12] or [txt[3000:6000]]
        except Exception as e:
            DEBUG[mid] = [repr(e)]
        time.sleep(5)


def db():
    c = sqlite3.connect(DB_PATH, timeout=10); c.row_factory = sqlite3.Row; return c

def init_db():
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    with db() as c:
        c.execute("CREATE TABLE IF NOT EXISTS quotes(metal TEXT, ts TEXT, price REAL, change REAL, unit TEXT, PRIMARY KEY(metal, ts))")
        c.execute("DELETE FROM quotes WHERE unit LIKE 'CNY%'")
        c.execute("CREATE TABLE IF NOT EXISTS manual(metal TEXT, ts TEXT, price REAL, unit TEXT, note TEXT, PRIMARY KEY(metal, ts))")
        c.execute("CREATE TABLE IF NOT EXISTS override(metal TEXT PRIMARY KEY)")
        c.execute("CREATE TABLE IF NOT EXISTS xcheck(metal TEXT, ts TEXT, primary_price REAL, second_price REAL, diff_pct REAL, unit TEXT, PRIMARY KEY(metal, ts))")

def num(s): return float(re.sub(r"[^\d.\-]", "", s.replace(",", "")) or 0)

def poll_te():
    soup = BeautifulSoup(requests.get("https://tradingeconomics.com/commodities", headers=UA, timeout=30).text, "html.parser")
    ts = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0).isoformat()
    n = 0
    with db() as c:
        ov = {r[0] for r in c.execute("SELECT metal FROM override")}
        for mid, (slug, unit) in TE.items():
            if mid in ov: continue
            a = soup.find("a", href=f"/commodity/{slug}")
            tr = a and a.find_parent("tr")
            td = tr.find_all("td") if tr else []
            if len(td) < 4:
                log.warning("TE %s not found", mid); continue
            price, ch = num(td[1].get_text(strip=True)), num(td[3].get_text(strip=True))
            if price <= 0: continue
            if unit.startswith("CNY"):
                price, unit = round(price * fx_cny_usd(), 2), unit.replace("CNY", "USD")
            last = c.execute("SELECT price FROM quotes WHERE metal=? ORDER BY ts DESC LIMIT 1", (mid,)).fetchone()
            if last and last["price"] == price: continue  # no genuine update
            n += c.execute("INSERT OR IGNORE INTO quotes VALUES(?,?,?,?,?)", (mid, ts, price, ch, unit)).rowcount
    log.info("TE poll ok: %d new points", n)

def loop():
    while True:
        try: poll_xcheck()
        except Exception as e: log.error("xcheck failed: %s", e)
        try: poll_te()
        except Exception as e: log.error("poll failed: %s", e)
        time.sleep(POLL)

@app.after_request
def cors(r):
    r.headers["Access-Control-Allow-Origin"] = "*"; r.headers["Cache-Control"] = "no-store"; return r

@app.route("/latest")
def latest():
    with db() as c:
        rows = c.execute("SELECT q.* FROM quotes q JOIN (SELECT metal, MAX(ts) m FROM quotes GROUP BY metal) x ON q.metal=x.metal AND q.ts=x.m").fetchall()
        since = {r["metal"]: r["f"] for r in c.execute("SELECT metal, MIN(ts) f FROM quotes GROUP BY metal")}
        man = {r[0] for r in c.execute("SELECT DISTINCT q.metal FROM quotes q JOIN manual m ON q.metal=m.metal AND q.ts=m.ts")}
        mts = {(r[0], r[1]) for r in c.execute("SELECT metal, ts FROM manual")}
    lim = datetime.now(timezone.utc) - timedelta(hours=STALE_HOURS)
    return jsonify([{"id": r["metal"], "price": r["price"], "change": r["change"], "unit": r["unit"], "ts": r["ts"],
                     "manual": (r["metal"], r["ts"]) in mts,
                     "stale": (r["metal"], r["ts"]) not in mts and datetime.fromisoformat(r["ts"]) < lim, "since": since.get(r["metal"])} for r in rows])

@app.route("/history")
def history():
    mid = request.args.get("id", "").lower()
    days = {"30d": 30, "90d": 90, "1y": 365}.get(request.args.get("range", "30d"), 30)
    frm = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    with db() as c:
        rows = c.execute("SELECT ts, price, unit FROM quotes WHERE metal=? AND ts>=? ORDER BY ts", (mid, frm)).fetchall()
    return jsonify({"id": mid, "unit": rows[-1]["unit"] if rows else None, "points": [[r["ts"], r["price"]] for r in rows]})

@app.route("/xcheck")
def xcheck():
    """Internal: primary vs second source, flagged when they diverge > DIVERGE_PCT."""
    with db() as c:
        rows = c.execute("SELECT x.* FROM xcheck x JOIN (SELECT metal, MAX(ts) m FROM xcheck GROUP BY metal) y ON x.metal=y.metal AND x.ts=y.m").fetchall()
    return jsonify({"fx_cny_usd": FX, "threshold_pct": DIVERGE, "rows": [dict(r) | {"diverge": r["diff_pct"] is not None and abs(r["diff_pct"]) > DIVERGE} for r in rows]})

# ───────────── admin ─────────────
CSS = """<meta name=viewport content="width=device-width,initial-scale=1"><meta name=robots content=noindex>
<style>body{font:16px system-ui,sans-serif;max-width:760px;margin:0 auto;padding:16px;background:#111;color:#eee}
input,select,button{font:inherit;padding:8px;border-radius:6px;border:1px solid #555;background:#1c1c1c;color:#eee;box-sizing:border-box}
button{background:#b8913a;color:#111;border:0;cursor:pointer}.m{border:1px solid #333;border-radius:10px;padding:12px;margin:12px 0}
.row{display:flex;gap:8px;flex-wrap:wrap}.row>*{flex:1 1 120px}small{color:#999}a{color:#d4b25a}table{width:100%;font-size:14px}
.ok{color:#7c7}.err{color:#e77}</style>"""

def page(body, title="Цены — админка"):
    return Response(f"<!doctype html><html lang=ru><head><meta charset=utf-8><title>{title}</title>{CSS}</head><body>{body}</body></html>",
                    headers={"X-Frame-Options": "DENY", "Referrer-Policy": "no-referrer", "Cache-Control": "no-store"})

def csrf():
    if "csrf" not in session: session["csrf"] = secrets.token_urlsafe(32)
    return session["csrf"]

def check_csrf():
    t = request.form.get("csrf", "")
    return t and hmac.compare_digest(t, session.get("csrf", ""))

@app.after_request
def _prefix(resp):
    p = request.headers.get("X-Forwarded-Prefix", "").rstrip("/")
    if p and p.startswith("/") and all(c.isalnum() or c in "/-_" for c in p):
        loc = resp.headers.get("Location")
        if loc and loc.startswith("/admin"): resp.headers["Location"] = p + loc
        elif loc and loc.startswith("https://") and "/admin" in loc and p not in loc:
            h, _, rest = loc[8:].partition("/"); resp.headers["Location"] = "https://" + h + p + "/" + rest
        if resp.mimetype == "text/html" and not resp.direct_passthrough:
            b = resp.get_data(as_text=True)
            for a in ("action='", "href='", 'action="', 'href="'):
                b = b.replace(a + "/admin", a + p + "/admin")
            resp.set_data(b)
    return resp

def https_only():
    return request.headers.get("X-Forwarded-Proto", "https") == "https"

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if not https_only(): return redirect("https://" + request.host + request.path)
    msg = ""
    if request.method == "POST":
        ip = (request.headers.get("X-Forwarded-For") or request.remote_addr or "").split(",")[0].strip()
        now = time.time(); _fails[ip] = [t for t in _fails[ip] if now - t < 900]
        if len(_fails[ip]) >= 5:
            msg = "Слишком много попыток. Попробуйте через 15 минут."
        elif not check_csrf():
            msg = "Сессия устарела, попробуйте ещё раз."
        elif ADMIN_PASSWORD and hmac.compare_digest(request.form.get("password", ""), ADMIN_PASSWORD):
            session.clear(); session.permanent = True; session["ok"] = True; csrf()
            return redirect("/admin")
        else:
            _fails[ip].append(now); time.sleep(1); msg = "Неверный пароль."
    return page(f"<h2>Вход</h2><p class=err>{msg}</p><form method=post><input type=hidden name=csrf value='{csrf()}'>"
                "<div class=row><input type=password name=password placeholder='Пароль' autocomplete=current-password required>"
                "<button>Войти</button></div></form>")

@app.route("/admin", methods=["GET"])
def admin():
    if not https_only(): return redirect("https://" + request.host + request.path)
    if not session.get("ok"): return redirect("/admin/login")
    tok = csrf(); out = ["<h2>Ручной ввод цен</h2><p><small>Цена в долларах США. Каждое сохранение попадает в историю и на сайт "
                         "с отметкой «обновлено ДД.ММ.ГГГГ».</small> <a href='/admin/logout'>Выйти</a></p>"]
    if request.args.get("m"): out.append(f"<p class=ok>{html.escape(request.args['m'])}</p>")
    with db() as c:
        ov = {r[0] for r in c.execute("SELECT metal FROM override")}
        for mid, (name, du) in MANUAL.items():
            hist = c.execute("SELECT ts, price, unit, note FROM manual WHERE metal=? ORDER BY ts DESC LIMIT 5", (mid,)).fetchall()
            auto = mid in TE
            unit = hist[0]["unit"] if hist else du
            opts = "".join(f"<option{' selected' if u == unit else ''}>{u}</option>" for u in UNITS)
            rows = "".join(f"<tr><td>{datetime.fromisoformat(h['ts']).strftime('%d.%m.%Y %H:%M')}</td><td>{h['price']:g} {h['unit']}</td>"
                           f"<td>{html.escape(h['note'] or '')}</td><td><form method=post action='/admin/delete' style=margin:0>"
                           f"<input type=hidden name=csrf value='{tok}'><input type=hidden name=metal value='{mid}'>"
                           f"<input type=hidden name=ts value='{h['ts']}'><button style='background:#633;color:#eee;padding:2px 8px'>×</button></form></td></tr>" for h in hist)
            state = ("<small>Автоисточник есть; " + ("<b>сейчас ручной режим</b>" if mid in ov else "сейчас автоматически") + "</small>") if auto else "<small>Только ручной ввод</small>"
            back = (f"<form method=post action='/admin/auto' style='display:inline'><input type=hidden name=csrf value='{tok}'>"
                    f"<input type=hidden name=metal value='{mid}'><button style='background:#345;color:#eee'>Вернуть авто</button></form>") if mid in ov else ""
            out.append(f"<div class=m><b>{name}</b><br>{state} {back}<form method=post action='/admin/save'>"
                       f"<input type=hidden name=csrf value='{tok}'><input type=hidden name=metal value='{mid}'><div class=row>"
                       f"<input name=price inputmode=decimal placeholder='Цена, USD' required><select name=unit>{opts}</select>"
                       f"<input name=note maxlength=200 placeholder='Примечание (необязательно)'><button>Сохранить</button></div></form>"
                       f"{'<table>' + rows + '</table>' if rows else ''}</div>")
    return page("".join(out))

@app.route("/admin/save", methods=["POST"])
def admin_save():
    if not session.get("ok") or not check_csrf(): return Response("Forbidden", 403)
    mid = request.form.get("metal", ""); unit = request.form.get("unit", "")
    try: price = float(request.form.get("price", "").replace(" ", "").replace(",", "."))
    except ValueError: price = 0
    if mid not in MANUAL or unit not in UNITS or not (0 < price < 1e9): return redirect("/admin?m=Ошибка: проверьте цену")
    note = request.form.get("note", "")[:200]
    ts = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with db() as c:
        prev = c.execute("SELECT price FROM quotes WHERE metal=? ORDER BY ts DESC LIMIT 1", (mid,)).fetchone()
        ch = round((price - prev["price"]) / prev["price"] * 100, 2) if prev and prev["price"] else 0.0
        c.execute("INSERT INTO manual VALUES(?,?,?,?,?)", (mid, ts, price, unit, note))
        c.execute("INSERT OR REPLACE INTO quotes VALUES(?,?,?,?,?)", (mid, ts, price, ch, unit))
        if mid in TE: c.execute("INSERT OR IGNORE INTO override VALUES(?)", (mid,))
    log.info("manual price saved: %s", mid)
    return redirect("/admin?m=Сохранено")

@app.route("/admin/delete", methods=["POST"])
def admin_delete():
    if not session.get("ok") or not check_csrf(): return Response("Forbidden", 403)
    mid, ts = request.form.get("metal", ""), request.form.get("ts", "")
    with db() as c:
        c.execute("DELETE FROM manual WHERE metal=? AND ts=?", (mid, ts))
        c.execute("DELETE FROM quotes WHERE metal=? AND ts=?", (mid, ts))
        if not c.execute("SELECT 1 FROM manual WHERE metal=?", (mid,)).fetchone(): c.execute("DELETE FROM override WHERE metal=?", (mid,))
    log.info("manual price deleted: %s", mid)
    return redirect("/admin?m=Удалено")

@app.route("/admin/auto", methods=["POST"])
def admin_auto():
    if not session.get("ok") or not check_csrf(): return Response("Forbidden", 403)
    with db() as c: c.execute("DELETE FROM override WHERE metal=?", (request.form.get("metal", ""),))
    threading.Thread(target=poll_te, daemon=True).start()
    return redirect("/admin?m=Автоисточник включён")

@app.route("/admin/logout")
def admin_logout():
    session.clear(); return redirect("/admin/login")

@app.route("/health")
def health(): return jsonify(ok=True)

init_db()
threading.Thread(target=loop, daemon=True).start()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8080")))
