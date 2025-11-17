"use client";

import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/common.json";
import sk from "../locales/sk/common.json";
import enPricing from "../locales/en/shared/pricing.json";
import skPricing from "../locales/sk/shared/pricing.json";

let initialized = false;

function getInitialLanguage(): string {
  if (typeof window === "undefined") return "sk";
  const fromStorage = window.localStorage.getItem("lng");
  if (fromStorage) return fromStorage;
  return "sk";
}

export function ensureI18n(): I18nInstance {
  if (!initialized) {
    i18next
      .use(initReactI18next)
      .init({
        resources: {
          en: { common: en, shared: enPricing },
          sk: { common: sk, shared: skPricing }
        },
        lng: getInitialLanguage(),
        fallbackLng: "sk",
        ns: ["common", "shared"],
        defaultNS: "common",
        interpolation: { escapeValue: false }
      })
      .then(() => {
        initialized = true;
      })
      .catch(() => {
        // swallow init errors for now
      });
  }
  return i18next;
}

export function changeLanguage(lng: string) {
  ensureI18n().changeLanguage(lng);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("lng", lng);
  }
}

