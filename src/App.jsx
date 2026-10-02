import React, { useState, useEffect, useRef } from "react";
import { useNativeBanners, NativeBannerSlot } from "./demo/NativeBanners";
import { useLifecycle } from "./demo/useLifecycle";
import { Personalization, PriceWatch, TripHub, Presenter } from "./demo/Demo";
import { newQuote, priceFor, offerKey, nightsBetween } from "./demo/model";
import { tl } from "./demo/content";
import {
  asset,
  destinations,
  destinationInfo,
  hotels,
  boards,
  rooms,
  travelTypes,
  origins,
  themes,
  stories,
  tripThemes,
  scoreLabel,
} from "./data";
import {
  track,
  item,
  commerce,
  readConsent,
  setConsent,
  startTracking,
} from "./tracking";

const shortDate = (s) =>
  new Date(s + "T12:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
const weekday = (s) =>
  new Date(s + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "long" });
const longDate = (s) =>
  new Date(s + "T12:00:00").toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
const party = (adults, children) =>
  `${adults} Yetişkin${children ? `, ${children} Çocuk` : ""} · 1 Oda`;
const originalFor = (h, total) =>
  h.discount ? Math.round(total / (1 - h.discount / 100) / 10) * 10 : null;

function Icon({ name, size = 22, ...props }) {
  const paths = {
    pin: (
      <>
        <path d="M19 10c0 5.5-7 12-7 12s-7-6.5-7-12a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4m8-4v4M3 10h18" />
      </>
    ),
    plane: (
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" />
    ),
    bus: (
      <>
        <rect x="4" y="3" width="16" height="15" rx="3" />
        <path d="M4 11h16M8 18v3m8-3v3M8 14.5h.01M16 14.5h.01" />
      </>
    ),
    bed: (
      <>
        <path d="M3 18V6m0 8h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" />
        <circle cx="7" cy="11" r="2" />
      </>
    ),
    villa: <path d="M3 21h18M5 21V10l7-6 7 6v11M10 21v-6h4v6" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    down: <path d="m6 9 6 6 6-6" />,
    check: <path d="m5 12 4.5 4.5L19 7" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    ),
    doc: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </>
    ),
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    filter: <path d="M3 5h18l-7 8v6l-4 2v-8Z" />,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
    share: (
      <>
        <path d="M12 3v13M7 8l5-5 5 5" />
        <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </>
    ),
    camera: (
      <>
        <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    tag: (
      <>
        <path d="M3 3h8l10 10-8 8L3 11Z" />
        <circle cx="7.5" cy="7.5" r="1.2" />
      </>
    ),
    shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" />,
    back: <path d="M19 12H5m6-6-6 6 6 6" />,
    thumb: (
      <path d="M7 10v11H3V10Zm0 0 4-7a2 2 0 0 1 3 1.7V9h5.5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18 21H7" />
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.check}
    </svg>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef();
  useEffect(() => {
    const before = document.activeElement;
    ref.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = ref.current.querySelectorAll(
          'button,input,select,a[href],[tabindex="0"]',
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = old;
      before?.focus();
    };
  }, []);
  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={ref}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={"modal " + (wide ? "wide" : "")}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button aria-label="Kapat" className="icon-button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ScoreBadge({ h, compact = false }) {
  return (
    <div className={"score " + (compact ? "compact" : "")}>
      <span>
        <strong>{scoreLabel(h.score)}</strong>
        <small>{h.reviews.toLocaleString("tr-TR")} Değerlendirme</small>
      </span>
      <b>{h.score.toFixed(1)}</b>
    </div>
  );
}

