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
  const metin = l.map(x => `• ${x.ad} × ${x.adet}`).join('%0A');
  el.querySelector('.wa').href =
    `https://wa.me/90XXXXXXXXXX?text=Merhaba, sipariş vermek istiyorum:%0A${metin}%0AToplam: ${encodeURIComponent(fmt(toplam))} (${encodeURIComponent(etiket)})`;
  el.classList.add('on');
}

/* ---------- KATALOG ---------- */
async function katalog() {
  const kok = document.getElementById('katalog');
  if (!kok) return;
  const res = await fetch('products.json');
  const hepsi = await res.json();
  const params = new URLSearchParams(location.search);
  const sec = document.getElementById('f-kat');
  const ara = document.getElementById('f-ara');
  [...new Set(hepsi.map(u => u.kat))].forEach(k => sec.add(new Option(k, k)));
  if (params.get('kat')) sec.value = params.get('kat');

  function ciz() {
    const q = (ara.value || '').toLocaleLowerCase('tr');
    const k = sec.value;
    const liste = hepsi.filter(u =>
      (!k || u.kat === k) &&
      (!q || (u.ad + ' ' + u.sku + ' ' + u.olcu).toLocaleLowerCase('tr').includes(q)));
    document.getElementById('f-say').textContent = liste.length + ' ürün';
    kok.innerHTML = liste.slice(0, 120).map(u => {
      const fiyat = u.satis == null
        ? `<div class="ask">Fiyat için WhatsApp'tan sorun</div>`
        : `<div class="price"><span class="now mono">${fmt(u.satis)}</span></div>
           <div class="tier">10+ adet alımda · tek: <span class="mono">${fmt(KDM.tek(u.satis))}</span> · 5+: <span class="mono">${fmt(KDM.bes(u.satis))}</span></div>`;
      const buton = u.satis == null
        ? `<a class="btn gri" target="_blank" rel="noopener" href="https://wa.me/90XXXXXXXXXX?text=${encodeURIComponent(u.ad + ' fiyatını öğrenmek istiyorum')}">Fiyat Sor</a>`
        : `<div class="buyrow"><input class="qty mono" type="number" min="1" value="10" aria-label="adet"><button class="btn" data-sku="${u.sku}">Sepete Ekle</button></div>`;
      return `<div class="prod">
        <div class="fam">${u.aile}</div>
        <div class="nm">${u.ad}</div>
        <div class="spec mono">${u.olcu || u.kat}</div>
        ${fiyat}${buton}
      </div>`;
    }).join('') + (liste.length > 120 ? `<p class="sec-sub">İlk 120 ürün gösteriliyor — aramayı daraltın.</p>` : '');
    kok.querySelectorAll('button[data-sku]').forEach(b => b.onclick = () => {
      const u = hepsi.find(x => x.sku === b.dataset.sku);
      const adet = Math.max(1, parseInt(b.previousElementSibling.value) || 1);
      sepet.ekle(u.sku, u.ad, u.satis, adet);
      b.textContent = 'Eklendi ✓'; setTimeout(() => b.textContent = 'Sepete Ekle', 900);
    });
  }
  ara.oninput = ciz; sec.onchange = ciz; ciz();
}

document.addEventListener('DOMContentLoaded', () => {
  katalog(); bar();
  const t = document.querySelector('#cartbar .clear');
  if (t) t.onclick = () => sepet.bosalt();
});
