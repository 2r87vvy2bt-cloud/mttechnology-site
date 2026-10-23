import json,re,os,html as H,shutil,urllib.request as U,datetime
W='/workspace';SRC=W+'/mt_preview_ru';OUT=W+'/mt_i18n'
LANGS=['bg','ru','uk','en','de','fr','es','it']
NAMES={'bg':'Български','ru':'Русский','uk':'Українська','en':'English','de':'Deutsch','fr':'Français','es':'Español','it':'Italiano'}
LOC={'bg':'bg-BG','ru':'ru-RU','uk':'uk-UA','en':'en-GB','de':'de-DE','fr':'fr-FR','es':'es-ES','it':'it-IT'}
PHOTO={'bg':'снимка','ru':'фото','uk':'фото','en':'photo','de':'Foto','fr':'photo','es':'foto','it':'foto'}
UNITS={'$/т':{'bg':'$/т','uk':'$/т','ru':'$/т','*':'$/t'},'$/кг':{'bg':'$/кг','uk':'$/кг','ru':'$/кг','*':'$/kg'},'$/унц':{'bg':'$/унция','uk':'$/унц.','ru':'$/унц','*':'$/oz'},'$/фунт':{'bg':'$/фунт','uk':'$/фунт','ru':'$/фунт','*':'$/lb'}}
ORIG={'bg':'Оригинал на английски','ru':'Оригинал на английском','uk':'Оригінал англійською','en':'','de':'Original auf Englisch','fr':'Original en anglais','es':'Original en inglés','it':'Originale in inglese'}
NF={'bg':('Пазарни новини','Новинарският поток временно не е достъпен.'),'ru':('Новости рынка','Лента новостей временно недоступна.'),'uk':('Новини ринку','Стрічка новин тимчасово недоступна.'),'en':('Market news','The news feed is temporarily unavailable.'),'de':('Marktnachrichten','Der Newsfeed ist vorübergehend nicht verfügbar.'),'fr':('Actualités du marché','Le fil d’actualités est temporairement indisponible.'),'es':('Noticias del mercado','El canal de noticias no está disponible temporalmente.'),'it':('Notizie di mercato','Il feed delle notizie è temporaneamente non disponibile.')}
CATS_EN=['Aluminium','Base metals','Battery Materials','Black Mass','Cobalt','Copper','Electric Vehicles','Electrification','Energy Storage','Ferro-Chrome','Ferro-Molybdenum','Ferro-Nickel','Ferrous Scrap','Freight','Green Steel','Nickel','Rare earths','Recycling','Tin','Tungsten','Zinc']
CT={
'bg':'Алуминий|Неблагородни метали|Материали за батерии|Черна маса|Кобалт|Мед|Електромобили|Електрификация|Съхранение на енергия|Ферохром|Феромолибден|Феро-никел|Стоманен скрап|Товарни превози|Зелена стомана|Никел|Редкоземни метали|Рециклиране|Калай|Волфрам|Цинк',
'ru':'Алюминий|Цветные металлы|Материалы для батарей|Чёрная масса|Кобальт|Медь|Электромобили|Электрификация|Накопление энергии|Феррохром|Ферромолибден|Ферроникель|Стальной лом|Грузоперевозки|Зелёная сталь|Никель|Редкоземельные металлы|Переработка|Олово|Вольфрам|Цинк',
'uk':'Алюміній|Кольорові метали|Матеріали для батарей|Чорна маса|Кобальт|Мідь|Електромобілі|Електрифікація|Накопичення енергії|Ферохром|Феромолібден|Феронікель|Сталевий брухт|Вантажоперевезення|Зелена сталь|Нікель|Рідкісноземельні метали|Переробка|Олово|Вольфрам|Цинк',
'en':'|'.join(CATS_EN),
'de':'Aluminium|Basismetalle|Batteriematerialien|Schwarzmasse|Kobalt|Kupfer|Elektrofahrzeuge|Elektrifizierung|Energiespeicher|Ferrochrom|Ferromolybdän|Ferronickel|Stahlschrott|Fracht|Grüner Stahl|Nickel|Seltene Erden|Recycling|Zinn|Wolfram|Zink',
'fr':'Aluminium|Métaux de base|Matériaux pour batteries|Black mass|Cobalt|Cuivre|Véhicules électriques|Électrification|Stockage d’énergie|Ferrochrome|Ferromolybdène|Ferronickel|Ferraille|Fret|Acier vert|Nickel|Terres rares|Recyclage|Étain|Tungstène|Zinc',
'es':'Aluminio|Metales básicos|Materiales para baterías|Masa negra|Cobalto|Cobre|Vehículos eléctricos|Electrificación|Almacenamiento de energía|Ferrocromo|Ferromolibdeno|Ferroníquel|Chatarra férrica|Fletes|Acero verde|Níquel|Tierras raras|Reciclaje|Estaño|Wolframio|Zinc',
'it':'Alluminio|Metalli di base|Materiali per batterie|Black mass|Cobalto|Rame|Veicoli elettrici|Elettrificazione|Accumulo di energia|Ferrocromo|Ferromolibdeno|Ferronichel|Rottame ferroso|Trasporti|Acciaio verde|Nichel|Terre rare|Riciclo|Stagno|Tungsteno|Zinco'}
CAT={l:dict(zip(CATS_EN,v.split('|'))) for l,v in CT.items()}
DESC={'index':269,'about':13,'aluminium':74,'bronze':87,'casting':103,'catalysts-spent':152,'copper':160,'engineering':173,'escrap':195,'ferroalloys':210,'graphite':246,'lead':282,'logistics':303,'nickel':285,'prices':306,'raw-materials':278,'slags':277,'solutions':302,'tin':281,'titanium':284}
K=json.load(open(W+'/i18n_keys.json'))
T={'ru':{i:k for i,k in enumerate(K)}}
for l in LANGS:
    if l=='ru':continue
    d={}
    for ln in open(f'{W}/i18n/{l}.txt',encoding='utf-8').read().split('\n'):
        if '|' in ln: i,t=ln.split('|',1); d[int(i)]=t
    assert len(d)==len(K),(l,len(d)); T[l]={i:t.replace("'",'’') for i,t in d.items()}
