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
        c.execute("CREATE TABLE IF NOT EXISTS xcheck(metal TEXT, ts TEXT, primary_price REAL, second_price REAL, diff_pct REAL, unit TEXT, PRIMARY KEY(metal, ts))")

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

@app.route("/xcheck")
def xcheck():
    """Internal: primary vs second source, flagged when they diverge > DIVERGE_PCT."""
    with db() as c:
        rows = c.execute("SELECT x.* FROM xcheck x JOIN (SELECT metal, MAX(ts) m FROM xcheck GROUP BY metal) y ON x.metal=y.metal AND x.ts=y.m").fetchall()
    return jsonify({"fx_cny_usd": FX, "threshold_pct": DIVERGE, "rows": [dict(r) | {"diverge": r["diff_pct"] is not None and abs(r["diff_pct"]) > DIVERGE} for r in rows]})

@app.route("/health")
def health(): return jsonify(ok=True)

init_db()
threading.Thread(target=loop, daemon=True).start()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8080")))
