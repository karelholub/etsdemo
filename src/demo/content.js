import { watchURL } from "./model.js";
// Customer-facing lifecycle copy (Turkish). Presenter explanations stay English.
export const content = {
  inspiration: {
    eyebrow: "SIRADAKİ TATİLİN",
    title: "Tatil zamanı geldi",
    body: "Tatil fikirlerimizi keşfet, sana en uygun oteli kolayca bul.",
    cta: "Tatilleri keşfet",
  },
  research: {
    eyebrow: "TATİL FİKİRLERİN",
    title: "{destination} tatilin seni bekliyor",
    body: "Gözüne bir rota kestirdin. Sana uygun otelleri incele, planını dilediğin zaman tamamla.",
    cta: "Planlamaya devam et",
  },
  recovery: {
    eyebrow: "KAYDEDİLEN TATİLİN",
    title: "Tatiline sadece bir adım kaldı",
    body: "Seçimin kaydedildi. Tarihlerini, odanı ve konaklama tipini kontrol et, rezervasyonuna kaldığın yerden devam et.",
    cta: "Rezervasyona devam et",
  },
  price: {
    eyebrow: "FİYAT ALARMIN",
    title: "Beklediğin fiyata ulaşıldı",
    body: "Takip ettiğin demo teklif artık belirlediğin fiyat limitinin altında. Güncel seçimi hemen incele.",
    cta: "Teklifi incele",
  },
  pretrip: {
    eyebrow: "TATİLİN YAKLAŞIYOR",
    title: "Tatiline rahat başla",
    body: "Tatilin kapıda. Havalimanı transferi henüz rezervasyonunda yok – planlarına uyuyorsa hemen ekleyebilirsin.",
    cta: "Rezervasyonuma ekle",
  },
  service: {
    eyebrow: "REZERVASYON BİLGİLERİN",
    title: "Tatil hazırlığın tek yerde",
    body: "Rezervasyon detaylarını ve tatil kontrol listeni burada bulabilirsin.",
    cta: "Rezervasyonumu aç",
  },
  feedback: {
    eyebrow: "TEKRAR HOŞ GELDİN",
    title: "Tatilin nasıl geçti?",
    body: "Deneyimini bizimle paylaş. Görüşlerin bir sonraki tatilini daha da iyi planlamamıza yardımcı olur.",
    cta: "Değerlendirme yap",
  },
  rebook: {
    eyebrow: "YENİ TATİL FİKİRLERİ",
    title: "Sıradaki rota neresi?",
    body: "Bir tatil biter, yenisinin planı başlar. İlgi alanlarına uygun yeni rotaları keşfet.",
    cta: "Yeni tatil keşfet",
  },
  vip: {
    eyebrow: "SENİ YENİDEN GÖRMEK GÜZEL",
    title: "Tatil tutkun bizi buluşturuyor",
    body: "Seyahat etmeyi seviyorsun. Sana özel tatil fikirlerini keşfet, sıradaki kaçamağını bizimle planla.",
    cta: "Tatil fikirlerini gör",
  },
  winback: {
    eyebrow: "YENİDEN BULUŞALIM",
    title: "Sıradaki tatilin seni bekliyor",
    body: "Yeni bir deniz manzarası, tanıdık bir tatil hissi. Bir sonraki tatilin için yeniden ilham al.",
    cta: "Tatil bul",
  },
  care: {
    eyebrow: "YANINDAYIZ",
    title: "Talebin önceliğimiz",
    body: "Demo talebini aldık. İşlem durumunu buradan takip edebilirsin.",
    cta: "Talebi görüntüle",
  },
  cancelled: {
    eyebrow: "REZERVASYONUN",
    title: "İptal kaydedildi",
    body: "Demo rezervasyonun iptal edildi. Bu tatille ilgili hatırlatmalar ve teklifler durduruldu.",
    cta: "Özeti aç",
  },
  expired: {
    eyebrow: "YENİDEN PLANLA",
    title: "Kaydedilen teklifinin süresi doldu",
    body: "Güncel bir demo teklif almak için tatilini yeniden ara.",
    cta: "Yeni arama yap",
  },
};
export const textFor = (key, destination = "Bodrum") =>
  Object.fromEntries(
    Object.entries(content[key] || content.inspiration).map(([k, v]) => [
      k,
      v.replaceAll("{destination}", destination),
    ]),
  );
