import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_FILES = /\.(.*)$/;
const LOCALES = ["sk", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "sk";

function detectLocale(req: NextRequest): Locale {
  const cookieLng = req.cookies.get("lng")?.value?.toLowerCase();
  if (cookieLng && (LOCALES as readonly string[]).includes(cookieLng)) return cookieLng as Locale;
  const header = req.headers.get("accept-language") || "";
  const parts = header.split(",").map((s) => s.trim().toLowerCase());
  for (const p of parts) {
    const code = p.split(";")[0] || "";
    if (code.startsWith("sk")) return "sk";
    if (code.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip next internals, api, and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots.txt") ||
    PUBLIC_FILES.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If the path already starts with a locale, just ensure cookie and continue
  const seg = pathname.split("/")[1]?.toLowerCase();
  if ((LOCALES as readonly string[]).includes(seg)) {
    const res = NextResponse.next();
    // Persist chosen locale in cookie
    res.cookies.set("lng", seg, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // Redirect to locale-prefixed path
  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const res = NextResponse.redirect(url);
  res.cookies.set("lng", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * - /_next (internal)
     * - /api (API routes)
     * - /favicon.ico, files in /public, etc.
     * - /robots.txt and /sitemap*.xml
     */
    "/((?!_next|api|.*\\..*|robots.txt|sitemap.*\\.xml).*)",
  ],
};


