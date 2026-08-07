# -*- coding: utf-8 -*-
"""KURAL (kullanıcı 07.08): Köşe radius değişince fiyat DEĞİŞMEZ.
Aynı grup içinde aynı ⌀D × Boy olan satırlar tek fiyat taşır (en düşük/baz satış)."""
import json
from collections import defaultdict
p = r'C:\Users\info\frezefabrikasi-site\products.json'
urunler = json.load(open(p, encoding='utf-8'))
grup = defaultdict(list)
for u in urunler:
    if u.get('satis') and u.get('D'):
        grup[(u.get('grup') or u['aile'], u['D'], u.get('L') or '')].append(u)
duzeltilen = 0
for (g, D, L), l in grup.items():
    if len(l) < 2: continue
    fiyatlar = {u['satis'] for u in l}
    if len(fiyatlar) > 1:
        taban = min(fiyatlar)
        for u in l:
            if u['satis'] != taban:
                u['satis'] = taban; duzeltilen += 1
json.dump(urunler, open(p, 'w', encoding='utf-8'), ensure_ascii=False)
print('R-kurali: esitlenen satir:', duzeltilen)
