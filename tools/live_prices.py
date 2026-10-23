# Live price snapshot for the build (real data only; no synthetic series).
import json as _j, urllib.request as _u, datetime as _dt
HIST='https://prices-history-production.up.railway.app'
import os as _o; EXTRA=_o.environ.get('MT_EXTRA','https://prices-extra-staging.up.railway.app')
METALS=[('nf','Cu','copper','Медь'),('nf','Al','aluminium','Алюминий'),('nf','Zn','zinc','Цинк'),('nf','Ni','nickel','Никель'),('nf','Pb','lead','Свинец'),('nf','Sn','tin','Олово'),
('pm','Au','gold','Золото'),('pm','Ag','silver','Серебро'),('pm','Pt','platinum','Платина'),('pm','Pd','palladium','Палладий'),
('fa','FeSi','ferrosilicon','Ферросилиций'),('fa','FeMn','ferromanganese','Ферромарганец'),('fa','SiMn','silicomanganese','Силикомарганец'),('fa','FeCr','ferrochrome','Феррохром'),
('fa','FeMo','ferromolybdenum','Ферромолибден'),('fa','FeV','ferrovanadium','Феррованадий'),('fa','FeTi','ferrotitanium','Ферротитан'),('fa','FeW','ferrotungsten','Ферровольфрам'),('fa','FeNb','ferroniobium','Феррониобий'),
('ot','Mo','molybdenum','Молибден (Китай)'),('ot','Co','cobalt','Кобальт'),('ot','Li','lithium','Карбонат лития (Китай)'),('ot','TiSp','titanium-sponge','Титановая губка (Китай)'),('ot','Scrap','steel-scrap','Стальной лом HMS 1&2'),('ot','W','tungsten-apt','Вольфрам (APT)'),('ot','Sb','antimony','Сурьма 99,65%'),('ot','Gr','graphite','Графит чешуйчатый')]
EMPTY_OK={'tungsten-apt','antimony','graphite'}
EXTRA_IDS={'tungsten-apt','antimony','graphite','molybdenum','cobalt','lithium','titanium-sponge','steel-scrap'}
UNIT={'USD/t':'$/т','USD/oz':'$/унц.','CNY/t':'¥/т','CNY/kg':'¥/кг','USD/kg':'$/кг','USD/mtu':'$/мту','USD/lb':'$/фунт'}
def _get(p,base=None): return _j.load(_u.urlopen((base or HIST)+p,timeout=30))
def ohlc(pts,n=30):
    days={p[0][:10] for p in pts};kl=10 if len(days)>1 else 13;m={}
    for t,v in pts:
        k=t[:kl];b=m.get(k)
        if not b: m[k]=[k if kl==10 else k+':00',v,v,v,v]
        else: b[2]=max(b[2],v);b[3]=min(b[3],v);b[4]=v
    return list(m.values())[-n:]
def build():
    lat={x['id']:x for x in _get('/latest')}
    try: lat.update({x['id']:x for x in _get('/latest',EXTRA)})
    except Exception: pass
    PD={'groups':{'nf':'Цветные металлы','pm':'Драгоценные металлы','fa':'Ферросплавы','ot':'Редкие металлы и лом'},'series':{},'map':{}}
    asof=None
    for g,k,mid,name in METALS:
        L=lat.get(mid)
        if not L and mid in EMPTY_OK:
            PD['series'][k]={'group':g,'name':name,'id':mid,'unit':'','values':[],'ohlc':[],'dates':[],'last':None,'change':None,'ts':None,'stale':False,'since':None,'manual':True}; PD['map'][mid]=k; continue
        if not L: continue
        h=_get(f'/history?id={mid}&range=1y',EXTRA if mid in EXTRA_IDS else None)
        pts=h['points'] or [[L['ts'],L['price']]]
        PD['series'][k]={'group':g,'name':name,'id':mid,'unit':UNIT.get(L['unit'],L['unit']),'values':[p[1] for p in pts],'ohlc':ohlc(pts),'dates':[p[0][:10] for p in pts],
                         'last':L['price'],'change':L['change'],'ts':L['ts'],'stale':L['stale'],'since':L['since'],'manual':L.get('manual',False)}
        PD['map'][mid]=k
        asof=max(asof or L['ts'],L['ts']) if not L.get('manual') else asof
    PD['asof']=asof
    return PD
