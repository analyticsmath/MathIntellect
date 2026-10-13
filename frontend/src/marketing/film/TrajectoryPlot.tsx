import type { MonteCarloResult } from "../../math/deterministicModels";

export function TrajectoryPlot({
  current,
  baseline,
  compare = false,
  draw = false,
}: {
  current: MonteCarloResult;
  baseline?: MonteCarloResult;
  compare?: boolean;
  draw?: boolean;
}) {
  const all = [...current.paths, ...(baseline?.paths ?? [])].flat();
  const limit = Math.max(0.6, ...all.map(Math.abs)) * 1.12;
  const y = (value: number) => 180 - (value / limit) * 146;
  const path = (points: number[]) =>
    points
      .map(
        (value, i) =>
          `${i ? "L" : "M"}${48 + (i / (points.length - 1)) * 860},${y(value)}`,
      )
      .join(" ");
  return (
    <svg
      className={`mi-trajectory ${draw ? "mi-drawn-field" : ""}`}
      viewBox="0 0 960 370"
      role="img"
      aria-label={`${current.paths.length} computed sample paths. Endpoint mean ${current.mean.toFixed(4)}; variance ${current.variance.toFixed(4)}${compare ? "; baseline and changed paths share the same axes" : ""}`}
    >
      <line x1="48" y1="180" x2="908" y2="180" className="mi-plot-axis" />
      <text x="48" y="348">
        START
      </text>
      <text x="865" y="348">
        OUTCOME
      </text>
      {compare &&
        baseline?.paths.map((points, i) => (
          <path key={`b${i}`} d={path(points)} className="mi-path-baseline" />
        ))}
      {current.paths.map((points, i) => (
        <path
          key={i}
          d={path(points)}
          pathLength="1"
          className={`mi-path ${i === 0 ? "mi-path-primary" : ""} ${compare ? "mi-path-changed" : ""}`}
        />
      ))}
      <circle cx="48" cy="180" r="4" className="mi-plot-origin" />
      <text x="12" y="32">
        {limit.toFixed(2)}
      </text>
      <text x="12" y="320">
        −{limit.toFixed(2)}
      </text>
    </svg>
  );
}