export const escapeHTML = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const tl = (n) =>
  `${Math.round(Number(n || 0)).toLocaleString("tr-TR")} TL`;
const trDate = (s) =>
  s ? new Date(s).toLocaleDateString("tr-TR", { dateStyle: "medium" }) : "";
export function emailHTML(key, s, h, origin = "https://etsdemo.netlify.app") {
  const c = textFor(key, s.destination),
    e = escapeHTML;
  const hub = ["service", "pretrip", "feedback", "care", "cancelled"].includes(
    key,
  );
  const defaultHref =
    key === "recovery" && s.quote
      ? `${origin}/rezervasyon/${encodeURIComponent(s.quote.hotel_id)}?${new URLSearchParams({ ...s.quote, quote: s.quote.id })}`
      : `${origin}/${hub ? "rezervasyonlarim" : `oteller?destination=${encodeURIComponent(s.destination)}`}`;
  const href =
    key === "price" && s.watch ? `${origin}${watchURL(s.watch)}` : defaultHref;
  const trip = s.booking || s.quote;
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#F6F9FD;font-family:Montserrat,Arial,sans-serif;color:#000929"><div style="display:none">${e(c.title)} – ${e(s.destination)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" style="width:100%;max-width:600px;background:white;border-radius:12px;overflow:hidden" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 28px;border-bottom:1px solid #E6F0FF"><img src="${origin}/assets/ets-logo.svg" width="170" alt="etstur"><p style="font-size:12px;color:#666B7E;margin:10px 0 0">E-posta önizlemesi · sentetik demo · gönderim yapılmaz</p></td></tr><tr><td><img width="600" height="240" style="width:100%;height:240px;object-fit:cover;display:block" src="${origin}/assets/${e(h.image)}" alt="${e(s.destination)}"></td></tr><tr><td style="padding:32px 28px"><p style="font-size:12px;letter-spacing:2px;font-weight:700;color:#056BFD;margin:0">${e(c.eyebrow)}</p><h1 style="font-size:28px;line-height:1.25;margin:10px 0 18px">${e(c.title)}</h1><p style="font-size:16px;line-height:1.6;color:#4D5369">Merhaba,</p><p style="font-size:16px;line-height:1.6;color:#4D5369">${e(c.body)}</p>${trip ? `<table role="presentation" width="100%" style="background:#F2F8FF;border-radius:10px;padding:18px"><tr><td><strong style="font-size:16px">${e(trip.hotel)}</strong><p style="margin:8px 0;color:#4D5369">${e(trDate(trip.start))} – ${e(trDate(trip.end))}</p><p style="margin:8px 0;color:#4D5369">${e(trip.room)} · ${e(trip.board)}</p><p style="margin:8px 0;color:#4D5369">${e(trip.adults)} Yetişkin · ${e(trip.children || 0)} Çocuk</p><strong style="font-size:20px">${e(tl(trip.total))}</strong></td></tr></table>` : ""}${key === "price" ? `<p style="font-size:16px">Güncel demo fiyat: <strong>${e(tl(s.watch?.current_price))}</strong></p>` : ""}<p style="margin:28px 0"><a target="_blank" href="${e(href)}" style="display:inline-block;background:#056BFD;color:white;padding:15px 26px;border-radius:8px;text-decoration:none;font-weight:700">${e(c.cta)}</a></p><p style="font-size:12px;line-height:1.6;color:#666B7E">Bağlayıcı olmayan demo teklif. Gerçek rezervasyon veya ödeme yoktur. Fiyat ve müsaitlik seçim öncesinde yeniden kontrol edilir.</p></td></tr><tr><td style="padding:22px 28px;background:#000929;color:#CDE1FF;font-size:12px;line-height:1.7">ETS demo prototipi · Resmi ETS hizmeti değildir<br><a href="${origin}/rezervasyonlarim" style="color:#ffffff">İletişim tercihlerini yönet</a> · <a href="${origin}/" style="color:#ffffff">Web sitesine git</a></td></tr></table></td></tr></table></body></html>`;
}
