# Direct Meiro SDK event contract (ETS)

Implementation: `src/tracking.js`. The SDK (`https://ets-demo.eu1.pipes.meiro.io/mpt.js`) is loaded only after analytics consent and posts to `https://ets-demo.eu1.pipes.meiro.io/collect/etstur-web` (source **Etstur Web**). Shared attributes use `mpt('set', {demo: true, demo_site: 'ets', brand: 'etstur'})`. The SDK supplies browser/session identifiers.

Every app event (except the strictly validated `page_view` / `form_submit`) also carries `demo: true`, `demo_site: 'ets'`, `brand: 'etstur'`, `page_location` and `page_title`.

| Event | Trigger | Fields |
|---|---|---|
| page_view | Route entry or initial consent | page_title, url, referrer |
| search | Submit hotel search / “Oda Ara” | search_term, destination, item_category: hotel, otel_city, start_date, end_date, adults, children, travel_type, origin (only for Uçak + Otel / Otobüs + Otel) |
| view_search_results | Results page | search_term, destination, item_category: hotel, otel_city, items |
| select_item | Open hotel | item_list_name, item_category: hotel, otel_city, items |
| view_item | Hotel detail | commerce fields¹ |
| add_to_wishlist | Add to Favorilerim | commerce fields¹ |
| add_to_cart | “Oda Seç” | commerce fields¹, room_type, board_type |
| begin_checkout | “Rezervasyona Devam Et” | commerce fields¹, quote_id, booking_session_id, room, board, destination, start_date, end_date, adults, children, travel_type |
| form_start | First booking form focus | form_id |
| form_submit | Valid booking form submission | form_id |
| purchase | Simulated booking submission | commerce fields¹, transaction_id, order_id, booking_type: simulated, quote_id, destination, start_date, end_date, room, board, adults, children, travel_type |
| select_promotion | Homepage story/campaign/theme card | promotion_name |
| filter_results | Sort or filter change | sort or filter |

¹ Commerce fields (read by existing ets-demo instance attributes): `currency: 'TRY'`, `value` (TL total for the stay), `item_category: 'hotel'`, `otel_city` (hotel destination, e.g. “Bodrum”), `brand: 'etstur'`, `items`.

Item fields: item_id, item_name, item_category (hotel), item_category2 (destination), item_brand (etstur), price, quantity. All monetary amounts are TL example values. Order ID (`ETS-DEMO-…`) is generated on form submission; reloading the confirmation does not send another purchase.

The installed SDK strictly validates page_view and form_submit. Their arguments must not include arbitrary fields; shared demo markers belong in `set`. Named custom events accept object payloads. Automatic link tracking and tracking rules are disabled, avoiding duplicate automatic events and form scraping.

Names and email entered into the booking form are never sent or persisted. Do not add them when extending the demo. No payment/ID data is requested. Consent rejection blocks SDK loading; withdrawal blocks new app event calls and updates SDK persistence consent; re-acceptance restores consent. Events before consent are not replayed. No consent-specific event type is sent.

## ETS lifecycle extension

`ets_demo_state` is a synthetic-only snapshot event (same payload as the DERTOUR `dtr_demo_state`) with `demo_site: 'ets'`, `currency: 'TRY'`, a random run ID, revision, producer event time (`updated_at`), lifecycle `action`, `event_id`, experiment arm, persona, stage, destination, separate marketing/media permissions (`email_permission`, `ads_permission`), **`efilli_consent_marketing: 'true' | 'false'`** (mirrors the synthetic marketing-permission checkbox), quote/booking/watch context, owned extras (`transfer_owned`, `ancillary_value` 2.400 TL, `ancillary_margin` 720 TL per transfer), contact-step keys and outcome values (`searched`, `checkout_started`, `confirmed`, `net_booking`, `repeat_booking`, `booked_value`, `net_value`). Meiro derives decisions and eligibility from the inputs; a client-provided decision is not used. Events are ordered by producer time then receipt time to withstand batching.

`ets_touchpoint` records a live web impression/click or eligible email preview with event ID, run ID, decision, channel, action, experiment and destination (`synthetic: true`, `demo_site: 'ets'`). Gallery previews do not count as communication. This is not an email-delivered/open event.

The website polls `https://ets-demo.eu1.pipes.meiro.io/profile-api/ets-demo?identifier_type=user_id&identifier_value=<SDK user_id>` and reads `attributes.ets_decision` (dimensions: run_id, revision, decision, reason, marketing) and `attributes.ets_message_eligibility` (dimensions: revision, eligible, reason) — the same dimensions as the DERTOUR `dtr_decision` / `dtr_message_eligibility`. A decision is rendered only when run_id and revision match the current local state.

See [demo-runbook.md](demo-runbook.md). The Meiro object snapshot (`meiro/`) will be regenerated for ets-demo.

## Native Web Banner events

The Meiro SDK automatically emits `web_banner_impression`, `web_banner_click` and `web_banner_close` for native banners. Do not also emit these through `track()` or duplicate them as `ets_touchpoint`. Standard payloads include `banner_id`, `banner_name`, `banner_type`, `placement`, `source_slug`, `url`, `path` and `host`; click events also include `action_text` and `href`. The ETS banner IDs are not configured yet (`NATIVE_BANNERS` in `src/demo/NativeBanners.jsx`).
