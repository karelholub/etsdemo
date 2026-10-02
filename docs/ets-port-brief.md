# ETS demo — port brief (from the DERTOUR demo)

This repo started as a copy of `karelholub/dtr` (DERTOUR × Meiro demo). Goal: the same prototype and Demo Studio, rebranded and localised for **ETS (Etstur)**, wired to the **ets-demo** Meiro instance.

## Look & feel (source of truth: `ref/home.png`, `ref/list.png`, `ref/detail.png`)

- Logo: `/Users/kh/Downloads/Tatil, Etstur'dan sorulur! _ Etstur_files/35-year-logo.svg` (red "etstur" + "35. YIL"). Copy into `public/assets/`.
- Colours: primary blue `#056BFD`, navy text `#000929`, light-blue tints `#F2F8FF` / `#E6F0FF` / `#CDE1FF`, page tint `#F6F9FD`, secondary text `#4D5369` / `#666B7E`, guest-score badge teal `#0FB4AB`, success green `#10A760`, accent yellow `#FFCE00`, "Son Yaz Fırsatları" orange-ish nav link. Buttons: solid blue, white text, 8px radius.
- Type: **Montserrat** (Google Fonts) for headings/UI, system UI stack for body (as etstur.com).
- Header: logo, nav `Otel · Tur · Kıbrıs · Mısır · Villa · Ulaşım · Kampanyalar · Son Yaz Fırsatları`, top-right `Hesabım`, `Rezervasyonlarım`, `Yardım`, `Acenteler`, `444 0 387` (demo dialogs only, as in dtr).
- Home hero: sea/beach image, "Hayalindeki tatili ETS ile planla!", tabs Otel / Tur / Uçak / Villa / Otobüs, search box: destination/hotel, Giriş Tarihi, Çıkış Tarihi, "2 Yetişkin, 1 Çocuk · 1 Oda" (Kişi/Oda), blue search button; "Popüler Aramalar" links; round campaign story bubbles; "Tatil Temaları"; "Popüler Bölgeler".
- Results (list): breadcrumb, "X tesis bulduk", left filter column (Popüler Filtreler, Fiyat Aralığı, Misafir Puanı, Konaklama Tipi, Bölge, Temalar), member login strip ("Üye girişi yaparak üyelere özel indirimlerden yararlanabilirsiniz." + Giriş Yap — demo only), hotel cards: image, name, "Bodrum, Muğla", feature bullets (Denize Sıfır, İptal Güvencesi), teal score badge (e.g. 8.9 "Çok iyi", "1891 Değerlendirme"), board ("Ultra Her Şey Dahil" / "Kahvaltı Dahil"), "7 Gece", discount %, struck original TL and current TL total.
- Detail: breadcrumb, title + location, gallery (1 big + 2 small, "Galeri (n)"), tabs Genel Bakış / Odalar / Yorumlar / Çevre ve Konum / Tesis Bilgileri, description, feature chips, score card, campaigns strip, rooms with date/person search and "Oda Ara".
- Do NOT reproduce third-party bank/card brands (no "Maximum", "MaxiPuan" logos or names). Use neutral "Üyelere özel %8 ek indirim" style copy.

## Content

- **Customer copy in Turkish**, presenter/Demo Studio explanations in English (same split as dtr: German customer copy, English presenter).
- Currency **TL** (format like `109.200 TL`, Turkish thousands dot). Prices are per stay (7 gece) for the selected party.
- Hotels: use the real Bodrum reference hotels from `ref/list.json` + Agaya Bodrum from `ref/detail.json` (names, location, score, reviews, board, prices, gallery images copied from the `_files` folders in `/Users/kh/Downloads/`). Add ONE clearly synthetic "(Demo)" hotel each for: Antalya (Belek/Kemer), Kapadokya, Kıbrıs, Fethiye, Sapanca (thermal/İstanbul'a yakın). Destinations list: Bodrum, Antalya, Kapadokya, Kıbrıs, Fethiye, Sapanca. Default destination: **Bodrum**.
- Boards: Ultra Her Şey Dahil, Her Şey Dahil, Yarım Pansiyon, Kahvaltı Dahil, Sadece Oda. Rooms e.g. Standart Oda, Deniz Manzaralı Oda, Aile Odası, Suit.
- Travel types: Sadece Otel (default), Uçak + Otel, Otobüs + Otel. Departure (for Uçak+Otel) İstanbul, Ankara, İzmir.
- Update `docs/asset-provenance.json` with every copied etstur.com asset and its source page. README: "demonstration prototype, not an official ETS service".

## Meiro contract (ets-demo instance) — keep EXACTLY

- SDK: `https://ets-demo.eu1.pipes.meiro.io/mpt.js`
- Collection endpoint: `https://ets-demo.eu1.pipes.meiro.io/collect/etstur-web` (existing source "Etstur Web", web-sdk template)
- Profile API: `https://ets-demo.eu1.pipes.meiro.io/profile-api/ets-demo` (identifier_type=user_id), returns attributes **`ets_decision`** and **`ets_message_eligibility`** with the same dimensions as `dtr_decision` / `dtr_message_eligibility`.
- `mpt('set', { demo: true, demo_site: 'ets', brand: 'etstur' })`.
- Lifecycle snapshot event: **`ets_demo_state`** (same payload as `dtr_demo_state`, `demo_site: 'ets'`, currency `TRY`). Touchpoint event: **`ets_touchpoint`**.
- Standard GA4-style events as in dtr, plus these fields that existing instance attributes read: `item_category: 'hotel'`, `otel_city` (e.g. "Bodrum"), `brand: 'etstur'`, `value`, `currency: 'TRY'`; `search` also sends `destination` and `item_category: 'hotel'` (and `origin` for Uçak+Otel). Purchase sends `value` and `item_category: 'hotel'`.
- Consent: keep the dtr consent gating. When analytics consent is granted also send `mpt('event','consent_update'...)`? NO — do not invent event types; instead include `efilli_consent_marketing: 'true'|'false'` in the `ets_demo_state` payload from the synthetic marketing permission checkbox.
- Rename every `dtr`/`DTR`/`dertour` identifier, CSS class, storage key, window debug name (`window.__etsEvents`), custom DOM event name to `ets`/`ETS`. Persona ids stay `researcher`, `vip`, `lapsed`.
- Native banner anchors: keep the mechanism; anchor id `#ets-meiro-inpage`. Banner IDs/links will be supplied later — leave a config constant.

## Engineering rules

- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, `tests/sites-worker.test.mjs`.
- `npm ci && npm run build` must pass; update unit (`tests/lifecycle.test.mjs`) and Playwright tests to the new names and copy, and make them pass (they stub the SDK — never send analytics to the live instance from tests).
- Remove the `meiro/` DERTOUR snapshot folder contents (a new one will be generated) — leave an empty `meiro/README.md` placeholder.
- Do not push, do not deploy, do not call the Meiro API.
