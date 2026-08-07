/* FREZE FABRİKASI — katalog + kademeli fiyat sepeti
   FİYAT MODELİ (Alibaba tarzı, AYNI ÜRÜNDEN adede göre):
   products.json "satis" = aynı üründen 10+ adet alımdaki DİP fiyat (vitrinde büyük gösterilen)
   Tek adet = satis / 0.88  ·  aynı üründen 5+ = tek × 0.93
   Sepet, HER ÜRÜNÜN KENDİ adedine göre kademeyi otomatik uygular. */

const KDM = {
  tek: s => s / 0.88,
  bes: s => (s / 0.88) * 0.93,
  on:  s => s,
};
const fmt = n => n.toFixed(2).replace('.', ',') + ' $';

/* ---------- SEPET ---------- */
const sepet = {
  oku()  { try { return JSON.parse(localStorage.getItem('ff-sepet') || '[]'); } catch { return []; } },
  yaz(l) { localStorage.setItem('ff-sepet', JSON.stringify(l)); bar(); },
  ekle(sku, ad, satis, adet) {
    const l = sepet.oku();
    const m = l.find(x => x.sku === sku);
    if (m) m.adet += adet; else l.push({ sku, ad, satis, adet });
    sepet.yaz(l);
  },
  bosalt() { sepet.yaz([]); },
};

function satirFiyat(x) {
  const fn = x.adet >= 10 ? KDM.on : x.adet >= 5 ? KDM.bes : KDM.tek;
  return fn(x.satis) * x.adet;
}
function kademeHesap(l) {
  const adet = l.reduce((t, x) => t + x.adet, 0);
  const toplam = l.reduce((t, x) => t + satirFiyat(x), 0);
  const dipte = l.filter(x => x.adet >= 10).length;
  const etiket = dipte === l.length && l.length ? 'hepsi DİP FİYATTA' :
                 dipte ? `${dipte} ürün dip fiyatta` : 'adet arttıkça ürün fiyatı düşer';
  return { adet, toplam, etiket };
}

function bar() {
  const el = document.getElementById('cartbar');
  if (!el) return;
  const l = sepet.oku();
  if (!l.length) { el.classList.remove('on'); return; }
  const { adet, toplam, etiket } = kademeHesap(l);
  const aday = l.filter(x => x.adet < 10).sort((a, b) => b.adet - a.adet)[0];
  const sonraki = !aday ? 'Dip fiyattasınız 🔥' :
    aday.adet >= 5 ? `${aday.ad.slice(0, 25)}: ${10 - aday.adet} adet daha → DİP FİYAT` :
    `${aday.ad.slice(0, 25)}: ${5 - aday.adet} adet daha → 5+ indirimi`;
  el.querySelector('.info').textContent = `Sepet: ${adet} ürün · ${fmt(toplam)} (${etiket})`;
  el.querySelector('.next').textContent = sonraki;
  const metin = l.map(x => `• [${x.sku}] ${x.ad} × ${x.adet}`).join('%0A');
  el.querySelector('.wa').href =
    `https://wa.me/902129060303?text=Merhaba, sipariş vermek istiyorum:%0A${metin}%0AToplam: ${encodeURIComponent(fmt(toplam))} (${encodeURIComponent(etiket)})`;
  el.classList.add('on');
}

