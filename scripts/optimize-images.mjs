#!/usr/bin/env node
/**
 * Build-time image optimizer for the public/ directory.
 * - Recompresses JPG/PNG
 * - Optionally resizes down very large assets to max 2000px (fit: inside)
 * - Only overwrites if the result is smaller than the original
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const MAX_DIMENSION = 2000; // Prevent extremely large originals
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const SKIP_DIR_NAMES = new Set(["fonts"]); // keep font assets untouched
const TRAINERS_DIR_SEGMENT = `${path.sep}public${path.sep}trainers${path.sep}`;
const TRAINER_TARGET = { width: 634, height: 979 }; // portrait target
const GALLERY_DIR_SEGMENT = `${path.sep}public${path.sep}gallery${path.sep}`;
const HERO_BASENAME = "vincent";
const RESPONSIVE_SUFFIX = (w) => `-${w}w`;
const HERO_WIDTHS = [480, 768, 1024, 1280];
const GALLERY_WIDTHS = [480, 768, 1024, 1536];
const TRAINER_WIDTHS = [634, 1268]; // 1x and 2x
const RESPONSIVE_VARIANT_RE = /-\d+w\.(jpg|jpeg|png)$/i;

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTS.has(ext);
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTS.has(ext)) return { skipped: true };

  const originalBuffer = await fs.readFile(filePath);
  const input = sharp(originalBuffer);
  const meta = await input.metadata();

  let pipeline = sharp(originalBuffer);
  // Special handling: normalize trainer portraits to a consistent portrait size
  if (filePath.includes(TRAINERS_DIR_SEGMENT)) {
    pipeline = pipeline.resize({
      width: TRAINER_TARGET.width,
      height: TRAINER_TARGET.height,
      fit: "cover",
      position: "attention",
      withoutEnlargement: true
    });
  } else {
    // Constrain excessively large images to MAX_DIMENSION while preserving aspect
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true
    });
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({
      quality: 50,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: "4:4:4"
    });
  } else if (ext === ".png") {
    // palette reduces color depth where possible, big wins for logos
    pipeline = pipeline.png({
      quality: 50,
      compressionLevel: 9,
      palette: true
    });
  }

  const optimizedBuffer = await pipeline.toBuffer();

  // Only overwrite if smaller to avoid regressions
  if (optimizedBuffer.length < originalBuffer.length) {
    await fs.writeFile(filePath, optimizedBuffer);
    return {
      skipped: false,
      originalBytes: originalBuffer.length,
      optimizedBytes: optimizedBuffer.length,
      width: meta.width,
      height: meta.height
    };
  } else {
    return {
      skipped: true,
      originalBytes: originalBuffer.length,
      optimizedBytes: optimizedBuffer.length
    };
  }
}

async function generateVariant(basePath, width, options = {}) {
  const ext = path.extname(basePath);
  const baseName = path.basename(basePath, ext);
  const dir = path.dirname(basePath);
  const targetPath = path.join(dir, `${baseName}${RESPONSIVE_SUFFIX(width)}${ext}`);
  const input = await fs.readFile(basePath);
  let pipeline = sharp(input).resize({
    width,
    height: options.height ?? undefined,
    fit: options.fit ?? (options.height ? "cover" : "inside"),
    position: options.position ?? "attention",
    withoutEnlargement: true
  });
  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 50, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ quality: 50, compressionLevel: 9, palette: true });
  }
  const out = await pipeline.toBuffer();
  // Only write if different or doesn't exist
  try {
    const existing = await fs.readFile(targetPath);
    if (existing.length <= out.length) return { created: false, path: targetPath };
  } catch {
    // file doesn't exist
  }
  await fs.writeFile(targetPath, out);
  return { created: true, path: targetPath };
}

async function generateResponsiveVariantsIfNeeded(filePath) {
  // Never generate variants from an already generated variant to avoid duplication chains
  if (RESPONSIVE_VARIANT_RE.test(filePath)) {
    return false;
  }
  // Gallery set
  if (filePath.includes(GALLERY_DIR_SEGMENT)) {
    await Promise.all(GALLERY_WIDTHS.map((w) => generateVariant(filePath, w)));
    return true;
  }
  // Trainers (fixed portrait)
  if (filePath.includes(TRAINERS_DIR_SEGMENT)) {
    await Promise.all(
      TRAINER_WIDTHS.map((w) =>
        generateVariant(filePath, w, { height: Math.round((TRAINER_TARGET.height / TRAINER_TARGET.width) * w), fit: "cover" })
      )
    );
    return true;
  }
  // Hero single asset by basename
  const base = path.basename(filePath, path.extname(filePath)).toLowerCase();
  if (base === HERO_BASENAME) {
    await Promise.all(HERO_WIDTHS.map((w) => generateVariant(filePath, w)));
    return true;
  }
  return false;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} kB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

async function main() {
  try {
    let totalOriginal = 0;
    let totalOptimized = 0;
    let changedCount = 0;
    let seenCount = 0;

    for await (const filePath of walk(PUBLIC_DIR)) {
      if (!isImageFile(filePath)) continue;
      seenCount++;
      const result = await optimizeImage(filePath);
      if (!result.skipped) {
        changedCount++;
        totalOriginal += result.originalBytes ?? 0;
        totalOptimized += result.optimizedBytes ?? 0;
        const saved = (result.originalBytes ?? 0) - (result.optimizedBytes ?? 0);
        console.log(
          `Optimized: ${path.relative(ROOT, filePath)} (-${formatBytes(saved)})`
        );
      }
      // Generate responsive variants for known sets
      const didVariants = await generateResponsiveVariantsIfNeeded(filePath);
      if (didVariants) {
        console.log(`Variants generated for: ${path.relative(ROOT, filePath)}`);
      }
    }

    if (changedCount > 0) {
      const savedTotal = totalOriginal - totalOptimized;
      console.log(
        `\nImage optimization complete. ${changedCount}/${seenCount} updated. Total saved: ${formatBytes(
          savedTotal
        )}`
      );
    } else {
      console.log(`\nNo images changed. ${seenCount} images checked.`);
    }
  } catch (err) {
    console.error("Image optimization failed:", err);
    process.exitCode = 1;
  }
}

await main();


