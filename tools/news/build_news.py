"""Build the internal news section (list + article pages, 8 languages) from data/news/*.json.
Run after the main site generator. Idempotent. No external links are emitted."""
import json, glob, os, re, html
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE = "https://mttechnology.eu"
LANGS = ["bg", "ru", "uk", "en", "de", "fr", "es", "it"]
DIR = {l: ("" if l == "bg" else l + "/") for l in LANGS}
UI = json.load(open(f"{ROOT}/data/news/ui.json"))
E = lambda s: html.escape(str(s), quote=True)
NUM = {"bg": "Новини", "ru": "Новости", "uk": "Новини", "en": "News", "de": "News", "fr": "Actualités", "es": "Noticias", "it": "Notizie"}

def load():
    items = [json.load(open(f)) for f in glob.glob(f"{ROOT}/data/news/2*.json")]
    return sorted(items, key=lambda x: x["id"], reverse=True)

def fmt_date(d): y, m, dd = d.split("-"); return f"{dd}.{m}.{y}"
def val(v, l): return v[l] if isinstance(v, dict) else v

CSS = """<style>
.nw{max-width:1180px;margin:0 auto;padding:150px 28px 70px}.nw .eyebrow{color:var(--gold,#f2c94c);font:500 11px Inter,sans-serif;letter-spacing:.22em;text-transform:uppercase}
.nw h1{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(40px,6vw,64px);line-height:1.05;margin:12px 0 14px;color:#f4efe2}
.nw .intro{color:#a9a290;max-width:640px}.nw-f{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 34px}
.nw-f button{background:none;border:1px solid rgba(242,201,76,.3);border-radius:99px;padding:6px 14px;font:400 12px Inter,sans-serif;color:#cfc8b4;cursor:pointer}.nw-f button.on{background:#f2c94c;color:#111;border-color:#f2c94c}
.nw-g{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.nw-g .feat{grid-column:span 2;grid-row:span 2}
.nc{background:linear-gradient(160deg,#101513,#0b0e0d);border:1px solid rgba(242,201,76,.14);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:.3s;text-decoration:none;color:inherit}
.nc:hover{border-color:rgba(242,201,76,.5);transform:translateY(-3px)}
.nc .im,.na .nhero{height:150px;background:radial-gradient(circle at 30% 30%,rgba(242,201,76,.35),transparent 60%),linear-gradient(135deg,#1c2420,#0c0f0e);position:relative}
.nc.feat .im{height:330px}.nc .im b{position:absolute;left:16px;bottom:14px;font:500 10px Inter,sans-serif;letter-spacing:.18em;color:#111;background:#f2c94c;padding:4px 9px;border-radius:4px;text-transform:uppercase}
.nc .bd{padding:20px 22px 22px;display:flex;flex-direction:column;gap:10px;flex:1}.nc .mt{font-size:11px;color:#9b9584;letter-spacing:.05em}
.nc h3{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:23px;line-height:1.2;color:#f4efe2;margin:0}.nc.feat h3{font-size:38px}.nc p{font-size:13.5px;color:#bdb6a3;margin:0}
.kf{display:flex;gap:8px;flex-wrap:wrap}.kf span{font-size:11.5px;border:1px solid rgba(242,201,76,.25);border-radius:6px;padding:3px 8px;color:#f2c94c}
.nc .more{margin-top:auto;font-size:12px;color:#f2c94c;letter-spacing:.06em}
.na{max-width:780px;margin:0 auto;padding:150px 24px 60px}.na h1{font-size:clamp(34px,5vw,52px)}.na .lead{font-size:18px;color:#d8d1bd}
.nc .im picture,.na .nhero picture,.nimg picture{position:absolute;inset:0}.nimg{position:relative}.nc .im img,.na .nhero img,.nimg img{width:100%;height:100%;object-fit:cover;display:block}.nc .im b{z-index:1}.na .nhero{overflow:hidden;height:360px;border-radius:16px;margin:28px 0}
.figs{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:26px 0}.fig{border:1px solid rgba(242,201,76,.22);border-radius:12px;padding:16px}.fig b{display:block;font:500 26px 'Cormorant Garamond',serif;color:#f2c94c}.fig small{color:#9b9584;font-size:12px}
.na h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:30px;margin:30px 0 10px;color:#f4efe2}.na p{margin:0 0 14px;color:#cfc8b4}
.box{background:rgba(242,201,76,.07);border-left:3px solid #f2c94c;border-radius:8px;padding:18px 22px;margin:24px 0}.box ul{margin:0;padding:0}.box li{margin:6px 0 6px 18px;color:#e2dbc6}
.cta{display:flex;justify-content:space-between;align-items:center;gap:16px;border:1px solid rgba(242,201,76,.3);border-radius:14px;padding:22px 26px;margin:34px 0}.cta h3{font-family:'Cormorant Garamond',serif;font-size:24px;margin:0 0 4px;color:#f4efe2}
.cta .btn{background:#f2c94c;color:#111;padding:11px 20px;border-radius:8px;font-weight:500;font-size:13px;text-decoration:none;white-space:nowrap}
.src{border-top:1px solid rgba(255,255,255,.08);padding-top:14px;font-size:11.5px;color:#7f7a6d}.na .back{display:inline-block;margin-top:26px;color:#f2c94c;font-size:13px;text-decoration:none}
@media(max-width:900px){.nw-g{grid-template-columns:1fr 1fr}.nw-g .feat{grid-column:span 2;grid-row:auto}}
@media(max-width:640px){.nw,.na{padding:110px 18px 40px}.nw-g{grid-template-columns:1fr}.nw-g .feat{grid-column:auto}.nc.feat .im{height:190px}.nc.feat h3{font-size:28px}.na .lead{font-size:16px}.na .nhero{height:210px}.figs{grid-template-columns:1fr}.cta{flex-direction:column;align-items:flex-start}}
</style>"""

