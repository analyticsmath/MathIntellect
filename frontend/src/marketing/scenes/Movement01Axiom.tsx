import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DESKTOP_MOTION } from "../components/DesktopLenisBridge"
import { SystemAnchorOverlay } from "../components/SystemAnchorOverlay"

gsap.registerPlugin(ScrollTrigger)

export function Movement01Axiom() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const primaryImage = useRef<HTMLImageElement>(null)
  const macroInset = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(DESKTOP_MOTION, () => {
      if (!root.current || !stage.current || !primaryImage.current || !macroInset.current) return

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "movement01Axiom",
            trigger: root.current,
            pin: stage.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.35}`,
            scrub: 0.65,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        })

        // Inner image counter-translation against container pin
        tl.fromTo(
          primaryImage.current,
          { yPercent: -8, scale: 1.05 },
          { yPercent: 8, scale: 1.0, ease: "none" },
          0
        )

        // Asymmetric macro optical inset counter-drift
        tl.fromTo(
          macroInset.current,
          { yPercent: 12 },
          { yPercent: -12, ease: "none" },
          0
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
          systemTag="SYSTEM // AXIOM LOAD MATRIX"
          telemetryMetric="PRNG // MULBERRY32 : 0x77A1F9"
          coordSystem="COORD // X 847.22 Y 119.04 Z 0.91"
          verificationState="VERIFIED // REPLAY READY"
        />

        {/* Primary Photographic Mass: Ahmed's Brutalist Concrete Cantilever */}
        <div className="absolute left-[5vw] top-[10svh] w-[90vw] lg:w-[65vw] h-[78svh] overflow-hidden bg-[#0E1015] z-10">
          <img
            ref={primaryImage}
            src="/media/math/ahmed-brutalist-concrete.jpg"
            alt="Monolithic concrete structural mass under raking light"
            className="absolute left-0 top-[-14%] h-[128%] w-full object-cover grayscale contrast-125 brightness-90 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Secondary Macro Optical Laser Inset: Asymmetric Counter-Plane */}
        <div
          ref={macroInset}
          className="absolute right-[5vw] top-[18svh] w-[22vw] h-[34svh] overflow-hidden bg-[#0E1015] border border-white/10 z-20 hidden lg:block"
        >
          <img
            src="/media/math/optical-laser-refraction.jpg"
            alt="Laser beam split through precision coated prism"
            className="w-full h-full object-cover grayscale contrast-150 brightness-75"
          />
          <div className="absolute bottom-2 right-2 font-mono text-[8px] tracking-wider text-white/50 bg-black/60 px-1.5 py-0.5">
            TENSOR // 01
          </div>
        </div>

        {/* Spatial Syntax Typographic Block: Zero Dashes, Zero Commas */}
        <div className="absolute left-[8vw] bottom-[12svh] z-30 max-w-2xl">
          <h1 className="font-sans text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-[0.92] tracking-[-0.035em] text-[#ECEFF5] uppercase">
            Reality without approximation
          </h1>

          <div className="mt-5 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575]">
            <p className="text-[#ECEFF5]">
              Deterministic computation replaces generative guesswork
            </p>
            <p className="pl-[18px] text-[#ECEFF5]/80">
              Systems move under physical law
            </p>
            <p className="pl-[36px] text-[#2D5BFF]">
              You command the outcome
            </p>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <a
              href="/app/simulations/new"
              className="inline-block bg-[#ECEFF5] text-[#07080B] font-mono text-[11px] uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-white transition-colors"
            >
              Initialize Run
            </a>
            <span className="font-mono text-[9px] tracking-[0.14em] text-[#5F6575]">
              LOCK: SHA256_ACTIVE
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
