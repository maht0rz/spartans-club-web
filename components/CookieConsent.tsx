"use client";
import React from "react";
import { ensureI18n } from "../lib/i18n";

function getConsent(): "granted" | "denied" | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("ga_consent="));
  if (!m) return null;
  const v = m.split("=")[1] || "";
  return v === "granted" ? "granted" : v === "denied" ? "denied" : null;
}

export default function CookieConsent() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const existing = getConsent();
    // If consent is not explicitly granted, immediately erase GA cookies on load
    if (existing !== "granted") {
      eraseGaCookies();
      try {
        window.dispatchEvent(new Event("ga-consent"));
      } catch {
        // ignore
      }
    }
    setVisible(existing === null);
  }, []);

  function deleteCookie(name: string) {
    try {
      const domain = window.location.hostname;
      const past = "Thu, 01 Jan 1970 00:00:00 GMT";
      // Current path
      document.cookie = `${name}=; expires=${past}; path=/`;
      // Explicit domain
      document.cookie = `${name}=; expires=${past}; path=/; domain=${domain}`;
      // Dot domain (covers subdomains)
      document.cookie = `${name}=; expires=${past}; path=/; domain=.${domain}`;
    } catch {
      // ignore
    }
  }

  function eraseGaCookies() {
    try {
      const all = document.cookie.split(";").map((c) => c.trim());
      const names = all.map((c) => c.split("=")[0]);
      const toDelete = new Set<string>();
      names.forEach((n) => {
        const lower = n.toLowerCase();
        if (
          lower === "_ga" ||
          lower.startsWith("_ga_") ||
          lower === "_gid" ||
          lower === "_gat" ||
          lower.startsWith("_gat_") ||
          lower.startsWith("_gac_") ||
          lower.startsWith("_gcl_")
        ) {
          toDelete.add(n);
        }
      });
      // Also delete our consent cookies if any legacy keys exist
      ["ga_consent"].forEach((n) => toDelete.add(n));
      toDelete.forEach((n) => deleteCookie(n));
    } catch {
      // ignore
    }
  }

  function setConsent(value: "granted" | "denied") {
    try {
      document.cookie = `ga_consent=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
      window.dispatchEvent(new Event("ga-consent"));
    } catch {
      // ignore
    }
    if (value === "denied") {
      eraseGaCookies();
    }
    setVisible(false);
  }

  if (!visible) return null;
  const t = ensureI18n().t;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999]">
      <div className="mx-auto max-w-[1040px] rounded-t-2xl border border-black/15 bg-white shadow-2xl drop-shadow-xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="text-[15px] md:text-base leading-relaxed text-foreground/90">
            {t("consent.text", "We use cookies for analytics to improve our site. You can accept or decline analytics cookies.")}
          </div>
          <div className="md:ml-auto flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm shadow-md hover:shadow-lg transition-shadow"
              onClick={() => setConsent("granted")}
            >
              {t("consent.accept", "Accept")}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-black/20 bg-white text-sm hover:border-black/30 transition-colors"
              onClick={() => setConsent("denied")}
            >
              {t("consent.decline", "Decline")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