# client-side: apply admin state (hidden / edited) from /api/extra/news/state
STATE_JS = """<script>fetch('/api/extra/news/state').then(r=>r.ok?r.json():0).then(s=>{if(!s)return;const L=document.documentElement.lang;(s.hidden||[]).forEach(id=>{document.querySelectorAll('[data-nid="'+id+'"]').forEach(e=>e.remove());if(document.body.dataset.article===id)location.replace('news.html')});const ed=s.edits||{};Object.keys(ed).forEach(id=>{const x=(ed[id]||{})[L];if(!x)return;document.querySelectorAll('[data-nid="'+id+'"]').forEach(e=>{if(x.title)e.querySelectorAll('[data-f=title]').forEach(t=>t.textContent=x.title);if(x.lead)e.querySelectorAll('[data-f=lead]').forEach(t=>t.textContent=x.lead)})})}).catch(()=>{})</script>"""
FILTER_JS = """<script>document.querySelectorAll('.nw-f button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nw-f button').forEach(x=>x.classList.toggle('on',x===b));const c=b.dataset.c;document.querySelectorAll('.nw-g .nc').forEach((n,i)=>{n.style.display=(c==='all'||n.dataset.c===c)?'':'none'})})</script>"""

def shell(l):
    s = open(f"{ROOT}/{DIR[l]}about.html", encoding="utf-8").read()
    head, rest = s.split("</head>", 1)
    top = rest[: rest.index("</header>") + 9]
    bot = rest[rest.index("<footer"):]
    return head, top, bot

def pic(x, eager=False):
    """<picture> for item image field (img/news/<image>.webp + .jpg fallback); empty -> gradient placeholder."""
    i = x.get("image")
    if not i: return ""
    return (f'<picture><source srcset="/img/news/{i}.webp" type="image/webp"><img src="/img/news/{i}.jpg" alt="" '
            f'loading="{"eager" if eager else "lazy"}" decoding="async"></picture>')

def homepic(x):
    return f'<div class="nimg" style="position:relative;height:150px;margin:-1px -1px 16px;border-radius:12px;overflow:hidden">{pic(x).replace('<picture>','<picture style="position:absolute;inset:0">').replace('<img ','<img style="width:100%;height:100%;object-fit:cover;display:block" ')}</div>' if x.get("image") else ""

