export function FallbackSvgManifold() {
  // Pre-calculated deterministic topology curves (Elevation slices)
  const paths = [
    "M 0 180 Q 250 80 500 180 T 1000 180",
    "M 0 150 Q 250 50 500 150 T 1000 150",
    "M 0 120 Q 250 30 500 120 T 1000 120",
    "M 0 90 Q 250 10 500 90 T 1000 90",
    "M 0 60 Q 250 0 500 60 T 1000 60"
  ]

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#07080B] p-8 border border-white/10">
      <svg viewBox="0 0 1000 240" className="w-full h-auto max-w-4xl" fill="none">
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={i === 2 ? "#2D5BFF" : "#ECEFF5"}
            strokeOpacity={0.25 + i * 0.15}
            strokeWidth={i === 2 ? "1.5" : "1"}
            strokeDasharray={i % 2 === 1 ? "4 4" : undefined}
          />
        ))}
      </svg>
      <div className="mt-6 flex justify-between w-full max-w-4xl font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575]">
        <span>HARDWARE FALLBACK ACTIVE</span>
        <span>EQUILIBRIUM CONTOUR PROJECTION</span>
        <span className="text-[#2D5BFF]">DETERMINISTIC 2D LAYER</span>
      </div>
    </div>
  )
}
