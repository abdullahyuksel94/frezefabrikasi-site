# ÜRÜN GÖRSEL SİSTEMİ — ÇEKİM VE İŞLEME YÖNERGESİ
_07.08.2026 · Hedef: frezecim'den profesyonel görünüm. Referans: frezecim ürün sayfası = rötuşlu gerçek foto + teknik çizim + detaylı alt bölüm._

## 1. Her ürün grubu için 3 görsel gerekiyor
| Görsel | Ne | Kaynak |
|---|---|---|
| A. Gerçek foto | Rötuşlu, beyaz fonlu ürün fotoğrafı | Mevcut 89 foto var; eksik/kötüler yeniden çekilecek |
| B. Teknik çizim | Ölçülendirilmiş çizim (D1, D2, L1, L2, R) | **2024 Moncarb katalog PDF'inde VAR** — `moncarb-site-kaynak\...\attached_assets\2024_FİYATSIZ_KATALOG_MONCARB_*.pdf` + aile bazlı sayfa PDF'leri. Çıkarılacak (pymupdf ile sayfa render + kırpma) |
| C. Uygulama karesi (ops.) | Takım iş başında / talaş kaldırırken | Fabrika çekimi — telefonla olur |

## 2. Yeni çekim yapılacaksa kurallar (telefonla çekilebilir)
- **Fon:** düz beyaz (A3 beyaz fon kartonu yeter) · gölgesiz, iki yandan ışık
- **Açı:** ürün TAM YATAY, **sap SOLDA, ağız SAĞDA** (site standardı) — hepsi aynı açı = simetri
- **Kadraj:** ürün kareyi %80 doldursun, üstten çekim (90°), hafif 10-15° perspektif de kabul
- **Netlik:** ağız kısmına odak; MONCARB lazer yazısı okunacak keskinlikte
- **Format:** en az 2000px genişlik, JPG/PNG · her aileden 1 baz foto + istenirse ağız makro
- Çekilince klasöre at, bana "fotolar geldi" de → kırpma/hizalama/yayın bende (otomatik hattım hazır)

## 3. İşleme hattı (bende, otomatik)
Kırp → yatay hizala (sap solda) → 480×320 tek kadraj → beyaz fon → siteye bas.
Script: fotoğraf işleme adımları bu repo geçmişinde; toplu işlem 1 komut.

## 4. Sayfa yapısı hedefi (frezecim referans, biz daha iyisi)
Üst: gerçek foto (büyük) + teknik özellik paneli → **Teknik çizim** (katalogdan) → ölçü/fiyat tablosu →
alt detay bölümü: kesme şartları önerisi + kullanım notları + ilgili gruplar + yorumlar.
Kesme şartları ve gerçek teknik veriler (z, helis, tolerans, DIN) **CEO/mühendis ajanı arşivinden** alınacak —
Drive `ai - ajanlar\PROJE-SARTLARI.md` + 371 teknik resim DB (SONRAKİ OTURUM İŞİ; uydurma veri YASAK — bugün z'ler bu yüzden kaldırıldı).
