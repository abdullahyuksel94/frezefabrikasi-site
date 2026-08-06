# frezefabrikasi.com — Replit Çalışma Kuralları

## Bu proje nedir
FREZE FABRİKASI — karbür kesici takım e-ticaret sitesi (Moncarb'ın alt markası, kuruluş 2018).
Şu an **Faz 0**: `index.html` = "Yakında" sayfası. **Statik site** — build/framework YOK, npm YOK, veritabanı YOK.

## ⚠️ TEK DOĞRULUK KAYNAĞI: GITHUB (bu repo)
Site kodunu **Claude Code** (Moncarb'ın yapay zekâ asistanı, kullanıcının bilgisayarında) yazar ve GitHub'a push'lar.
**Replit'in görevi SADECE yayınlamak** (deploy + custom domain). 

### Replit tarafında YAPILMAYACAKLAR
- Dosya İÇERİĞİNİ değiştirme (HTML/CSS/JS düzenleme, refactor, "iyileştirme")
- Yeni framework/paket ekleme (React'e çevirme, npm init vs. YASAK — site bilerek statik)
- `products.json`'a dokunma (Moncarb fiyat Excel'inden otomatik üretilir; elle düzenlenirse sonraki üretimde ezilir)
- Dosya silme/yeniden adlandırma

### Replit tarafında YAPILABİLECEKLER
- GitHub'dan güncelleme çekme (pull) ve yayınlama (deploy)
- Deployment/domain/SSL ayarları
- `.replit` / `replit.nix` gibi SADECE Replit'in çalışması için gereken yapılandırma dosyalarını ekleme

### Eğer Replit'te bir dosya değişikliği ZORUNLU olduysa
1. Değişikliği MÜMKÜN OLAN EN KÜÇÜK boyutta yap
2. Hemen GitHub'a commit + push et (mesajda `[replit]` öneki kullan)
3. Kullanıcı Claude'a "Replit'te değişiklik oldu" desin — Claude pull edip devam eder

## Dosyalar
- `index.html` — Yakında sayfası (yayındaki sayfa)
- `landing-full.html` — Faz 1 ana sayfa taslağı (HENÜZ YAYINLANMAZ)
- `style.css` — Faz 1 stil dosyası (index.html kullanmaz, kendi stili gömülü)
- `products.json` — 576 ürünlük katalog verisi (ÜRETİLEN dosya, elle dokunma)
- `README.md` — proje planı ve fazlar

## Deploy şekli
Static deployment · kök dizin · giriş: `index.html` · Custom domain: frezefabrikasi.com
