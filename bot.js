/* FREZE FABRİKASI Asistan v1 — yerleşik (API'siz) otomasyon.
   Ürün/fiyat/malzeme/SSS sorularını yanıtlar; çözemediğini MÜHENDİSE (WhatsApp) aktarır.
   v2: Claude API'li tam yapay zekâ — bkz. CLAUDE-BOT-PLAN.md (endpoint hazır olunca BOT_API doldurulur). */
const BOT_API = ''; // v2'de Cloudflare Worker adresi girilecek — boşsa yerleşik mod çalışır
const WA = 'https://wa.me/902129060303';

const SSS = [
  [/kargo|teslim|ne zaman gelir/i, 'Saat 16:00\'a kadar verilen siparişler AYNI GÜN kargoya verilir. 1.500 $ üzeri siparişte kargo bedava. 🚚'],
  [/kapıda|ödeme|havale|kart/i, 'Kapıda ödeme çalışıyoruz — takımı gör, teslim alırken öde. Havale/EFT de mümkün. Online kart ödemesi yakında.'],
  [/iade|garanti|beğenmez/i, '14 gün soru sormasız iade garantimiz var. Beğenmezsen geri gönder, paran iade. Risk bizde.'],
  [/fiyat.*(nasıl|neden|kademe)|10\+|adet.*indirim/i, 'Fiyat sistemimiz: aynı üründen adet arttıkça fiyat düşer. Vitrindeki fiyat 10+ adet DİP fiyattır; 5-9 adette ara kademe, 1-4 adette tek fiyat uygulanır.'],
  [/kimsiniz|üretici|nerede|fabrika|moncarb/i, '2018\'den beri üretici olan MONCARB\'ın online markasıyız — İstanbul\'da kendi fabrikamız var. Satıcı değil, üreticiyiz: aracı marjı ödemezsin. 🇹🇷'],
  [/tanışma|paket|ilk sipariş|deneme/i, 'Tanışma Paketi: her yeni vergi numarasına 1 kez — seçtiğin 10 takımın hepsi DİP fiyattan + kargo bedava + 14 gün iade.'],
];

const MALZEME = [
  [/alüminyum|alu|bakır|pirinç|plastik|delrin/i, 'Alüminyum için KAPLAMASIZ polisajlı serilerimizi kullan (AluRO/AluBALL/AluCO) — kaplamalı freze alüminyumda para israfıdır. Kataloğun Alüminyum bölümüne bakabilirsin: katalog.html?kat=Alüminyum'],
  [/1\.2316|paslanmaz.*kalıp|yapışkan/i, '⚠ 1.2316 gibi yapışkan paslanmaz kalıp çeliklerinde kaplama-malzeme uyumu kritik. Bu malzeme için seni mühendisimize aktarıyorum — malzeme + işlem bilgisini yaz, doğru takımı seçelim.', 'muhendis'],
  [/paslanmaz|304|316|inox/i, 'Paslanmazda SharpRO-430 (TSH) genel işlerde iyi sonuç verir. Derin cep/finiş detayı varsa mühendisimize danışmanı öneririm.'],
  [/sert|55 hrc|60 hrc|65 hrc|70 hrc|1\.2379|1\.2344|h13|d2|sertleştiril/i, 'Sert malzeme bizim uzmanlık alanımız (70 HRC\'ye kadar). Sert Küre ve Sert Düz serilerimize bak: katalog.html?kat=Küre Frezeler — rakiplerden %30\'a varan fiyat avantajıyla.'],
  [/çelik|1040|4140|st37|st52|imalat|ıslah/i, 'İmalat/ıslah çelikleri için Standart Düz Freze serimiz (TSH kaplama) ideal: katalog.html?kat=Düz Frezeler'],
  [/döküm|gg25|ggg|sfero|grafit/i, 'Döküm için ayrı seri tutuyoruz (EPF 740A sınıfı) — stok durumu için mühendisimize yazmanı önereyim.', 'muhendis'],
  [/derin delik|matkap|delik del/i, '3×çap derinliğe kadar 3D, 5×çapa kadar 5D matkap kullan. İçten soğutmalı seçenekler de var: katalog.html?kat=Karbür Matkap'],
];

