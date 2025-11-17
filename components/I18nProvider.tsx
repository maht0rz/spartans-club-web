"use client";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { ensureI18n } from "../lib/i18n";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const i18n = ensureI18n();
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

