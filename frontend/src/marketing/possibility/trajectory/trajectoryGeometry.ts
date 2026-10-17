import type { MonteCarloResult } from "../../../math/deterministicModels";
export interface TrajectoryDomain {
  min: number;
  max: number;
}
export function getSharedTrajectoryDomain(
  results: MonteCarloResult[],
): TrajectoryDomain {
  let min = 0,
    max = 0;
  for (const result of results)
    for (const path of result.paths)
      for (const value of path)
        if (Number.isFinite(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
  const padding = (max - min) * 0.08 || 1;
  return { min: min - padding, max: max + padding };
}
export function pathToSvg(
  points: number[],
  domain: TrajectoryDomain,
  width: number,
  height: number,
): string {
  return points
    .map(
      (value, index) =>
        `${index ? "L" : "M"}${points.length > 1 ? (index / (points.length - 1)) * width : 0},${height - ((value - domain.min) / (domain.max - domain.min)) * height}`,
    )
    .join(" ");
}
