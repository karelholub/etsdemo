export const asset = (name) => `/assets/${name}`;

// Destinations offered by the demo search. Bodrum is the default.
export const destinations = [
  "Bodrum",
  "Antalya",
  "Kapadokya",
  "Kıbrıs",
  "Fethiye",
  "Sapanca",
];

export const destinationInfo = {
  Bodrum: { province: "Muğla", image: "region-bodrum.webp" },
  Antalya: { province: "Antalya", image: "region-antalya.webp" },
  Kapadokya: { province: "Nevşehir", image: "region-kapadokya.webp" },
  Kıbrıs: { province: "KKTC", image: "region-kibris.webp" },
  Fethiye: { province: "Muğla", image: "region-fethiye.webp" },
  Sapanca: { province: "Sakarya", image: "region-sapanca.webp" },
};

// Board types ("Konaklama Tipi") and their price factor relative to "Kahvaltı Dahil".
export const boards = [
  "Sadece Oda",
  "Kahvaltı Dahil",
  "Yarım Pansiyon",
  "Her Şey Dahil",
  "Ultra Her Şey Dahil",
];
export const boardFactor = {
  "Sadece Oda": 0.85,
  "Kahvaltı Dahil": 1,
  "Yarım Pansiyon": 1.15,
  "Her Şey Dahil": 1.35,
  "Ultra Her Şey Dahil": 1.5,
};

// Room types and their price factor relative to "Standart Oda".
export const rooms = [
  {
    name: "Standart Oda",
    factor: 1,
    image: "room-standart.webp",
    features: ["Kara manzarası", "Klima", "Wi-Fi", "Minibar"],
    capacity: "2 Yetişkin",
  },
  {
    name: "Deniz Manzaralı Oda",
    factor: 1.15,
    image: "room-deniz.webp",
    features: ["Deniz manzarası", "Balkon", "Klima", "Wi-Fi"],
    capacity: "2 Yetişkin",
  },
  {
    name: "Aile Odası",
    factor: 1.25,
    image: "room-aile.webp",
    features: ["Geniş oda", "Ek yatak", "Klima", "Wi-Fi"],
    capacity: "2 Yetişkin + 2 Çocuk",
  },
  {
    name: "Suit",
    factor: 1.45,
    image: "room-suit.webp",
    features: ["Oturma alanı", "Deniz manzarası", "Balkon", "Kahve seti"],
    capacity: "3 Yetişkin",
  },
];

// Travel types. Supplements are per traveller for the whole stay (TL).
export const travelTypes = ["Sadece Otel", "Uçak + Otel", "Otobüs + Otel"];
export const travelSupplement = {
  "Sadece Otel": 0,
  "Uçak + Otel": 4500,
  "Otobüs + Otel": 1800,
};
export const origins = ["İstanbul", "Ankara", "İzmir"];

export const scoreLabel = (score) =>
  score >= 9
    ? "Mükemmel"
    : score >= 8
      ? "Çok iyi"
      : score >= 7
        ? "İyi"
        : "Ortalama";

