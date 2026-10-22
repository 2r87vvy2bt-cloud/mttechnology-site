# Live price snapshot for the build (real data only; no synthetic series).
import json as _j, urllib.request as _u, datetime as _dt
HIST='https://prices-history-production.up.railway.app'
METALS=[('nf','Cu','copper','Медь'),('nf','Al','aluminium','Алюминий'),('nf','Zn','zinc','Цинк'),('nf','Ni','nickel','Никель'),('nf','Pb','lead','Свинец'),('nf','Sn','tin','Олово'),
('pm','Au','gold','Золото'),('pm','Ag','silver','Серебро'),('pm','Pt','platinum','Платина'),('pm','Pd','palladium','Палладий'),
('fa','FeSi','ferrosilicon','Ферросилиций'),('fa','FeMn','ferromanganese','Ферромарганец'),('fa','SiMn','silicomanganese','Силикомарганец'),('fa','FeCr','ferrochrome','Феррохром'),
('fa','FeMo','ferromolybdenum','Ферромолибден'),('fa','FeV','ferrovanadium','Феррованадий'),('fa','FeTi','ferrotitanium','Ферротитан'),('fa','FeW','ferrotungsten','Ферровольфрам'),('fa','FeNb','ferroniobium','Феррониобий')]
UNIT={'USD/t':'$/т','USD/oz':'$/унц.'}
def _get(p): return _j.load(_u.urlopen(HIST+p,timeout=30))
def build():
    lat={x['id']:x for x in _get('/latest')}
    PD={'groups':{'nf':'Цветные металлы','pm':'Драгоценные металлы','fa':'Ферросплавы'},'series':{},'map':{}}
    asof=None
    for g,k,mid,name in METALS:
        L=lat.get(mid)
        if not L: continue
        h=_get(f'/history?id={mid}&range=1y')
        pts=h['points'] or [[L['ts'],L['price']]]
        PD['series'][k]={'group':g,'name':name,'id':mid,'unit':UNIT.get(L['unit'],L['unit']),'values':[p[1] for p in pts],'dates':[p[0][:10] for p in pts],
                         'last':L['price'],'change':L['change'],'ts':L['ts'],'stale':L['stale'],'since':L['since']}
        PD['map'][mid]=k
        asof=max(asof or L['ts'],L['ts'])
    PD['asof']=asof
    return PD