order=sorted(range(len(K)),key=lambda i:-len(K[i]))
RX=re.compile('|'.join('(?<![А-Яа-яЁёЇїІіЄєҐґ])'+re.escape(K[i])+'(?![А-Яа-яЁёЇїІіЄєҐґ])' for i in order))
IDX={k:i for i,k in enumerate(K)}
def tr(s,l):
    if l=='ru':return s
    return RX.sub(lambda m:T[l][IDX[m.group(0)]],s)
def news_data():
    r={}
    for l in set(LANGS)|{'en'}:
        try:r[l]=json.load(U.urlopen(U.Request(f'https://mttechnology.eu/api/blog/posts?per_page=12&lang={l}',headers={'User-Agent':'Mozilla/5.0'}),timeout=30))['data']
        except Exception as e:print('news',l,e);r[l]=None
    return r
ND=news_data()
def pick(l):
    L=ND.get(l);E={x['id']:x for x in (ND.get('en') or [])}
    if not L:return None
    if l=='en':return [(x,False) for x in L[:3]]
    tr_=[x for x in L if x['title']!=E.get(x['id'],{}).get('title')];rest=[x for x in L if x not in tr_]
    return [(x,False) for x in tr_]+[(x,True) for x in rest] if tr_ else [(x,True) for x in L]
def card(x,orig,l):
    d='.'.join(reversed(x['date'].split('-')));c=(x.get('categories') or [None])[0];c=CAT[l].get(c,c) if c else T[l][70]
    ol=f' · {ORIG[l]}' if orig and ORIG[l] else ''
    return f'<a class="card visible" href="{H.escape(x["link"])}" target="_blank" rel="noopener nofollow" style="text-decoration:none;color:inherit"><div class="tag">{d} · {H.escape(c)}{ol}</div><h3>{H.escape(x["title"])}</h3><p>{H.escape((x.get("excerpt") or "")[:180])}…</p><p style="font-size:11px;opacity:.5">{T[l][71]}</p></a>'
def newsgrid(l):
    p=pick(l)
    inner=''.join(card(x,o,l) for x,o in p[:3]) if p else f'<div class="card"><h3>{NF[l][0]}</h3><p>{NF[l][1]}</p></div>'
    return '<div id="newsgrid" style="display:contents">'+inner+'</div>'
def newsjs(l):
    return ("<script>(()=>{const g=document.getElementById('newsgrid');if(!g)return;const LG=%s,CM=%s,OL=%s,MK=%s,RS=%s;"
    "const e=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));const j=u=>fetch(u).then(r=>r.ok?r.json():0).catch(()=>0);"
    "Promise.all([j('/api/blog/posts?per_page=12&lang='+LG),LG==='en'?0:j('/api/blog/posts?per_page=12&lang=en')]).then(([d,en])=>{if(!d||!d.data||!d.data.length)return;const E={};((en&&en.data)||[]).forEach(x=>E[x.id]=x.title);"
    "let L=d.data.map(x=>[x,LG!=='en'&&E[x.id]===x.title]);const t=L.filter(a=>!a[1]);if(t.length)L=t.concat(L.filter(a=>a[1]));L=L.slice(0,3);"
    "g.innerHTML=L.map(([x,o])=>{const c=(x.categories||[])[0];return '<a class=\"card visible\" href=\"'+e(x.link)+'\" target=\"_blank\" rel=\"noopener nofollow\" style=\"text-decoration:none;color:inherit\"><div class=\"tag\">'+e(x.date.split('-').reverse().join('.'))+' · '+e(c?(CM[c]||c):MK)+(o&&OL?' · '+OL:'')+'</div><h3>'+e(x.title)+'</h3><p>'+e((x.excerpt||'').slice(0,180))+'…</p><p style=\"font-size:11px;opacity:.5\">'+RS+'</p></a>'}).join('')})})()</script>"
    )%(json.dumps(l),json.dumps(CAT[l],ensure_ascii=False),json.dumps(ORIG[l],ensure_ascii=False),json.dumps(T[l][70],ensure_ascii=False),json.dumps(T[l][71],ensure_ascii=False))
