# frezefabrikasi.com

FREZE FABRİKASI — Moncarb alt markası e-ticaret sitesi (kuruluş 2018, İstanbul; hedef pazar Anadolu).

## ⚠️ İŞ BÖLÜMÜ — çakışma olmasın
- **Claude Code** (kullanıcının bilgisayarında): TÜM kod/içerik değişiklikleri burada yapılır → GitHub'a push.
- **GitHub**: tek doğruluk kaynağı.
- **Replit**: SADECE yayınlar (pull + deploy + domain). Replit'te kod DÜZENLENMEZ. Detay: `replit.md`.
- Değişiklik isteği → kullanıcı Claude'a söyler; Claude push'lar; Replit'te "pull" yapılıp yayınlanır.

## Durum
- **Faz 0 (şimdi):** `index.html` = "Yakında" sayfası. Replit'te bunu yayınla.
- **Faz 1 (hazırlanıyor):** `landing-full.html` (ana sayfa) + katalog (products.json, 576 ürün) + Mix&Match sepet + WhatsApp sipariş.
- **Faz 2:** iyzico ödeme + üyelik. **Faz 3:** Mikro ERP/stok.

## Fiyat modeli (karar 06.08.2026)
- Çok alımda fiyat düşer (Alibaba/Mix&Match): tek adet = fabrika fiyatı · karışık 5+ = indirim · karışık 10+ = dip fiyat.
- Add-on'lar olacak (sepette ek ürün/servis önerileri).
- Kaynak veri: `MONCARB FIYAT SISTEMI.xlsx` "Satış $" → `products.json` (üretici script Moncarb tarafında).

## Replit'te yayınlama
1. Replit → Create Repl → **Import from GitHub** → bu repo.
2. Statik site: `index.html` kök dizinde, ekstra build gerekmez ("Static" deployment seç).
3. Deployments → Custom domain → `frezefabrikasi.com` ekle, verilen DNS kayıtlarını isimtescil paneline gir.
