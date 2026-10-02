import React, { useEffect } from "react";
import { readConsent } from "../tracking";

export const MEIRO_APP = "https://ets-demo.eu1.pipes.meiro.io";

// Native Meiro Web Banners for the ETS demo. The banners are authored in
// Engage → Channels → Web Banners on the ets-demo instance. Their IDs and editor
// links will be supplied later — fill them in here once they exist. Until then
// the guide links to the generic Web Banners list. Do not invent IDs.
export const NATIVE_BANNERS = {
  inpage: {
    id: null, // TODO: Meiro web banner ID for the homepage in-page strip
    anchor: "#ets-meiro-inpage",
    frequency: "5 impressions per SDK session (planned)",
  },
  popup: {
    id: null, // TODO: Meiro web banner ID for the price-watch popup
    trigger: "#ets-price-help",
    frequency: "1 impression per SDK session (planned)",
  },
};
export const bannerEditorURL = (banner) =>
  banner?.id
    ? `${MEIRO_APP}/channels/web-banners/${banner.id}`
    : `${MEIRO_APP}/channels/web-banners`;

let sdkLoaded = false;
// SDK banners own their iframe and children. React only owns the empty anchor.
// Reinitialize on navigation: SDK page conditions are evaluated at initialization.
export function useNativeBanners(route) {
  useEffect(() => {
    const refresh = () => {
      if (!sdkLoaded || !window.mpt) return;
      window.mpt("config", { web_banners: { enabled: false } });
      if (readConsent() === "granted") {
        window.mpt("config", { web_banners: { enabled: true } });
      }
    };
    const onLoaded = (event) => {
      if (event.detail !== "loaded") return;
      sdkLoaded = true;
      refresh();
    };
    window.addEventListener("ets-sdk-status", onLoaded);
    window.addEventListener("ets-consent-changed", refresh);
    refresh();
    return () => {
      window.removeEventListener("ets-sdk-status", onLoaded);
      window.removeEventListener("ets-consent-changed", refresh);
      if (sdkLoaded)
        window.mpt?.("config", { web_banners: { enabled: false } });
    };
  }, [route]);
}

export function NativeBannerSlot() {
  return <div className="container ets-native-slot" id="ets-meiro-inpage" />;
}

export function NativeBannerGuide() {
  const configured = NATIVE_BANNERS.inpage.id && NATIVE_BANNERS.popup.id;
  return (
    <section className="ets-card">
      <h3>Creative owned by Meiro</h3>
      <p>
        Native examples are HTML Web Banners served by the real Meiro SDK. Copy,
        layout, targeting and caps live in Engage → Channels → Web Banners on
        the ets-demo instance; reload the website after editing.
      </p>
      {!configured && (
        <p className="ets-notice">
          Banner IDs are not configured yet (see <code>NATIVE_BANNERS</code> in
          src/demo/NativeBanners.jsx). The anchors and SDK lifecycle are in
          place; nothing renders until the banners exist in Meiro.
        </p>
      )}
      <ol>
        <li>
          <strong>In-page inspiration:</strong> open the homepage and accept
          analytics cookies. The compact strip renders in the empty{" "}
          <code>#ets-meiro-inpage</code> anchor below the search and lifecycle
          content.
        </li>
        <li>
          <strong>Price-watch popup:</strong> open a hotel and click “Fiyat
          alarmı nasıl çalışır?” beside the price-watch control.
        </li>
      </ol>
      <p>
        These examples use page and host targeting. The lifecycle cards use
        Meiro profile decisions with website-owned layouts. Native banner
        targeting does not use the lifecycle experiment arm.
      </p>
      <p>
        Planned caps — popup: {NATIVE_BANNERS.popup.frequency}; in-page:{" "}
        {NATIVE_BANNERS.inpage.frequency}. No content is substituted locally if
        Meiro is unavailable or consent is declined.
      </p>
      <div className="ets-actions">
        <a className="primary" href="/">
          Open in-page example
        </a>
        <a className="primary" href="/otel/agaya-bodrum">
          Open popup example
        </a>
        <a
          className="ets-link"
          href={bannerEditorURL(NATIVE_BANNERS.inpage)}
          target="_blank"
          rel="noreferrer"
        >
          Edit in Meiro ↗
        </a>
      </div>
      <p>
        Impressions, clicks and closes are emitted automatically by the SDK
        (web_banner_impression / click / close). Demo traffic is not measured
        business uplift.
      </p>
    </section>
  );
}