// `price` is the reference total in TL for 2 adults, 7 nights, Standart Oda,
// the hotel's default board and "Sadece Otel". `original` is the struck price.
// Bodrum reference hotels: names, scores, review counts, boards and list prices
// were captured from the saved etstur.com Bodrum list page (see docs/asset-provenance.json).
export const hotels = [
  {
    id: "agaya-bodrum",
    name: "Agaya Bodrum +16 Adult Only (Ex.Prive Bodrum)",
    location: "Bodrum, Bardakçı Koyu, Muğla",
    destination: "Bodrum",
    score: 8.9,
    reviews: 1891,
    board: "Ultra Her Şey Dahil",
    price: 196000,
    original: 245000,
    discount: 20,
    priceIsDemo: true,
    image: "agaya-1.webp",
    gallery: [
      "agaya-1.webp",
      "agaya-2.webp",
      "agaya-3.webp",
      "agaya-4.webp",
      "agaya-5.webp",
      "agaya-6.webp",
      "agaya-7.webp",
      "agaya-8.webp",
    ],
    features: ["Denize Sıfır", "Özel Plaj", "İptal Güvencesi"],
    chips: [
      "Yetişkin Oteli",
      "Marinaya Yakın",
      "Balayı",
      "Platform Plaj",
      "Özel Plaj",
      "Denize Sıfır",
    ],
    themes: ["Yetişkin Oteli", "Balayı", "Denize Sıfır"],
    family: false,
    description:
      "Bodrum’un sakin mevkii Bardakçı Koyu’nda yer alan tesis, 16 yaş üzeri misafirlere Ultra Her Şey Dahil konseptiyle hizmet veriyor. Denize sıfır konumdaki otelin kum-çakıl özel plaj alanı, deniz manzaralı havuzu ve a la carte restoranı bulunuyor.",
    nearby: [
      ["Milas-Bodrum Havalimanı", "39,2 km"],
      ["Bodrum Yel Değirmenleri", "0,3 km"],
    ],
  },
  {
    id: "sarpedor-boutique-hotel",
    name: "Sarpedor Boutique Hotel",
    location: "Bodrum, Muğla",
    destination: "Bodrum",
    score: 7.9,
    reviews: 359,
    board: "Kahvaltı Dahil",
    price: 109200,
    original: 210000,
    discount: 48,
    image: "hotel-sarpedor.webp",
    gallery: ["hotel-sarpedor.webp"],
    features: ["Denize Sıfır", "İptal Güvencesi"],
    chips: ["Denize Sıfır", "Butik Otel"],
    themes: ["Denize Sıfır", "Balayı"],
    family: false,
  },
  {
    id: "regia-mare-beach-hotel-spa",
    name: "Regia Mare Beach Hotel & Spa Bodrum",
    location: "Bodrum, Muğla",
    destination: "Bodrum",
    score: 8.8,
    reviews: 86,
    board: "Kahvaltı Dahil",
    price: 104511,
    original: 139348,
    discount: 25,
    image: "hotel-regia-mare.webp",
    gallery: ["hotel-regia-mare.webp"],
    features: ["Denize Sıfır", "Otopark", "Çocuk Dostu"],
    chips: ["Denize Sıfır", "Otopark", "Çocuk Dostu", "Spa"],
    themes: ["Denize Sıfır", "Çocuk Dostu", "Spa"],
    family: true,
  },
  {
    id: "zest-exclusive-hotel-spa",
    name: "Zest Exclusive Hotel & Spa",
    location: "Bodrum, Muğla",
    destination: "Bodrum",
    score: 9.8,
    reviews: 40,
    board: "Sadece Oda",
    price: 105427,
    original: 124031,
    discount: 15,
    image: "hotel-zest.webp",
    gallery: ["hotel-zest.webp"],
    features: ["Denize Sıfır", "Çocuk Dostu", "İptal Edilebilir"],
    chips: ["Denize Sıfır", "Çocuk Dostu", "Spa"],
    themes: ["Denize Sıfır", "Çocuk Dostu", "Spa"],
    family: true,
  },
  {
    id: "costa-maya-bodrum",
    name: "Costa Maya Bodrum",
    location: "Bodrum, Muğla",
    destination: "Bodrum",
    score: 7.3,
    reviews: 140,
    board: "Kahvaltı Dahil",
    price: 72450,
    original: 80500,
    discount: 10,
    image: "hotel-costa-maya.webp",
    gallery: ["hotel-costa-maya.webp"],
    features: ["İptal Güvencesi"],
    chips: ["Havuz", "Bahçe"],
    themes: ["Balayı"],
    family: false,
  },
  {
    id: "costa-viva",
    name: "Costa Viva",
    location: "Bodrum, Muğla",
    destination: "Bodrum",
    score: 7.1,
    reviews: 83,
    board: "Kahvaltı Dahil",
    price: 51330,
    original: 102661,
    discount: 50,
    image: "hotel-costa-viva.webp",
    gallery: ["hotel-costa-viva.webp"],
    features: ["Özel Fırsat"],
    chips: ["Havuz", "Bütçe Dostu"],
    themes: ["Çocuk Dostu"],
    family: true,
  },
  {
    id: "ramada-resort-bodrum",
    name: "Ramada Resort Bodrum By Wyndham",
    location: "Bodrum, Muğla",
    destination: "Bodrum",
    score: 6.8,
    reviews: 81,
    board: "Kahvaltı Dahil",
    price: 230566,
    original: null,
    discount: 0,
    image: "hotel-ramada.webp",
    gallery: ["hotel-ramada.webp"],
    features: ["Havuz", "Spa"],
    chips: ["Havuz", "Spa", "Otopark"],
    themes: ["Spa", "Çocuk Dostu"],
    family: true,
  },
];

