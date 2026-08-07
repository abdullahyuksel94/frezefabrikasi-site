# -*- coding: utf-8 -*-
"""SEO statik üretici: products.json -> urun/<slug>.html (Google'ın okuyacağı gerçek HTML)
+ sitemap.xml + robots.txt. Her katalog güncellemesinden sonra çalıştırılır."""
import json, os, re, html, datetime

KOK = os.path.dirname(os.path.abspath(__file__))
urunler = [u for u in json.load(open(os.path.join(KOK, 'products.json'), encoding='utf-8')) if u.get('aktif') is not False]
BUGUN = datetime.date.today().isoformat()
SITE = 'https://frezefabrikasi.com'

def slug(s):
    t = s.lower()
    for a, b in zip('çğıöşü', 'cgiosu'): t = t.replace(a, b)
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', t)).strip('-')

def fmt(x): return f"{x:.2f}".replace('.', ',') + ' $'

gruplar = {}
for u in urunler:
    g = u.get('grup') or u['aile']
    gruplar.setdefault(g, []).append(u)

os.makedirs(os.path.join(KOK, 'urun'), exist_ok=True)
sitemap = [f'{SITE}/', f'{SITE}/katalog.html', f'{SITE}/kaplama-rehberi.html']

for g, liste in gruplar.items():
    liste.sort(key=lambda u: (float((u.get('D') or '99').replace(',', '.')), float((u.get('L') or '0').replace(',', '.')) if u.get('L') else 0))
    ilk = next((u for u in liste if u.get('foto')), liste[0])
    kat = ilk['kat']; sl = slug(g)
    sert = bool(re.search(r'Sert|70 HRC|55 HRC', g))
    kaplama = ('Kaplamasız — polisajlı ağız' if 'Alüminyum' in g else 'TLX / AlTiN' if 'Matkap' in g
               else 'TLX — 70 HRC sınıfı' if sert else 'TSH — 55 HRC sınıfı')
    sertlik = ('Alüminyum · bakır · plastik' if 'Alüminyum' in g else '70 HRC sertliğe kadar' if sert else '55 HRC sertliğe kadar')
    r_var = any(u.get('R') for u in liste)
    tut_mu = any(u.get('tut') for u in liste)
    uc_mu = (not tut_mu) and any(u.get('ic') for u in liste)
    kaplamalar = ' / '.join(sorted({m2.group(1) for u in liste for m2 in [__import__('re').search(r'\b(TSH|TLX|TH|TX|PM)\b', u['ad'].upper())] if m2})) or 'TSH'
    fiyatli = [u for u in liste if u.get('satis')]
    min_f = min((u['satis'] for u in fiyatli), default=None)
    TIP_SIRA = ['Düz', 'Köşe Radius', 'Küre']
    tipler = [t for t in TIP_SIRA if any(u.get('tip') == t for u in liste)]
    bolumlu = len(tipler) > 1
    satirlar = []
    onceki_tip = None
    liste = sorted(liste, key=lambda u: (TIP_SIRA.index(u.get('tip')) if bolumlu and u.get('tip') in TIP_SIRA else 0,
        float((u.get('D') or '99').replace(',', '.')) if str(u.get('D') or '').replace(',','').replace('.','').isdigit() else 99))
    for u in [x for x in liste if x.get('D') or x.get('ic') or x.get('tut')]:
        if bolumlu and u.get('tip') and u.get('tip') != onceki_tip:
            onceki_tip = u.get('tip')
            satirlar.append(f"<tr><td colspan='9' style='background:#211f1e; color:#fff; font-weight:800; text-transform:uppercase; padding:.45rem .7rem;'>{onceki_tip}</td></tr>")
        if tut_mu:
            kim = f"<td class='sol'>{html.escape(u.get('mad') or u['ad'])}</td><td class='orta mono'>{u.get('D') or '—'}</td><td class='orta mono'>{u.get('bag') or '—'}</td><td class='orta mono'>{u.get('L') or '—'}</td><td class='orta mono'>{u.get('z') or '—'}</td>"
        elif uc_mu:
            kim = f"<td class='sol kalin'>{u.get('mad') or u['ad']}</td><td class='orta mono'>{u.get('ic') or '—'}</td><td class='orta mono'>{u.get('kal') or '—'}</td>" + (f"<td class='orta mono'>{u.get('R') or '—'}</td>" if r_var else "")
        else:
            kim = f"<td class='sol mono kalin'>{u.get('D') or '—'}</td><td class='orta mono'>{u.get('L') or '—'}</td>" + (f"<td class='orta mono'>{u.get('R') or '—'}</td>" if r_var else "")
        if u.get('satis'):
            tek = u['satis'] / 0.88; bes = tek * 0.93
            if tut_mu:
                satirlar.append(f"<tr>{kim}<td class='our mono dip'>{fmt(u['satis'])}</td><td class='orta'><span class='alsat'><input class='qty mono' type='number' min='1' value='1'><button class='btn mini sepet-btn' data-sku='{html.escape(u['sku'])}' data-ad='{html.escape(u.get('mad') or u['ad'])}' data-satis='{u['satis']}' data-tur='kater'>Ekle</button></span></td></tr>")
            elif uc_mu:
                satirlar.append(f"<tr>{kim}<td class='our mono dip'>{fmt(u['satis'])}</td><td class='orta'><span class='alsat'><input class='qty mono' type='number' min='10' step='10' value='10'><button class='btn mini sepet-btn' data-sku='{html.escape(u['sku'])}' data-ad='{html.escape(u.get('mad') or u['ad'])}' data-satis='{u['satis']}' data-tur='uc'>Ekle</button></span></td></tr>")
            else:
                satirlar.append(f"""<tr>{kim}<td class='our mono dip'>{fmt(u['satis'])}</td><td class='mono'>{fmt(bes)}</td><td class='mono soluk'>{fmt(tek)}</td>
<td class='orta'><span class='alsat'><input class='qty mono' type='number' min='1' value='10' aria-label='adet'><button class='btn mini sepet-btn' data-sku='{html.escape(u['sku'])}' data-ad='{html.escape(u.get('mad') or u['ad'])}' data-satis='{u['satis']}'>Ekle</button></span></td></tr>""")
        else:
            ad = html.escape(u.get('mad') or u['ad'])
            satirlar.append(f"""<tr>{kim}<td colspan='3' class='sol soluk'>Fiyat için sorun</td><td class='orta'><a class='btn gri mini' target='_blank' rel='noopener' href='https://wa.me/902129060303?text={html.escape(ad)}%20fiyat%C4%B1%3F'>Sor</a></td></tr>""")

    # uyumlu katerler (uc sayfalari)
    kater_html = ''
    if uc_mu:
        import re as _re
        kod = (_re.match(r'^([A-Z]{2,6}\d{0,2})', g) or [None]) and (_re.match(r'^([A-Z]{2,6}\d{0,2})', g).group(1) if _re.match(r'^([A-Z]{2,6}\d{0,2})', g) else None)
        if kod:
            katerler = [x for x in urunler if x['aile'] == 'AYDIN TAKIM' and kod in x['ad'].upper().replace(' ', '')]
            if katerler:
                ksatir = []
                for x in katerler[:40]:
                    if x.get('satis'):
                        tekk = x['satis'] / 0.88; besk = tekk * 0.93
                        ksatir.append(f"<tr><td class='sol'>{html.escape(x.get('mad') or x['ad'])}</td><td class='our mono dip'>{fmt(x['satis'])}</td><td class='orta'><span class='alsat'><input class='qty mono' type='number' min='1' value='1'><button class='btn mini sepet-btn' data-sku='{html.escape(x['sku'])}' data-ad='{html.escape(x.get('mad') or x['ad'])}' data-satis='{x['satis']}' data-tur='kater'>Ekle</button></span></td></tr>")
                if ksatir:
                    kater_html = ("<h2 style='margin-top:1.4rem; font-size:1.15rem; font-weight:850; text-transform:uppercase;'><span style='color:#d81f26;'>/</span> Bu Uca Uygun Katerler (" + str(len(ksatir)) + ")</h2>"
                        "<div class='tblwrap olcu-kart'><table class='olcu-tablo'>"
                        "<tr><th class='sol'>Kater</th><th>Fiyat</th><th class='orta'>Sipariş</th></tr>"
                        + ''.join(ksatir) + "</table></div>"
                        + "<div class='asistan-band'>🎁 <b>Kampanya:</b> Aynı uçtan 50+ alana uyumlu kater sadece <b>1 $</b>! · Emin değil misin? <button class='btn mini' onclick=\"document.getElementById('bot-panel').classList.add('on')\">Asistana Danış 💬</button></div>")

    jsonld = json.dumps({
        "@context": "https://schema.org", "@type": "Product",
        "name": g, "brand": {"@type": "Brand", "name": "FREZE FABRİKASI (MONCARB)"},
        "description": f"{g} — karbür kesici takım, üreticiden. {sertlik}, {kaplama} kaplama.",
        "image": SITE + '/' + ilk.get('foto', ''),
        "offers": {"@type": "AggregateOffer", "priceCurrency": "USD",
                   "lowPrice": min_f or 0, "offerCount": len(fiyatli),
                   "availability": "https://schema.org/InStock"},
    }, ensure_ascii=False)
    sayfa = f"""<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://formsubmit.co; base-uri 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{g} Fiyatları | Üreticiden Karbür Freze — FREZE FABRİKASI</title>
<meta name="description" content="{g}: {len(liste)} ölçü stoktan. {sertlik}, {kaplama}. Aynı üründen 10+ adette dip fiyat{', ' + fmt(min_f) + chr(39) + 'den başlar' if min_f else ''}. Kapıda ödeme, aynı gün kargo.">
<link rel="canonical" href="{SITE}/urun/{sl}.html">
<meta property="og:title" content="{g} | FREZE FABRİKASI">
<meta property="og:description" content="Üreticiden {g.lower()} — 10+ adette dip fiyat.">
<meta property="og:image" content="{SITE}/{ilk.get('foto','')}">
<meta property="og:type" content="product">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../style.css">
<script type="application/ld+json">{jsonld}</script>
</head>
<body>
<div class="ribbon">🔥 Vitrindeki fiyat = aynı üründen 10+ ADET alım fiyatıdır · Adedi artır, dip fiyattan al</div>
<header class="site">
  <a class="logo" href="../index.html">FREZE<span>FABRİKASI</span></a>
  <nav>
    <a href="../katalog.html">Tüm Ürünler</a>
    <a href="../katalog.html?kat={html.escape(kat)}">{kat}</a>
    <a href="../kaplama-rehberi.html">Seçim Rehberi</a>
  </nav>
  <a class="tel-ust" href="tel:02129060303">📞 0212 906 03 03</a>
</header>
<main>
  <section>
    <div class="urun-ust">
      <div class="urun-foto">{'<img src="../' + ilk['foto'] + '" alt="' + html.escape(g) + '">' if ilk.get('foto') else ''}</div>
      <div class="urun-bilgi">
        <a href="../katalog.html?kat={html.escape(kat)}" class="geri">← {kat}</a>
        <h1 style="font-size:1.5rem; margin:.2rem 0 .3rem; text-transform:uppercase; font-weight:900;">{g}</h1>
        <p class="uzun">Üreticiden {html.escape(g.lower())} — stoktan aynı gün kargo, aynı üründen 10+ adette dip fiyat.</p>
        <div class="spec-grid">
          {'<div><small>Kaplama seçenekleri</small><b>' + kaplamalar + '</b></div><div><small>Uç tipi</small><b>Değiştirilebilir (ISO)</b></div>' if uc_mu else ('<div><small>Kaplama</small><b>' + kaplama + '</b></div><div><small>Kullanım alanı</small><b>' + sertlik + '</b></div><div><small>Çap toleransı (D1)</small><b>' + ('m7' if 'Matkap' in g else '0 / −0,02 mm') + '</b></div><div><small>Şaft toleransı (D2)</small><b>h6</b></div>' + ('<div><small>Radius toleransı</small><b>±0,01 mm</b></div>' if ('Radius' in g or 'Küre' in g) else ''))}
          <div><small>Karbür</small><b>Mikro tane (ultra-fine)</b></div>
          <div><small>Menşei</small><b>Türkiye — kendi üretimimiz</b></div>
        </div>
        <div class="chips" style="margin-top:.7rem;">
          <div class="chip2">🚚 Aynı gün kargo</div><div class="chip2">💵 Kapıda ödeme</div><div class="chip2">↩ 14 gün iade</div>
        </div>
      </div>
    </div>
    
    <div class="tblwrap olcu-kart"><table class="olcu-tablo">
      {('<tr><th class="sol">Kater</th><th class="orta">DC (Uç Çapı)</th><th class="orta">DCON (Bağlantı)</th><th class="orta">LF (Boy)</th><th class="orta">Z</th><th>Fiyat</th><th class="orta">Sipariş</th></tr>') if tut_mu else ('<tr><th class="sol">Uç Adı</th><th class="orta">IC</th><th class="orta">Kalınlık</th>' + ('<th class="orta">R</th>' if r_var else '') + '<th>Adet Fiyatı</th><th class="orta">Sipariş — 10 ve katları</th></tr>') if uc_mu else ('<tr><th class="sol">⌀ Çap</th><th class="orta">Boy</th>' + ('<th class="orta">R</th>' if r_var else '') + '<th>10+ Adet</th><th>5-9 Adet</th><th>1-4 Adet</th><th class="orta">Sipariş</th></tr>')}
      {''.join(satirlar)}
    </table></div>
    {kater_html}
    <div class="asistan-band">🤔 Hangi ölçüyü alacağından emin değil misin? <button class="btn mini" onclick="document.getElementById('bot-panel').classList.add('on')">Asistana Danış 💬</button> <span style="color:#6b6864;">ya da ara: 0212 906 03 03</span></div>
  </section>
</main>
<div id="cartbar">
  <span class="info"></span><span class="next"></span>
  <a class="cta wa" href="#" target="_blank" rel="noopener">Siparişi WhatsApp'tan Gönder</a>
  <a href="tel:02129060303" style="color:#c8c4bf; font-size:.8rem; text-decoration:none;">ya da ara: <b style="color:#fff;">0212 906 03 03</b></a>
  <button class="clear">Boşalt</button>
</div>
<footer class="site">
  <div class="in">
    <div><b>FREZE FABRİKASI</b> — Bir MONCARB kuruluşudur · 2018'den beri üretici · İstanbul</div>
    <div>Kapıda ödeme · 14 gün iade · Aynı gün kargo</div>
    <div>Sipariş &amp; Destek: <span class="mono">0212 906 03 03</span></div>
  </div>
</footer>
<script src="../app.js"></script>
<script src="../bot.js"></script>
</body>
</html>"""
    open(os.path.join(KOK, 'urun', sl + '.html'), 'w', encoding='utf-8').write(sayfa)
    sitemap.append(f'{SITE}/urun/{sl}.html')

with open(os.path.join(KOK, 'sitemap.xml'), 'w', encoding='utf-8') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for url in sitemap:
        f.write(f'  <url><loc>{url}</loc><lastmod>{BUGUN}</lastmod></url>\n')
    f.write('</urlset>\n')

open(os.path.join(KOK, 'robots.txt'), 'w', encoding='utf-8').write(
    f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')

print('statik sayfa:', len(gruplar), '| sitemap url:', len(sitemap))