def page(l, fname, title, desc, body, extra_head="", body_attr="", image=None):
    head, top, bot = shell(l)
    head = re.sub(r"<title>.*?</title>", f"<title>{E(title)}</title>", head, flags=re.S)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{E(desc)}">', head)
    head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{BASE}/{DIR[l]}{fname}">', head)
    head = re.sub(r'(<link rel="alternate" hreflang="([a-z-]+)" href=")[^"]*(">)',
                  lambda m: m.group(1) + f"{BASE}/{DIR.get(m.group(2), '')}{fname}" + m.group(3), head)
    head = re.sub(r'<meta property="og:[^>]*>', "", head)
    og = (f'<meta property="og:type" content="{"article" if body_attr else "website"}"><meta property="og:title" content="{E(title)}">'
          f'<meta property="og:description" content="{E(desc)}"><meta property="og:url" content="{BASE}/{DIR[l]}{fname}">'
          + (f'<meta property="og:image" content="{BASE}/img/news/{image}.jpg"><meta name="twitter:card" content="summary_large_image">' if image else ""))
    top = re.sub(r'href="/((?:[a-z]{2}/)?)about\.html" hreflang=', lambda m: f'href="/{m.group(1)}{fname}" hreflang=', top)
    top = top.replace("<body", f"<body{body_attr}", 1) if body_attr else top
    return head + og + extra_head + CSS + "</head>" + top + body + bot.replace("</body>", STATE_JS + "</body>", 1)

def card(x, l, feat=False):
    u, t = UI[l], x["t"][l]
    kf = "".join(f"<span>{E(val(f['v'], l))}</span>" for f in x["figures"][: 3 if feat else 1])
    lead = f'<p data-f="lead">{E(t["lead"])}</p>' if feat else ""
    return (f'<a class="nc{" feat" if feat else ""}" data-nid="{x["id"]}" data-c="{x["category"]}" href="news-{x["id"]}.html">'
            f'<div class="im">{pic(x, feat)}<b>{E(u["cats"][x["category"]])}</b></div><div class="bd"><div class="mt">{fmt_date(x["date"])} · {x["minutes"]} {E(u["min"])}</div>'
            f'<h3 data-f="title">{E(t["title"])}</h3>{lead}<div class="kf">{kf}</div><div class="more">{E(u["read"])}</div></div></a>')

def list_page(items, l):
    u = UI[l]
    cats = [c for c in u["cats"] if any(x["category"] == c for x in items)]
    f = f'<button class="on" data-c="all">{E(u["all"])}</button>' + "".join(f'<button data-c="{c}">{E(u["cats"][c])}</button>' for c in u["cats"])
    grid = "".join(card(x, l, i == 0) for i, x in enumerate(items))
    body = (f'<section class="nw"><div class="eyebrow">{E(u["eyebrow"])}</div><h1>{E(u["title"])}</h1><p class="intro">{E(u["sub"])}</p>'
            f'<div class="nw-f">{f}</div><div class="nw-g">{grid}</div></section>' + FILTER_JS)
    return page(l, "news.html", f'{u["title"]} — MT Technology', u["sub"], body)

def article(x, l):
    u, t = UI[l], x["t"][l]
    figs = "".join(f'<div class="fig"><b>{E(val(f["v"], l))}</b><small>{E(f["l"][l])}</small></div>' for f in x["figures"])
    what = "".join(f"<p>{E(p)}</p>" for p in t["what"])
    means = "".join(f"<li>{m}</li>" for m in t["means"])  # trusted editorial HTML (<b>)
    ld = {"@context": "https://schema.org", "@type": "NewsArticle", "headline": t["title"], "description": t["lead"], "datePublished": x["date"],
          "inLanguage": l, "author": {"@type": "Organization", "name": "MT Technology"}, "publisher": {"@type": "Organization", "name": "MT Technology"},
          "mainEntityOfPage": f'{BASE}/{DIR[l]}news-{x["id"]}.html'}
    body = (f'<article class="nw na" data-nid="{x["id"]}"><div class="eyebrow">{E(u["cats"][x["category"]])} · {fmt_date(x["date"])} · {x["minutes"]} {E(u["min"])}</div>'
            f'<h1 data-f="title">{E(t["title"])}</h1><p class="lead" data-f="lead">{E(t["lead"])}</p><div class="nhero">{pic(x, True)}</div><div class="figs">{figs}</div>'
            f'<h2>{E(u["what"])}</h2>{what}<div class="box"><div class="eyebrow" style="margin-bottom:8px">{E(u["means"])}</div><ul>{means}</ul></div>'
            f'<div class="cta"><div><h3>{E(t["cta"])}</h3><small style="color:#9b9584">{E(u["cta_sub"])}</small></div><a class="btn" href="index.html#contact">{E(u["cta_btn"])}</a></div>'
            f'<div class="src">{E(u["src"])}: {E(x["source"][l])}. {E(u["prep"])}</div><a class="back" href="news.html">{E(u["back"])}</a></article>')
    extra = f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
    return page(l, f'news-{x["id"]}.html', f'{t["title"]} — MT Technology', t["lead"], body, extra, f' data-article="{x["id"]}"', x.get("image"))

