import { useId } from "react";
import type { MonteCarloResult } from "../../../math/deterministicModels";
import { getSharedTrajectoryDomain, pathToSvg } from "./trajectoryGeometry";
import { OriginMark } from "./OriginMark";
export interface TrajectoryFieldProps {
  current: MonteCarloResult;
  baseline?: MonteCarloResult;
  compare?: boolean;
  variant: "hero" | "field" | "comparison" | "instrument";
  focusPathIndex?: number;
  className?: string;
}
export function TrajectoryField({
  current,
  baseline,
  compare = false,
  variant,
  focusPathIndex,
  className = "",
}: TrajectoryFieldProps) {
  const titleId = useId();
  const domain = getSharedTrajectoryDomain(
    baseline ? [current, baseline] : [current],
  );
  const width = 1120,
    height = 500;
  const zero = height - ((0 - domain.min) / (domain.max - domain.min)) * height;
  return (
    <svg
      className={`pe-field pe-field--${variant} ${className}`}
      viewBox="0 0 1200 600"
      role="img"
      aria-labelledby={titleId}
      data-transition-actor="trajectory"
    >
      <title
        id={titleId}
      >{`${current.paths.length} paths. Mean endpoint ${current.mean.toFixed(4)}. Variance ${current.variance.toFixed(4)}.${compare && baseline ? " Dashed baseline and solid current paths share one scale." : ""}`}</title>
      <g transform="translate(40 50)">
        <line
          x1="0"
          x2={width}
          y1={zero}
          y2={zero}
          stroke="currentColor"
          opacity=".15"
          aria-hidden="true"
        />
        {compare &&
          baseline &&
          baseline.paths.map((path, index) => (
            <path
              key={`b${index}`}
              aria-hidden="true"
              className="pe-path pe-path--baseline"
              d={pathToSvg(path, domain, width, height)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5 7"
              opacity=".3"
            />
          ))}
        {current.paths.map((path, index) => (
          <path
            key={index}
            aria-hidden="true"
            className={`pe-path${index === focusPathIndex ? " pe-path--focused" : ""}`}
            d={pathToSvg(path, domain, width, height)}
            fill="none"
            stroke="currentColor"
            strokeWidth={index === focusPathIndex ? 3 : 1.5}
            opacity={
              focusPathIndex === undefined
                ? 0.6
                : index === focusPathIndex
                  ? 1
                  : 0.2
            }
          />
        ))}
        <OriginMark y={zero} />
      </g>
    </svg>
  );
}
