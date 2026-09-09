import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { MEDIA_ITEMS } from './fetch-marketing-media.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '../public/media/math-intellect');
const SOURCE_DIR = path.join(BASE_DIR, 'source');
const AVIF_DIR = path.join(BASE_DIR, 'optimized/avif');
const WEBP_DIR = path.join(BASE_DIR, 'optimized/webp');

const LANDSCAPE_WIDTHS = [768, 1280, 1920, 2560];
const PORTRAIT_WIDTHS = [640, 960, 1280];

async function processImage(item) {
  const sourcePath = path.join(SOURCE_DIR, item.filename);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`[SKIP] Source image missing: ${sourcePath}`);
    return null;
  }

  const baseName = path.parse(item.filename).name;
  const image = sharp(sourcePath);
  const metadata = await image.metadata();

  const isPortrait = (metadata.height || 0) > (metadata.width || 0);
  const targetWidths = isPortrait ? PORTRAIT_WIDTHS : LANDSCAPE_WIDTHS;

  console.log(`[PROCESS] ${item.id} (${item.filename}) - ${metadata.width}x${metadata.height} (${isPortrait ? 'portrait' : 'landscape'})`);

  const avifMap = {};
  const webpMap = {};

  for (const width of targetWidths) {
    // Never upscale beyond source dimension
    if (metadata.width && width > metadata.width) {
      continue;
    }

    const avifFilename = `${baseName}-${width}.avif`;
    const avifPath = path.join(AVIF_DIR, avifFilename);
    const webpFilename = `${baseName}-${width}.webp`;
    const webpPath = path.join(WEBP_DIR, webpFilename);

    // Generate AVIF (quality 58)
    if (!fs.existsSync(avifPath) || fs.statSync(avifPath).size < 1000) {
      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 58, effort: 4 })
        .toFile(avifPath);
    }
    avifMap[width] = `/media/math-intellect/optimized/avif/${avifFilename}`;

    // Generate WebP (quality 80)
    if (!fs.existsSync(webpPath) || fs.statSync(webpPath).size < 1000) {
      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(webpPath);
    }
    webpMap[width] = `/media/math-intellect/optimized/webp/${webpFilename}`;
  }

  return {
    id: item.id,
    filename: item.filename,
    width: metadata.width,
    height: metadata.height,
    isPortrait,
    avifMap,
    webpMap,
  };
}

async function main() {
  fs.mkdirSync(AVIF_DIR, { recursive: true });
  fs.mkdirSync(WEBP_DIR, { recursive: true });

  console.log('Generating responsive AVIF and WebP derivatives...');
  const results = [];
  for (const item of MEDIA_ITEMS) {
    try {
      const res = await processImage(item);
      if (res) results.push(res);
    } catch (err) {
      console.error(`[ERROR] Processing ${item.id} failed:`, err.message);
    }
  }

  console.log(`\nProcessed ${results.length} assets into responsive derivatives.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('Fatal derivative generation error:', err);
    process.exit(1);
  });
}
