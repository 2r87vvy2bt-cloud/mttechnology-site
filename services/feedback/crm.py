"""Forward website enquiries to the CRM receiver (website-lead). Best effort, never blocks email."""
import hashlib, hmac, json, logging, os, re, threading, urllib.request, uuid
from urllib.parse import urlparse

log = logging.getLogger("crm")
CRM_URL = os.getenv("LEAD_WEBHOOK_URL", "https://pjaiphwsntkyzmsvznas.supabase.co/functions/v1/website-lead")
CRM_TIMEOUT = float(os.getenv("LEAD_WEBHOOK_TIMEOUT", "5"))
LANGS = {"bg", "ru", "uk", "en", "de", "fr", "es", "it"}

KEYS = {
    "company": r"компан|company|firma|unternehmen|entreprise|soci[eé]t[eé]|empresa|azienda",
    "country": r"стран|країн|държав|country|land|pays|pa[ií]s|paese",
    "weight":  r"тегло|вес|вага|weight|gewicht|poids|peso|tonn|тонн",
    "volume":  r"обем|объ[её]м|об.?єм|volume|volumen",
    "product": r"товар|груз|вантаж|product|продукт|material|матери|ware|marchandise|carga|merce|cargo",
}

def _num(v):
    m = re.search(r"\d+(?:[.,]\d+)?", v or "")
    return float(m.group().replace(",", ".")) if m else None

def build_payload(name, email, phone, description, page_url="", lang="", submission_id=None):
    f = {}
    for line in (description or "").splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        for key, rx in KEYS.items():
            if key not in f and re.search(rx, k, re.I):
                f[key] = v.strip(); break
    if not lang and page_url:
        seg = urlparse(page_url).path.strip("/").split("/")[0]
        lang = seg if seg in LANGS else "bg"
    p = {"submission_id": submission_id or f"site-{uuid.uuid4().hex}",
         "name": name or None, "email": email or None, "phone": phone or None,
         "company": f.get("company"), "country": f.get("country"),
         "product": f.get("product"), "message": (description or "").strip() or None,
         "page_url": page_url or None, "lang": lang or None}
    q, unit = _num(f.get("weight")), "t"
    if q is None:
        q, unit = _num(f.get("volume")), "m³"
    if q is not None:
        p["quantity"], p["unit"] = q, unit
    return {k: v for k, v in p.items() if v is not None}

def post_lead(payload, secret=None, timeout=CRM_TIMEOUT):
    secret = secret or os.getenv("LEAD_WEBHOOK_SECRET", "")
    if not secret:
        log.warning("CRM: LEAD_WEBHOOK_SECRET not set, skipping"); return None
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode()
    sig = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    req = urllib.request.Request(CRM_URL, data=body, method="POST",
        headers={"Content-Type": "application/json", "X-Lead-Signature": sig})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            res = json.loads(r.read() or b"{}"); log.info("CRM ok %s %s", payload["submission_id"], res); return res
    except urllib.error.HTTPError as e:
        log.error("CRM HTTP %s for %s: %s", e.code, payload["submission_id"], e.read()[:300])
    except Exception as e:
        log.error("CRM error for %s: %s", payload["submission_id"], e)
    return None

def forward_async(**kw):
    """Single attempt in a daemon thread; no retries."""
    try:
        payload = build_payload(**kw)
    except Exception as e:
        log.error("CRM payload error: %s", e); return
    threading.Thread(target=post_lead, args=(payload,), daemon=True).start()
