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
          { yPercent: -6, scale: 1.05 },
          { yPercent: 6, scale: 1.0, ease: "none" },
          0
        )

        // Asymmetric macro optical inset counter-drift
        tl.fromTo(
          macroInset.current,
          { yPercent: 10 },
          { yPercent: -10, ease: "none" },
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

        {/* Primary Photographic Mass: Concrete anchored to left edge (w-[72vw] h-[85vh] top-0 left-0) */}
        <div className="absolute left-0 top-0 w-full lg:w-[72vw] h-[85vh] overflow-hidden bg-[#0E1015] z-10 border-b border-r border-white/10">
          <img
            ref={primaryImage}
            src="/media/math/ahmed-brutalist-concrete.jpg"
            alt="Monolithic concrete structural mass under raking light"
            className="absolute left-0 top-[-10%] h-[120%] w-full object-cover grayscale contrast-125 brightness-90 will-change-transform"
          />
          {/* Smooth horizontal right-edge gradient fade to #07080B */}
          <div className="absolute inset-y-0 right-0 w-[45%] bg-gradient-to-r from-transparent to-[#07080B] pointer-events-none" />
          {/* Bottom gradient fade to void */}
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#07080B] via-[#07080B]/60 to-transparent pointer-events-none" />
        </div>

        {/* 1px Coordinate Line connecting concrete frame (72vw) to docked laser inset (76vw) */}
        <div className="absolute top-[28svh] left-[72vw] right-[24vw] h-[1px] bg-white/20 z-20 pointer-events-none hidden lg:block">
          <span className="absolute -top-3.5 left-3 font-mono text-[8px] tracking-[0.14em] text-[#5F6575] uppercase">
            COORD // TENSOR REF
          </span>
          <span className="absolute -top-[3px] left-0 w-[7px] h-[7px] border-l border-t border-[#2D5BFF]" />
        </div>

        {/* Secondary Macro Optical Laser Inset: Docked on right plane */}
        <div
          ref={macroInset}
          className="absolute right-[4vw] top-[14svh] w-[20vw] h-[32svh] overflow-hidden bg-[#0E1015] border border-white/15 z-20 hidden lg:block"
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

        {/* Embedded Headline & Spatial Syntax Block: Overlapping bottom third and bleeding into right canvas */}
        <div className="absolute left-[6vw] bottom-[10svh] z-30 max-w-5xl">
          <h1 className="font-['Space_Grotesk',sans-serif] text-[clamp(3rem,6.5vw,5.75rem)] font-medium leading-[0.88] tracking-[-0.045em] text-[#ECEFF5] uppercase">
            Reality without approximation
          </h1>

          <div className="mt-6 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575]">
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

          {/* Milled Button Upgrade */}
          <div className="mt-8 flex items-center gap-6">
            <a
              href="/app/simulations/new"
              className="group inline-flex items-center gap-3 bg-[#0E1015] text-[#ECEFF5] border border-white/20 rounded-xl px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)] hover:border-white/40 hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.25)] transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5BFF] shadow-[0_0_8px_#2D5BFF] animate-pulse" />
              <span>Initialize Run</span>
              <span className="text-[#5F6575] group-hover:text-[#ECEFF5] group-hover:translate-x-0.5 transition-all duration-150">
                →
              </span>
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
