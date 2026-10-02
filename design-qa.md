# ETS demo design QA

## Evidence and scope

Visual source of truth: the saved etstur.com pages and the reference captures in `ref/home.png`, `ref/list.png` and `ref/detail.png` (1440 px wide). Implementation captures from the local dev server are in `ref/out/` at 1440 × 900 and 390 × 844 (home, Bodrum results, Agaya Bodrum detail, `/demo`). Captures were visually inspected, not only generated.

## Checked surfaces

- Header: ETS 35. yıl logo, nav (Otel · Tur · Kıbrıs · Mısır · Villa · Ulaşım · Kampanyalar · Son Yaz Fırsatları in orange), light-blue account pill (Hesabım, Rezervasyonlarım) and utility row (Favorilerim, Yardım, Acenteler, 444 0 387). Mobile collapses to logo + menu.
- Home: beach hero with curved bottom, product tab pill, frosted search panel, Popüler Aramalar, gradient-ring campaign bubbles, neutral member promo, Tatil Temaları band, Popüler Bölgeler mosaic.
- Results: light-blue search band, breadcrumb, “X tesis bulduk”, filter column, member strip, three-part hotel cards with teal score badge, board, nights, discount, struck and current TL.
- Detail: title + location, 1 + 2 gallery with “Galeri (n)”, tab bar with Odaları Gör, overview with chips, score and location cards, campaigns strip, room search and room cards with board selection and sticky summary.
- No horizontal overflow at 390 px on any captured page.

## Fixes made during QA

1. The hero search form inherited the `.hero` section class (variant name collision), stretching fields to 500 px. Renamed the variant.
2. Header utility links overlapped the nav at 1440 px; moved Favorilerim to the utility row and tightened nav spacing.
3. Region mosaic left empty cells; switched to two tall cards framing four small ones.
4. “Oda Ara” lost its blue background due to selector specificity.
5. Demo Studio checkboxes inherited the 40 px input min-height.
6. `/demo` showed an empty page behind the studio; it now renders the homepage.

## Accepted differences

Reduced inventory and campaign content, simplified account/help dialogs, no user reviews reproduced, no payment-provider or bank/card logos, no app-download section. Demo, not a production booking engine.
