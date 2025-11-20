import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  let base = (process.env.NEXT_PUBLIC_SITE_URL || "https://spartans-club.netlify.app/").replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  const baseRoutesEn = ["/", "/sessions", "/way-of-life", "/testimonials", "/private-coaching", "/about", "/gallery"];
  const baseRoutesSk = ["/", "/rozvrh", "/way-of-life", "/referencie", "/treneri", "/o-nas", "/galeria"];
  const locales = ["sk", "en"];
  const now = new Date();
  const items: MetadataRoute.Sitemap = [];
  // English
  for (const r of baseRoutesEn) {
    const path = r === "/" ? "" : r;
    items.push({
      url: `${base}/en${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: r === "/" ? 1 : 0.7,
    });
  }
  // Slovak
  for (const r of baseRoutesSk) {
      const path = r === "/" ? "" : r;
      items.push({
        url: `${base}/sk${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: r === "/" ? 1 : 0.7,
      });
  }
  return items;
}