// One clearly synthetic example per additional destination. Photos are
// illustrative destination imagery, not photos of these (fictional) hotels.
const synthetic = [
  {
    id: "belek-lagoon-resort",
    name: "Belek Lagoon Resort (Demo)",
    location: "Antalya, Belek",
    destination: "Antalya",
    score: 9.1,
    reviews: 512,
    board: "Ultra Her Şey Dahil",
    price: 142800,
    original: 168000,
    discount: 15,
    image: "region-antalya.webp",
    features: ["Denize Sıfır", "Aquapark", "Çocuk Dostu"],
    themes: ["Denize Sıfır", "Çocuk Dostu", "Aquapark"],
    family: true,
  },
  {
    id: "kapadokya-vadi-cave-hotel",
    name: "Kapadokya Vadi Cave Hotel (Demo)",
    location: "Nevşehir, Göreme",
    destination: "Kapadokya",
    score: 9.3,
    reviews: 286,
    board: "Kahvaltı Dahil",
    price: 58900,
    original: 69300,
    discount: 15,
    image: "region-kapadokya.webp",
    features: ["Taş Otel", "İptal Güvencesi"],
    themes: ["Balayı", "Doğa"],
    family: false,
  },
  {
    id: "girne-harbour-resort",
    name: "Girne Harbour Resort (Demo)",
    location: "Kıbrıs, Girne",
    destination: "Kıbrıs",
    score: 8.7,
    reviews: 344,
    board: "Her Şey Dahil",
    price: 96400,
    original: 113400,
    discount: 15,
    image: "region-kibris.webp",
    features: ["Denize Sıfır", "İptal Güvencesi"],
    themes: ["Denize Sıfır", "Balayı"],
    family: true,
  },
  {
    id: "oludeniz-koy-hotel",
    name: "Ölüdeniz Koy Hotel (Demo)",
    location: "Muğla, Fethiye, Ölüdeniz",
    destination: "Fethiye",
    score: 8.6,
    reviews: 198,
    board: "Yarım Pansiyon",
    price: 74300,
    original: 82500,
    discount: 10,
    image: "region-fethiye.webp",
    features: ["Denize Yakın", "Doğa İçinde"],
    themes: ["Doğa", "Denize Sıfır"],
    family: true,
  },
  {
    id: "sapanca-gol-termal-spa",
    name: "Sapanca Göl Termal & Spa (Demo)",
    location: "Sakarya, Sapanca",
    destination: "Sapanca",
    score: 9.0,
    reviews: 421,
    board: "Kahvaltı Dahil",
    price: 48600,
    original: 54000,
    discount: 10,
    image: "region-sapanca.webp",
    features: ["Termal", "İstanbul’a Yakın", "Spa"],
    themes: ["Termal", "Spa", "İstanbul’a Yakın"],
    family: true,
  },
];
for (const h of synthetic)
  hotels.push({
    ...h,
    synthetic: true,
    gallery: [h.image],
    chips: h.features,
    description:
      "Bu tesis demo amaçlı oluşturulmuş kurgusal bir örnektir. Görseller bölgeyi temsil eder; fiyatlar ve olanaklar örnek niteliğindedir.",
  });

export const themes = [
  "Denize Sıfır",
  "Balayı",
  "Yetişkin Oteli",
  "Çocuk Dostu",
  "Spa",
  "Termal",
  "Doğa",
];

// Homepage campaign bubbles: neutral ETS demo copy, no third-party bank/card brands.
export const stories = [
  ["Son Yaz Fırsatları", "story-sea.webp", "Bodrum", "Son Yaz\nFırsatları"],
  ["Kapadokya’da Balon Keyfi", "region-kapadokya.webp", "Kapadokya", "Balon\nKeyfi"],
  ["29 Ekim Tatilini Değerlendir!", "theme-istanbul-yakin.webp", "Sapanca", "29 Ekim\nTatili"],
  ["Kıbrıs Otelleri", "region-kibris.webp", "Kıbrıs", "Kıbrıs\nOtelleri"],
  ["2027 Erken Rezervasyon Fırsatları", "region-antalya.webp", "Antalya", "2027\nErken Rez."],
  ["Ege’de Antik Rotalar", "story-didim.webp", "Bodrum", "Antik\nRotalar"],
];

export const tripThemes = [
  ["İstanbul’a Yakın Oteller", "theme-istanbul-yakin.webp", "Sapanca"],
  ["Balayı Otelleri", "theme-balayi.webp", "Kapadokya"],
  ["Denize Sıfır Oteller", "theme-denize-sifir.webp", "Bodrum"],
  ["Doğa Otelleri", "theme-doga.webp", "Fethiye"],
];
