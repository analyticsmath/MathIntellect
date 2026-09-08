interface PanelSpec {
  roleTag: string
  title: string
  active?: boolean
}

interface MonolithTriptychProps {
  imageSrc: string
  panels: [PanelSpec, PanelSpec, PanelSpec]
}

export function MonolithTriptych({ imageSrc, panels }: MonolithTriptychProps) {
  return (
    <div className="relative w-full h-[62svh] bg-[#0E1015] border border-white/10 overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]">
      {/* 3 Slices with zero gap cut by material */}
      <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-0">
        {panels.map((panel, idx) => {
          const bgPositions = ["0% 50%", "50% 50%", "100% 50%"]
          return (
            <div
              key={idx}
              className={`relative h-full overflow-hidden group ${
                idx < 2 ? "border-b md:border-b-0 md:border-r border-white/10" : ""
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-no-repeat grayscale contrast-125 brightness-90 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                style={{
                  backgroundImage: `url('${imageSrc}')`,
                  backgroundPosition: bgPositions[idx],
                  backgroundSize: "300% 100%"
                }}
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-transparent transition-colors duration-500" />
              
              <div className="absolute bottom-6 left-6 z-10 font-mono text-[10px] uppercase tracking-wider text-white">
                <span className={`block text-[8px] ${panel.active ? "text-[#2D5BFF]" : "text-[#5F6575]"}`}>
                  {panel.roleTag}
                </span>
                {panel.title}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mandate 03: Continuous 1px hairline rule bleeding across entire container at 58% */}
      <div className="absolute top-[58%] inset-x-0 h-[1px] bg-white/20 pointer-events-none z-20" />
    </div>
  )
}
