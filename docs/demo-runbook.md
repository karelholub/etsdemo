# ETS × Meiro demo

## What is live

The website sends events directly through Meiro's Web SDK to the **Etstur Web** source on https://ets-demo.eu1.pipes.meiro.io. Meiro computes destination/lifecycle decisions and preview eligibility; the website polls the narrow `ets-demo` Profile API (`ets_decision`, `ets_message_eligibility`) and renders only a matching run and revision. A stale/missing response keeps the public personalization slot empty. The presenter can still inspect an explicitly labelled local rule preview.

Open `/demo` or click **Meiro · Demo Studio**. Accept analytics cookies (**Tümünü Kabul Et**) to demonstrate live Meiro. No API token belongs in the website or Netlify environment. The Profile API is intentionally public and must return only ETS synthetic decision/eligibility fields, not contact information.

Prerequisite (to verify on the instance before presenting): the `ets_demo_state` / `ets_touchpoint` event types, the `ets_decision` / `ets_message_eligibility` attributes and the `ets-demo` Profile API endpoint exist on ets-demo. This repository does not create or call them; until they respond, the Studio shows “Local rule preview · not live Meiro”.

## Twelve-minute presentation

1. Reset a Researcher scenario. Select Treatment and keep the explicitly synthetic marketing permission enabled (sent as `efilli_consent_marketing: 'true'`). Reset keeps the experiment arm; the arm can be manually overridden for presentation only.
2. Research a destination (default Bodrum) and advance two demo hours. Wait for **Live Meiro decision**. Close the panel; the personalized card (“Bodrum tatilin seni bekliyor”) appears below the campaign bubbles.
3. Start a saved quote and advance 30 minutes. Open Email previews and preview the eligible recovery email (“Tatiline sadece bir adım kaldı”). The CTA opens the exact stored stay in a new tab (`/rezervasyon/:hotel?…`). The quote expires after 48 demo hours; changed/expired offers are blocked and require a new selection.
4. Confirm a demo booking. Recovery disappears; the pre-trip decision offers an unowned airport transfer. **Rezervasyonlarım** shows dates, party, room, board and the checklist.
5. Add the synthetic 2.400 TL transfer (assumed 720 TL contribution). The upsell stops. Essential service content remains.
6. Complete the trip, submit feedback, and inspect rebooking. Open a service case to demonstrate marketing suppression. Cancellation also stops recovery and pre-trip offers and zeroes net stay/ancillary value.
7. Reset to Frequent traveler (`vip`) or Lapsed traveler (`lapsed`) to show distinct recognition and win-back decisions. Switch to Control or withdraw marketing permission to see neutral content.
8. Optional price-watch scene: seed an explicitly opted-in watch (threshold 100.000 TL, current 120.000 TL), simulate the price dropping to 95.000 TL, and preview the alert. Watch expiry, cancellation and purchase suppress alerts. A watched quote has a specific hotel, dates, party, room and board; changed selections use the normal reference price.
9. Open Value & reporting, then Meiro Reporting. Explain observed synthetic activity separately from the editable hypothetical ROI example (defaults: 85.000 TL net booking value, 12% margin, 170.000 TL intervention cost → 140% illustrative ROI).

Time advances only for this synthetic scenario. It never changes instance time or other journeys. Marketing previews have a 24-demo-hour cap and a per-step/per-trip deduplication key, mirrored locally (and expected to be enforced in Meiro). The template gallery is explicitly a design preview and does not count as an eligible communication.

## Meiro navigation

All objects below are on ets-demo with plain names; IDs are in [`meiro/manifest.json`](../meiro/manifest.json).

**Reporting** (Engage → Reporting):

- **Web Analytics** — GA-style: sessions, users, page views, engagement/bounce, engagement time, conversion rate, revenue, sessions per day, default channel group (from UTM + referrer), device (viewport), new vs returning, sources, campaigns, landing pages, session funnel (search → hotel view → cart → checkout → booking) and destinations. Built on the row-per-session attributes **Web sessions** and **Web funnel**. Includes historical sessions already on the instance (no device info: shown as *Bilinmiyor*, excluded from the device chart).
- **Business KPIs** — net booking revenue (TL), bookings, average booking value, cancellation rate, weekly trend, revenue by sales channel (Online / Acente / Çağrı merkezi), destination, top hotels, board and party mix, known customers, repeat customers, online-research-then-agency customers, average CLV, loyalty mix, known vs anonymous profiles and suppression counts. Built on **Booking ledger**, **Booking summary**, **Identity map** and related attributes.
- **Booking funnel (demo runs)**, **Lifecycle & suppression (demo runs)**, **Commercial value (illustrative)**, **Web Banners (demo interactions)** — the DERTOUR lifecycle dashboards ported to ETS attributes.

**Identity** — sources *CRM*, *Rezervasyon Sistemi*, *ETS Üyelik (CIAM)*, *Müşteri Hizmetleri* hold 300 fictional customers (`ETS-C-100001…`, `@example.com`, IYS/Efilli consent fields). When the Demo Studio confirms a booking, the Etstur Web transform adds an `order_submitted` event with the email + CRM number of a pool customer for the persona (researcher → agency-only customer, vip → Gold/Platinum, lapsed → lapsed), so the anonymous browser is stitched to the CRM/booking/CIAM profile; a Pipe (*Web siparişi → Rezervasyon Sistemi*) then writes the simulated booking confirmation into *Rezervasyon Sistemi*. Use a fresh private window per persona run. Profile attributes to show: *Identity map*, *Booking summary*, *Bookings*, *Online research before offline booking*, *Travel intent*, *Suppression status*.

