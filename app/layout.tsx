"use client";
import "./globals.css";
import React from "react";
import I18nProvider from "../components/I18nProvider";
import LanguageSelector from "../components/LanguageSelector";
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

  React.useEffect(() => {
    const ids: Array<"top" | "way-of-life" | "sessions" | "testimonials" | "private-coaching" | "about" | "gallery"> = ["top", "way-of-life", "sessions", "testimonials", "private-coaching", "about", "gallery"];
    function computeActive() {
      const headerEl = document.querySelector("header");
      const headerH = headerEl instanceof HTMLElement ? headerEl.offsetHeight : 0;
      let nearestId: "top" | "way-of-life" | "sessions" | "testimonials" | "private-coaching" | "about" | "gallery" = "top";
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
      setActive(nearestId);
    }
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          computeActive();
          ticking = false;
        });
        ticking = true;
      }
    };
    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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

  const navItems: Array<{ id: "top" | "way-of-life" | "sessions" | "testimonials" | "private-coaching" | "gallery" | "contact" | "about" | "shop"; labelKey: string; href: string, target?: string }> = [
    { id: "top", labelKey: "nav.home", href: "#top" },
    { id: "sessions", labelKey: "nav.sessions", href: "#sessions" },
    { id: "way-of-life", labelKey: "nav.wayoflife", href: "#way-of-life" },
    { id: "testimonials", labelKey: "nav.testimonials", href: "#testimonials" },
    { id: "private-coaching", labelKey: "nav.private", href: "#private-coaching" },
    { id: "about", labelKey: "nav.about", href: "#about" },
    { id: "gallery", labelKey: "nav.gallery", href: "#gallery" },
    // { id: "shop", labelKey: "nav.shop", href: "https://shop.spartans.sk", target: "_blank" },
  ];

  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="6BudQ4yOWOQzLJyUGI98HPtaQJz1ohCxLY8NEnHBfJc" />
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
          <header className="fixed top-0 left-0 right-0 z-[999] backdrop-saturate-150 backdrop-blur bg-white/90 dark:bg-black/60">
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
                    <a
                      key={item.id}
                      href={item.href}
                      className={`text-md px-3 py-2 rounded-md hover:text-primary ${
                        active === item.id ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => !item.target && setActive(item.id)}
                      target={item.target ?? undefined}
                    >
                      {ensureI18n().t(item.labelKey)}
                    </a>
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
                      <a
                        key={item.id}
                        href={item.href}
                        className={`px-3 py-2 rounded-md ${
                          active === item.id ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                        }`}
                        onClick={() => {
                          setActive(item.id);
                          setMobileOpen(false);
                        }}
                      >
                        {ensureI18n().t(item.labelKey)}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href="https://instagram.com/spartansclubbratislava"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:border-black/20 transition-colors text-foreground/70 hover:text-foreground"
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
          {/* Floating call button with helper bubble */}
          <a
            href={`tel:${ensureI18n().t("about.phone")}`}
            className="fixed bottom-4 right-4 z-[90] flex items-end gap-3"
            aria-label="Call head coach"
          >
            <div className="flex items-center gap-2 max-w-[280px] bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-md rounded-2xl px-3 py-2">
              <span className="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-black/5 text-muted-foreground border border-black/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.11 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.67-1.2a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className="text-[13px] leading-snug text-foreground">
                {ensureI18n().t("help.prompt")}
              </div>
            </div>
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-lg hover:scale-105 transition">
              <img src="/vincent.png" alt="Call Vincent" className="w-full h-full object-cover object-center scale-125" />
            </span>
          </a>
          {/* <footer className="mt-14 border-t border-black/10 text-muted-foreground">
            <Container className="py-6 text-[13px] 2xl:max-w-[1440px]">
              © {new Date().getFullYear()} Spartans Muay Thai. {ensureI18n().t("footer.copy")}
            </Container>
          </footer> */}
        </I18nProvider>
      </body>
    </html>
  );
}

