# ETS travel demo

Responsive Turkish hotel-booking prototype modelled on etstur.com, with a direct Meiro Web SDK integration and the Meiro lifecycle **Demo Studio**. No Google Tag Manager. No real bookings or payments.

**This is a demonstration prototype, not an official ETS service.**

## Run and build

```sh
npm ci
npm run dev
npm run build
```

Node 22 is recommended. Vite produces the static website in `dist/client`.

## Netlify

Production host: **https://etsdemo.netlify.app**. Connect this repository and deploy its `main` branch. `netlify.toml` sets:

- Build command: `npm run build`
- Publish directory: `dist/client`
- SPA fallback: all application paths serve `index.html`

No API token or secret is required. Optional public configuration overrides are documented in `.env.example`. Deployment is intentionally left to the repository owner.

## Demo journey

1. Choose cookie consent (**Tümünü Kabul Et** / **Sadece Gerekli**). Meiro loads only when analytics is accepted.
2. Pick a destination (default **Bodrum**), dates (Giriş/Çıkış Tarihi), party (Yetişkin/Çocuk, 1 Oda) and travel type (Otel = Sadece Otel, Uçak = Uçak + Otel, Otobüs = Otobüs + Otel; departure İstanbul/Ankara/İzmir).
3. Results (`/oteller`): filter by Popüler Filtreler, Fiyat Aralığı, Misafir Puanı, Konaklama Tipi, Bölge and Temalar; sort by ETS Sıralaması, price or guest score.
4. Save hotels to **Favorilerim** (`/favorilerim`), open a hotel (`/otel/:id`), pick room (Standart Oda, Deniz Manzaralı Oda, Aile Odası, Suit) and board (Sadece Oda … Ultra Her Şey Dahil).
5. **Rezervasyona Devam Et** → guest form with invented details (`/rezervasyon/:id`).
6. Complete a clearly labelled simulated booking (`/onay`); no payment is collected. **Rezervasyonlarım** (`/rezervasyonlarim`) is the trip hub.

Catalogue: seven Bodrum reference hotels (names, locations, guest scores, review counts, boards and list prices captured from the saved etstur.com Bodrum list page; Agaya Bodrum detail content from its detail page — its price is a demo value) plus one clearly synthetic “(Demo)” hotel each for Antalya, Kapadokya, Kıbrıs, Fethiye and Sapanca. Prices are TL totals per stay for the selected party (reference = 2 adults, 7 nights, Standart Oda, the hotel's default board; children at 50%; transport supplements per traveller). They are static examples, not live availability. Account, agency, help, phone and non-hotel products (Tur, Villa, Mısır, Ulaşım) are bounded demo dialogs. Favourites and consent persist locally; the last simulated confirmation persists for the tab session. No third-party bank/card brands are shown; member offers use neutral “Üyelere özel %8 ek indirim” copy.

## Meiro

- Instance: https://ets-demo.eu1.pipes.meiro.io
- Source: **Etstur Web** (slug `etstur-web`, `web-sdk` template)
- SDK: `https://ets-demo.eu1.pipes.meiro.io/mpt.js`
- Collection endpoint: `https://ets-demo.eu1.pipes.meiro.io/collect/etstur-web`
- Profile API: `https://ets-demo.eu1.pipes.meiro.io/profile-api/ets-demo` (`identifier_type=user_id`, attributes `ets_decision`, `ets_message_eligibility`)

See [the event contract](docs/event-contract.md). Shared SDK attributes: `mpt('set', {demo: true, demo_site: 'ets', brand: 'etstur'})`.

Browser debug inspection: `window.__etsEvents` contains the most recent 50 app event calls, without SDK-generated identifiers. Check the browser Network panel and Meiro source History for receipt. A successful browser call alone does not prove downstream activation.

Names and email entered in the booking form are never copied into analytics, browser persistence, or a backend. The SDK itself supplies browser/session metadata. Withdrawing consent blocks further app event calls and updates SDK persistence consent.

Local storage keys: `ets-consent`, `ets-saved` (favourites), `ets-lifecycle-v1` (synthetic Demo Studio state); session storage: `ets-trip`, `ets-booking`. DOM events: `ets-sdk-status`, `ets-consent-changed`, `ets-lifecycle`.

## Testing

```sh
npx playwright install chromium   # or set PLAYWRIGHT_EXECUTABLE_PATH to a local Chrome/Chromium
node --test tests/lifecycle.test.mjs
npm run test:sites
npm test
```

Automated tests stub the SDK and the Profile API and never send analytics to the live instance. No live smoke test against ets-demo has been run from this repository yet.

## Reference assets

The ETS logo and the hotel, destination and theme photographs were copied from locally saved etstur.com pages into `public/assets/` (resized/converted to WebP); nothing is hotlinked. Montserrat is self-hosted via `@fontsource-variable/montserrat` (OFL). Sources are listed in [asset provenance](docs/asset-provenance.json). Brand and image rights remain with their respective owners. Photos used for the synthetic “(Demo)” hotels show the destination, not those fictional hotels.

### Meiro lifecycle demonstration

Open `/demo` or **Meiro · Demo Studio** for the complete website/email-preview story. Live personalization requires analytics consent and a current Meiro Profile API response for the current run/revision; otherwise the presenter sees an explicitly labelled local rule preview and the public website stays generic.

[Presentation runbook](docs/demo-runbook.md) · [Meiro snapshot placeholder](meiro/README.md)

Includes the lifecycle modules (research, quote recovery, price watch, pre-trip transfer upsell, service/feedback/rebooking, VIP/win-back, care and cancellation suppression), synthetic personas (`researcher`, `vip`, `lapsed`) and clock, exact quote recovery, a trip hub, Turkish email previews and an explicitly illustrative ROI model. Real sends, ad exports, live inventory and predictive models are not enabled.
