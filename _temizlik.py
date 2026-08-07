# -*- coding: utf-8 -*-
"""Veri temizliği: (1) ölçüsü boş varyant satırlarının çapını addan doğru ayrıştır
(2) aynı grup içinde aynı ⌀D×L×R mükerrer satırları teke indir."""
import json, re
p = r'C:\Users\info\frezefabrikasi-site\products.json'
urunler = json.load(open(p, encoding='utf-8'))

# 1) olcu bos olan freze satirlarinda D = aile adindan sonraki ILK sayi
duz = 0
for u in urunler:
    if u['aile'] in ('INSERT', 'KR', 'KR TUTUCU', 'AYDIN TAKIM', 'TORNA', 'EMT', 'CMC'):
        continue
    if (u.get('olcu') or '').strip():
        continue
    ad = u['ad']
    m = re.search(r'[-–]\s*(\d+[\.,]?\d*)', ad)
    if m:
        yeni = m.group(1).replace('.', ',')
        if u.get('D') != yeni:
            u['D'] = yeni; duz += 1
    m2 = re.search(r'(\d+[\.,]?\d*)\s?\*\s?(\d+)', ad)
    if m2:
        u['D'] = m2.group(1).replace('.', ','); u['L'] = m2.group(2)

# 2) mukerrer temizligi: ayni (grup, D, L, R) -> tek satir
gorulen = {}
temiz = []
at = 0
for u in urunler:
    anahtar = (u.get('grup') or u['aile'], u.get('D'), u.get('L'), u.get('R'), u.get('satis'))
    if u.get('D') and anahtar in gorulen:
        at += 1; continue
    gorulen[anahtar] = True
    temiz.append(u)
json.dump(temiz, open(p, 'w', encoding='utf-8'), ensure_ascii=False)
print('cap duzeltilen:', duz, '| atilan mukerrer:', at, '| kalan urun:', len(temiz))
