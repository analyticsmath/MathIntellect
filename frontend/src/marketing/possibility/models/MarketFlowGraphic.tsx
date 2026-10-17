import { useId } from "react";
import type { MarketDynamicsResult } from "../../../math/deterministicModels";
import { pathToSvg } from "../trajectory/trajectoryGeometry";
export function MarketFlowGraphic({
  result,
  className = "",
}: {
  result: MarketDynamicsResult;
  className?: string;
}) {
  const id = useId();
  const min = Math.min(0, ...result.series),
    max = Math.max(0, ...result.series);
  const padding = (max - min) * 0.08 || 1;
  return (
    <svg
      viewBox="0 0 1000 500"
      role="img"
      aria-labelledby={id}
      className={`pe-market-flow ${className}`}
    >
      <title
        id={id}
      >{`Illustrative AR(1) series, ${result.series.length} observations. Persistence ${result.persistence}. ${result.regimeSwitches} sign changes. Theoretical variance ${result.theoreticalVariance.toFixed(4)}.`}</title>
      <path
        transform="translate(20 20)"
        d={pathToSvg(
          result.series,
          { min: min - padding, max: max + padding },
          960,
          460,
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      />
    </svg>
  );
}