/* ---------- AİLE BİLGİLERİ (moncarb site yapısından) ---------- */
const AILE_BILGI = {
  'SHARPRO-430': ['Genel amaçlı düz freze — Z4, TSH kaplama, mikro tane karbür. İmalat ve ıslah çeliklerinin ekmek teknesi.', 'images/products/sharpro430.png'],
  'SHARPRO-420': ['2 ağızlı düz freze — kanal ve cep açmada talaş tahliyesi rahat.', 'images/products/hardsharp420_new.png'],
  'HIGHRO-410R': ['Yüksek ilerleme (high-feed) frezesi — kaba talaşta zaman kazandırır.', 'images/products/highro410_new.png'],
  'EPF-530': ['55 HRC sınıfı parmak freze — sertleştirilmiş kalıp çeliğinde güvenilir.', 'images/products/hardsharp420l.png'],
  'HARDCO-430R': ['Köşe radüslü freze R0,2-R3 — kalıpçının kaba+yarı finiş standardı.', 'images/products/hardco430r.png'],
  'HARDCO-420R': ['2 ağızlı köşe radüslü — dalma ve cep işlerinde.', 'images/products/hardco420r_new.png'],
  'HARDCO-452R': ['Ağır kaba talaş radüslü serisi — yüksek talaş debisi.', 'images/products/hardco452r_new.png'],
  'HARDBALL-220': ['Tam küre freze Z2 — 55 HRC\'ye kadar profil ve finiş.', 'images/products/hardball220.png'],
  'HARDBALL-210': ['Küre freze — genel amaçlı profil işleme.', 'images/products/hardball210_new.png'],
  'HARDBALL-240L': ['65 HRC sert malzeme küresi, TLX kaplama, uzun boy — uzmanlık serimiz.', 'images/products/hardball240l.png'],
  'HARDFIN-630L': ['Sert malzeme finiş frezesi — kalıpta son yüzey kalitesi.', 'images/products/hardfin630.png'],
  'ALUCO-710AR': ['Alüminyum köşe radüslü — polisajlı, yapışma yapmaz.', 'images/products/aluco710ar.png'],
  'ALURO-710A': ['Alüminyum düz freze — parlak ağız, yüksek devir.', 'images/products/aluro710a.png'],
  'ALURO-110': ['Alüminyum ekonomik seri.', 'images/products/alu_main.png'],
  'ALUBALL-720A': ['Alüminyum küre freze.', 'images/products/alu710.png'],
  'NECK': ['Boğazlı (neck) frezeler — derin cepte gövde sürtmez.', 'images/products/neckball220b_new.png'],
  'PEN': ['Mikro ve pen frezeler — hassas küçük çap işleri.', 'images/products/penco410br_new.png'],
  'EMT': ['Karbür matkaplar — 3D/5D, içten soğutmalı seçenekler.', 'images/products/dr210-1.png'],
  'INSERT': ['Değiştirilebilir kesici uçlar — freze gövdeleriniz için.', 'images/products/insert-tools-hero.png'],
  'KR': ['KR serisi değiştirilebilir kafa uçları — kendi üretimimiz.', 'images/products/insert-38-kr220-1.png'],
  'KR TUTUCU': ['KR uçları için tutucular.', 'images/products/insert-tools-hero.png'],
  'THREMILL': ['Diş frezeleri — tek takımla çok diş standardı.', 'images/products/th30-1.png'],
  'AYDIN TAKIM': ['Takım tutucular ve tarama kafaları.', 'images/products/insert_apkt10.png'],
  'ECO': ['ECO ithal seri — küçük çapta en iyi fiyat/performans.', 'images/products/bm220new.png'],
  'ETF (OUTSOURCE)': ['ETF ekonomik düz freze serisi.', 'images/products/sharp430l.png'],
  'CMC': ['CMC özel frezeler.', ''],
  'TORNA': ['Tornalama uçları.', ''],
  'ERY-212': ['Raybalar — hassas delik toleransı.', ''],
  'CHEMFER-EPK': ['Pah ve havşa frezeleri.', ''],
};