def homepage(items, l):
    p = f"{ROOT}/{DIR[l]}index.html"
    s = open(p, encoding="utf-8").read()
    u = UI[l]
    cards = "".join(f'<a class="card visible news-card" data-nid="{x["id"]}" href="news-{x["id"]}.html" style="text-decoration:none;color:inherit">'
                    f'{homepic(x)}<div class="tag">{fmt_date(x["date"])} · {E(u["cats"][x["category"]])}</div><h3 data-f="title">{E(x["t"][l]["title"])}</h3>'
                    f'<p data-f="lead">{E(x["t"][l]["lead"])}</p></a>' for x in items[:3])
    new = (f'<section class="section" id="news" style="padding-top:0"><h2>{E(NUM[l])}</h2><p class="sub">{E(u["home_sub"])}</p>'
           f'<div class="cards"><div id="newsgrid" style="display:contents">{cards}</div></div>'
           f'<p style="margin-top:28px"><a href="news.html" style="color:var(--gold);text-decoration:none;letter-spacing:.06em">{E(u["allnews"])}</a></p></section>')
    s, n = re.subn(r'<section class="section" id="news".*?</section>', lambda m: new, s, count=1, flags=re.S)
    assert n == 1, p
    s = re.sub(r"<script>\(\(\)=>\{const g=document\.getElementById\('newsgrid'\).*?</script>", "", s, flags=re.S)  # old external-feed script
    if "/api/extra/news/state" not in s: s = s.replace("</body>", STATE_JS + "</body>", 1)
    open(p, "w", encoding="utf-8").write(s)

def nav_links(l):
    for p in glob.glob(f"{ROOT}/{DIR[l]}*.html"):
        s = open(p, encoding="utf-8").read(); s2 = s.replace('href="index.html#news"', 'href="news.html"')
        if s2 != s: open(p, "w", encoding="utf-8").write(s2)

def sitemaps(items):
    files = ["news.html"] + [f'news-{x["id"]}.html' for x in items]
    lm = {"news.html": items[0]["date"], **{f'news-{x["id"]}.html': x["date"] for x in items}}
    for l in LANGS:
        p = f"{ROOT}/sitemap-{l}.xml"; s = open(p, encoding="utf-8").read()
        s = re.sub(r"<url><loc>[^<]*/news[^<]*\.html</loc>.*?</url>\n?", "", s, flags=re.S)
        add = ""
        for f in files:
            alt = "".join(f'<xhtml:link rel="alternate" hreflang="{a}" href="{BASE}/{DIR[a]}{f}"/>' for a in LANGS) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{BASE}/{f}"/>'
            add += f"<url><loc>{BASE}/{DIR[l]}{f}</loc><lastmod>{lm[f]}</lastmod>{alt}</url>\n"
        s = s.replace("</urlset>", add + "</urlset>")
        open(p, "w", encoding="utf-8").write(s)

def main():
    items = load()
    for l in LANGS:
        for old in glob.glob(f"{ROOT}/{DIR[l]}news*.html"): os.remove(old)
        open(f"{ROOT}/{DIR[l]}news.html", "w", encoding="utf-8").write(list_page(items, l))
        for x in items: open(f'{ROOT}/{DIR[l]}news-{x["id"]}.html', "w", encoding="utf-8").write(article(x, l))
        homepage(items, l); nav_links(l)
    sitemaps(items)
    json.dump([{"id": x["id"], "date": x["date"], "category": x["category"], "t": {l: {"title": x["t"][l]["title"], "lead": x["t"][l]["lead"]} for l in LANGS}} for x in items],
              open(f"{ROOT}/data/news/index.json", "w", encoding="utf-8"), ensure_ascii=False)
    print(f"built {len(items)} articles x {len(LANGS)} languages")
if __name__ == "__main__": main()
