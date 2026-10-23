#!/usr/bin/env python3
"""Extra metals (staging): hourly scrape of public quotes for metals not covered by prices-prod.
Stores every genuine update in SQLite; same /latest and /history format as prices-history."""
import os, re, sqlite3, threading, time, logging
from datetime import datetime, timezone, timedelta
import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("extra")
DB_PATH = os.getenv("DB_PATH", "/data/extra.db")
POLL = int(os.getenv("POLL_SECONDS", "3600"))
STALE_HOURS = int(os.getenv("STALE_HOURS", "72"))
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"}
# our id -> (TE slug, unit)
TE = {"cobalt": ("cobalt", "USD/t"), "molybdenum": ("molybden", "CNY/kg"), "lithium": ("lithium", "CNY/t"),
      "titanium-sponge": ("titanium", "CNY/kg"), "steel-scrap": ("scrap-steel", "USD/t")}
app = Flask(__name__)

def db():
    c = sqlite3.connect(DB_PATH, timeout=10); c.row_factory = sqlite3.Row; return c

def init_db():
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    with db() as c:
        c.execute("CREATE TABLE IF NOT EXISTS quotes(metal TEXT, ts TEXT, price REAL, change REAL, unit TEXT, PRIMARY KEY(metal, ts))")

def num(s): return float(re.sub(r"[^\d.\-]", "", s.replace(",", "")) or 0)

def poll_te():
    soup = BeautifulSoup(requests.get("https://tradingeconomics.com/commodities", headers=UA, timeout=30).text, "html.parser")
    ts = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0).isoformat()
    n = 0
    with db() as c:
        for mid, (slug, unit) in TE.items():
            a = soup.find("a", href=f"/commodity/{slug}")
            tr = a and a.find_parent("tr")
            td = tr.find_all("td") if tr else []
            if len(td) < 4:
                log.warning("TE %s not found", mid); continue
            price, ch = num(td[1].get_text(strip=True)), num(td[3].get_text(strip=True))
            if price <= 0: continue
            last = c.execute("SELECT price FROM quotes WHERE metal=? ORDER BY ts DESC LIMIT 1", (mid,)).fetchone()
            if last and last["price"] == price: continue  # no genuine update
            n += c.execute("INSERT OR IGNORE INTO quotes VALUES(?,?,?,?,?)", (mid, ts, price, ch, unit)).rowcount
    log.info("TE poll ok: %d new points", n)

def loop():
    while True:
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
    lim = datetime.now(timezone.utc) - timedelta(hours=STALE_HOURS)
    return jsonify([{"id": r["metal"], "price": r["price"], "change": r["change"], "unit": r["unit"], "ts": r["ts"],
                     "stale": datetime.fromisoformat(r["ts"]) < lim, "since": since.get(r["metal"])} for r in rows])

@app.route("/history")
def history():
    mid = request.args.get("id", "").lower()
    days = {"30d": 30, "90d": 90, "1y": 365}.get(request.args.get("range", "30d"), 30)
    frm = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    with db() as c:
        rows = c.execute("SELECT ts, price, unit FROM quotes WHERE metal=? AND ts>=? ORDER BY ts", (mid, frm)).fetchall()
    return jsonify({"id": mid, "unit": rows[-1]["unit"] if rows else None, "points": [[r["ts"], r["price"]] for r in rows]})

@app.route("/health")
def health(): return jsonify(ok=True)

init_db()
threading.Thread(target=loop, daemon=True).start()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8080")))
