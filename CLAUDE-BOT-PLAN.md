# FF ASİSTAN — YAPAY ZEKÂ CHATBOT PLANI
_07.08.2026 · Sahip vizyonu: müşteri sorularının tamamı otomasyonla çözülsün; çözülemeyen mühendise aktarılsın._

## v1 — YAYINDA (yerleşik, API'siz)
Sitedeki 💬 butonu. Yanıtladıkları: malzeme→seri önerisi (rehber mantığı), ürün grubu bulma+link,
kargo/ödeme/iade/kademe SSS, kimlik soruları. **Kesme parametresi sorularını BİLEREK yanıtlamaz** →
mühendise aktarır (yanlış parametre takım kırar). Çözemediği her şeyde: WhatsApp'a tek tıkla aktarım (soru metniyle).

## v2 — GERÇEK YAPAY ZEKÂ (Claude API) — kurulum ~30 dk, kullanıcıyla birlikte
Statik sitede API anahtarı SAKLANAMAZ (herkes görür). Mimari:
```
Site (bot.js, BOT_API dolu) → Cloudflare Worker (ücretsiz, anahtar burada) → Claude API (claude-haiku: ucuz/hızlı)
```
1. console.anthropic.com'dan API anahtarı al (kullanıcı) — aylık maliyet tahmini: haiku ile soru başına ~yarım kuruş
2. Cloudflare hesabı aç (ücretsiz) → Worker oluştur → Claude proxy kodunu ben yazarım (ANTHROPIC_API_KEY secret)
3. Worker sistem promptu: ürün kataloğu (products.json) + kaplama rehberi + CEO/mühendis ajanı bilgi tabanı
   (PROJE-SARTLARI + teknik veriler) + "emin değilsen mühendise yönlendir" kuralı + fiyat kademe kuralları
4. bot.js'te BOT_API = worker adresi → widget otomatik yapay zekâ moduna geçer (kod hazır)
5. Eskalasyon: model "MUHENDIS" etiketi dönerse WhatsApp aktarımı (v1'deki akış)

## Bilgi tabanı kaynakları (v2 promptuna girecek)
- products.json (1.400 ürün, fiyat kademeleri)
- kaplama-rehberi (malzeme→seri)
- CEO arşivi: Drive `ai - ajanlar\PROJE-SARTLARI.md` + 371 teknik resim DB + kesme şartları (SONRAKİ OTURUMDA çıkarılacak)
- SSS + kampanya kuralları (Tanışma Paketi, kademeler, kargo)

## Başarı ölçütü (sahip): "Her müşteri sorusu bize gelmesin — otomasyon çözsün, olmazsa mühendise."


## KONUŞMA TONU (sahip talimatı 07.08 — v2 sistem promptunun çekirdeği)
- Dürüst danışman: "Ben yapay zekâyım, para kazanmayı değil senin faydanı düşünürüm" ruhu.
- Müşteri ÇELİK + OPERASYON söyleyince direkt ürün önerisi: mümkünse İKİ seçenek — "ikisi de işini görür;
  bütçe dostu olan X, şu avantaj için Y maliyeti daha yüksek" kalıbı. Üstü kapalı satışa yönlendirme.
- Birebir cümle şart değil; mantık bu. Şakacı-samimi ama teknik olarak net.

## UÇ KAMPANYALARI (mevcut, siteye işlenecek — hangi uçta hangisi LİSTE KULLANICIDAN BEKLENİYOR)
- Bazı uçlarda: 50 uca +1 UÇ BEDAVA
- Bazı serilerde: 100 uca 1 KAFA (kater) BEDAVA
- Yeni bundle fikirleri açık (sahip: "yeni bundle sıçratabiliriz")

## ADD-ON SİSTEMİ (sahip: "sonra yaparım, karışık" — SPEC şimdiden)
- Sepet içeriğine göre OTOMATİK farklı add-on önerisi (yapay zekâ hesaplı; v2 worker'a eklenecek)
- Avantaj vurgusu: "sadece +X $'a şunu da al" formatı
- Örnek mantık: sepette APKT uçları → uygun kater öner; sert küre → aynı çapta finiş çifti; 8 uca 2 tamamla-dip-fiyat dürtmesi
- Sahip metriklere göre sürekli ayarlayacak → yönetilebilir kural dosyası (addon-kurallar.json) olarak tasarlanacak
