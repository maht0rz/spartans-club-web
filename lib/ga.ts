export type GAParams = Record<string, string | number | boolean | null | undefined>;

function hasConsent(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("ga_consent=granted"));
}

export function gaEvent(name: string, params: GAParams = {}): void {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;
  // @ts-ignore - gtag exists only after Analytics component loads
  if (typeof window.gtag !== "function") return;
  // @ts-ignore
  window.gtag("event", name, params);
}


