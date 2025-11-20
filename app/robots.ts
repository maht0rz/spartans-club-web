import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  let base = (process.env.NEXT_PUBLIC_SITE_URL || "https://spartans-club.netlify.app/").replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [`${base}/sitemap.xml`, `${base}/sitemap-images.xml`],
    host: base.replace(/^https?:\/\//, ""),
  };
}


