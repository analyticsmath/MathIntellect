interface SpatialSyntaxProps {
  domain: string
  headline: string
  statement: string
  subordinate: string
  resolution: string
}

export function SpatialSyntaxBlock({
  domain,
  headline,
  statement,
  subordinate,
  resolution
}: SpatialSyntaxProps) {
  return (
    <div className="relative z-30 max-w-3xl">
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575] block mb-2">
        {domain}
      </span>
      <h2 className="font-sans text-[clamp(2.25rem,4.5vw,4.25rem)] font-medium leading-[0.92] tracking-[-0.035em] text-[#ECEFF5] uppercase">
        {headline}
      </h2>
      <div className="mt-5 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575]">
        <p className="text-[#ECEFF5]">{statement}</p>
        <p className="pl-[18px] text-[#ECEFF5]/80">{subordinate}</p>
        <p className="pl-[36px] text-[#2D5BFF]">{resolution}</p>
      </div>
    </div>
  )
}
