const ENDPOINT =
  import.meta.env.VITE_MEIRO_ENDPOINT ||
  "https://ets-demo.eu1.pipes.meiro.io/collect/etstur-web";
const SCRIPT =
  import.meta.env.VITE_MEIRO_SDK_URL ||
  "https://ets-demo.eu1.pipes.meiro.io/mpt.js";
export const CONSENT_KEY = "ets-consent";
export const BRAND = "etstur";
export const CURRENCY = "TRY";
let started = false;
export const readConsent = () => localStorage.getItem(CONSENT_KEY);
export function startTracking() {
  if (started || readConsent() !== "granted") return;
  started = true;
  window.mpt =
    window.mpt ||
    function () {
      (window.mpt.q = window.mpt.q || []).push(Array.from(arguments));
    };
  window.mpt("config", {
    collection_endpoint: ENDPOINT,
    link_tracking: { enabled: false },
    tracking_rules: { enabled: false },
    // The route lifecycle enables banners after the SDK has loaded.
    web_banners: { enabled: false },
  });
  window.mpt("consent", {
    storage_persistence: "granted",
    user_id: "granted",
    session_id: "granted",
  });
  window.mpt("set", { demo: true, demo_site: "ets", brand: BRAND });
  const script = document.createElement("script");
  script.src = SCRIPT;
  script.async = true;
  script.onerror = () =>
    window.dispatchEvent(
      new CustomEvent("ets-sdk-status", { detail: "unavailable" }),
    );
  script.onload = () =>
    window.dispatchEvent(
      new CustomEvent("ets-sdk-status", { detail: "loaded" }),
    );
  document.head.appendChild(script);
}
export function setConsent(granted) {
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  if (granted) {
    startTracking();
    window.mpt("consent", {
      storage_persistence: "granted",
      user_id: "granted",
      session_id: "granted",
    });
  } else if (started) {
    window.mpt("config", { web_banners: { enabled: false } });
    window.mpt("consent", {
      storage_persistence: "denied",
      user_id: "denied",
      session_id: "denied",
    });
  }
  window.dispatchEvent(new Event("ets-consent-changed"));
}
export function track(name, payload = {}) {
  if (readConsent() !== "granted") return;
  startTracking();
  let event = {
    demo: true,
    demo_site: "ets",
    brand: BRAND,
    page_location: location.href,
    page_title: document.title,
    ...payload,
  };
  // The SDK strictly validates page_view and form_submit: no arbitrary fields.
  if (name === "page_view")
    event = {
      page_title: document.title,
      url: location.href,
      referrer: document.referrer,
    };
  if (name === "form_submit") event = { form_id: payload.form_id };
  window.mpt("event", name, event);
  // This bounded log lets demo operators inspect what was sent without exposing identifiers.
  window.__etsEvents = [
    ...(window.__etsEvents || []).slice(-49),
    { name, payload: event },
  ];
}
export function item(hotel, value = hotel.price) {
  return {
    item_id: hotel.id,
    item_name: hotel.name,
    item_category: "hotel",
    item_category2: hotel.destination,
    item_brand: BRAND,
    price: value,
    quantity: 1,
  };
}
// Shared commerce fields read by existing ets-demo instance attributes.
export function commerce(hotel, value = hotel.price) {
  return {
    currency: CURRENCY,
    value,
    item_category: "hotel",
    otel_city: hotel.destination,
    brand: BRAND,
    items: [item(hotel, value)],
  };
}