**Audiences** — `Lifecycle · …` (13 live decisions), *Identified at web order*, *Online research → offline booking*, *Cross-device customers (web + app)*, *Known only from the travel agency*, *Suppress · CRM campaigns / paid media / acquisition*, *Package retargeting · eligible*, *Agency customers researching online*.

**Journeys & campaigns** (drafts, never launched): *Package retargeting · abandoned trip (cross-channel)*, *Price watch alert*, *Online research → travel agency follow-up*, with seven Turkish email/SMS drafts (*Retargeting 1–3*, *Fiyat alarmı*, *Acente danışmanlığı*). No email/SMS/WhatsApp/push transport is configured on ets-demo, so nothing can be sent; the instance's marketing footer still uses the placeholder unsubscribe URL.

The website catalogue contains seven Bodrum reference hotels and five synthetic “(Demo)” hotels sharing website IDs (`agaya-bodrum`, `sarpedor-boutique-hotel`, …). Prices are TL reference totals; room, board, party, nights, travel type and explicit simulated price changes determine the current quote total. It is not a live inventory or price feed.

## Measurement boundaries

- Everything in these dashboards is synthetic demo data, including QA runs.
- The 12% booking contribution assumption and 720 TL transfer margin are illustrative, not ETS economics.
- The ROI calculator is a what-if model. It does not claim measured incremental lift or significance.
- No paid-media spend feed or ad-platform export is connected. The demo shows audience eligibility/suppression, not actual spend savings or verified ROAS.
- Manually changing experiment arms is useful for presentation but invalidates causal interpretation. A real pilot needs persistent person-level randomization and an agreed observation window.
- Dynamic packaging and predictive next-trip timing remain roadmap items; no predictive model is claimed.

## Configuration and recovery

`meiro/manifest.json` records the ets-demo object IDs (generated 2026-10-02). To roll back website changes, revert the implementation commit. No deployment was run from this workspace.

Local preview: `npm run dev -- --host 127.0.0.1 --port 5173`.
Build: `npm run build`.
Rule tests: `node --test tests/lifecycle.test.mjs`.
Browser tests: `npm test` (set `PLAYWRIGHT_EXECUTABLE_PATH` if using an existing local Chrome/Chromium).

## Native Meiro Web Banners

Two examples are **authored and delivered by Meiro**, alongside the website-rendered lifecycle cards: [In-page · Bodrum sezon sonu](https://ets-demo.eu1.pipes.meiro.io/channels/web-banners/9b0cbda4-385f-4020-80b1-33986a5b6765) (homepage, 5 impressions per session) and [Popup · Fiyat alarmı rehberi](https://ets-demo.eu1.pipes.meiro.io/channels/web-banners/6540341a-5b29-4356-b9f2-c91474ad1ecb) (hotel page, click on “Fiyat alarmı nasıl çalışır?”, 1 per session). They are enabled only on the Etstur Web SDK source and on the hosts `etsdemo.netlify.app`, `127.0.0.1` and `localhost`. Customer content, layout, page/host conditions, trigger and frequency cap live in Engage → Channels → Web Banners; IDs are in `NATIVE_BANNERS` (`src/demo/NativeBanners.jsx`).

| Example | Where / trigger | Planned frequency |
| --- | --- | --- |
| In-page inspiration (compact, image-free strip) | Homepage, empty `#ets-meiro-inpage` slot below the campaign/lifecycle content | 5 impressions per SDK session |
| Price-watch guide (popup) | Hotel detail → **Fiyat alarmı nasıl çalışır?** (`#ets-price-help`, visible with analytics consent) | 1 impression per SDK session |

1. Open a fresh private browser session on https://etsdemo.netlify.app and accept analytics cookies. The SDK and both banners are consent-gated.
2. On the homepage, show the in-page strip and open its editor in Meiro. Change copy, save, and reload the site: creative updates require no website deployment.
3. Open a hotel (e.g. Agaya Bodrum) and click **Fiyat alarmı nasıl çalışır?** near the price-watch control. The native popup opens; its CTA should open the existing price-watch form (`[data-ets-watch-open]`). Close or press Escape to dismiss it.
4. Refresh the hotel page and try again: the session cap prevents another popup impression. Resetting the lifecycle scenario does not reset native SDK caps.
5. Banner metrics are SDK interaction counts (`web_banner_impression` / `click` / `close`), not unique visitors or causal uplift.

Implementation: React provides a stable empty anchor and a hotel-page trigger. The SDK creates an iframe inside the anchor or a popup at document level. On SPA navigation and consent changes, the SDK banner module is reinitialized to re-evaluate page conditions and clean up old content. There is no local creative fallback. Banner CTA links should stay on the current demo host. Rollback: disable the banners in Meiro, or set `web_banners.enabled` to false in code.
