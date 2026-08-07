# -*- coding: utf-8 -*-
"""Denetim tablosu: site grubu <-> Moncarb aile/SKU öneki <-> Excel Satış vs site 10+ fiyat."""
import json, openpyxl, re
from collections import defaultdict

urunler = [u for u in json.load(open(r'C:\Users\info\frezefabrikasi-site\products.json', encoding='utf-8')) if u.get('aktif') is not False]

wb = openpyxl.load_workbook(r'C:\Users\info\moncarb-fiyatlama\FREZEFABRIKASI FIYAT SISTEMI.xlsx', data_only=True, read_only=True)
SAYFALAR = ['SHARPRO-430','HARDCO-430R','HARDBALL-240L','HARDBALL-220','EPF-530','SHARPRO-420','HARDCO-420R',
 'HARDFIN-630L','HIGHRO-410R','HARDBALL-210','HARDCO-452R','ALUCO-710AR','ALURO-710A','ALURO-110','ALUBALL-720A',
 'PEN','KR','EMT','INSERT','KR TUTUCU','ETF (OUTSOURCE)','ECO']
def num(v):
    try:
        f = float(v); return round(f, 2) if f > 0 else None
    except: return None
excel = {}
for ad in SAYFALAR:
    try: ws = wb[ad]
    except KeyError: continue
    data = list(ws.iter_rows(min_row=1, max_row=min(ws.max_row, 400), max_col=20, values_only=True))
    hdr = skuc = satisc = None
    for i, row in enumerate(data[:8]):
        b = {str(v).strip(): j for j, v in enumerate(row) if v}
        sc = next((j for t, j in b.items() if 'SKU' in t.upper() or 'STOK KODU' in t.upper()), None)
        st = next((j for t, j in b.items() if t in ('Satış $', 'SATIŞ $', 'YENİ $')), None)
        if sc is not None and st is not None: hdr, skuc, satisc = i, sc, st; break
    if hdr is None: continue
    for row in data[hdr+1:]:
        if skuc < len(row) and satisc < len(row) and row[skuc] and num(row[satisc]):
            excel[str(row[skuc]).strip()] = num(row[satisc])

grup = defaultdict(list)
for u in urunler:
    grup[(u['kat'], u.get('grup') or u['aile'])].append(u)

satirlar = []
for (kat, g), l in sorted(grup.items()):
    aileler = sorted({u['aile'] for u in l})
    onek = sorted({u['sku'][:6] for u in l if not u['sku'].startswith(('NECK', 'CMC'))})[:3]
    fiyatli = [u for u in l if u.get('satis')]
    esit = farkli = yok = 0
    ornekler = []
    for u in fiyatli:
        e = excel.get(u['sku'])
        if e is None: yok += 1
        elif abs(e - u['satis']) <= 0.01: esit += 1
        else:
            farkli += 1
            if len(ornekler) < 2: ornekler.append(f"{u['sku']}: Excel {e} / site {u['satis']}")
    durum = '✅' if farkli == 0 else f'⚠ {farkli} fark'
    satirlar.append((kat, g, '+'.join(aileler), '/'.join(onek), len(l), len(fiyatli), durum, ' · '.join(ornekler)))

md = ['# SİTE ↔ MONCARB EŞLEŞTİRME & FİYAT DENETİM TABLOSU', '',
      '| Kategori | Site Grubu | Moncarb Aile | SKU Önek | Ölçü | Fiyatlı | Excel↔Site | Fark örneği |',
      '|---|---|---|---|---|---|---|---|']
for s in satirlar:
    md.append('| ' + ' | '.join(str(x) for x in s) + ' |')
md.append('')
md.append('Not: ⚠ farkların ana sebebi R-KURALI (R varyantları grup içi EN DÜŞÜK fiyata eşitlenir — kullanıcı kuralı).')
md.append('Excel\'de R varyantına farklı fiyat girildiyse site en düşüğü gösterir. Kural değişsin istersen söyle.')
open(r'C:\Users\info\frezefabrikasi-site\ESLESTIRME.md', 'w', encoding='utf-8').write('\n'.join(md))
for s in satirlar: print(f"{s[0][:14]:14} | {s[1][:34]:34} | {s[2][:28]:28} | {s[6]}")
