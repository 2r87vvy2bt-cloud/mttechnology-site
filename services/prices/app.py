#!/usr/bin/env python3
"""
Prices service — replaces the .NET GetPricesService.
Sources: LME (curl_cffi), TradingEconomics (requests), MetalTorg (curl_cffi).
Exposes: GET /get_price?id=<metal>  →  {"id", "price", "change", "typeOfPrice"}
Cache: in-memory, refreshed every hour in background.
"""

import re
import threading
import time
import logging
from flask import Flask, jsonify, request
from curl_cffi import requests as cffi_requests
import requests as std_requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)

# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────

# TradingEconomics slugs: our metal_id → TE URL slug
# LME metals added here as fallback since Cloudflare blocks Railway IPs on lme.com
TE_METALS = {
    "aluminium": "aluminum",
    "copper":    "copper",
    "zinc":      "zinc",
    "nickel":    "nickel",
    "lead":      "lead",
    "tin":       "tin",
    "gold":      "gold",
    "silver":    "silver",
    "platinum":  "platinum",
    "palladium": "palladium",
    "rhodium":   "rhodium",
}

METALTORG_METALS = {
    "ferrochrome":    "ferrokhrom",
    "ferromanganese": "ferromarganets",
    "ferromolybdenum":"ferromolibden",
    "ferrosilicon":   "ferrosilitsii",
    "ferrotitanium":  "ferrotitan",
    "ferrotungsten":  "ferrovolfram",
    "ferrovanadium":  "ferrovanadii",
    "silicomanganese":"silikomarganets",
    "ferroniobium":   "ferroniobii",
}

UPDATE_INTERVAL = 3600  # seconds

# ──────────────────────────────────────────────
# Cache
# ──────────────────────────────────────────────

_cache: dict[str, dict] = {}
_cache_lock = threading.Lock()


def set_price(metal_id: str, price: float, change: float, type_of_price: str = ""):
    with _cache_lock:
        _cache[metal_id] = {
            "id": metal_id,
            "price": round(price, 2),
            "change": round(change, 2),
            "typeOfPrice": type_of_price,
        }
    log.info(f"  {metal_id}: ${price:.2f}  {change:+.2f}%")


def get_cached(metal_id: str):
    with _cache_lock:
        return _cache.get(metal_id)


# ──────────────────────────────────────────────
# Scrapers
# ──────────────────────────────────────────────

def scrape_lme():
    """LME — curl_cffi with Chrome TLS impersonation (bypasses Cloudflare)."""
    session = cffi_requests.Session()
    for metal_id, path in LME_METALS.items():
        try:
            resp = session.get(
                f"https://www.lme.com/Metals/{path}",
                impersonate="chrome124",
                timeout=20,
            )
            soup = BeautifulSoup(resp.text, "html.parser")

            price_el = soup.select_one(".hero-metal-data__number")
            change_el = soup.select_one(".hero-metal-data__change")
            type_el   = soup.select_one(".hero-metal-data__text")

            if not price_el:
                log.warning(f"LME {metal_id}: price element not found")
                continue

            price  = float(price_el.get_text(strip=True).replace(",", ""))
            change_text = change_el.get_text(strip=True) if change_el else "0%"
            change = float(re.sub(r"[^\d.\-]", "", change_text) or 0)
            type_of_price = type_el.get_text(strip=True) if type_el else ""

            set_price(metal_id, price, change, type_of_price)
        except Exception as e:
            log.error(f"LME {metal_id}: {e}")


def scrape_trading_economics():
    """TradingEconomics — plain HTTP, prices are server-rendered in HTML table."""
    try:
        resp = std_requests.get(
            "https://tradingeconomics.com/commodities",
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
            timeout=20,
        )
        soup = BeautifulSoup(resp.text, "html.parser")

        for metal_id, te_slug in TE_METALS.items():
            try:
                link = soup.find("a", href=f"/commodity/{te_slug}")
                if not link:
                    log.warning(f"TE {metal_id}: link not found")
                    continue

                row = link.find_parent("tr")
                if not row:
                    continue

                cells = row.find_all("td")
                if len(cells) < 2:
                    continue

                price_text  = cells[1].get_text(strip=True).replace(",", "")
                change_text = cells[3].get_text(strip=True) if len(cells) > 3 else "0"

                price  = float(price_text)
                change = float(re.sub(r"[^\d.\-]", "", change_text) or 0)

                # Unit from the small div under the metal name
                unit_el = link.find_next("div", style=lambda s: s and "font-size" in s)
                type_of_price = unit_el.get_text(strip=True) if unit_el else ""

                set_price(metal_id, price, change, type_of_price)
            except Exception as e:
                log.error(f"TE {metal_id}: {e}")
    except Exception as e:
        log.error(f"TradingEconomics fetch failed: {e}")


def scrape_metaltorg():
    """MetalTorg — windows-1251 encoding, old HTML 4 — use regex directly."""
    base = "https://www.metaltorg.ru/metal_catalog/metallurgicheskoye_syrye_i_polufabrikaty/ferrosplavy"
    session = cffi_requests.Session()

    for metal_id, slug in METALTORG_METALS.items():
        try:
            resp = session.get(f"{base}/{slug}", impersonate="chrome124", timeout=20)
            content = resp.content.decode("windows-1251", errors="replace")

            # Find first price: <td ...>NUMBER<BR> pattern
            price_match = re.search(
                r'<td[^>]*>(\d{3,6})<BR>', content, re.IGNORECASE
            )
            if not price_match:
                log.warning(f"MetalTorg {metal_id}: price not found")
                continue

            price = float(price_match.group(1))

            # Find percentage change in the same row — look for XX.XX% after price
            row_end = content.find("</tr>", price_match.start())
            row_html = content[price_match.start():row_end] if row_end != -1 else ""
            # Percentage is inside <NOBR>...-1.23%</NOBR> or similar
            pct_match = re.search(r'([\+\-]?\d+\.\d+)%', row_html)
            change = float(pct_match.group(1)) if pct_match else 0.0

            set_price(metal_id, price, change, "$/т")
        except Exception as e:
            log.error(f"MetalTorg {metal_id}: {e}")


# ──────────────────────────────────────────────
# Background updater
# ──────────────────────────────────────────────

def update_all():
    log.info("=== Updating all prices ===")
    scrape_trading_economics()
    scrape_metaltorg()
    log.info(f"=== Done, {len(_cache)} metals cached ===")


def background_updater():
    while True:
        try:
            update_all()
        except Exception as e:
            log.error(f"Updater error: {e}")
        time.sleep(UPDATE_INTERVAL)


# ──────────────────────────────────────────────
# API
# ──────────────────────────────────────────────

@app.route("/get_price")
def get_price():
    metal_id = request.args.get("id", "").lower()
    data = get_cached(metal_id)
    if data is None:
        return jsonify({"error": f"Metal '{metal_id}' not found"}), 404
    return jsonify(data)


@app.route("/prices")
def all_prices():
    with _cache_lock:
        return jsonify(list(_cache.values()))


@app.route("/health")
def health():
    return jsonify({"status": "ok", "cached": len(_cache)})


# ──────────────────────────────────────────────
# Start
# ──────────────────────────────────────────────

# Start background updater at module level so it works with gunicorn too
_t = threading.Thread(target=background_updater, daemon=True)
_t.start()

if __name__ == "__main__":
    app.run(host="::", port=8080, debug=False)
