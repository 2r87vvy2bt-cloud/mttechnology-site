#!/usr/bin/env python3
"""
Price history service.

Polls the prices service every POLL_SECONDS, normalises units and stores each
genuine price update in SQLite (on a Railway volume).  Exposes:

  GET /latest                     last known value per metal (+ timestamp, stale flag)
  GET /history?id=copper&range=30d|1y   series of real stored points
  GET /health
"""
import logging
import os
import sqlite3
import threading
import time
from datetime import datetime, timezone, timedelta

import requests
from flask import Flask, jsonify, request

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

PRICES_URL   = os.getenv("PRICES_URL", "http://prices-prod.railway.internal:8080/prices")
DB_PATH      = os.getenv("DB_PATH", "/data/history.db")
POLL_SECONDS = int(os.getenv("POLL_SECONDS", "900"))
STALE_HOURS  = int(os.getenv("STALE_HOURS", "6"))

# Metals whose upstream value is a fixed placeholder — never stored.
SKIP = {"rhodium"}

LB_PER_T = 2204.62262

app = Flask(__name__)


def db():
    c = sqlite3.connect(DB_PATH, timeout=10)
    c.row_factory = sqlite3.Row
    return c


def init_db():
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    with db() as c:
        c.execute("""CREATE TABLE IF NOT EXISTS quotes(
            metal TEXT NOT NULL, ts TEXT NOT NULL, price REAL NOT NULL,
            change REAL, unit TEXT NOT NULL, PRIMARY KEY(metal, ts))""")


def normalise(item):
    """Return (price, unit) in USD/t or USD/oz, or None if unknown unit."""
    price = float(item["price"])
    u = (item.get("typeOfPrice") or "").lower().replace(" ", "")
    if "lbs" in u or "/lb" in u:
        return round(price * LB_PER_T, 2), "USD/t"
    if "oz" in u:
        return round(price, 2), "USD/oz"
    if u in ("usd/t", "$/т", "$/t", "usd/т"):
        return round(price, 2), "USD/t"
    return None


def poll_once():
    r = requests.get(PRICES_URL, timeout=20)
    r.raise_for_status()
    now = datetime.now(timezone.utc)
    hour = now.replace(minute=0, second=0, microsecond=0).isoformat()
    n = 0
    with db() as c:
        for it in r.json():
            mid = it.get("id")
            if not mid or mid in SKIP or it.get("price") in (None, 0):
                continue
            nu = normalise(it)
            if not nu:
                continue
            # Prefer the upstream fetch time; fall back to the current hour bucket.
            ts = it.get("updatedAt") or hour
            cur = c.execute("INSERT OR IGNORE INTO quotes(metal,ts,price,change,unit) VALUES(?,?,?,?,?)",
                            (mid, ts, nu[0], it.get("change"), nu[1]))
            n += cur.rowcount
    log.info("Poll ok: %d new points", n)


def loop():
    while True:
        try:
            poll_once()
        except Exception as e:  # keep last good values; just log
            log.error("Poll failed: %s", e)
        time.sleep(POLL_SECONDS)


@app.route("/latest")
def latest():
    with db() as c:
        rows = c.execute("""SELECT q.* FROM quotes q JOIN
            (SELECT metal, MAX(ts) m FROM quotes GROUP BY metal) x
            ON q.metal=x.metal AND q.ts=x.m""").fetchall()
        first = c.execute("SELECT metal, MIN(ts) f FROM quotes GROUP BY metal").fetchall()
    since = {r["metal"]: r["f"] for r in first}
    lim = datetime.now(timezone.utc) - timedelta(hours=STALE_HOURS)
    out = []
    for r in rows:
        ts = datetime.fromisoformat(r["ts"])
        out.append({"id": r["metal"], "price": r["price"], "change": r["change"], "unit": r["unit"],
                    "ts": r["ts"], "stale": ts < lim, "since": since.get(r["metal"])})
    return jsonify(out)


@app.route("/history")
def history():
    mid = request.args.get("id", "").lower()
    rng = request.args.get("range", "30d")
    days = {"30d": 30, "90d": 90, "1y": 365}.get(rng, 30)
    frm = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    with db() as c:
        rows = c.execute("SELECT ts, price, unit FROM quotes WHERE metal=? AND ts>=? ORDER BY ts",
                         (mid, frm)).fetchall()
    pts = [[r["ts"], r["price"]] for r in rows]
    if days > 30:  # one point per day (last value of the day)
        byday = {}
        for ts, p in pts:
            byday[ts[:10]] = [ts[:10], p]
        pts = list(byday.values())
    return jsonify({"id": mid, "range": rng, "unit": rows[-1]["unit"] if rows else None,
                    "from": pts[0][0] if pts else None, "to": pts[-1][0] if pts else None,
                    "count": len(pts), "points": pts})


@app.route("/health")
def health():
    with db() as c:
        n = c.execute("SELECT COUNT(*) FROM quotes").fetchone()[0]
    return jsonify({"status": "ok", "points": n})


init_db()
threading.Thread(target=loop, daemon=True).start()

if __name__ == "__main__":
    app.run(host="::", port=8080)
