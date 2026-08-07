# -*- coding: utf-8 -*-
"""Tüm ürün görsellerinde arka planı kaldır: kenarlardan bağlantılı near-white/şeffaf
bölgeyi tam şeffaf yap → beyaz sayfayla 'tek parça' görünüm (matkap görselleri standardı)."""
from PIL import Image
import os
from collections import deque

d = r'C:\Users\info\frezefabrikasi-site\images\products'
ESIK = 235          # bu değerden parlak (ve düşük doygunluklu) pikseller fon sayılır
FARK = 20           # r-g-b birbirine yakın (gri/beyaz) olmalı

def fon_mu(px):
    r, g, b, a = px
    if a < 12: return True
    return r > ESIK and g > ESIK and b > ESIK and (max(r, g, b) - min(r, g, b)) < FARK

n = 0
for f in os.listdir(d):
    if not f.lower().endswith('.png'): continue
    p = os.path.join(d, f)
    im = Image.open(p).convert('RGBA')
    W, H = im.size
    px = im.load()
    gor = [[False] * H for _ in range(W)]
    q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if fon_mu(px[x, y]) and not gor[x][y]: gor[x][y] = True; q.append((x, y))
    for y in range(H):
        for x in (0, W - 1):
            if fon_mu(px[x, y]) and not gor[x][y]: gor[x][y] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and not gor[nx][ny] and fon_mu(px[nx, ny]):
                gor[nx][ny] = True; q.append((nx, ny))
    im.save(p); n += 1
print('fon temizlenen:', n)
