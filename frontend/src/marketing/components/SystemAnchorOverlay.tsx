interface SystemAnchorProps {
  systemTag: string
  telemetryMetric: string
  coordSystem: string
  verificationState: string
  accentColor?: string
}

export function SystemAnchorOverlay({
  systemTag,
  telemetryMetric,
  coordSystem,
  verificationState,
  accentColor = "text-[#2D5BFF]"
}: SystemAnchorProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* 12-Column Hairline Software Grid (5% Opacity) */}
      <div className="absolute inset-0 grid grid-cols-12 gap-0 px-6 opacity-[0.05]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-white h-full relative" />
        ))}
      </div>

      {/* Subtle Crosshair Marks (+) at 25%, 50%, 75% Intersections */}
      <div className="absolute inset-0 pointer-events-none">
        {[25, 50, 75].map(y => (
          <div key={y}>
            {[25, 50, 75].map(x => (
              <div
                key={`${x}-${y}`}
                className="absolute font-mono text-[10px] text-white/25 -translate-x-1/2 -translate-y-1/2 select-none"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                +
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 4-Corner Software Anchors (2.3s Institutional Recognition Rule) */}
      <div className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.14em] text-[#5F6575] uppercase">
        {systemTag}
      </div>
      <div className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.14em] text-[#5F6575] uppercase">
        {telemetryMetric}
      </div>
      <div className="absolute bottom-6 left-6 font-mono text-[9px] tracking-[0.14em] text-[#5F6575] uppercase">
        {coordSystem}
      </div>
      <div className={`absolute bottom-6 right-6 font-mono text-[9px] tracking-[0.14em] ${accentColor} uppercase`}>
        {verificationState}
      </div>
    </div>
  )
}
