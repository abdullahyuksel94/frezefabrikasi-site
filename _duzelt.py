# -*- coding: utf-8 -*-
import json, re
p = r'C:\Users\info\frezefabrikasi-site\products.json'
urunler = json.load(open(p, encoding='utf-8'))
nz = 0
for u in urunler:
    if 'z' in u:
        del u['z']; nz += 1  # uydurma agiz bilgisi kaldirildi — gercek degerler kullanicidan gelecek
    ad = u['ad'].upper().replace(' ', '')
    aile = u['aile']
    uzun = bool(re.search(r'(430L|430RL|430RLX|420RL|452RL|220L|220LX|210L|630L|710AL|LX)', ad))
    ku = 'Uzun Boy' if uzun else 'Kısa Boy'
    if aile in ('SHARPRO-430', 'SHARPRO-420', 'ETF (OUTSOURCE)'):
        u['grup'] = f'Standart Düz Freze — {ku}'
        u.pop('R', None)  # duzde R olmaz (kullanici)
    elif aile == 'EPF-530':
        u['grup'] = f'Sert Düz Freze (55 HRC) — {ku}'; u.pop('R', None)
    elif aile == 'HARDFIN-630L':
        u.pop('R', None)
    elif aile in ('HARDCO-430R', 'HARDCO-420R'):
        u['grup'] = f'Sert Köşe Radius — {ku}'
    elif aile in ('HARDBALL-220', 'HARDBALL-210'):
        u['grup'] = f'Standart Küre — {ku}'
    elif aile == 'HARDBALL-240L':
        u['grup'] = 'Sert Küre — Uzun Boy'
    elif aile in ('ALURO-710A', 'ALURO-110'):
        u['grup'] = f'Alüminyum Düz — {ku}'; u.pop('R', None)
    elif aile == 'ALUCO-710AR':
        u['grup'] = f'Alüminyum Köşe Radius — {ku}'
    elif aile == 'ALUBALL-720A':
        u['grup'] = f'Alüminyum Küre — {ku}'
json.dump(urunler, open(p, 'w', encoding='utf-8'), ensure_ascii=False)
print('z kaldirilan:', nz, '| gruplar L/LX koduna gore, duzlerde R yok')
