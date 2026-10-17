import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const root = path.resolve(import.meta.dirname, "..");
const sourceDir = process.argv[2];
if (!sourceDir)
  throw new Error("Provide the directory of licensed Unsplash masters.");
const manifest = JSON.parse(
  await fs.readFile(
    path.join(root, "src/marketing/possibility/media/provenance.json"),
    "utf8",
  ),
);
const output = path.join(root, "public/media/math-intellect/possibility");
await fs.mkdir(output, { recursive: true });
const names = {
  worldCollision: "world-collision",
  gameForeground: "game-foreground",
  marketEnvironment: "market-environment",
  agentCollective: "agent-collective",
  methodStructure: "method-structure",
};
for (const asset of manifest) {
  const source = path.join(sourceDir, asset.sourceFilename);
  const metadata = await sharp(source).metadata();
  if (
    metadata.width !== asset.dimensions[0] ||
    metadata.height !== asset.dimensions[1]
  )
    throw new Error("Unexpected source dimensions: " + asset.role);
  for (const [shape, width, height] of [
    ["wide", 1920, 1080],
    ["tablet", 1080, 810],
    ["portrait", 780, 1040],
  ]) {
    let pipeline = sharp(source).autoOrient();
    if (asset.role === "marketEnvironment" && shape !== "portrait")
      pipeline = pipeline.rotate(90);
    // Native source pixels only; no generative edits and no upscaling.
    const resized = pipeline.resize({
      width,
      height,
      fit: "cover",
      position: asset.role === "agentCollective" ? "north" : "centre",
      withoutEnlargement: true,
    });
    for (const format of ["webp", "avif"])
      await resized
        .clone()
        .toFormat(format, { quality: format === "webp" ? 84 : 58 })
        .toFile(path.join(output, `${names[asset.role]}-${shape}.${format}`));
  }
  console.log("Built responsive derivatives: " + asset.role);
}

const chess = manifest.find((asset) => asset.role === "gameForeground");
const mask = await fs.readFile(
  path.join(root, "scripts/game-foreground-mask.svg"),
);
await sharp(path.join(sourceDir, chess.sourceFilename))
  .resize(1400, 933, { fit: "fill", withoutEnlargement: true })
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .webp({ quality: 95, alphaQuality: 100 })
  .toFile(path.join(output, "game-foreground-cutout.webp"));
console.log("Built manually traced hand and king foreground.");
