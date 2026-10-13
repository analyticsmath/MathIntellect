import { useId } from "react";
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
  const titleId = "trajectory-title-" + useId().replace(/:/g, "");
  const paths = current.paths.concat(compare && baseline ? baseline.paths : []).flat();
  const limit = Math.max(0.45, ...paths.map((value) => Math.abs(value))) * 1.08;
  const left = 56;
  const right = 922;
  const center = 184;
  const amplitude = 142;
  const y = (value: number) => center - (value / limit) * amplitude;

  const makePath = (points: number[]) =>
    points
      .map((value, index) => {
        const x = left + (index / Math.max(1, points.length - 1)) * (right - left);
        return (index ? "L" : "M") + x.toFixed(2) + "," + y(value).toFixed(2);
      })
      .join(" ");

  return (
    <svg
      className={"mi-trajectory" + (draw ? " mi-trajectory--draw" : "")}
      viewBox="0 0 960 410"
      role="img"
      aria-labelledby={titleId}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>
        {current.paths.length} sample paths. Mean endpoint {current.mean.toFixed(4)}.
        Endpoint variance {current.variance.toFixed(4)}.
      </title>

      <g className="mi-plot-grid" aria-hidden="true">
        <line x1={left} y1="42" x2={right} y2="42" />
        <line x1={left} y1="113" x2={right} y2="113" />
        <line x1={left} y1="184" x2={right} y2="184" />
        <line x1={left} y1="255" x2={right} y2="255" />
        <line x1={left} y1="326" x2={right} y2="326" />
        <line x1={left} y1="30" x2={left} y2="340" />
        <line x1="272" y1="30" x2="272" y2="340" />
        <line x1="488" y1="30" x2="488" y2="340" />
        <line x1="705" y1="30" x2="705" y2="340" />
        <line x1={right} y1="30" x2={right} y2="340" />
      </g>

      <line
        x1={left}
        y1={center}
        x2={right}
        y2={center}
        className="mi-plot-zero"
        aria-hidden="true"
      />

      {compare &&
        baseline?.paths.map((points, index) => (
          <path
            key={"baseline-" + index}
            d={makePath(points)}
            className="mi-path mi-path--baseline"
            pathLength="1"
            aria-hidden="true"
          />
        ))}

      {current.paths.map((points, index) => (
        <path
          key={"current-" + index}
          d={makePath(points)}
          className={
            "mi-path mi-path--current" + (index === 0 ? " mi-path--focus" : "")
          }
          pathLength="1"
          style={{ animationDelay: Math.min(index * 16, 320) + "ms" }}
          aria-hidden="true"
        />
      ))}

      <circle
        cx={left}
        cy={y(0)}
        r="5"
        className="mi-plot-origin"
        aria-hidden="true"
      />

      <g className="mi-plot-labels" aria-hidden="true">
        <text x={left} y="386">Start</text>
        <text x={right} y="386" textAnchor="end">{current.steps} steps</text>
        <text x="8" y="46">{limit.toFixed(2)}</text>
        <text x="8" y="329">−{limit.toFixed(2)}</text>
      </g>
    </svg>
  );
}

