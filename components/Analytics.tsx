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

  React.useEffect(() => {
    setEnabled(!!gaId && hasConsent());
    const onConsent = () => setEnabled(!!gaId && hasConsent());
    window.addEventListener("ga-consent", onConsent);
    return () => window.removeEventListener("ga-consent", onConsent);
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