BASE='https://mttechnology.eu'
def url(l,p): pp='' if p=='index' else p+'.html'; return f'{BASE}/{pp}' if l=='bg' else f'{BASE}/{l}/{pp}'
CSS='<style>details.langs{position:relative;display:block!important}details.langs summary{list-style:none;cursor:pointer;font:500 12px Inter,sans-serif;letter-spacing:.08em;color:#f2c94c;border:1px solid rgba(242,201,76,.45);border-radius:6px;padding:6px 10px}details.langs summary::-webkit-details-marker{display:none}details.langs .ld{position:absolute;right:0;top:calc(100% + 6px);background:rgba(10,10,10,.97);border:1px solid rgba(242,201,76,.35);border-radius:8px;padding:6px;min-width:150px;z-index:1000;display:flex;flex-direction:column}details.langs .ld a{color:#e8e2d0;text-decoration:none;padding:7px 10px;font:400 13px Inter,sans-serif;border-radius:5px}details.langs .ld a:hover,details.langs .ld a.on{background:rgba(242,201,76,.15);color:#f2c94c}</style>'
def build():
    if os.path.exists(OUT):shutil.rmtree(OUT)
    pages=sorted(f[:-5] for f in os.listdir(SRC) if f.endswith('.html'))
    for l in LANGS:
        od=OUT if l=='bg' else f'{OUT}/{l}';os.makedirs(od,exist_ok=True)
        for p in pages:
            s=open(f'{SRC}/{p}.html',encoding='utf-8').read()
            s=re.sub(r'<div id="newsgrid" style="display:contents">.*?</a></div>|<div id="newsgrid" style="display:contents"><div class="card">.*?</div></div>','@@NEWS@@',s,count=1,flags=re.S)
            s=re.sub(r"<script>\(\(\)=>\{const g=document\.getElementById\('newsgrid'\).*?</script>",'@@NEWSJS@@',s,count=1,flags=re.S)
            s=re.sub(r"\n?document\.querySelectorAll\('\.langs button'\)[^\n]*",'',s)
            m=re.search(r'<title>(.*?)</title>',s)
            desc=K[DESC[p]] if p in DESC else m.group(1)
            s=s.replace('</title>','</title>@@HEAD@@',1).replace('@@HEAD@@','<meta name="description" content="'+H.escape(desc)+'">@@HEAD@@',1)
            s=tr(s,l)
            s=re.sub(r' — фото (\d+)',lambda m:f' — {PHOTO[l]} {m.group(1)}',s)
            for u,v in UNITS.items(): s=s.replace(u,v.get(l,v['*']))
            s=s.replace("'ru-RU'",f"'{LOC[l]}'").replace('"ru-RU"',f'"{LOC[l]}"').replace('<html lang="ru">',f'<html lang="{l}">')
            alt=''.join(f'<link rel="alternate" hreflang="{x}" href="{url(x,p)}">' for x in LANGS)+f'<link rel="alternate" hreflang="x-default" href="{url("bg",p)}">'
            s=s.replace('@@HEAD@@',f'<link rel="canonical" href="{url(l,p)}">{alt}<link rel="icon" href="/logo.svg">{CSS}')
            sw='<details class="langs"><summary>'+l.upper()+' ▾</summary><div class="ld">'+''.join(f'<a href="{"/" if x=="bg" else "/"+x+"/"}{"" if p=="index" else p+".html"}" hreflang="{x}" lang="{x}"{" class=on" if x==l else ""}>{NAMES[x]}</a>' for x in LANGS)+'</div></details>'
            s=re.sub(r'<div class="langs">.*?</div>',sw,s,count=1)
            s=s.replace('@@NEWS@@',newsgrid(l)).replace('@@NEWSJS@@',newsjs(l))
            s=re.sub(r'''(["'(])(photos/|hero/|data/|logo\.svg|chart\.umd\.min\.js)''',r'\1/\2',s)
            open(f'{od}/{p}.html','w',encoding='utf-8').write(s)
    today=datetime.date.today().isoformat()
    for l in LANGS:
        open(f'{OUT}/sitemap-{l}.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+''.join(f'<url><loc>{url(l,p)}</loc><lastmod>{today}</lastmod>'+''.join(f'<xhtml:link rel="alternate" hreflang="{x}" href="{url(x,p)}"/>' for x in LANGS)+f'<xhtml:link rel="alternate" hreflang="x-default" href="{url("bg",p)}"/></url>\n' for p in pages)+'</urlset>\n')
    open(f'{OUT}/sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<sitemap><loc>{BASE}/sitemap-{l}.xml</loc><lastmod>{today}</lastmod></sitemap>\n' for l in LANGS)+'</sitemapindex>\n')
    open(f'{OUT}/robots.txt','w').write(f'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: {BASE}/sitemap.xml\n')
    print('built',len(pages),'pages x',len(LANGS))
build()
