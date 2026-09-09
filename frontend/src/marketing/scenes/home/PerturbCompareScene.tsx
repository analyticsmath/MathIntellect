import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const PerturbCompareScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const perturbedPathRef = useRef<SVGPathElement | null>(null);
  const assumptionBadgeRef = useRef<HTMLDivElement | null>(null);
  const compareTextRef = useRef<HTMLDivElement | null>(null);
  const deltaMetricsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: pinStageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // 1. Assumption change triggered: sigma jumps 0.25 -> 0.45
      tl.to(
        assumptionBadgeRef.current,
        {
          borderColor: '#983E36',
          backgroundColor: '#F8F9F8',
          duration: 0.2,
          ease: 'power1.out',
        },
        0.2
      );

      // 2. Geometry branches into perturbed trajectory
      tl.fromTo(
        perturbedPathRef.current,
        { strokeDashoffset: 600, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.4, ease: 'none' },
        0.3
      );

      // 3. Headline transitions: "Change one assumption" -> "Compare what moved"
      tl.to(
        compareTextRef.current,
        { opacity: 1, y: 0, duration: 0.25, ease: 'power1.out' },
        0.55
      );

      // 4. Output delta aligns on shared coordinate axis
      tl.fromTo(
        deltaMetricsRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power1.out' },
        0.7
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-paper border-b border-mi-rule"
      aria-label="Change One Assumption, Compare What Moved"
    >
      <div
        ref={pinStageRef}
        className="w-full min-h-[100svh] py-16 px-6 sm:px-8 lg:px-16 flex flex-col justify-center max-w-[1600px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left 4 Cols: Story & Dynamic Headline */}
          <div className="lg:col-span-4 space-y-6">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Movement 07 and 08: Perturbation and Comparison
            </span>
            <div className="relative">
              <h2 className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-ink">
                Change one assumption.
              </h2>
              <div
                ref={compareTextRef}
                className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-data-red opacity-0 -translate-y-2 mt-2"
              >
                Compare what moved.
              </div>
            </div>

            <p className="text-mi-ink-2 text-base leading-relaxed">
              Isolate causality by holding seeds and environmental constants static while perturbing a single parameter. Both outcomes align against shared coordinates without perceptual guesswork.
            </p>

            {/* Perturbed Parameter Indicator */}
            <div
              ref={assumptionBadgeRef}
              className="p-4 bg-mi-canvas border border-mi-rule space-y-2 font-mono text-xs transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Baseline Parameter</span>
                <span className="text-mi-ink font-medium">σ = 0.25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Perturbed Parameter</span>
                <span className="text-mi-data-red font-semibold">σ' = 0.45</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-mi-rule">
                <span className="text-mi-muted uppercase">Random Seed</span>
                <span className="text-mi-ink font-medium">42 (Exact Invariant)</span>
              </div>
            </div>

            {/* Output Delta Metrics */}
            <div
              ref={deltaMetricsRef}
              className="grid grid-cols-2 gap-4 p-4 border border-mi-rule bg-mi-white font-mono text-xs opacity-0"
            >
              <div>
                <span className="text-mi-muted block text-[10px] uppercase">Terminal Mean Δ</span>
                <span className="text-mi-ink font-medium text-sm">+0.012 (Unchanged)</span>
              </div>
              <div>
                <span className="text-mi-muted block text-[10px] uppercase">Terminal Variance Δ</span>
                <span className="text-mi-data-red font-medium text-sm">+0.142 (Expanded)</span>
              </div>
            </div>
          </div>

          {/* Right 8 Cols: Shared Coordinate Axis Visualizing Branched Geometries */}
          <div className="lg:col-span-8 bg-mi-canvas border border-mi-rule p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4 text-xs font-mono text-mi-muted">
              <span>SHARED AXIS STATE COMPARISON</span>
              <span>BASELINE (SOLID) VS PERTURBED (DASHED)</span>
            </div>

            <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] bg-mi-white border border-mi-rule">
              <svg viewBox="0 0 540 240" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Shared Axes */}
                <line x1="30" y1="20" x2="30" y2="220" stroke="#CFD4D0" strokeWidth="1" />
                <line x1="30" y1="120" x2="510" y2="120" stroke="#CFD4D0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="510" y1="20" x2="510" y2="220" stroke="#CFD4D0" strokeWidth="1" />

                {/* Baseline Path (Sigma = 0.25): Calibrated dispersion */}
                <path
                  d="M 30 120 C 120 120 180 100 270 95 C 360 90 440 105 510 102"
                  fill="none"
                  stroke="#315F7A"
                  strokeWidth="2"
                />
                <circle cx="510" cy="102" r="4" fill="#315F7A" />

                {/* Perturbed Path (Sigma = 0.45): High dispersion */}
                <path
                  ref={perturbedPathRef}
                  d="M 30 120 C 120 120 180 65 270 52 C 360 40 440 25 510 32"
                  fill="none"
                  stroke="#983E36"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <circle cx="510" cy="32" r="4" fill="#983E36" />

                {/* Delta Bracket at Terminal Line x = 510 */}
                <line x1="518" y1="32" x2="518" y2="102" stroke="#101311" strokeWidth="1" />
                <line x1="514" y1="32" x2="522" y2="32" stroke="#101311" strokeWidth="1" />
                <line x1="514" y1="102" x2="522" y2="102" stroke="#101311" strokeWidth="1" />
                <text x="526" y="70" fill="#101311" fontSize="10" fontFamily="IBM Plex Mono">
                  Δ = +70px
                </text>
              </svg>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-mi-rule font-mono text-[11px]">
              <span className="text-mi-data-blue">■ Baseline: σ = 0.25</span>
              <span className="text-mi-data-red">■ Perturbed: σ' = 0.45</span>
              <span className="text-mi-muted">Shared Coordinate Zero (y=120)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