export function App() {
  const demo = useLifecycle();
  const params = new URLSearchParams(
    location.search || sessionStorage.getItem("ets-trip") || "",
  );
  const [route, setRoute] = useState(location.pathname),
    [destination, setDestination] = useState(
      params.get("destination") || "Bodrum",
    ),
    [departure, setDeparture] = useState(params.get("departure") || "İstanbul"),
    [start, setStart] = useState(params.get("start") || "2026-10-20"),
    [end, setEnd] = useState(params.get("end") || "2026-10-27"),
    [adults, setAdults] = useState(Number(params.get("adults")) || 2),
    [children, setChildren] = useState(Number(params.get("children")) || 0),
    [travelType, setTravelType] = useState(
      travelTypes.includes(params.get("travelType"))
        ? params.get("travelType")
        : "Sadece Otel",
    );
  const [modal, setModal] = useState(null),
    [saved, setSaved] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("ets-saved") || "[]");
      } catch {
        return [];
      }
    }),
    [consent, setConsentState] = useState(readConsent()),
    [cookieOpen, setCookieOpen] = useState(!readConsent()),
    [sort, setSort] = useState("recommended"),
    [popular, setPopular] = useState([]),
    [priceMin, setPriceMin] = useState(""),
    [priceMax, setPriceMax] = useState(""),
    [minScore, setMinScore] = useState(0),
    [boardFilter, setBoardFilter] = useState([]),
    [themeFilter, setThemeFilter] = useState([]),
    [board, setBoard] = useState(params.get("board") || ""),
    [room, setRoom] = useState(params.get("room") || "Standart Oda"),
    [notice, setNotice] = useState(""),
    [gallery, setGallery] = useState(0),
    [booking, setBooking] = useState(() => {
      try {
        return JSON.parse(sessionStorage.getItem("ets-booking") || "null");
      } catch {
        return null;
      }
    });
  const hotel =
    hotels.find(
      (h) => route === "/otel/" + h.id || route === "/rezervasyon/" + h.id,
    ) || hotels[0];
  const selBoard = boards.includes(board) ? board : hotel.board;
  useEffect(() => {
    sessionStorage.setItem(
      "ets-trip",
      new URLSearchParams({
        destination,
        departure,
        start,
        end,
        adults,
        children,
        travelType,
        board,
        room,
      }).toString(),
    );
  }, [destination, departure, start, end, adults, children, travelType, board, room]);
  const nights = nightsBetween(start, end);
  const tripSelection = {
    destination,
    departure,
    start,
    end,
    adults,
    children,
    travelType,
    board: selBoard,
    room,
  };
  const referenceTotal = priceFor(hotel, tripSelection);
  useNativeBanners(route);
  const watch = demo.state.watch;
  const total =
    watch?.active &&
    watch.offer_key === offerKey(hotel, tripSelection) &&
    new Date(watch.expires_at) > new Date(demo.state.clock)
      ? watch.current_price
      : referenceTotal;
  const listPrice = (h) =>
    priceFor(h, {
      board: h.board,
      room: "Standart Oda",
      travelType,
      adults,
      children,
      start,
      end,
    });
  function go(path) {
    history.pushState({}, "", path);
    setRoute(path.split("?")[0]);
    window.scrollTo({ top: 0 });
    setModal(null);
  }
  useEffect(() => {
    const pop = () => {
      setRoute(location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", pop);
    startTracking();
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    document.title =
      (route.startsWith("/otel/")
        ? hotel.name
        : route === "/oteller"
          ? `${destination} Otelleri`
          : route === "/favorilerim"
            ? "Favorilerim"
            : route === "/rezervasyonlarim"
              ? "Rezervasyonlarım"
              : "Tatil, ETS’den sorulur!") + " | ETS Demo";
    track("page_view", { page_path: route });
    if (route.startsWith("/otel/"))
      track("view_item", commerce(hotel, listPrice(hotel)));
    if (route === "/oteller")
      track("view_search_results", {
        search_term: destination,
        destination,
        item_category: "hotel",
        otel_city: destination,
        items: hotels
          .filter((h) => h.destination === destination)
          .map((h) => item(h, listPrice(h))),
      });
  }, [route, destination]);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  function search(dest = destination) {
    setDestination(dest);
    demo.act("search", { destination: dest });
    track("search", {
      search_term: dest,
      destination: dest,
      item_category: "hotel",
      otel_city: dest,
      start_date: start,
      end_date: end,
      adults,
      children,
      travel_type: travelType,
      ...(travelType !== "Sadece Otel" ? { origin: departure } : {}),
    });
    go(
      `/oteller?destination=${encodeURIComponent(dest)}&start=${start}&end=${end}&adults=${adults}&children=${children}`,
    );
  }
  function favourite(h) {
    const added = !saved.includes(h.id);
    const next = added ? [...saved, h.id] : saved.filter((s) => s !== h.id);
    setSaved(next);
    localStorage.setItem("ets-saved", JSON.stringify(next));
    if (added) track("add_to_wishlist", commerce(h, listPrice(h)));
    setNotice(
      added ? "Tesis Favorilerim’e eklendi" : "Tesis Favorilerim’den çıkarıldı",
    );
  }
  function chooseConsent(granted) {
    setConsent(granted);
    setConsentState(granted ? "granted" : "denied");
    setCookieOpen(false);
    demo.act("analytics_consent");
    if (granted) track("page_view", { page_path: route });
  }
  function openHotel(h, list = "Arama Sonuçları") {
    track("select_item", {
      item_list_name: list,
      item_category: "hotel",
      otel_city: h.destination,
      items: [item(h, listPrice(h))],
    });
    setBoard(h.board);
    setRoom("Standart Oda");
    go("/otel/" + h.id);
  }
  function checkout() {
    const quote = newQuote(hotel, tripSelection, demo.state);
    quote.total = total;
    demo.act("checkout", { quote });
    track("begin_checkout", {
      ...commerce(hotel, total),
      quote_id: quote.id,
      booking_session_id: quote.id,
      room,
      board: selBoard,
      destination,
      start_date: start,
      end_date: end,
      adults,
      children,
      travel_type: travelType,
    });
    go("/rezervasyon/" + hotel.id);
  }
  function resetFilters() {
    setPopular([]);
    setPriceMin("");
    setPriceMax("");
    setMinScore(0);
    setBoardFilter([]);
    setThemeFilter([]);
  }
  const inDestination = hotels.filter((h) => h.destination === destination);
  const results = inDestination.filter((h) => {
    const p = listPrice(h);
    return (
      (!popular.includes("Ultra Her Şey Dahil") ||
        h.board === "Ultra Her Şey Dahil") &&
      (!popular.includes("9 ve üstü") || h.score >= 9) &&
      (!popular.includes("Denize Sıfır") ||
        h.themes.includes("Denize Sıfır")) &&
      (!popular.includes("Çocuk Dostu") || h.family) &&
      (!priceMin || p >= Number(priceMin)) &&
      (!priceMax || p <= Number(priceMax)) &&
      h.score >= minScore &&
      (!boardFilter.length || boardFilter.includes(h.board)) &&
      (!themeFilter.length || themeFilter.some((t) => h.themes.includes(t)))
    );
  });
  if (sort === "price") results.sort((a, b) => listPrice(a) - listPrice(b));
  if (sort === "price-desc")
    results.sort((a, b) => listPrice(b) - listPrice(a));
  if (sort === "rating") results.sort((a, b) => b.score - a.score);
  const filterProps = {
    inDestination,
    popular,
    setPopular,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    minScore,
    setMinScore,
    boardFilter,
    setBoardFilter,
    themeFilter,
    setThemeFilter,
    destination,
    search,
    onChange: (name) => track("filter_results", { filter: name }),
  };

  const SearchFields = ({ variant = "in-hero" }) => (
    <form
      className={"search-fields " + variant}
      onSubmit={(e) => {
        e.preventDefault();
        search();
      }}
    >
      <button
        className="search-field destination-field"
        type="button"
        onClick={() => setModal("destination")}
      >
        <Icon name="pin" />
        <span>
          {variant === "in-hero" && <small>Nereye gitmek istersin?</small>}
          <strong>
            {route.startsWith("/otel/") && variant !== "in-hero"
              ? hotel.name
              : `${destination} Otelleri`}
          </strong>
        </span>
      </button>
      <button
        type="button"
        className="search-field date-field"
        onClick={() => setModal("dates")}
        aria-label={`Tarihler: ${shortDate(start)} – ${shortDate(end)}, ${nights} gece`}
      >
        <span>
          <small>Giriş Tarihi</small>
          <strong>{shortDate(start)}</strong>
          <em>{weekday(start)}</em>
        </span>
        <span>
          <small>Çıkış Tarihi</small>
          <strong>{shortDate(end)}</strong>
          <em>{weekday(end)}</em>
        </span>
        <span className="nights">
          <Icon name="moon" size={16} />
          {nights}
        </span>
      </button>
      <button
        type="button"
        className="search-field party-field"
        onClick={() => setModal("travellers")}
      >
        <span>
          <small className="pill">
            {adults + children} Kişi, 1 Oda
          </small>
          <strong>{party(adults, children)}</strong>
        </span>
      </button>
      {travelType !== "Sadece Otel" && variant === "in-hero" && (
        <button
          type="button"
          className="search-field origin-field"
          onClick={() => setModal("origin")}
        >
          <Icon name={travelType === "Uçak + Otel" ? "plane" : "bus"} />
          <span>
            <small>Nereden?</small>
            <strong>{departure}</strong>
          </span>
        </button>
      )}
      <button className="search-submit" type="submit" aria-label="Otel ara">
        <Icon name="search" />
        <span>Ara</span>
      </button>
    </form>
  );

  const HotelCard = ({ h }) => {
    const p = listPrice(h),
      orig = originalFor(h, p);
    return (
      <article className="hotel-card">
        <div className="hotel-photo">
          <button
            className="photo-link"
            aria-label={`${h.name} incele`}
            onClick={() => openHotel(h)}
          >
            <img src={asset(h.image)} alt={`${h.name}`} loading="lazy" />
          </button>
          <button
            className={"save-button " + (saved.includes(h.id) ? "saved" : "")}
            aria-label={
              saved.includes(h.id)
                ? `${h.name} favorilerden çıkar`
                : `${h.name} favorilere ekle`
            }
            onClick={() => favourite(h)}
          >
            <Icon name="heart" size={18} />
          </button>
          {h.synthetic && <span className="photo-tag">Demo tesis</span>}
        </div>
        <div className="hotel-info">
          <button className="hotel-title" onClick={() => openHotel(h)}>
            <h2>{h.name}</h2>
          </button>
          <p className="location">
            <Icon name="pin" size={15} />
            {h.location}
          </p>
          <ul className="features">
            {h.features.map((f) => (
              <li key={f} className={/İptal/.test(f) ? "green" : ""}>
                {/İptal/.test(f) && <Icon name="shield" size={15} />}
                {f}
              </li>
            ))}
          </ul>
          <p className="member-chip">
            <Icon name="tag" size={15} />
            Üyelere özel sepette %8 ek indirim (demo)
          </p>
        </div>
        <div className="hotel-price">
          <ScoreBadge h={h} />
          <div className="price-box">
            <span className="board">{h.board}</span>
            <span className="nights-label">{nights} Gece</span>
            {orig && <span className="discount">%{h.discount}</span>}
            {orig && <s>{tl(orig)}</s>}
            <strong>{tl(p)}</strong>
            <small>
              {party(adults, children)}
              {travelType !== "Sadece Otel" ? ` · ${travelType}` : ""}
            </small>
            <button className="primary" onClick={() => openHotel(h)}>
              Oteli İncele
            </button>
          </div>
        </div>
      </article>
    );
  };

  const navItems = [
    ["Otel", () => search()],
    ["Tur", () => setModal("product")],
    ["Kıbrıs", () => search("Kıbrıs")],
    ["Mısır", () => setModal("product")],
    ["Villa", () => setModal("product")],
    ["Ulaşım", () => setModal("product")],
    [
      "Kampanyalar",
      () => {
        go("/");
        setTimeout(
          () =>
            document
              .getElementById("kampanyalar")
              ?.scrollIntoView({ behavior: "smooth" }),
          30,
        );
      },
    ],
    ["Son Yaz Fırsatları", () => search("Bodrum")],
  ];

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="logo-button"
            aria-label="ETS ana sayfa"
            onClick={() => go("/")}
          >
            <img src={asset("ets-logo.svg")} alt="etstur 35. yıl" />
          </button>
          <nav aria-label="Ana menü" className="main-nav">
            {navItems.map(([label, fn], i) => (
              <button
                key={label}
                className={label === "Son Yaz Fırsatları" ? "hot" : ""}
                onClick={fn}
              >
                {label}
                {i < 6 && <Icon name="down" size={14} />}
              </button>
            ))}
          </nav>
          <div className="header-right">
            <div className="account-pill">
              <button onClick={() => setModal("account")}>
                <Icon name="user" size={17} />
                <span>Hesabım</span>
              </button>
              <button onClick={() => go("/rezervasyonlarim")}>
                <Icon name="doc" size={17} />
                <span>Rezervasyonlarım</span>
              </button>
            </div>
            <div className="utility">
              <button onClick={() => go("/favorilerim")}>
                <Icon name="heart" size={16} />
                Favorilerim{saved.length ? ` (${saved.length})` : ""}
              </button>
              <button onClick={() => setModal("help")}>
                Yardım <Icon name="down" size={14} />
              </button>
              <button onClick={() => setModal("agency")}>Acenteler</button>
              <button onClick={() => setModal("phone")}>
                <Icon name="phone" size={16} />
                444 0 387
              </button>
            </div>
          </div>
          <button
            className="mobile-menu"
            aria-label="Menüyü aç"
            onClick={() => setModal("menu")}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      <main>
        {route === "/rezervasyonlarim" && (
          <TripHub demo={demo} search={search} />
        )}
        {(route === "/" || route === "/demo") && (
          <>
            <section className="hero">
              <img
                className="hero-photo"
                src={asset("hero-beach.webp")}
                alt=""
              />
              <span className="hero-chip">
                Demo prototip · Resmi ETS hizmeti değildir
              </span>
              <div className="hero-inner">
                <h1>Hayalindeki tatili ETS ile planla!</h1>
                <div className="product-tabs" role="tablist">
                  {[
                    ["Otel", "bed", "Sadece Otel"],
                    ["Tur", "globe", null],
                    ["Uçak", "plane", "Uçak + Otel"],
                    ["Villa", "villa", null],
                    ["Otobüs", "bus", "Otobüs + Otel"],
                  ].map(([label, icon, type]) => (
                    <button
                      key={label}
                      role="tab"
                      aria-selected={type === travelType}
                      className={type === travelType ? "active" : ""}
                      onClick={() =>
                        type ? setTravelType(type) : setModal("product")
                      }
                    >
                      <Icon name={icon} size={18} />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="search-panel">
                  <SearchFields />
                  <div className="popular-searches">
                    <span>Popüler Aramalar:</span>
                    {[
                      ["ETS Son Yaz Fırsatları", "Bodrum"],
                      ["Kapadokya Otelleri", "Kapadokya"],
                      ["Kıbrıs Otelleri", "Kıbrıs"],
                      ["İstanbul’a Yakın Oteller", "Sapanca"],
                    ].map(([t, d]) => (
                      <button key={t} onClick={() => search(d)}>
                        {t} <Icon name="arrow" size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <section className="container stories" id="kampanyalar">
              <div className="story-row">
                {stories.map(([title, img, dest, overlay]) => (
                  <button
                    key={title}
                    className="story"
                    onClick={() => {
                      track("select_promotion", { promotion_name: title });
                      search(dest);
                    }}
                  >
                    <span className="ring">
                      <img src={asset(img)} alt="" loading="lazy" />
                      <b>{overlay}</b>
                    </span>
                    <span className="story-label">{title}</span>
                  </button>
                ))}
                <button
                  className="story-wide"
                  onClick={() => {
                    track("select_promotion", {
                      promotion_name: "Son Dakika Tatil Fırsatları",
                    });
                    search("Fethiye");
                  }}
                >
                  <span className="ring">
                    <img
                      src={asset("theme-balayi.webp")}
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span>
                    <strong>Son Dakika Tatil Fırsatları</strong>
                    <small>Sevilen rotalarda birçok otel seçeneği!</small>
                    <em>
                      Fırsatları Gör <Icon name="arrow" size={15} />
                    </em>
                  </span>
                </button>
              </div>
              <button className="primary center" onClick={() => search()}>
                Tüm Kampanyaları Gör
              </button>
            </section>
            <Personalization demo={demo} go={go} search={search} />
            <NativeBannerSlot />
            <section className="container promo-banner">
              <div className="promo-copy">
                <span className="eyebrow">ÜYELERE ÖZEL</span>
                <h2>Bodrum’da sezon sonu keyfi</h2>
                <p>
                  Üye girişi yapan misafirlere seçili otellerde sepette %8 ek
                  indirim. Demo kampanya; gerçek indirim uygulanmaz.
                </p>
                <button
                  className="light"
                  onClick={() => {
                    track("select_promotion", {
                      promotion_name: "Üyelere özel Bodrum",
                    });
                    search("Bodrum");
                  }}
                >
                  Otelleri Gör <Icon name="arrow" size={16} />
                </button>
              </div>
              <img src={asset("region-bodrum.webp")} alt="Bodrum koyu" />
            </section>
            <section className="container campaign-cards">
              {[
                ["ETS Son Yaz Fırsatları", "%50’ye varan indirimler", "Bodrum", "story-sea.webp"],
                ["Üyelere Özel Avantajlar", "Sepette ek indirim fırsatı", "Antalya", "region-antalya.webp"],
                ["Günün Fırsatı", "Kapadokya’da taş otel keyfi", "Kapadokya", "region-kapadokya.webp"],
              ].map(([t, s, d, img]) => (
                <article key={t}>
                  <img src={asset(img)} alt="" loading="lazy" />
                  <div>
                    <strong>{t}</strong>
                    <small>{s}</small>
                    <button
                      className="primary small"
                      onClick={() => {
                        track("select_promotion", { promotion_name: t });
                        search(d);
                      }}
                    >
                      Rezervasyon Yap!
                    </button>
                  </div>
                </article>
              ))}
            </section>
            <section className="themes-band">
              <div className="container">
                <h2 className="section-title">Tatil Temaları</h2>
                <div className="theme-grid">
                  {tripThemes.map(([t, img, d]) => (
                    <button
                      key={t}
                      className="theme-card"
                      onClick={() => {
                        track("select_promotion", { promotion_name: t });
                        search(d);
                      }}
                    >
                      <img src={asset(img)} alt="" loading="lazy" />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
                <button className="primary center" onClick={() => search()}>
                  Tüm Temaları Gör
                </button>
              </div>
            </section>
            <section className="container regions">
              <h2 className="section-title">Popüler Bölgeler</h2>
              <div className="region-tabs">
                {destinations.map((d) => (
                  <button key={d} onClick={() => search(d)}>
                    {d}
                  </button>
                ))}
              </div>
              <div className="region-grid">
                {destinations.map((d) => (
                  <button
                    key={d}
                    className="region-card"
                    onClick={() => search(d)}
                  >
                    <img
                      src={asset(destinationInfo[d].image)}
                      alt={d}
                      loading="lazy"
                    />
                    <span>
                      <strong>{d}</strong>
                      <small>
                        {hotels.filter((h) => h.destination === d).length} Otel
                      </small>
                    </span>
                  </button>
                ))}
              </div>
              <button className="primary center" onClick={() => search()}>
                Tüm Popüler Bölgeleri Gör
              </button>
            </section>
            <section className="container about">
              <h2>ETS ile tatil planlamak çok kolay</h2>
              <p>
                Bu sayfa, ETS’nin otel arama ve rezervasyon deneyimini temel
                alan etkileşimli bir demo prototipidir. Bodrum’daki referans
                tesisler gerçek ETS listelerinden alınmıştır; diğer bölgelerde
                “(Demo)” etiketli kurgusal örnek oteller yer alır. Fiyatlar
                örnek niteliğindedir, gerçek müsaitlik veya ödeme yoktur.
              </p>
            </section>
          </>
        )}
        {(route === "/oteller" || route === "/favorilerim") && (
          <>
            {route === "/oteller" && (
              <div className="search-band">
                <div className="container">
                  <SearchFields variant="band" />
                </div>
              </div>
            )}
            <div className="container results-page">
              <nav className="breadcrumbs" aria-label="Sayfa yolu">
                <button onClick={() => go("/")}>Etstur</button>
                <Icon name="chevron" size={14} />
                {route === "/favorilerim" ? (
                  <span>Favorilerim</span>
                ) : (
                  <>
                    <button onClick={() => search()}>Otel</button>
                    <Icon name="chevron" size={14} />
                    <button onClick={() => search()}>
                      {destinationInfo[destination]?.province} Otelleri
                    </button>
                    <Icon name="chevron" size={14} />
                    <span>{destination} Otelleri</span>
                  </>
                )}
              </nav>
              <div className="result-heading">
                <h1>
                  {route === "/favorilerim"
                    ? "Favorilerim"
                    : `${destination} Otelleri için toplam ${results.length} tesis bulduk!`}
                </h1>
                {route === "/oteller" && (
                  <button
                    className="text-link"
                    onClick={() => setModal("pricing")}
                  >
                    Fiyat ve İndirimler / Fiyat Farkı İade Garantisi
                  </button>
                )}
              </div>
              <div
                className={
                  "results-layout " + (route === "/favorilerim" ? "single" : "")
                }
              >
                {route === "/oteller" && (
                  <aside className="filters">
                    <div className="map-card">
                      <img src={asset("map-strip.webp")} alt="" />
                      <button
                        className="outline"
                        onClick={() => setModal("map")}
                      >
                        <Icon name="pin" size={16} />
                        Sonuçları Haritada Gör
                      </button>
                    </div>
                    <FilterFields {...filterProps} />
                    <button className="text-link" onClick={resetFilters}>
                      Filtreleri temizle
                    </button>
                  </aside>
                )}
                <section className="results-list">
                  {route === "/oteller" && (
                    <>
                      <div className="member-strip">
                        <span className="member-icon">
                          <Icon name="user" size={18} />
                        </span>
                        <p>
                          Üye girişi yaparak üyelere özel indirimlerden
                          yararlanabilirsiniz.
                        </p>
                        <button onClick={() => setModal("account")}>
                          Giriş Yap
                        </button>
                      </div>
                      <div className="list-tools">
                        <p className="demo-note">
                          Demo fiyatlar · {nights} gece ·{" "}
                          {party(adults, children)} · Canlı müsaitlik yok
                        </p>
                        <button
                          className="mobile-filter outline"
                          onClick={() => setModal("filters")}
                        >
                          <Icon name="filter" size={16} />
                          Filtrele
                        </button>
                        <label className="sort">
                          <span>Sırala</span>
                          <select
                            value={sort}
                            onChange={(e) => {
                              setSort(e.target.value);
                              track("filter_results", {
                                sort: e.target.value,
                              });
                            }}
                          >
                            <option value="recommended">ETS Sıralaması</option>
                            <option value="price">Fiyat (Artan)</option>
                            <option value="price-desc">Fiyat (Azalan)</option>
                            <option value="rating">Misafir Puanı</option>
                          </select>
                        </label>
                      </div>
                    </>
                  )}
                  {(route === "/favorilerim"
                    ? hotels.filter((h) => saved.includes(h.id))
                    : results
                  ).map((h) => (
                    <HotelCard key={h.id} h={h} />
                  ))}
                  {((route === "/favorilerim" && !saved.length) ||
                    (route === "/oteller" && !results.length)) && (
                    <div className="empty">
                      <Icon name="heart" size={40} />
                      <h2>
                        {route === "/favorilerim"
                          ? "Henüz favori tesisin yok"
                          : "Uygun tesis bulunamadı"}
                      </h2>
                      <p>
                        {route === "/favorilerim"
                          ? "Beğendiğin otelleri kalp simgesiyle Favorilerim’e ekle."
                          : "Filtrelerini değiştirerek diğer tesisleri keşfet."}
                      </p>
                      <button
                        className="primary"
                        onClick={() => {
                          resetFilters();
                          search();
                        }}
                      >
                        Otelleri Keşfet
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
        {route.startsWith("/otel/") && (
          <>
            <div className="search-band">
              <div className="container">
                <SearchFields variant="band" />
              </div>
            </div>
            <div className="container detail-page">
              <div className="detail-top">
                <nav className="breadcrumbs" aria-label="Sayfa yolu">
                  <button onClick={() => go("/")}>Etstur</button>
                  <Icon name="arrow" size={13} />
                  <button onClick={() => search(hotel.destination)}>
                    Otel
                  </button>
                  <Icon name="arrow" size={13} />
                  <button onClick={() => search(hotel.destination)}>
                    {hotel.destination} Otelleri
                  </button>
                </nav>
                {hotel.synthetic && (
                  <span className="license">Kurgusal demo tesis</span>
                )}
              </div>
              <div className="detail-heading">
                <h1>
                  {hotel.name}{" "}
                  <span className="location">
                    <Icon name="pin" size={16} />
                    {hotel.location}
                  </span>
                </h1>
                <div className="heading-actions">
                  <button
                    className={"soft " + (saved.includes(hotel.id) ? "saved" : "")}
                    onClick={() => favourite(hotel)}
                  >
                    <Icon name="heart" size={17} />
                    {saved.includes(hotel.id) ? "Beğenildi" : "Beğen"}
                  </button>
                  <button
                    className="soft"
                    onClick={() => setNotice("Paylaşım bu demoda simüle edilir")}
                  >
                    <Icon name="share" size={17} />
                    Paylaş
                  </button>
                </div>
              </div>
              <div className="gallery">
                <button
                  className="main-image"
                  onClick={() => {
                    setGallery(0);
                    setModal("gallery");
                  }}
                >
                  <img src={asset(hotel.gallery[0])} alt={hotel.name} />
                </button>
                <div className="gallery-side">
                  {[1, 2].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setGallery(n % hotel.gallery.length);
                        setModal("gallery");
                      }}
                    >
                      <img
                        src={asset(hotel.gallery[n % hotel.gallery.length])}
                        alt={`${hotel.name} – görsel ${n + 1}`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  className="gallery-count"
                  onClick={() => {
                    setGallery(0);
                    setModal("gallery");
                  }}
                >
                  <Icon name="camera" size={18} />
                  Galeri ({hotel.gallery.length})
                </button>
              </div>
              <div className="detail-tabs">
                <div>
                  {[
                    ["Genel Bakış", "genel-bakis"],
                    ["Odalar", "odalar"],
                    ["Yorumlar", "yorumlar"],
                    ["Çevre ve Konum", "konum"],
                    ["Tesis Bilgileri", "tesis-bilgileri"],
                  ].map(([t, id]) => (
                    <button
                      key={t}
                      onClick={() =>
                        document
                          .getElementById(id)
                          ?.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  className="primary"
                  onClick={() =>
                    document
                      .getElementById("odalar")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Odaları Gör
                </button>
              </div>
              <div className="overview" id="genel-bakis">
                <article className="overview-text">
                  <p>{hotel.description}</p>
                  <div className="chips" id="tesis-bilgileri">
                    {hotel.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                  <button
                    className="soft"
                    onClick={() => setModal("facilities")}
                  >
                    Bu Tesisin Tüm Özelliklerini Gör
                    <Icon name="chevron" size={16} />
                  </button>
                </article>
                <aside className="overview-side">
                  <div className="score-card" id="yorumlar">
                    <b>{hotel.score.toFixed(1)}</b>
                    <strong>{scoreLabel(hotel.score)}</strong>
                    <span>
                      {hotel.reviews.toLocaleString("tr-TR")} Değerlendirme
                    </span>
                    <p>
                      Misafir puanı referans sayfadan alınmıştır. Bu demoda
                      yorum içerikleri gösterilmez ve yeni yorum yayınlanmaz.
                    </p>
                  </div>
                  <div className="location-card" id="konum">
                    <img src={asset("map-strip.webp")} alt="Harita (temsili)" />
                    <div>
                      {(hotel.nearby || [[hotel.location, ""]]).map(
                        ([place, km]) => (
                          <p key={place}>
                            <Icon name="pin" size={14} />
                            {place} <b>{km}</b>
                          </p>
                        ),
                      )}
                      <button
                        className="text-link"
                        onClick={() => setModal("map")}
                      >
                        Tesisi Haritada Gör <Icon name="chevron" size={14} />
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
              <div className="campaign-strip">
                <h2>Kampanyalar</h2>
                <div>
                  <span>
                    <Icon name="tag" size={16} />
                    Üyelere özel sepette %8 ek indirim
                  </span>
                  {hotel.discount > 0 && (
                    <span>
                      <Icon name="tag" size={16} />%{hotel.discount}’e varan
                      erken rezervasyon fırsatı
                    </span>
                  )}
                  <span>
                    <Icon name="shield" size={16} />
                    İptal Güvencesi
                  </span>
                </div>
              </div>
              <section className="rooms-section" id="odalar">
                <div className="rooms-head">
                  <h2>Odalar</h2>
                  <span className="room-score">
                    <Icon name="thumb" size={16} />
                    Tesisin Oda Puanı {Math.min(10, hotel.score - 0.4).toFixed(1)}
                  </span>
                </div>
                <div className="room-search">
                  <button onClick={() => setModal("dates")}>
                    <Icon name="calendar" size={18} />
                    <span>
                      <small>Giriş Tarihi</small>
                      {longDate(start)}
                    </span>
                  </button>
                  <button onClick={() => setModal("dates")}>
                    <Icon name="calendar" size={18} />
                    <span>
                      <small>Çıkış Tarihi</small>
                      {longDate(end)}
                    </span>
                  </button>
                  <button onClick={() => setModal("travellers")}>
                    <Icon name="users" size={18} />
                    <span>
                      <small>{adults + children} Kişi | 1 Oda</small>
                      {adults} Yetişkin, {children} Çocuk
                    </span>
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setNotice(`${nights} gece için odalar güncellendi`);
                      track("search", {
                        search_term: hotel.name,
                        destination: hotel.destination,
                        item_category: "hotel",
                        otel_city: hotel.destination,
                        start_date: start,
                        end_date: end,
                        adults,
                        children,
                        travel_type: travelType,
                        ...(travelType !== "Sadece Otel"
                          ? { origin: departure }
                          : {}),
                      });
                    }}
                  >
                    <Icon name="search" size={18} />
                    Oda Ara
                  </button>
                </div>
                <div className="rooms-layout">
                  <div>
                    <div className="travel-toggle" role="group" aria-label="Seyahat tipi">
                      {travelTypes.map((t) => (
                        <button
                          key={t}
                          aria-pressed={travelType === t}
                          className={travelType === t ? "selected" : ""}
                          onClick={() => setTravelType(t)}
                        >
                          <Icon
                            name={
                              t === "Uçak + Otel"
                                ? "plane"
                                : t === "Otobüs + Otel"
                                  ? "bus"
                                  : "bed"
                            }
                            size={18}
                          />
                          {t}
                        </button>
                      ))}
                    </div>
                    {travelType !== "Sadece Otel" && (
                      <label className="origin-select">
                        Kalkış noktası
                        <select
                          value={departure}
                          onChange={(e) => setDeparture(e.target.value)}
                        >
                          {origins.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </label>
                    )}
                    <PriceWatch
                      demo={demo}
                      hotel={hotel}
                      total={total}
                      trip={tripSelection}
                    />
                    {rooms.map((r) => {
                      const rBoard = room === r.name ? selBoard : hotel.board;
                      const rPrice = priceFor(hotel, {
                        ...tripSelection,
                        room: r.name,
                        board: rBoard,
                      });
                      return (
                        <div
                          className={
                            "room " + (room === r.name ? "selected-room" : "")
                          }
                          key={r.name}
                        >
                          <img src={asset(r.image)} alt="" loading="lazy" />
                          <div className="room-info">
                            <h3>{r.name}</h3>
                            <p>
                              {r.capacity} · {r.features.join(" · ")}
                            </p>
                            <span className="green">
                              <Icon name="check" size={16} /> Seçtiğin tarihler
                              için müsait (demo)
                            </span>
                            {hotel.synthetic || hotel.id !== "agaya-bodrum" ? (
                              <small className="muted">
                                Oda görseli temsilidir.
                              </small>
                            ) : null}
                          </div>
                          <div className="room-buy">
                            <label>
                              Konaklama Tipi
                              <select
                                value={rBoard}
                                onChange={(e) => {
                                  setRoom(r.name);
                                  setBoard(e.target.value);
                                }}
                              >
                                {boards.map((b) => (
                                  <option key={b} value={b}>
                                    {b}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <strong className="room-price">{tl(rPrice)}</strong>
                            <small>{nights} gece toplam</small>
                            <button
                              className={
                                room === r.name ? "secondary" : "primary"
                              }
                              onClick={() => {
                                setRoom(r.name);
                                track("add_to_cart", {
                                  ...commerce(hotel, rPrice),
                                  room_type: r.name,
                                  board_type: rBoard,
                                });
                              }}
                            >
                              {/* Keep labels in stable elements: browser translation
                                  can replace bare text nodes outside React's control. */}
                              <span hidden={room !== r.name}>
                                <Icon name="check" size={18} />
                              </span>
                              <span>
                                {room === r.name ? "Seçildi" : "Oda Seç"}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {travelType !== "Sadece Otel" && (
                      <div className="flight">
                        <h3>
                          {travelType === "Uçak + Otel"
                            ? "Uçuş bilgileri"
                            : "Otobüs bilgileri"}{" "}
                          (örnek)
                        </h3>
                        <p>
                          <Icon
                            name={travelType === "Uçak + Otel" ? "plane" : "bus"}
                            size={18}
                          />
                          {departure} → {hotel.destination} ·{" "}
                          {longDate(start)}
                        </p>
                        <p>
                          <Icon
                            name={travelType === "Uçak + Otel" ? "plane" : "bus"}
                            size={18}
                          />
                          {hotel.destination} → {departure} · {longDate(end)}
                        </p>
                        <small>Ulaşım bu demoda örnek olarak gösterilir.</small>
                      </div>
                    )}
                  </div>
                  <aside className="booking-summary">
                    <span className="eyebrow">REZERVASYON ÖZETİ</span>
                    <h3>{hotel.name}</h3>
                    <p>
                      {longDate(start)} – {longDate(end)}
                      <br />
                      {nights} Gece · {adults} Yetişkin
                      {children ? ` · ${children} Çocuk` : ""}
                      <br />
                      {room}
                      <br />
                      {selBoard}
                      <br />
                      {travelType}
                      {travelType !== "Sadece Otel" ? ` · ${departure}` : ""}
                    </p>
                    <div className="price-line total">
                      <span>Toplam</span>
                      <strong>{tl(total)}</strong>
                    </div>
                    <button className="primary full" onClick={checkout}>
                      Rezervasyona Devam Et
                    </button>
                    <small className="demo-note">
                      Demo teklif · Gerçek rezervasyon veya ödeme yok
                    </small>
                  </aside>
                </div>
              </section>
            </div>
          </>
        )}
        {route.startsWith("/rezervasyon/") && (
          <div className="container checkout-page">
            <button
              className="text-link back"
              onClick={() => go("/otel/" + hotel.id)}
            >
              <Icon name="back" size={16} />
              Odalara geri dön
            </button>
            <ol className="checkout-steps">
              <li className="done">1 Oda Seçimi</li>
              <li className="active">2 Misafir Bilgileri</li>
              <li>3 Onay</li>
            </ol>
            <h1>Tatilin bir adım uzağında</h1>
            <p className="demo-banner">
              Bu bir demodur. Gerçek rezervasyon yapılmaz ve ödeme alınmaz.
            </p>
            <div className="checkout-layout">
              <form
                className="checkout-form"
                onFocus={() => {
                  if (!window.__etsFormStarted) {
                    window.__etsFormStarted = true;
                    track("form_start", { form_id: "demo_booking" });
                  }
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const savedQuote = demo.state.quote;
                  if (
                    savedQuote &&
                    (new Date(savedQuote.expires_at) <
                      new Date(demo.state.clock) ||
                      savedQuote.hotel_id !== hotel.id ||
                      Math.abs(savedQuote.total - total) > 0.01)
                  ) {
                    setNotice(
                      "Kaydedilen teklifin değişti veya süresi doldu. Lütfen odanı yeniden seç.",
                    );
                    return;
                  }
                  const order = {
                    id: "ETS-DEMO-" + Date.now().toString(36).toUpperCase(),
                    hotel: hotel.name,
                    hotel_id: hotel.id,
                    destination,
                    departure,
                    travelType,
                    quote_id: demo.state.quote?.id || null,
                    total,
                    start,
                    end,
                    adults,
                    children,
                    room,
                    board: selBoard,
                  };
                  demo.act("purchase", { booking: order, value: total });
                  track("form_submit", { form_id: "demo_booking" });
                  track("purchase", {
                    ...commerce(hotel, total),
                    transaction_id: order.id,
                    order_id: order.id,
                    booking_type: "simulated",
                    quote_id: order.quote_id,
                    destination,
                    start_date: start,
                    end_date: end,
                    room,
                    board: selBoard,
                    adults,
                    children,
                    travel_type: travelType,
                  });
                  sessionStorage.setItem("ets-booking", JSON.stringify(order));
                  setBooking(order);
                  go("/onay");
                }}
              >
                <h2>Misafir bilgileri</h2>
                <p className="muted">
                  Demo için uydurma bilgiler yeterlidir. Ad ve e-posta
                  kaydedilmez ve Meiro’ya gönderilmez.
                </p>
                <div className="two-grid">
                  <label>
                    Ad
                    <input
                      name="first"
                      required
                      placeholder="Ayşe"
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    Soyad
                    <input
                      name="last"
                      required
                      placeholder="Yılmaz"
                      autoComplete="off"
                    />
                  </label>
                </div>
                <label>
                  E-posta
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="demo@example.com"
                    autoComplete="off"
                  />
                </label>
                <h2>Konaklama</h2>
                <p>
                  {longDate(start)} – {longDate(end)} · {adults} Yetişkin
                  {children ? `, ${children} Çocuk` : ""} · {nights} Gece
                </p>
                <label className="checkbox">
                  <input type="checkbox" required />
                  Rezervasyon akışını bağlayıcı olmadan simüle etmek istiyorum.
                </label>
                <button className="primary" type="submit">
                  Demo Rezervasyonu Tamamla
                </button>
              </form>
              <aside className="booking-summary">
                <img src={asset(hotel.image)} alt={hotel.name} />
                <h3>{hotel.name}</h3>
                <p>
                  {room}
                  <br />
                  {selBoard}
                  <br />
                  {travelType}
                </p>
                <div className="price-line total">
                  <span>Toplam</span>
                  <strong>{tl(total)}</strong>
                </div>
                <small className="demo-note">
                  Simüle fiyat · Ödeme alınmaz
                </small>
              </aside>
            </div>
          </div>
        )}
        {route === "/onay" && (
          <div className="container confirmation">
            <span className="success-circle">
              <Icon name="check" size={40} />
            </span>
            <span className="eyebrow">İYİ TATİLLER</span>
            <h1>
              {booking
                ? "Demo rezervasyonun onaylandı!"
                : "Sıradaki tatilin seni bekliyor"}
            </h1>
            {booking ? (
              <>
                <p>
                  Rezervasyon akışı başarıyla simüle edildi.
                  <br />
                  Gerçek bir rezervasyon yapılmadı.
                </p>
                <div className="confirmation-card">
                  <small>DEMO REZERVASYON NUMARASI</small>
                  <h3>{booking.id}</h3>
                  <h2>{booking.hotel}</h2>
                  <p>
                    {longDate(booking.start)} – {longDate(booking.end)}
                    <br />
                    {booking.adults} Yetişkin · {booking.room}
                    <br />
                    {booking.board}
                  </p>
                  <strong>{tl(booking.total)}</strong>
                </div>
              </>
            ) : (
              <p>Önce beğendiğin oteli seç.</p>
            )}
            <div className="confirmation-actions">
              <button className="primary" onClick={() => go("/")}>
                Ana Sayfaya Dön
              </button>
              <button
                className="secondary"
                onClick={() => go("/rezervasyonlarim")}
              >
                Rezervasyonlarım
              </button>
            </div>
          </div>
        )}
        {!["/", "/oteller", "/favorilerim", "/onay"].includes(route) &&
          !["/rezervasyonlarim", "/demo"].includes(route) &&
          !route.startsWith("/otel/") &&
          !route.startsWith("/rezervasyon/") && (
            <div className="empty container">
              <h1>Aradığın sayfa bulunamadı</h1>
              <button className="primary" onClick={() => go("/")}>
                Ana Sayfaya Dön
              </button>
            </div>
          )}
      </main>
      <Presenter demo={demo} go={go} />
      {route.startsWith("/otel/") && (
        <button
          className="mobile-offer-bar"
          onClick={() =>
            document
              .querySelector(".booking-summary")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span>
            <small>{nights} Gece toplam</small>
            <strong>{tl(total)}</strong>
          </span>
          <span className="cta">Rezervasyon Özeti</span>
        </button>
      )}
      <footer>
        <div className="footer-contact">
          <div className="container">
            <span>ETS demo prototipi</span>
            <button onClick={() => setModal("phone")}>
              <Icon name="phone" size={22} />
              <span>
                <strong>444 0 387</strong>
                <small>Demo · arama yapılmaz</small>
              </span>
            </button>
          </div>
        </div>
        <div className="container footer-columns">
          {[
            ["Otel Temaları", ["Balayı Otelleri", "Denize Sıfır Oteller", "Termal Oteller", "Doğa Otelleri"]],
            ["Kampanyalar", ["ETS Son Yaz Fırsatları", "Erken Rezervasyon", "Üyelere Özel Fırsatlar"]],
            ["Popüler Bölgeler", destinations.map((d) => `${d} Otelleri`)],
            ["Kurumsal", ["Hakkımızda", "İletişim", "Gizlilik", "Çerez Ayarları"]],
          ].map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              {links.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    const d = destinations.find((x) => t.startsWith(x));
                    if (t === "Çerez Ayarları") setCookieOpen(true);
                    else if (t === "Gizlilik") setModal("privacy");
                    else if (d) search(d);
                    else if (title === "Kurumsal") setModal("legal");
                    else search();
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="container">
            <img src={asset("ets-logo.svg")} alt="etstur" />
            <p>
              Bu site ETS için hazırlanmış bağımsız bir demo prototipidir;
              resmi bir ETS hizmeti değildir. Fiyatlar, kampanyalar ve
              müsaitlik örnek niteliğindedir. Gerçek rezervasyon veya ödeme
              yapılmaz.
            </p>
          </div>
        </div>
      </footer>
      {notice && (
        <div role="status" className="toast">
          <Icon name="check" />
          {notice}
        </div>
      )}
      {cookieOpen && (
        <div className="cookie-shade">
          <section
            className="cookie-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Çerez tercihleri"
          >
            <div>
              <img src={asset("ets-logo.svg")} alt="etstur" />
              <h2>Çerez tercihlerin</h2>
              <p>
                Favorilerim için gerekli yerel depolamayı kullanıyoruz. Onay
                verirsen Meiro bu demonun kullanımını analiz eder; örneğin
                aramalar, otel görüntülemeleri ve simüle rezervasyonlar.
                Tercihini dilediğin zaman Çerez Ayarları’ndan değiştirebilirsin.
              </p>
              <button
                className="text-link"
                onClick={() => {
                  setCookieOpen(false);
                  setModal("privacy");
                }}
              >
                Gizlilik hakkında daha fazla bilgi
              </button>
            </div>
            <div className="cookie-actions">
              <button className="primary" onClick={() => chooseConsent(true)}>
                Tümünü Kabul Et
              </button>
              <button
                className="secondary"
                onClick={() => chooseConsent(false)}
              >
                Sadece Gerekli
              </button>
            </div>
          </section>
        </div>
      )}
      {modal && (
        <Modal
          title={
            {
              destination: "Nereye gitmek istersin?",
              origin: "Nereden yola çıkacaksın?",
              dates: "Tarih seç",
              travellers: "Kişi ve oda seçimi",
              filters: "Filtrele",
              gallery: hotel.name,
              account: "Hesabım",
              agency: "Acenteler",
              help: "Yardım",
              phone: "444 0 387",
              map: "Harita",
              privacy: "Bu demoda gizlilik",
              legal: "Bu demo hakkında",
              product: "Yakında",
              pricing: "Fiyat ve İndirimler",
              facilities: "Tesis özellikleri",
              menu: "Menü",
            }[modal] || "ETS"
          }
          onClose={() => setModal(null)}
          wide={["dates", "gallery", "map"].includes(modal)}
        >
          {modal === "destination" && (
            <>
              <label className="destination-input">
                <Icon name="search" />
                <input
                  autoFocus
                  placeholder="Bölge veya otel ara"
                  defaultValue=""
                  onChange={(e) => {
                    document
                      .querySelectorAll(".destination-option")
                      .forEach(
                        (el) =>
                          (el.hidden = !el.textContent
                            .toLocaleLowerCase("tr-TR")
                            .includes(
                              e.target.value.toLocaleLowerCase("tr-TR"),
                            )),
                      );
                  }}
                />
              </label>
              <p className="muted">Popüler bölgeler</p>
              {destinations.map((d) => (
                <button
                  className="destination-option"
                  key={d}
                  onClick={() => {
                    setDestination(d);
                    setModal(null);
                  }}
                >
                  <Icon name="pin" />
                  <span>
                    <strong>{d}</strong>
                    <small>{destinationInfo[d].province}</small>
                  </span>
                  <Icon name="chevron" size={18} />
                </button>
              ))}
              <p className="demo-note">
                Bodrum’da referans oteller, diğer bölgelerde birer demo tesis
                bulunur.
              </p>
            </>
          )}
          {modal === "origin" && (
            <div className="option-list">
              {origins.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setDeparture(a);
                    setModal(null);
                  }}
                >
                  <Icon name={travelType === "Otobüs + Otel" ? "bus" : "plane"} />
                  {a}
                  {departure === a && <Icon name="check" />}
                </button>
              ))}
            </div>
          )}
          {modal === "dates" && (
            <>
              <div className="two-grid date-inputs">
                <label>
                  Giriş Tarihi
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => {
                      setStart(e.target.value);
                      if (e.target.value >= end) {
                        const next = new Date(e.target.value);
                        next.setDate(next.getDate() + 7);
                        setEnd(next.toISOString().slice(0, 10));
                      }
                    }}
                    required
                  />
                </label>
                <label>
                  Çıkış Tarihi
                  <input
                    type="date"
                    min={start}
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="calendar-grid">
                {[0, 1].map((offset) => (
                  <Calendar
                    key={offset}
                    offset={offset}
                    start={start}
                    end={end}
                    onSelect={(value) => {
                      if (value <= start || start !== end) {
                        setStart(value);
                        setEnd(value);
                      } else setEnd(value);
                    }}
                  />
                ))}
              </div>
              <h3>Kaç gece kalmak istersin?</h3>
              <div className="duration-options">
                {[3, 5, 7, 10, 14].map((n) => (
                  <button
                    className={nights === n ? "selected" : ""}
                    key={n}
                    onClick={() => {
                      const d = new Date(start);
                      d.setDate(d.getDate() + n);
                      setEnd(d.toISOString().slice(0, 10));
                    }}
                  >
                    {n} Gece
                  </button>
                ))}
              </div>
              <button
                className="primary full"
                onClick={() => {
                  if (!start || !end || end <= start) {
                    setNotice("Lütfen giriş tarihinden sonra bir çıkış tarihi seç.");
                    return;
                  }
                  setModal(null);
                }}
              >
                Tarihleri Uygula
              </button>
            </>
          )}
          {modal === "travellers" && (
            <>
              <Counter
                label="Yetişkin"
                subtitle="12 yaş ve üzeri"
                value={adults}
                set={setAdults}
                min={1}
                max={6}
              />
              <Counter
                label="Çocuk"
                subtitle="0–11 yaş"
                value={children}
                set={setChildren}
                min={0}
                max={4}
              />
              <p className="muted">
                Bu demoda çocuklar yetişkin fiyatının %50’si ile hesaplanır. 1
                oda seçilidir.
              </p>
              <button className="primary full" onClick={() => setModal(null)}>
                Uygula
              </button>
            </>
          )}
          {modal === "filters" && (
            <>
              <FilterFields {...filterProps} />
              <button className="primary full" onClick={() => setModal(null)}>
                {results.length} tesisi göster
              </button>
            </>
          )}
          {modal === "gallery" && (
            <div className="lightbox">
              <img
                src={asset(hotel.gallery[gallery % hotel.gallery.length])}
                alt={`${hotel.name}, görsel ${gallery + 1}`}
              />
              <div>
                <button
                  aria-label="Önceki görsel"
                  className="secondary"
                  onClick={() =>
                    setGallery(
                      (gallery + hotel.gallery.length - 1) %
                        hotel.gallery.length,
                    )
                  }
                >
                  ‹
                </button>
                <span>
                  {(gallery % hotel.gallery.length) + 1} /{" "}
                  {hotel.gallery.length}
                </span>
                <button
                  aria-label="Sonraki görsel"
                  className="secondary"
                  onClick={() =>
                    setGallery((gallery + 1) % hotel.gallery.length)
                  }
                >
                  ›
                </button>
              </div>
              {hotel.synthetic && (
                <p className="muted">
                  Görsel bölgeyi temsil eder; kurgusal demo tesise ait değildir.
                </p>
              )}
            </div>
          )}
          {modal === "map" && (
            <>
              <img
                className="location-map"
                src={asset("map-strip.webp")}
                alt="Temsili harita"
              />
              <p>Harita temsilidir. İncelemek için bir tesis seç.</p>
              {hotels.map((h) => (
                <button
                  className="destination-option"
                  key={h.id}
                  onClick={() => openHotel(h, "Harita")}
                >
                  <Icon name="pin" />
                  <span>
                    {h.name}
                    <small>{h.location}</small>
                  </span>
                  <strong>{tl(listPrice(h))}</strong>
                </button>
              ))}
            </>
          )}
          {modal === "privacy" && (
            <>
              <p>
                Bu prototip Favorilerim listesini ve çerez tercihini yerel
                olarak tarayıcında saklar. Meiro Web SDK yalnızca onay
                verdiğinde yüklenir ve kullanım olaylarını ets-demo
                instance’ındaki “Etstur Web” kaynağına gönderir.
              </p>
              <p>
                Olaylar ziyaret edilen sayfaları, tatil seçimlerini, otel
                kimliklerini ve simüle rezervasyon tutarlarını içerir. Demo
                rezervasyon formundaki ad ve e-posta bilgileri saklanmaz ve
                olaylara eklenmez. Meiro teknik tarayıcı ve oturum
                tanımlayıcılarını işleyebilir.
              </p>
              <p>
                Güncel tercih:{" "}
                <strong>
                  {consent === "granted"
                    ? "Analiz izni verildi"
                    : "Sadece gerekli işlevler"}
                </strong>
              </p>
              <button
                className="secondary"
                onClick={() => {
                  setModal(null);
                  setCookieOpen(true);
                }}
              >
                Çerez Ayarları
              </button>
            </>
          )}
          {modal === "facilities" && (
            <div className="chips">
              {[...new Set([...hotel.chips, ...hotel.features, ...hotel.themes])].map(
                (c) => (
                  <span key={c}>{c}</span>
                ),
              )}
            </div>
          )}
          {[
            "legal",
            "account",
            "agency",
            "help",
            "phone",
            "product",
            "pricing",
          ].includes(modal) && (
            <>
              <p>
                {
                  {
                    account:
                      "Bu demoda gerçek üyelik veya giriş yoktur. Beğendiğin oteller Favorilerim’de, demo rezervasyonların Rezervasyonlarım’da saklanır.",
                    agency:
                      "Acente başvuruları bu prototipte simüle edilmez. Otel arama ve rezervasyon akışını kendin deneyebilirsin.",
                    help: "Yardım merkezi bu demoda yer almaz. Sorularını demo sunucusuna iletebilirsin.",
                    phone:
                      "Bu demo üzerinden çağrı merkezi araması yapılmaz. Gerçek ETS iletişim kanallarını kullanmak için resmi siteyi ziyaret et.",
                    product:
                      "Bu prototip otel konaklamalarına odaklanır. Tur, villa, uçak ve diğer ürünler demo kapsamında değildir.",
                    pricing:
                      "Fiyatlar seçtiğin kişi sayısı ve gece için toplam konaklama tutarıdır. Bu demoda tüm fiyatlar örnek niteliğindedir; fiyat farkı iadesi uygulanmaz.",
                    legal:
                      "Bu, bağımsız ve rezervasyon alınamayan bir demo prototipidir. ETS markası, görseller ve tasarım yalnızca talep edilen demo için referans olarak kullanılır. ETS rezervasyon sistemleriyle canlı bağlantı yoktur.",
                  }[modal]
                }
              </p>
              <button
                className="primary"
                onClick={() =>
                  modal === "account" ? go("/favorilerim") : search()
                }
              >
                {modal === "account" ? "Favorilerim’e Git" : "Otelleri Keşfet"}
              </button>
            </>
          )}
          {modal === "menu" && (
            <div className="option-list">
              {navItems.map(([label, fn]) => (
                <button key={label} onClick={fn}>
                  {label}
                  <Icon name="chevron" />
                </button>
              ))}
              <button onClick={() => go("/favorilerim")}>
                Favorilerim{saved.length ? ` (${saved.length})` : ""}
                <Icon name="chevron" />
              </button>
              <button onClick={() => go("/rezervasyonlarim")}>
                Rezervasyonlarım
                <Icon name="chevron" />
              </button>
              <button onClick={() => setModal("account")}>
                Hesabım
                <Icon name="chevron" />
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

function Counter({ label, subtitle, value, set, min, max }) {
  return (
    <div className="counter">
      <div>
        <strong>{label}</strong>
        <small>{subtitle}</small>
      </div>
      <div>
        <button
          aria-label={`${label} azalt`}
          disabled={value <= min}
          onClick={() => set(value - 1)}
        >
          −
        </button>
        <strong>{value}</strong>
        <button
          aria-label={`${label} artır`}
          disabled={value >= max}
          onClick={() => set(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <details className="filter-group" open>
      <summary>{title}</summary>
      {children}
    </details>
  );
}

function FilterFields({
  inDestination,
  popular,
  setPopular,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  minScore,
  setMinScore,
  boardFilter,
  setBoardFilter,
  themeFilter,
  setThemeFilter,
  destination,
  search,
  onChange,
}) {
  const toggle = (list, set, value, name) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    onChange(name);
  };
  const count = (fn) => inDestination.filter(fn).length;
  return (
    <div className="filter-fields">
      <FilterGroup title="Popüler Filtreler">
        {[
          ["Ultra Her Şey Dahil", (h) => h.board === "Ultra Her Şey Dahil"],
          ["9 ve üstü", (h) => h.score >= 9],
          ["Denize Sıfır", (h) => h.themes.includes("Denize Sıfır")],
          ["Çocuk Dostu", (h) => h.family],
        ].map(([label, fn]) => (
          <label className="checkbox" key={label}>
            <input
              type="checkbox"
              checked={popular.includes(label)}
              onChange={() => toggle(popular, setPopular, label, "popular")}
            />
            <span>{label}</span>
            <small>({count(fn)})</small>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Fiyat Aralığı">
        <div className="price-range">
          <label>
            <span className="sr-only">En düşük fiyat</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Min. TL"
              aria-label="En düşük fiyat"
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value);
                onChange("price");
              }}
            />
          </label>
          <label>
            <span className="sr-only">En yüksek fiyat</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Maks. TL"
              aria-label="En yüksek fiyat"
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value);
                onChange("price");
              }}
            />
          </label>
        </div>
      </FilterGroup>
      <FilterGroup title="Misafir Puanı">
        <div className="score-filter">
          {[
            [9, "Mükemmel"],
            [8, "Çok İyi"],
            [7, "İyi"],
            [6, "Orta"],
          ].map(([n, label]) => (
            <button
              key={n}
              type="button"
              aria-pressed={minScore === n}
              className={minScore === n ? "active" : ""}
              onClick={() => {
                setMinScore(minScore === n ? 0 : n);
                onChange("score");
              }}
            >
              <b>{n}+</b> {label}
              <small>({count((h) => h.score >= n)})</small>
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Konaklama Tipi">
        {boards.map((b) => (
          <label className="checkbox" key={b}>
            <input
              type="checkbox"
              checked={boardFilter.includes(b)}
              onChange={() => toggle(boardFilter, setBoardFilter, b, "board")}
            />
            <span>{b}</span>
            <small>({count((h) => h.board === b)})</small>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Bölge">
        <p className="muted">Popüler Bölgeler</p>
        <div className="region-chips">
          {destinations.map((d) => (
            <button
              type="button"
              key={d}
              className={d === destination ? "active" : ""}
              aria-pressed={d === destination}
              onClick={() => search(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Temalar">
        {themes.map((t) => (
          <label className="checkbox" key={t}>
            <input
              type="checkbox"
              checked={themeFilter.includes(t)}
              onChange={() => toggle(themeFilter, setThemeFilter, t, "theme")}
            />
            <span>{t}</span>
            <small>({count((h) => h.themes.includes(t))})</small>
          </label>
        ))}
      </FilterGroup>
    </div>
  );
}

function Calendar({ offset, start, end, onSelect }) {
  const base = new Date(start + "T12:00:00");
  const year = base.getFullYear(),
    month = base.getMonth() + offset;
  const first = new Date(year, month, 1),
    days = new Date(year, month + 1, 0).getDate(),
    skip = (first.getDay() + 6) % 7;
  return (
    <div className="calendar">
      <h3>
        {first.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
      </h3>
      <div>
        {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) => (
          <small key={d}>{d}</small>
        ))}
        {Array.from({ length: skip }, (_, i) => (
          <span key={"b" + i} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = new Date(year, month, i + 1);
          const v = [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(i + 1).padStart(2, "0"),
          ].join("-");
          return (
            <button
              aria-label={longDate(v)}
              key={v}
              className={
                v === start || v === end
                  ? "edge "
                  : v > start && v < end
                    ? "range"
                    : ""
              }
              onClick={() => onSelect(v)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
