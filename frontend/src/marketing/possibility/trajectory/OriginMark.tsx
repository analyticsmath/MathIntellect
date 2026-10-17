export function OriginMark({
  x = 0,
  y = 0,
  className = "",
}: {
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <g
      className={`pe-origin ${className}`}
      data-origin-state="true"
      aria-hidden="true"
      transform={`translate(${x} ${y})`}
    >
      <circle r="7" fill="currentColor" />
      <circle r="16" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  );
}
