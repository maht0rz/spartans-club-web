/** @jsxImportSource react */
"use client";
import "./globals.css";
import "animate.css/animate.min.css";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import I18nProvider from "../components/I18nProvider";
import LanguageSelector from "../components/LanguageSelector";
import Analytics from "../components/Analytics";
import CookieConsent from "../components/CookieConsent";
import SectionAnalytics from "../components/SectionAnalytics";
import { gaEvent } from "../lib/ga";
import { ensureI18n } from "../lib/i18n";
import Container from "../components/Container";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [active, setActive] = React.useState<"top" | "way-of-life" | "sessions" | "testimonials" | "private-coaching" | "gallery" | "contact" | "about" 
  | "shop">("top");
  const [isDark, setIsDark] = React.useState(false);
  const [splashVisible, setSplashVisible] = React.useState(false);
  const [splashIn, setSplashIn] = React.useState(false);
  const [splashOut, setSplashOut] = React.useState(false);
  const pendingSectionIdRef = React.useRef<typeof active | null>(null);
  const urlDebounceRef = React.useRef<number | null>(null);
  const [isOnline, setIsOnline] = React.useState<boolean>(false);
  const [isOnlineReady, setIsOnlineReady] = React.useState<boolean>(false);
  const [isAway, setIsAway] = React.useState<boolean>(false);

  // SEO constants (client-safe NEXT_PUBLIC envs are inlined at build time)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = "Spartans Muay Thai Bratislava | Deti, Dospelí, VIP & Súkromné tréningy";
  const description =
    "Trénujte Muay Thai v Bratislave s hlavným inštruktorom Vincentom Kolekom (viac ako 30 rokov skúseností). VIP ranné tréningy, detské hodiny, klubové tréningy a súkromné lekcie. Bezplatné parkovanie, moderná telocvičňa a podporná komunita.";
  const ogImage = siteUrl ? `${siteUrl}/logo-large.png` : "/logo-large.png";
  const logo = siteUrl ? `${siteUrl}/logo.png` : "/logo.png";
  const telephone = "+421 911 712 109";
  const email = "spartans@spartans.sk";
  const address = {
    streetAddress: "Mlynské nivy 54",
    postalCode: "821 09",
    addressLocality: "Ružinov, Bratislava",
    addressCountry: "SK",
  };
  const sameAs = [
    "https://instagram.com/spartansclubbratislava",
    "https://facebook.com/spartansclub.sk",
    "https://www.tiktok.com/@spartansclubbratislava",
  ];
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Spartans Club Bratislava",
    url: siteUrl || undefined,
    image: ogImage,
    telephone,
    email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      postalCode: address.postalCode,
      addressLocality: address.addressLocality,
      addressCountry: address.addressCountry,
    },
    sameAs,
    areaServed: "Bratislava",
  };
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spartans Club Bratislava",
    url: siteUrl || undefined,
    logo,
    sameAs,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Potrebujem predchádzajúce skúsenosti?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Skúsenosti nie sú potrebné. Začiatočníci sú vítaní. Tréningy prispôsobujeme vašej úrovni a zameriavame sa najskôr na základy.",
        },
      },
      {
        "@type": "Question",
        name: "Ako často by som mal tréningy absolvovať?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "2–3 tréningy týždenne sú ideálne na začiatok. Ako sa vaša technika a kondícia zlepšujú, niektorí športovci trénujú 4–5× týždenne.",
        },
      },
      {
        "@type": "Question",
        name: "Je Muay Thai bezpečné?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bezpečnosť je prioritou. Dbáme na správnu techniku, kontrolované cvičenia, vhodné ochranné pomôcky a postupné zvyšovanie intenzity.",
        },
      },
    ],
  };

  // Breadcrumbs schema based on current path
  const pathToBreadcrumbs: Record<string, Array<{ name: string; url: string }>> = {
    "/": [{ name: "Domov", url: siteUrl || "/" }],
    "/sessions": [
      { name: "Domov", url: siteUrl || "/" },
      { name: "Rozvrh", url: (siteUrl || "") + "/sessions" },
    ],
    "/way-of-life": [
      { name: "Domov", url: siteUrl || "/" },
      { name: "Way Of Life", url: (siteUrl || "") + "/way-of-life" },
    ],
    "/testimonials": [
      { name: "Domov", url: siteUrl || "/" },
      { name: "Referencie", url: (siteUrl || "") + "/testimonials" },
    ],
    "/private-coaching": [
      { name: "Domov", url: siteUrl || "/" },
      { name: "Súkromné tréningy", url: (siteUrl || "") + "/private-coaching" },
    ],
    "/about": [
      { name: "Domov", url: siteUrl || "/" },
      { name: "O nás", url: (siteUrl || "") + "/about" },
    ],
    "/gallery": [
      { name: "Domov", url: siteUrl || "/" },
      { name: "Galéria", url: (siteUrl || "") + "/gallery" },
    ],
  };
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const breadcrumbsLd =
    pathToBreadcrumbs[currentPath] &&
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: pathToBreadcrumbs[currentPath].map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    };

  React.useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const map: Record<string, typeof active> = {
      "/": "top",
      "/sessions": "sessions",
      "/way-of-life": "way-of-life",
      "/testimonials": "testimonials",
      "/private-coaching": "private-coaching",
      "/about": "about",
      "/gallery": "gallery",
    };
    setActive(map[path] ?? "top");
    const onPop = () => {
      const p = window.location.pathname;
      setActive(map[p] ?? "top");
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // Reveal-on-view observer (fadeInUp by default)
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    // Section-based observer: when a section is visible, reveal all children marked with data-reveal
    const revealSections = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-section]"));
    const sectionObs =
      revealSections.length > 0
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const section = e.target as HTMLElement;
                const items = Array.from(section.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed='1'])"));
                items.forEach((el) => {
                  const direction = el.dataset.reveal || "up";
                  const delay = el.dataset.revealDelay || "";
                  if (delay) {
                    el.style.animationDelay = delay;
                  }
                  const anim =
                    direction === "up"
                      ? "animate__fadeInUp"
                      : direction === "down"
                      ? "animate__fadeInDown"
                      : "animate__fadeIn";
                  el.classList.add("animate__animated", anim, "animate__fast");
                  el.style.opacity = "1";
                  el.dataset.revealed = "1";
                });
                sectionObs?.unobserve(section);
              });
            },
            { root: null, rootMargin: "0px 0px 10% 0px", threshold: 0.1 }
          )
        : null;
    revealSections.forEach((sec) => sectionObs?.observe(sec));

    // Fallback: individually reveal standalone elements not inside a section
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed='1'])"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const direction = el.dataset.reveal || "up";
            const delay = el.dataset.revealDelay || "";
            if (delay) {
              el.style.animationDelay = delay;
            }
            const anim = direction === "up" ? "animate__fadeInUp" : direction === "down" ? "animate__fadeInDown" : "animate__fadeIn";
            el.classList.add("animate__animated", anim, "animate__fast");
            el.style.opacity = "1";
            el.dataset.revealed = "1";
            obs.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: "0px 0px 10% 0px", threshold: 0.1 }
    );
    // Only observe those not in a reveal-section
    revealEls
      .filter((el) => !el.closest("[data-reveal-section]"))
      .forEach((el) => obs.observe(el));
    return () => {
      obs.disconnect();
      sectionObs?.disconnect();
    };
  }, []);

  

  // Initialize theme from storage or system preference
  React.useEffect(() => {
    try {
      // const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      // const prefersDark =
      //   typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      // const dark = stored ? stored === "dark" : prefersDark;
      // setIsDark(dark);
      // if (typeof document !== "undefined") {
      //   document.documentElement.classList.toggle("dark", dark);
      // }
    } catch {
      // noop
    }
    // Splash sequence: animate in, brief hold, then out; total < 3s
    requestAnimationFrame(() => setSplashIn(true));
    const outT = setTimeout(() => setSplashOut(true), 1200);
    const hideT = setTimeout(() => setSplashVisible(false), 2000);
    return () => {
      clearTimeout(outT);
      clearTimeout(hideT);
    };
  }, []);

  // Compute availability
  React.useEffect(() => {
    function computeOnline() {
      const now = new Date();
      const day = now.getDay(); // 0 Sun ... 6 Sat
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const total = hour * 60 + minutes;
      const isWeekday = day >= 1 && day <= 5;
      // Active phone hours: Mon–Fri 09:00–19:00
      let withinActiveHours = isWeekday && total >= (9 * 60) && total < (19 * 60);
      // Training windows (Mon/Wed/Fri): 07:00–09:00, 16:00–17:00, 18:30–19:30
      const isMWF = day === 1 || day === 3 || day === 5;
      const inMorning = total >= (7 * 60) && total < (9 * 60);
      const inAfternoon = total >= (16 * 60) && total < (17 * 60);
      const inEvening = total >= (18 * 60 + 30) && total < (19 * 60 + 30);
      let trainingNow = isMWF && (inMorning || inAfternoon || inEvening);

      // Online only when within active hours and not training
      setIsOnline(withinActiveHours && !trainingNow);
      // // Away when training windows hit (regardless of active hours)
      setIsAway(trainingNow);
      setIsOnlineReady(true);
    }
    computeOnline();
    const id = window.setInterval(computeOnline, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  function toggleDarkMode() {
    const next = !isDark;
    setIsDark(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next);
    }
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // noop
    }
  }

  const pathname = usePathname();
  const _parts = (pathname || "/").split("/").filter(Boolean);
  const _first = _parts[0];
  const currentLocale = (_first === "en" ? "en" : "sk") as "sk" | "en";
  const prefix = currentLocale === "en" ? "/en" : "/sk";
  const slugsEn: Record<"top" | "sessions" | "way-of-life" | "testimonials" | "private-coaching" | "about" | "gallery", string> = {
    top: "",
    sessions: "sessions",
    "way-of-life": "way-of-life",
    testimonials: "testimonials",
    "private-coaching": "private-coaching",
    about: "about",
    gallery: "gallery",
  };
  const slugsSk: Record<"top" | "sessions" | "way-of-life" | "testimonials" | "private-coaching" | "about" | "gallery", string> = {
    top: "",
    sessions: "rozvrh",
    "way-of-life": "way-of-life",
    testimonials: "referencie",
    "private-coaching": "treneri",
    about: "o-nas",
    gallery: "galeria",
  };
  const slugs = currentLocale === "en" ? slugsEn : slugsSk;
  const navItems: Array<{ id: "top" | "way-of-life" | "sessions" | "testimonials" | "private-coaching" | "gallery" | "contact" | "about" | "shop"; labelKey: string; href: string, target?: string }> = [
    { id: "top", labelKey: "nav.home", href: `${prefix}/` },
    { id: "sessions", labelKey: "nav.sessions", href: `${prefix}/${slugs.sessions}` },
    { id: "way-of-life", labelKey: "nav.wayoflife", href: `${prefix}/${slugs["way-of-life"]}` },
    { id: "testimonials", labelKey: "nav.testimonials", href: `${prefix}/${slugs.testimonials}` },
    { id: "private-coaching", labelKey: "nav.private", href: `${prefix}/${slugs["private-coaching"]}` },
    { id: "about", labelKey: "nav.about", href: `${prefix}/${slugs.about}` },
    { id: "gallery", labelKey: "nav.gallery", href: `${prefix}/${slugs.gallery}` },
    // { id: "shop", labelKey: "nav.shop", href: "https://shop.spartans.sk", target: "_blank" },
  ];

  // Sync URL to section on scroll (smoothly update path without jumping)
  React.useEffect(() => {
    const ids: Array<"top" | "way-of-life" | "sessions" | "testimonials" | "private-coaching" | "about" | "gallery"> = [
      "top",
      "way-of-life",
      "sessions",
      "testimonials",
      "private-coaching",
      "about",
      "gallery",
    ];
    const idToPath = new Map<string, string>(navItems.map((n) => [n.id, n.href]));
    function computeAndSync() {
      const headerEl = document.querySelector("header");
      const headerH = headerEl instanceof HTMLElement ? headerEl.offsetHeight : 0;
      let nearestId: typeof active = "top";
      let nearestDist = Number.POSITIVE_INFINITY;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - headerH);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestId = id;
        }
      });
      // Update visual active section immediately, but delay URL mutation until scrolling stops
      pendingSectionIdRef.current = nearestId;
      if (active !== nearestId) {
        setActive(nearestId);
      }
    }
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          computeAndSync();
          ticking = false;
        });
        ticking = true;
      }
      // Re-schedule URL commit after user stops scrolling
      if (urlDebounceRef.current) {
        clearTimeout(urlDebounceRef.current);
      }
      urlDebounceRef.current = window.setTimeout(() => {
        const id = pendingSectionIdRef.current || "top";
        const desiredPath = idToPath.get(id) || "/";
        if (window.location.pathname !== desiredPath) {
          window.history.replaceState(null, "", desiredPath);
        }
        // Ensure active aligns with committed section
        if (active !== id) setActive(id);
        urlDebounceRef.current = null;
      }, 360);
    };
    computeAndSync();
    // Initial commit timer
    if (urlDebounceRef.current) {
      clearTimeout(urlDebounceRef.current);
    }
    urlDebounceRef.current = window.setTimeout(() => {
      const id = pendingSectionIdRef.current || "top";
      const desiredPath = idToPath.get(id) || "/";
      if (window.location.pathname !== desiredPath) {
        window.history.replaceState(null, "", desiredPath);
      }
      if (active !== id) setActive(id);
      urlDebounceRef.current = null;
    }, 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (urlDebounceRef.current) {
        clearTimeout(urlDebounceRef.current);
      }
    };
  }, [prefix, active]);

  // Update active menu when route changes (respects locale prefix and localized slugs)
  React.useEffect(() => {
    const parts = (pathname || "/").split("/").filter(Boolean);
    const idx = parts[0] === "sk" || parts[0] === "en" ? 1 : 0;
    const section = parts[idx] || "";
    const mapEn: Record<string, typeof active> = {
      "": "top",
      "sessions": "sessions",
      "way-of-life": "way-of-life",
      "testimonials": "testimonials",
      "private-coaching": "private-coaching",
      "about": "about",
      "gallery": "gallery",
    };
    const mapSk: Record<string, typeof active> = {
      "": "top",
      "rozvrh": "sessions",
      "way-of-life": "way-of-life",
      "referencie": "testimonials",
      "treneri": "private-coaching",
      "o-nas": "about",
      "galeria": "gallery",
    };
    const map = currentLocale === "en" ? mapEn : mapSk;
    setActive(map[section] ?? "top");
  }, [pathname]);
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="MVWRCAtl0E1o_XE1ovOw7MNmUcdgRiNb2usuYN7CP-8" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <meta name="theme-color" content="#000000" />
      {siteUrl ? <link rel="canonical" href={siteUrl} /> : null}
      <link rel="icon" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Spartans Club Bratislava" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {siteUrl ? <meta property="og:url" content={siteUrl} /> : null}
      <meta property="og:locale" content="sk_SK" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="preload" as="image" href="/logo.png" />
      <link rel="preload" as="font" href="/fonts/Goodland Bold.otf" type="font/otf" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://maps.google.com" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {breadcrumbsLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      ) : null}
      </head>
      <body>
        {/* Splash screen */}
        {/* <div className={`fixed inset-0 z-[2000] flex items-center justify-center bg-white dark:bg-black transition-opacity duration-[800ms] ease-out ${splashOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <img
            src="/logo.png"
            alt="Spartans logo"
            className={`transition-transform transition-opacity duration-[800ms] ease-in-out ${
              splashIn && !splashOut ? "opacity-100 scale-[1.15]" : splashOut ? "opacity-0 scale-[1.6]" : "opacity-0 scale-90"
            } w-[70vmin] max-w-[92vw] drop-shadow-xl`}
          />
        </div> */}
        <I18nProvider>
          <header className="fixed top-0 left-0 right-0 z-[999] backdrop-saturate-150 backdrop-blur bg-white/90 dark:bg-black/60 animate__animated animate__fadeInDown animate_slow md:animate__delay-[300ms]">
            <Container className="flex items-center justify-between w-full">
              <div className="flex items-center justify-between gap-4 md:gap-6 py-3">
                <div className="flex items-center gap-1.5">
                  <img src="/logo.svg" alt="Spartans Muay Thai logo" className="w-16 object-cover h-16 aspect-square" />
                  <span className="text-[36px] font-display font-extrabold font-goodland tracking-tight uppercase">
                    SPARTANS
                  </span>
                </div>
                
              </div>
                <nav className="hidden lg:flex items-center gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      scroll={false}
                      className={`text-md px-3 py-2 rounded-md hover:text-primary ${
                        active === item.id ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => {
                        if (!item.target) setActive(item.id);
                        if (item.id === "top") {
                          try {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } catch {}
                        }
                      }}
                      target={item.target ?? undefined}
                    >
                      {ensureI18n().t(item.labelKey)}
                    </Link>
                  ))}
                </nav>
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2">
                  <a
                    href="https://instagram.com/spartansclubbratislava"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:border-black/20 dark:hover:border-white/20 transition-colors text-foreground/70 hover:text-foreground"
                    onClick={() =>
                      gaEvent("social_click", {
                        platform: "instagram",
                        location: "navbar_desktop",
                        link_url: "https://instagram.com/spartansclubbratislava",
                      })
                    }
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com/spartansclub.sk"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:border-black/20 dark:hover:border-white/20 transition-colors text-foreground/70 hover:text-foreground"
                    onClick={() =>
                      gaEvent("social_click", {
                        platform: "facebook",
                        location: "navbar_desktop",
                        link_url: "https://facebook.com/spartansclub.sk",
                      })
                    }
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M14.5 8H16V5h-1.5C12.57 5 11 6.57 11 8.5V10H9v3h2v6h3v-6h2.1l.4-3H14v-1.5c0-.28.22-.5.5-.5Z" fill="currentColor"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@spartansclubbratislava"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:border-black/20 dark:hover:border-white/20 transition-colors text-foreground/70 hover:text-foreground"
                    onClick={() =>
                      gaEvent("social_click", {
                        platform: "tiktok",
                        location: "navbar_desktop",
                        link_url: "https://www.tiktok.com/@spartansclubbratislava",
                      })
                    }
                  >
                    <svg width="18" height="18" viewBox="0 0 256 256" aria-hidden="true">
                      <path fill="currentColor" d="M152 24h28c7 19 22 34 41 41v28c-16-1-31-5-45-13v75a76 76 0 1 1-76-76c6 0 12 .7 18 2v28c-5-2-11-3-17-3a48 48 0 1 0 48 48V24Z"/>
                    </svg>
                  </a>
                </div>
                <div className="hidden lg:block">
                  <LanguageSelector />
                </div>
                {/* <button
                  type="button"
                  onClick={toggleDarkMode}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  aria-pressed={isDark}
                  className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-md border border-black/10 bg-white shadow-sm dark:bg-black dark:border-white/10"
                  title={isDark ? "Light mode" : "Dark mode"}
                >
                  {isDark ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button> */}
                <button
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-black/10 bg-white shadow-sm"
                  type="button"
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  {mobileOpen ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
            </Container>
            {mobileOpen && (
              <div className="lg:hidden px-4 pb-4">
                <div className="rounded-lg border border-black/10 bg-white shadow-lg p-2">
                  <nav className="flex flex-col">
                    {navItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        scroll={false}
                        className={`px-3 py-2 rounded-md ${
                          active === item.id ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                        }`}
                        onClick={() => {
                          setActive(item.id);
                          setMobileOpen(false);
                          if (item.id === "top") {
                            try {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            } catch {}
                          }
                        }}
                      >
                        {ensureI18n().t(item.labelKey)}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href="https://instagram.com/spartansclubbratislava"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:border-black/20 transition-colors text-foreground/70 hover:text-foreground"
                      onClick={() =>
                        gaEvent("social_click", {
                          platform: "instagram",
                          location: "navbar_mobile",
                          link_url: "https://instagram.com/spartansclubbratislava",
                        })
                      }
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com/spartansclubbratislava"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:border-black/20 transition-colors text-foreground/70 hover:text-foreground"
                      onClick={() =>
                        gaEvent("social_click", {
                          platform: "facebook",
                          location: "navbar_mobile",
                          link_url: "https://facebook.com/spartansclubbratislava",
                        })
                      }
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M14.5 8H16V5h-1.5C12.57 5 11 6.57 11 8.5V10H9v3h2v6h3v-6h2.1l.4-3H14v-1.5c0-.28.22-.5.5-.5Z" fill="currentColor"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.tiktok.com/@spartansclubbratislava"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="TikTok"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:border-black/20 transition-colors text-foreground/70 hover:text-foreground"
                      onClick={() =>
                        gaEvent("social_click", {
                          platform: "tiktok",
                          location: "navbar_mobile",
                          link_url: "https://www.tiktok.com/@spartansclubbratislava",
                        })
                      }
                    >
                      <svg width="18" height="18" viewBox="0 0 256 256" aria-hidden="true">
                        <path fill="currentColor" d="M152 24h28c7 19 22 34 41 41v28c-16-1-31-5-45-13v75a76 76 0 1 1-76-76c6 0 12 .7 18 2v28c-5-2-11-3-17-3a48 48 0 1 0 48 48V24Z"/>
                      </svg>
                    </a>
                    <LanguageSelector />
                    {/* <button
                      type="button"
                      onClick={toggleDarkMode}
                      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                      aria-pressed={isDark}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-black/10 bg-white shadow-sm"
                    >
                      {isDark ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button> */}
                  </div>
                </div>
              </div>
            )}
          </header>
          {/* Spacer to offset fixed header height */}
          <div aria-hidden className="h-[68px] md:h-[76px]"></div>
          {children}
          {/* Floating help button with helper bubble */}
          {isOnlineReady && (
            <a
              href={`${isAway ? "sms" : (isOnline ? "tel" : "sms")}:${ensureI18n().t("about.phone")}`}
              className="fixed bottom-4 right-4 z-[90] flex items-end gap-3 animate__animated animate__bounceInUp animate__delay-1s"
              aria-label={isAway ? "Message head coach (away)" : (isOnline ? "Call head coach" : "Message head coach")}
              onClick={() =>
                gaEvent("cta_click", {
                  cta_name: isAway ? "message_head_coach" : (isOnline ? "call_head_coach" : "message_head_coach"),
                  location: "floating_button",
                  link_url: `${isAway ? "sms" : (isOnline ? "tel" : "sms")}:${ensureI18n().t("about.phone")}`,
                })
              }
            >
              <div className="flex items-center gap-3 max-w-[320px] bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-lg rounded-2xl px-3.5 py-2.5">
                <span className="relative inline-flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-black/5 text-muted-foreground border border-black/10">
                  <span
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${isOnline ? "bg-emerald-500" : isAway ? "bg-amber-400" : "bg-gray-400"}`}
                    aria-hidden="true"
                  />
                  {isOnline ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.11 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.67-1.2a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 16a3 3 0 0 1-3 3H9l-4 3v-3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <div className="text-[14px] md:text-[15px] leading-snug text-foreground">
                  {isOnline
                    ? ensureI18n().t("help.online")
                    : (isAway ? ensureI18n().t("help.away") : ensureI18n().t("help.offline"))}
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-lg transition">
                <img src="/vincent.png" alt="Call Vincent" className="w-full h-full object-cover object-center call-vincent" />
              </span>
            </a>
          )}
          {/* <footer className="mt-14 border-t border-black/10 text-muted-foreground">
            <Container className="py-6 text-[13px] 2xl:max-w-[1440px]">
              © {new Date().getFullYear()} Spartans Muay Thai. {ensureI18n().t("footer.copy")}
            </Container>
          </footer> */}
        </I18nProvider>
        <Analytics />
        <CookieConsent />
        <SectionAnalytics />
      </body>
    </html>
  );
}

