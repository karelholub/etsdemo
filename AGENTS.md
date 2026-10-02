# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, check the reference screenshots in `ref/` (`home.png`, `list.png`, `detail.png`) and `docs/ets-port-brief.md`. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## ETS lifecycle demo (ported from the DERTOUR demo, 2026-10-02)

- Audience: CRM and marketing leadership. Customer copy is Turkish; presenter (Demo Studio) explanations are English.
- Website + email previews only. Never launch real sends or ad exports as part of this demo.
- Meiro instance: `ets-demo.eu1.pipes.meiro.io`, source “Etstur Web” (`etstur-web`). Keep the event names `ets_demo_state` / `ets_touchpoint`, Profile API attributes `ets_decision` / `ets_message_eligibility` and the extra payload fields (`item_category`, `otel_city`, `brand`, `currency: TRY`, `efilli_consent_marketing`) exactly as documented in `docs/event-contract.md`.
- Use live Meiro decisions for customer-facing personalization. Label local rule previews explicitly and keep the public website generic until the current run/revision is returned.
- Keep synthetic outcomes and illustrative ROI separate. Native Meiro dashboards should use an ETS namespace and must not include other demos.
- Look: etstur.com — ETS logo, Montserrat, primary blue `#056BFD`, navy `#000929`, light-blue tints, teal score badges. Do not show third-party bank/card brands (e.g. Maximum, MaxiPuan); use neutral member-offer copy.
- React owns personalized content; SDK DOM injection must use separate empty slots (`#ets-meiro-inpage`). Native banner IDs are configured in `NATIVE_BANNERS` (src/demo/NativeBanners.jsx) — leave them `null` until real IDs are supplied; never invent Meiro object IDs.
- Native Meiro popup and inline examples belong alongside website-rendered lifecycle cards. Meiro owns their HTML, conditions, caps and triggers. Reinitialize on route/consent changes and do not duplicate native interaction events.
- Keep the native in-page banner compact and image-free to avoid repeating the lifecycle card’s hotel photograph.
- Production host: `https://etsdemo.netlify.app`. Demo, never production: no real payments; booking-form names/emails are never sent to analytics.
