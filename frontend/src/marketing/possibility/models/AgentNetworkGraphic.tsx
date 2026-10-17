import { useId } from "react";
import type { ConflictResult } from "../../../math/deterministicModels";
export function AgentNetworkGraphic({
  result,
  className = "",
}: {
  result: ConflictResult;
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      viewBox="-5 -5 110 110"
      role="img"
      aria-labelledby={id}
      className={`pe-agent-network ${className}`}
    >
      <title
        id={id}
      >{`Deterministic field of ${result.agents.length} agents with their actual position and velocity vectors. Coherence ${result.coherence.toFixed(4)}. This is an illustrative model, not observed collective motion.`}</title>
      <g aria-hidden="true" stroke="currentColor" fill="currentColor">
        {result.agents.map((agent, index) => (
          <g key={index}>
            <line
              x1={agent.x}
              y1={agent.y}
              x2={agent.x + agent.vx * 5}
              y2={agent.y + agent.vy * 5}
              strokeWidth=".3"
            />
            <circle cx={agent.x} cy={agent.y} r=".65" />
          </g>
        ))}
      </g>
    </svg>
  );
}