function botCevap(soru) {
  const s = soru.toLocaleLowerCase('tr');
  if (/kesme (şart|parametre)|devir|ilerleme|feed|rpm|vc |fz /i.test(s))
    return { m: 'Kesme parametreleri malzeme + takım + tezgâh üçlüsüne göre değişir — yanlış öneri takım kırar, o yüzden bunu MÜHENDİSİMİZ hesaplasın. Malzemeni ve takımını yaz, WhatsApp\'tan dakikalar içinde dönelim. 👇', wa: true };
  for (const [rx, cevap, esk] of MALZEME)
    if (rx.test(s)) return { m: cevap, wa: esk === 'muhendis' };
  for (const [rx, cevap] of SSS)
    if (rx.test(s)) return { m: cevap };
  // ürün arama: products.json yüklüyse eşleşen grubu öner
  if (window.__BOT_URUNLER) {
    const q = s.replace(/[^a-z0-9çğıöşü ]/g, '');
    const hit = window.__BOT_URUNLER.find(u => q.includes(u.k));
    if (hit) return { m: `${hit.g} ürünlerimiz stokta — ölçüler ve 10+ dip fiyatlar burada: ${hit.url} 🛒` };
  }
  return { m: 'Bu soruyu tam çözemedim — seni fabrika mühendisimize aktarıyorum. WhatsApp\'tan yaz, mesai saatlerinde dakikalar içinde döneriz. (Ya da ara: 0212 906 03 03)', wa: true };
}

function botKur() {
  const kok = document.createElement('div');
  kok.innerHTML = `
  <button id="bot-ac" aria-label="Asistan">💬</button>
  <div id="bot-panel">
    <div class="bot-bas">FF Asistan <small>ürün · fiyat · malzeme</small><span id="bot-kapat">✕</span></div>
    <div class="bot-log" id="bot-log">
      <div class="bot-msg">Merhaba! 👋 Hangi malzemeyi işleyeceksin, hangi ürünü arıyorsun? Kargo/ödeme/iade de sorabilirsin.</div>
    </div>
    <form id="bot-form"><input id="bot-in" placeholder="Sorunu yaz… (örn: 1.2344 için freze)" autocomplete="off"><button class="btn mini" type="submit">Sor</button></form>
  </div>`;
  document.body.appendChild(kok);
  const panel = document.getElementById('bot-panel');
  document.getElementById('bot-ac').onclick = () => panel.classList.toggle('on');
  document.getElementById('bot-kapat').onclick = () => panel.classList.remove('on');
  document.getElementById('bot-form').onsubmit = e => {
    e.preventDefault();
    const inp = document.getElementById('bot-in');
    const q = inp.value.trim(); if (!q) return;
    const log = document.getElementById('bot-log');
    log.insertAdjacentHTML('beforeend', `<div class="bot-msg kul">${q.replace(/</g, '&lt;')}</div>`);
    const c = botCevap(q);
    const link = c.wa ? ` <a target="_blank" rel="noopener" href="${WA}?text=${encodeURIComponent('Merhaba, sorum: ' + q)}"><b>→ Mühendise Yaz</b></a>` : '';
    log.insertAdjacentHTML('beforeend', `<div class="bot-msg">${c.m}${link}</div>`);
    inp.value = ''; log.scrollTop = log.scrollHeight;
  };
  // ürün dizini (hafif): grup adı -> url
  fetch((location.pathname.includes('/urun/') ? '../' : '') + 'products.json')
    .then(r => r.json())
    .then(d => {
      const g = new Map();
      d.filter(u => u.aktif !== false).forEach(u => {
        const ad = u.grup || u.aile;
        if (!g.has(ad)) g.set(ad, ad.toLocaleLowerCase('tr').split('—')[0].trim());
      });
      window.__BOT_URUNLER = [...g.entries()].map(([grup, k]) => ({
        g: grup, k: k.split(' ')[0],
        url: (location.pathname.includes('/urun/') ? '' : 'urun/') +
             grup.toLowerCase().replace(/[çğıöşü]/g, x => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[x])).replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '.html',
      }));
    }).catch(() => {});
}
document.addEventListener('DOMContentLoaded', botKur);
