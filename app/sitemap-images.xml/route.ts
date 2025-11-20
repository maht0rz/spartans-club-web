import fs from "node:fs/promises";
import path from "node:path";

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const root = process.cwd();
  let base = (process.env.NEXT_PUBLIC_SITE_URL || "https://spartans-club.netlify.app/").replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  const galleriesDir = path.join(root, "public", "gallery");
  const trainersDir = path.join(root, "public", "trainers");

  async function list(dir: string, exts: Set<string>) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      return entries
        .filter((e) => e.isFile() && exts.has(path.extname(e.name).toLowerCase()))
        .map((e) => `${dir}${path.sep}${e.name}`);
    } catch {
      return [];
    }
  }

  const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  const galleryFiles = await list(galleriesDir, imageExts);
  const trainerFiles = await list(trainersDir, imageExts);
  const hero = [path.join(root, "public", "vincent.png")];

  const all = [...galleryFiles, ...trainerFiles, ...hero];

  const urls = all
    .map((absPath) => {
      const rel = "/" + path.relative(path.join(root, "public"), absPath).split(path.sep).join("/");
      const loc = `${base}${rel}`;
      const pageLoc = rel.startsWith("/gallery/")
        ? `${base}/gallery`
        : rel.startsWith("/trainers/")
        ? `${base}/private-coaching`
        : base;
      return `
  <url>
    <loc>${xmlEscape(pageLoc)}</loc>
    <image:image>
      <image:loc>${xmlEscape(loc)}</image:loc>
    </image:image>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}