/* ---------- KATALOG: Kategori → Aile → Ölçü tablosu (frezecim/moncarb yapısı) ---------- */
async function katalog() {
  const kok = document.getElementById('katalog');
  if (!kok) return;
  const hepsi = (await (await fetch('products.json')).json()).filter(u => u.aktif !== false);
  const params = new URLSearchParams(location.search);
  const sec = document.getElementById('f-kat');
  const ara = document.getElementById('f-ara');
  [...new Set(hepsi.map(u => u.kat))].forEach(k => sec.add(new Option(k, k)));
  if (params.get('kat')) sec.value = params.get('kat');
  let seciliGrup = params.get('grup') || '';

  function satirlar(liste, teknik) { /* frezecim usulü teknik sütunlu ölçü tablosu */
    const t = teknik && liste.some(u => u.D);
    const bas = t
      ? `<tr><th class="sol">⌀ Çap</th><th class="orta">Boy</th><th class="orta">R</th><th class="orta">z</th><th>10+ Adet</th><th>5-9 Adet</th><th>1-4 Adet</th><th class="orta">Sipariş</th></tr>`
      : `<tr><th class="sol">Ürün</th><th>10+ Adet</th><th>5-9 Adet</th><th>1-4 Adet</th><th class="orta">Sipariş</th></tr>`;
    const satir = (u, i) => {
      const kimlik = t
        ? `<td class="sol mono kalin">${u.D || '—'}</td><td class="orta mono">${u.L || '—'}</td><td class="orta mono">${u.R || '—'}</td><td class="orta mono">${u.z || '—'}</td>`
        : `<td class="sol">${u.mad || u.ad}</td>`;
      if (u.satis == null) return `<tr>${kimlik}<td colspan="3" class="sol soluk">Fiyat için sorun</td>
        <td class="orta"><a class="btn gri mini" target="_blank" rel="noopener" href="https://wa.me/902129060303?text=${encodeURIComponent((u.mad || u.ad) + ' (' + u.sku + ') fiyatı?')}">Sor</a></td></tr>`;
      return `<tr>${kimlik}
        <td class="our mono dip">${fmt(u.satis)}</td>
        <td class="mono">${fmt(KDM.bes(u.satis))}</td>
        <td class="mono soluk">${fmt(KDM.tek(u.satis))}</td>
        <td class="orta"><span class="alsat"><input class="qty mono" type="number" min="1" value="10" aria-label="adet"><button class="btn mini" data-sku="${u.sku}">Ekle</button></span></td></tr>`;
    };
    return `<div class="tblwrap olcu-kart"><table class="olcu-tablo">${bas}${liste.map(satir).join('')}</table></div>`;
  }

  function ciz() {
    const q = (ara.value || '').toLocaleLowerCase('tr');
    const k = sec.value;
    let html = '';

    if (q) { /* ARAMA: tüm katalogda düz tablo */
      const liste = hepsi.filter(u => (u.ad + ' ' + u.sku + ' ' + u.olcu + ' ' + u.aile).toLocaleLowerCase('tr').includes(q)).slice(0, 150);
      document.getElementById('f-say').textContent = liste.length + ' sonuç';
      html = liste.length ? satirlar(liste) : '<p class="sec-sub">Sonuç yok — farklı yazmayı dene (örn. "küre 8").</p>';
    } else if (seciliGrup) { /* ALT GRUP = ÜRÜN SAYFASI (frezecim/agnero modeli): büyük görsel + teknik özellikler + ölçü tablosu */
      const liste = hepsi.filter(u => (u.grup || u.aile) === seciliGrup);
      liste.sort((a, b) => (parseFloat((a.D || '99').replace(',', '.')) - parseFloat((b.D || '99').replace(',', '.'))) || ((a.L || 0) - (b.L || 0)));
      const ilk = liste.find(u => u.foto) || liste[0] || {};
      const acik = (AILE_BILGI[ilk.aile] || [''])[0] || '';
      const kat = ilk.kat || k;
      const zlar = [...new Set(liste.map(u => u.z).filter(Boolean))].join(' / ');
      const sert = /Sert|65 HRC|55 HRC/.test(seciliGrup);
      const kaplama = /Alüminyum/.test(seciliGrup) ? 'Kaplamasız — polisajlı ağız'
                    : /Matkap/.test(seciliGrup) ? 'TLX / AlTiN' : sert ? 'TLX — 65 HRC sınıfı' : 'TSH — 55 HRC sınıfı';
      const sertlik = /Alüminyum/.test(seciliGrup) ? 'Alüminyum · bakır · plastik'
                    : sert ? '65 HRC sertliğe kadar' : '55 HRC sertliğe kadar';
      document.getElementById('f-say').textContent = liste.length + ' ölçü';
      html = `<div class="urun-ust">
          <div class="urun-foto">${ilk.foto ? `<img src="${ilk.foto}" alt="${seciliGrup}">` : ''}</div>
          <div class="urun-bilgi">
            <a href="katalog.html${kat ? '?kat=' + encodeURIComponent(kat) : ''}" class="geri">← ${kat || 'Kategoriler'}</a>
            <h2>${seciliGrup}</h2>
            <p class="uzun">${acik}</p>
            <div class="spec-grid">
              <div><small>Kaplama</small><b>${kaplama}</b></div>
              <div><small>Ağız sayısı (z)</small><b>${zlar || '—'}</b></div>
              <div><small>Kullanım alanı</small><b>${sertlik}</b></div>
              <div><small>Şaft toleransı</small><b>h6</b></div>
              <div><small>Karbür</small><b>Mikro tane (ultra-fine)</b></div>
              <div><small>Menşei</small><b>Türkiye — kendi üretimimiz</b></div>
            </div>
            <div class="chips" style="margin-top:.7rem;">
              <div class="chip2">🚚 Aynı gün kargo</div><div class="chip2">💵 Kapıda ödeme</div><div class="chip2">↩ 14 gün iade</div>
            </div>
          </div>
        </div>` + satirlar(liste, true);
    } else { /* KATEGORİ SAYFASI (frezecim usulü): alt grup LİSTESİ — her biri kendi sayfasına gider */
      const grup = new Map();
      hepsi.filter(u => !k || u.kat === k).forEach(u => {
        const g = u.grup || u.aile;
        if (!grup.has(g)) grup.set(g, []);
        grup.get(g).push(u);
      });
      document.getElementById('f-say').textContent = grup.size + ' ürün grubu';
      html = '<div class="grup-liste">' + [...grup.entries()].map(([g, liste]) => {
        const ilk = liste.find(u => u.foto) || liste[0];
        const acik = (AILE_BILGI[ilk.aile] || [''])[0] || '';
        const enDusuk = Math.min(...liste.filter(u => u.satis).map(u => u.satis));
        return `<a class="grup-satir" href="katalog.html?${ilk.kat ? 'kat=' + encodeURIComponent(ilk.kat) + '&' : ''}grup=${encodeURIComponent(g)}">
          ${ilk.foto ? `<img src="${ilk.foto}" alt="" loading="lazy">` : '<span class="bosfoto"></span>'}
          <span class="gbilgi"><b>${g}</b><small>${acik}</small></span>
          <span class="gfiyat">${isFinite(enDusuk) ? `<span class="mono our">${fmt(enDusuk)}</span><small>'den başlar · 10+ fiyatı</small>` : '<small>fiyat sor</small>'}</span>
          <span class="gok">${liste.length} ölçü →</span>
        </a>`;
      }).join('') + '</div>';
    }

    kok.innerHTML = html;
    kok.querySelectorAll('button[data-sku]').forEach(b => b.onclick = () => {
      const u = hepsi.find(x => x.sku === b.dataset.sku);
      const kutu = b.closest('tr').querySelector('.qty');
      const adet = Math.max(1, parseInt(kutu && kutu.value) || 1);
      sepet.ekle(u.sku, u.mad || u.ad, u.satis, adet);
      b.textContent = '✓'; setTimeout(() => b.textContent = 'Ekle', 900);
    });
  }
  ara.oninput = () => { seciliAile = ''; ciz(); };
  sec.onchange = () => { seciliAile = ''; ciz(); };
  ciz();
}

/* ---------- YORUMLAR (yorumlar.json — sadece sahibin onayıyla eklenir) ---------- */
async function yorumlar() {
  const kok = document.getElementById('yorum-liste');
  if (!kok) return;
  try {
    const l = await (await fetch('yorumlar.json')).json();
    if (!l.length) { document.getElementById('yorum-bos').style.display = 'flex'; return; }
    kok.innerHTML = l.map(y => `<div class="prod">
      <div class="fam">${'★'.repeat(y.yildiz || 5)}</div>
      <div class="nm" style="font-weight:600; font-size:.9rem;">"${y.metin}"</div>
      <div class="spec">${y.ad}${y.firma ? ' · ' + y.firma : ''}${y.sehir ? ' · ' + y.sehir : ''}</div>
    </div>`).join('');
  } catch { document.getElementById('yorum-bos').style.display = 'flex'; }
}

function yorumFormu() {
  const f = document.getElementById('yorum-form');
  if (!f) return;
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const d = document.getElementById('yorum-durum');
    d.textContent = 'Gönderiliyor…';
    try {
      const r = await fetch('https://formsubmit.co/ajax/abdullahyuksel94@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ _subject: 'FrezeFabrikasi YENİ YORUM', _captcha: 'false' },
          Object.fromEntries(new FormData(f)))),
      });
      if (!r.ok) throw 0;
      f.reset();
      d.textContent = '✓ Yorumun alındı — onaydan sonra burada yayınlanacak. Teşekkürler!';
    } catch { d.textContent = 'Gönderilemedi — lütfen tekrar dene.'; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  katalog(); bar(); yorumlar(); yorumFormu();
  const t = document.querySelector('#cartbar .clear');
  if (t) t.onclick = () => sepet.bosalt();
});
