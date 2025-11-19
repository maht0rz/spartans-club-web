import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://spartans-club.netlify.app/").replace(/\/+$/, "");
  const routes = [
    "/",
    "/sessions",
    "/way-of-life",
    "/testimonials",
    "/private-coaching",
    "/about",
    "/gallery",
  ];
  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r === "/" ? "" : r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "/" ? 1 : 0.7,
  }));
}


