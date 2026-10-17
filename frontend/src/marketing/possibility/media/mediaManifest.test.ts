/// <reference types="node" />
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { POSSIBILITY_MEDIA } from "./mediaManifest";
describe("licensed replacement media", () => {
  it("serves verified new sources with complete responsive derivatives", () => {
    expect(Object.keys(POSSIBILITY_MEDIA)).toEqual([
      "worldCollision",
      "gameForeground",
      "marketEnvironment",
      "agentCollective",
      "methodStructure",
    ]);
    for (const asset of Object.values(POSSIBILITY_MEDIA)) {
      expect(asset.sourceUrl).toMatch(/^https:\/\/unsplash.com\/photos\//);
      expect(asset.creator.length).toBeGreaterThan(3);
      expect(asset.intrinsic.width).toBeGreaterThan(1900);
      expect(asset.focalIntent.length).toBeGreaterThan(20);
      for (const src of [
        asset.wideSrc,
        asset.portraitSrc,
        asset.tabletSrc,
        asset.foregroundCutoutSrc,
        ...["wide", "tablet", "portrait"].map(
          (shape) => asset.base + "-" + shape + ".avif",
        ),
      ].filter(Boolean)) {
        expect(src).not.toMatch(
          /impact|water|river|shipping|murmuration|strategy-dialogue|cinematic/,
        );
        expect(fs.existsSync("public" + src)).toBe(true);
      }
    }
  });
});
