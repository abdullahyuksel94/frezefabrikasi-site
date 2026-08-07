# METRİK / ANALİTİK KURULUMU (profesyonel e-ticaret takibi)
Sahip ihtiyacı: kim sepete ekledi, kim checkout'a gitmedi (abandon), hangi ürün ilgi görüyor —
kampanya/add-on ayarları bu verilere göre yapılacak.

## Kurulum (5 dk, kullanıcı adımı)
1. analytics.google.com → hesap aç → "Web" akışı ekle: frezefabrikasi.com → **Ölçüm Kimliği (G-XXXXXXX)** kopyala
2. Claude'a "GA kimliği: G-XXXXXXX" yaz → tüm sayfalara gtag kodunu işlerim

## Hazır izlenen olaylar (kod içinde bekliyor)
- add_to_cart — her sepete ekleme (ürün + adet + $)
- begin_checkout — "Siparişi WhatsApp'tan Gönder" tıklaması
- (GA otomatik: sayfa görüntüleme, trafik kaynağı, cihaz, şehir)
- Abandon analizi = add_to_cart var ama begin_checkout yok → GA4 funnel raporu

## İleride (Faz 2)
purchase olayı (ödeme entegrasyonuyla) · add-on gösterim/kabul oranları · bot soru logları
