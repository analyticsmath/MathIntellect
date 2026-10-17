import { useId } from "react";
import type { GameTheoryResult } from "../../../math/deterministicModels";
export function GameMatrixGraphic({
  result,
  className = "",
}: {
  result: GameTheoryResult;
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 600 440"
      role="img"
      aria-labelledby={id}
      className={`pe-game-matrix ${className}`}
    >
      <title
        id={id}
      >{`Two by two zero-sum payoff matrix. Row A probability ${result.rowProbA.toFixed(3)}, column A probability ${result.colProbA.toFixed(3)}. Expected value ${result.expectedValue.toFixed(3)}.`}</title>
      <g fill="none" stroke="currentColor">
        <rect x="80" y="60" width="440" height="320" />
        <path d="M300 60V380 M80 220H520" />
      </g>
      {result.matrix.flatMap((row, r) =>
        row.map((value, c) => (
          <text
            key={`${r}${c}`}
            x={190 + c * 220}
            y={153 + r * 160}
            textAnchor="middle"
            fill="currentColor"
            fontSize="64"
          >
            {value}
          </text>
        )),
      )}
    </svg>
  );
}
