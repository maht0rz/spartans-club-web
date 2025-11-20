"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../lib/i18n";

const languages: Array<{ code: "sk" | "en"; label: string; flag: string }> = [
  { code: "sk", label: "SK", flag: "🇸🇰" },
  { code: "en", label: "EN", flag: "🇬🇧" }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const current = languages.find((l) => l.code === (i18n.language as "sk" | "en")) ?? languages[0];
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!btnRef.current || !menuRef.current) return;
      if (btnRef.current.contains(target) || menuRef.current.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-transparent px-3 py-2 text-sm hover:bg-black/5"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden="true" className="text-base">{current.flag}</span>
        <span className="tracking-wide">{current.label}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div
          ref={menuRef}
          role="listbox"
          className="absolute right-0 mt-2 w-36 rounded-md bg-white overflow-hidden z-50"
        >
          {languages.map((lng) => {
            const active = i18n.language === lng.code;
            return (
              <button
                key={lng.code}
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 ${active ? "text-primary" : ""}`}
                onClick={() => {
                  changeLanguage(lng.code);
                  try {
                    document.cookie = `lng=${lng.code}; path=/; max-age=${60 * 60 * 24 * 365}`;
                  } catch {}
                  try {
                    const { pathname, search, hash } = window.location;
                    const parts = pathname.split("/").filter(Boolean);
                    const rest =
                      parts.length > 0 && (parts[0] === "sk" || parts[0] === "en")
                        ? parts.slice(1)
                        : parts;
                    const newPath = `/${lng.code}${rest.length ? `/${rest.join("/")}` : ""}${search}${hash}`;
                    if (window.location.pathname !== newPath) {
                      window.history.replaceState(null, "", newPath);
                    }
                  } catch {
                    // ignore history errors
                  }
                  setOpen(false);
                }}
              >
                <span aria-hidden="true" className="text-base">{lng.flag}</span>
                <span className="tracking-wide">{lng.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

