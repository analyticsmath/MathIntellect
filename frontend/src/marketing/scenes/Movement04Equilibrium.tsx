import { MonolithTriptych } from "../components/MonolithTriptych"

export function Movement04Equilibrium() {
  return (
    <section className="relative bg-[#07080B] text-[#ECEFF5] py-[16svh] px-[5vw] border-b border-[#1A1D26]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header: Spatial Syntax (Zero Dashes · Zero Commas) */}
        <div className="mb-12">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575]">
            ENGINE 03 // GAME THEORY
          </span>
          <h2 className="mt-2 font-sans text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[0.94] tracking-[-0.03em] uppercase">
            Opposition resolves into equilibrium
          </h2>
          <div className="mt-4 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575]">
            <p className="text-[#ECEFF5]">Conflicting strategies lock into place</p>
            <p className="pl-[18px]">No player gains by unilateral deviation</p>
            <p className="pl-[36px] text-[#2D5BFF]">Pareto optimality verified</p>
          </div>
        </div>

        {/* Mandate 03: The Continuous Monolith (Zero Gaps · Cut by Material) */}
        <MonolithTriptych
          imageSrc="/media/math/precision-metrology-surface.jpg"
          panels={[
            { roleTag: "SUBSTRATE A", title: "STRATEGY MATRIX" },
            { roleTag: "SADDLE POINT", title: "NASH EQUILIBRIUM", active: true },
            { roleTag: "SUBSTRATE B", title: "DEFECTOR ATTRITION" }
          ]}
        />

      </div>
    </section>
  )
}
