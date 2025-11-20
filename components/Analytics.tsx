"use client";
import React from "react";
import Script from "next/script";

function hasConsent(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("ga_consent=granted"));
}

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [enabled, setEnabled] = React.useState<boolean>(false);
  const lastConsentRef = React.useRef<"granted" | "denied" | "none">("none");

  React.useEffect(() => {
    const granted = hasConsent();
    setEnabled(!!gaId && granted);
    // Respect GA disable flag even if script was injected
    if (typeof window !== "undefined" && gaId) {
      // @ts-ignore dynamic key
      window[`ga-disable-${gaId}`] = !granted;
    }
    const onConsent = () => setEnabled(!!gaId && hasConsent());
    window.addEventListener("ga-consent", onConsent);
    return () => window.removeEventListener("ga-consent", onConsent);
  }, [gaId]);

  // Monitor cookie changes (other tabs, devtools edits) and react
  React.useEffect(() => {
    if (!gaId) return;
    function currentConsent(): "granted" | "denied" | "none" {
      if (typeof document === "undefined") return "none";
      const ck = document.cookie.split(";").map((c) => c.trim());
      const v = ck.find((c) => c.startsWith("ga_consent="))?.split("=")[1];
      if (v === "granted") return "granted";
      if (v === "denied") return "denied";
      return "none";
    }
    const check = () => {
      const now = currentConsent();
      if (now !== lastConsentRef.current) {
        lastConsentRef.current = now;
        const granted = now === "granted";
        setEnabled(granted);
        if (typeof window !== "undefined") {
          // @ts-ignore dynamic key
          window[`ga-disable-${gaId}`] = !granted;
          // notify listeners (e.g., SectionAnalytics) to re-evaluate
          window.dispatchEvent(new Event("ga-consent"));
        }
      }
    };
    const id = window.setInterval(check, 2000);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [gaId]);

  if (!gaId || !enabled) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}


