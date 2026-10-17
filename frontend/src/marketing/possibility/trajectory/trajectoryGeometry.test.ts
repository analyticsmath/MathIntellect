import { expect, it } from "vitest";
import { runDeterministicMonteCarlo } from "../../../math/deterministicModels";
import { getSharedTrajectoryDomain, pathToSvg } from "./trajectoryGeometry";
it("shares a finite padded domain containing zero and every point", () => {
  const results = [
    runDeterministicMonteCarlo(),
    runDeterministicMonteCarlo(0.9),
  ];
  const domain = getSharedTrajectoryDomain(results);
  expect(Number.isFinite(domain.min + domain.max)).toBe(true);
  for (const value of [0, ...results.flatMap((r) => r.paths.flat())]) {
    expect(domain.min).toBeLessThan(value);
    expect(domain.max).toBeGreaterThan(value);
  }
  expect(getSharedTrajectoryDomain([])).toEqual({ min: -1, max: 1 });
});
it("preserves every step and honest endpoints in order", () => {
  expect(pathToSvg([0, 1, -1], { min: -2, max: 2 }, 100, 80)).toBe(
    "M0,40 L50,20 L100,60",
  );
  expect(pathToSvg([], { min: -1, max: 1 }, 100, 80)).toBe("");
});
