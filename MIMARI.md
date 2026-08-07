# SİTE MİMARİ PLANI — TEK MOTOR REFAKTORU (sonraki oturumun İLK İŞİ)
Sorun (sahip tespiti): tablo/kural mantığı 2 yerde (app.js dinamik + _uret_statik.py) → her değişiklik çift yama, karışıyor.
Çözüm: TEK ÜRETİCİ mimari:
- `_site_uret.py` → TÜM sayfaları statik üretir: ana sayfa, kategori sayfaları, grup sayfaları, rehber (SEO da kazanır)
- Kurallar TEK dosyada: SEMA.md okunur → sıralar/tablolar/kampanyalar tek fonksiyon setinde
- app.js sadece: sepet + kampanya hesabı + bot + arama kutusu (tablo ÜRETMEZ)
- Değişiklik akışı: SEMA.md güncelle → üretici çalıştır → ekran görüntüsüyle doğrula → push
Kabul kriteri: hiçbir görsel/tablo mantığı iki yerde yaşamayacak.
