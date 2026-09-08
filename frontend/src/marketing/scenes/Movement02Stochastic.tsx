import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DESKTOP_MOTION } from "../components/DesktopLenisBridge"
import { SystemAnchorOverlay } from "../components/SystemAnchorOverlay"

gsap.registerPlugin(ScrollTrigger)

export function Movement02Stochastic() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const vectorPaths = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(DESKTOP_MOTION, () => {
      if (!root.current || !stage.current || !vectorPaths.current) return

      const ctx = gsap.context(() => {
        const paths = vectorPaths.current?.querySelectorAll(".cholesky-path")

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "movement02Stochastic",
            trigger: root.current,
            pin: stage.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.5}`,
            scrub: 0.75,
            pinSpacing: true,
            anticipatePin: 1
          }
        })

        // Expanding path fan simulating Cholesky dispersion
        tl.fromTo(
          paths || [],
          { strokeDashoffset: 1000, opacity: 0.1 },
          { strokeDashoffset: 0, opacity: 0.8, stagger: 0.005, ease: "power2.out" }
        )
      }, root)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="relative bg-[#07080B] text-[#ECEFF5] border-b border-[#1A1D26]">
      <div ref={stage} className="relative h-[100svh] w-full overflow-hidden">
        <SystemAnchorOverlay
          systemTag="ENGINE 01 // STOCHASTIC PROCESSES"
          telemetryMetric="ITERATIONS // 1000000 RUNS"
          coordSystem="FACTOR // LL^T = SIGMA"
          verificationState="VAR 95 // -3.88 PERCENT"
        />

        {/* Dual Photographic & Vector Assembly */}
        <div className="absolute inset-x-[5vw] top-[10svh] h-[75svh] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          
          {/* Paris Bilal High-Speed Fluid Dynamics */}
          <div className="lg:col-span-5 h-full overflow-hidden bg-[#0E1015] border border-white/10 relative">
            <img
              src="/media/math/paris-bilal-fluid-dynamics.jpg"
              alt="High speed water shock dispersion in physical macro"
              className="w-full h-full object-cover grayscale contrast-125 brightness-85"
            />
            <div className="absolute bottom-4 left-4 font-mono text-[8px] uppercase tracking-wider text-white/50 bg-black/60 px-2 py-1">
              DISPERSION DYNAMICS // MACRO
            </div>
          </div>

          {/* SVG Vector Cholesky Covariance Stream */}
          <div className="lg:col-span-7 h-full flex flex-col justify-between bg-[#0E1015]/60 border border-white/10 p-8">
            <div className="w-full h-[45svh] flex items-center justify-center overflow-hidden">
              <svg
                ref={vectorPaths}
                viewBox="0 0 800 400"
                className="w-full h-full"
                fill="none"
              >
                {Array.from({ length: 40 }).map((_, i) => {
                  const spread = (i - 20) * 8
                  return (
                    <path
                      key={i}
                      className="cholesky-path"
                      d={`M 0 200 C 200 ${200 + spread * 0.3}, 450 ${200 + spread * 1.2}, 800 ${200 + spread * 2.5}`}
                      stroke={i === 20 ? "#2D5BFF" : "#ECEFF5"}
                      strokeWidth={i === 20 ? "2" : "0.75"}
                      strokeOpacity={i === 20 ? "1" : "0.35"}
                      strokeDasharray="1000"
                    />
                  )
                })}
              </svg>
            </div>

            {/* Spatial Syntax Text */}
            <div className="max-w-xl">
              <h2 className="font-sans text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-[0.94] tracking-[-0.03em] uppercase">
                One million realizations
              </h2>
              <div className="mt-3 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575]">
                <p className="text-[#ECEFF5]">True randomness obeys numerical law</p>
                <p className="pl-[18px]">Correlated paths factor via Cholesky decomposition</p>
                <p className="pl-[36px] text-[#2D5BFF]">Tail risks emerge with precision</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
