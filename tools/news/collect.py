"""Collect candidate market news from several RSS feeds, filter by relevance, dedupe.
Output: candidates.json (internal, NOT published; source links kept only for editors)."""
import json, re, sys, time, html, difflib, email.utils, urllib.request
import xml.etree.ElementTree as ET
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
FEEDS = {
 "Mining.com": "https://www.mining.com/feed/",
 "Investing News": "https://investingnews.com/feed/",
 "Recycling Today": "https://www.recyclingtoday.com/rss/",
 "The Northern Miner": "https://www.northernminer.com/feed/",
 "Fastmarkets": "https://www.fastmarkets.com/feed/",
 "Mining Technology": "https://www.mining-technology.com/feed/",
 "MRW": "https://www.mrw.co.uk/feed",
 "Graphite.news": "https://graphite.news/feed/",
}
CATS = {
 "graphite": r"graphite|anode|electrode",
 "ferroalloys": r"ferro|fesi|silicon metal|manganese|chrome|ferrochrome|vanadium|molybden|tungsten",
 "scrap": r"scrap|recycl|secondary metal|black mass",
 "nonferrous": r"copper|alumin|nickel|zinc|tin\b|lead\b|cobalt|lme|base metal|antimony|titanium",
 "catalysts": r"catalyst|palladium|platinum|rhodium|pgm",
}
NEG = r"gold stock|crypto|bitcoin|webinar|podcast|sponsored|top \d+ |stocks to"
def fetch(u):
    req = urllib.request.Request(u, headers={"User-Agent": UA, "Accept": "application/rss+xml,application/xml,*/*"})
    return urllib.request.urlopen(req, timeout=25).read()
def clean(s): return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()
def items(src, url):
    out = []
    try: root = ET.fromstring(fetch(url))
    except Exception as e:
        print(f"[warn] {src}: {e}", file=sys.stderr); return out
    for it in root.iter("item"):
        g = lambda t: (it.findtext(t) or "")
        body = g("{http://purl.org/rss/1.0/modules/content/}encoded") or g("description")
        try: ts = email.utils.parsedate_to_datetime(g("pubDate")).timestamp()
        except Exception: ts = time.time()
        out.append({"source": src, "title": clean(g("title")), "summary": clean(body)[:4000], "link": g("link").strip(), "ts": ts})
    return out
def classify(x):
    t = (x["title"] + " " + x["summary"][:600]).lower()
    if re.search(NEG, t): return None
    sc = {c: len(re.findall(p, t)) for c, p in CATS.items()}
    c = max(sc, key=sc.get)
    return c if sc[c] else None
def main(days=4):
    all_ = []
    for s, u in FEEDS.items():
        L = items(s, u); print(f"{s}: {len(L)}", file=sys.stderr); all_ += L
    cut = time.time() - days * 86400
    cand = []
    for x in sorted(all_, key=lambda x: -x["ts"]):
        if x["ts"] < cut: continue
        c = classify(x)
        if not c: continue
        if any(difflib.SequenceMatcher(None, x["title"].lower(), y["title"].lower()).ratio() > .6 for y in cand): continue  # same story
        x["category"] = c; cand.append(x)
    json.dump(cand, open("candidates.json", "w"), ensure_ascii=False, indent=1)
    for x in cand: print(time.strftime("%m-%d", time.gmtime(x["ts"])), x["category"], "|", x["source"], "|", x["title"])
if __name__ == "__main__": main(int(sys.argv[1]) if len(sys.argv) > 1 else 4)
