import sources from "./provenance.json";
export type MediaRole =
  | "worldCollision"
  | "gameForeground"
  | "marketEnvironment"
  | "agentCollective"
  | "methodStructure";
const slugs: Record<MediaRole, string> = {
  worldCollision: "world-collision",
  gameForeground: "game-foreground",
  marketEnvironment: "market-environment",
  agentCollective: "agent-collective",
  methodStructure: "method-structure",
};
function media(role: MediaRole) {
  const source = sources.find((asset) => asset.role === role);
  if (!source) throw new Error("Missing licensed source for " + role);
  const base = "/media/math-intellect/possibility/" + slugs[role];
  return {
    ...source,
    role,
    sourceUrl: source.canonicalUrl,
    intrinsic: { width: source.dimensions[0], height: source.dimensions[1] },
    focalIntent: source.cropIntent,
    wideSrc: base + "-wide.webp",
    portraitSrc: base + "-portrait.webp",
    tabletSrc: base + "-tablet.webp",
    foregroundCutoutSrc:
      role === "gameForeground"
        ? "/media/math-intellect/possibility/game-foreground-cutout.webp"
        : undefined,
    base,
  };
}
export const POSSIBILITY_MEDIA = {
  worldCollision: media("worldCollision"),
  gameForeground: media("gameForeground"),
  marketEnvironment: media("marketEnvironment"),
  agentCollective: media("agentCollective"),
  methodStructure: media("methodStructure"),
};
