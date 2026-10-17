import { describe, expect, it } from "vitest";
import { runDeterministicMonteCarlo } from "../../math/deterministicModels";

describe("the public scenario", () => {
  it("reproduces the seed exactly while a changed condition changes numerical evidence", () => {
    const a = runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 42),
      b = runDeterministicMonteCarlo(0.6, 0.05, 50, 24, 42);
    expect(runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 42)).toEqual(a);
    expect(a.paths).toHaveLength(24);
    expect(a.paths.every((path) => path.length === 51 && path[0] === 0)).toBe(
      true,
    );
    expect(a.variance).toBeCloseTo(0.080592785, 8);
    expect(b.variance).toBeCloseTo(0.236844103, 8);
    expect(b.variance / a.variance).toBeCloseTo((0.6 / 0.35) ** 2, 10);
    expect(runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 43)).not.toEqual(a);
  });
});
