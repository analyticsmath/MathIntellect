import React, { useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Seeded PRNG for market paths
function seededRng(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export const MarketRegimeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const shockMarkerRef = useRef<SVGLineElement | null>(null);
  const regimeBandRef = useRef<SVGRectElement | null>(null);
  const pathsGroupRef = useRef<SVGGElement | null>(null);

  // Generate 12 market paths demonstrating Regime 1 (Calm) -> Shock Event -> Regime 2 (Volatile)
  const pathsData = useMemo(() => {
    const rng = seededRng(314);
    const steps = 60;
    const shockStep = 28;
    const allPaths: string[] = [];

    for (let p = 0; p < 12; p++) {
      let val = 100;
      const pts: [number, number][] = [[20, 120]];

      for (let s = 1; s <= steps; s++) {
        const isShock = s === shockStep;
        const inVolatileRegime = s > shockStep;

        const vol = inVolatileRegime ? 4.2 : 1.2;
        const drift = inVolatileRegime ? -0.4 : 0.2;
        const shockJump = isShock ? (p % 2 === 0 ? -16 : -24) : 0;

        const noise = (rng() - 0.5) * 2 * vol;
        val += drift + noise + shockJump;

        // Map x: 20..520, y: 30..220
        const x = 20 + (s / steps) * 500;
        const y = 120 - (val - 100) * 2.2;
        pts.push([x, Math.max(25, Math.min(215, y))]);
      }

      const d = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');
      allPaths.push(d);
    }

    return allPaths;
  }, []);

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
          end: '+=140%',
          pin: pinStageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // 1. Drift: Paths enter
      tl.fromTo(
        pathsGroupRef.current?.querySelectorAll('.mi-market-path') ?? [],
        { strokeDashoffset: 600 },
        { strokeDashoffset: 0, stagger: 0.02, duration: 0.45, ease: 'none' }
      );

      // 2. Shock: Marker strikes at p ≈ 0.45
      tl.fromTo(
        shockMarkerRef.current,
        { opacity: 0, scaleY: 0 },
        { opacity: 1, scaleY: 1, duration: 0.15, ease: 'power2.out' },
        0.42
      );

      // 3. Switch & Cluster: Regime 2 shading activates
      tl.fromTo(
        regimeBandRef.current,
        { opacity: 0 },
        { opacity: 0.2, duration: 0.2, ease: 'power1.out' },
        0.55
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-paper border-b border-mi-rule"
      aria-label="Markets Move Through Regimes"
    >
      <div
        ref={pinStageRef}
        className="w-full min-h-[100svh] py-16 px-6 sm:px-8 lg:px-16 flex flex-col justify-center max-w-[1600px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left 4 Cols: Editorial */}
          <div className="lg:col-span-4 space-y-6">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Movement 05: Regime Dynamics
            </span>
            <h2 className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-ink">
              Markets move through regimes.
            </h2>
            <p className="text-mi-ink-2 text-base leading-relaxed">
              Stationary assumptions break when structural shocks occur. The market engine models discrete regime shifts, endogenous volatility clustering, and stochastic stress.
            </p>

            <div className="p-4 bg-mi-canvas border border-mi-rule space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Base Model</span>
                <span className="text-mi-ink">Geometric Brownian Motion</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Regime Shift</span>
                <span className="text-mi-ink">Markov Two-State Switch</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Shock Injection</span>
                <span className="text-mi-data-red font-medium">Exogenous Drawdown Event</span>
              </div>
            </div>
          </div>

          {/* Right 8 Cols: Path Field & Regime Banding */}
          <div className="lg:col-span-8 bg-mi-canvas border border-mi-rule p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4 text-xs font-mono text-mi-muted">
              <span>PATH REALIZATIONS WITH EXPLICIT SHOCK</span>
              <span>REGIME 01 (CALM) → REGIME 02 (TURBULENT)</span>
            </div>

            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-mi-white border border-mi-rule">
              <svg
                viewBox="0 0 540 240"
                className="w-full h-full overflow-hidden"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Flat Regime Bands: Solid low-opacity fills, NO GRADIENT */}
                {/* Regime 1: Calm */}
                <rect x="20" y="20" width="233" height="200" fill="#3E6B50" fillOpacity="0.06" />
                <text x="32" y="42" fill="#626864" fontSize="10" fontFamily="IBM Plex Mono">
                  REGIME I: LOW VOLATILITY
                </text>

                {/* Shock Line: x = 253 (step 28) */}
                <line
                  ref={shockMarkerRef}
                  x1="253"
                  y1="20"
                  x2="253"
                  y2="220"
                  stroke="#983E36"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="258" y="42" fill="#983E36" fontSize="10" fontFamily="IBM Plex Mono">
                  SHOCK EVENT
                </text>

                {/* Regime 2: Volatile */}
                <rect
                  ref={regimeBandRef}
                  x="253"
                  y="20"
                  width="267"
                  height="200"
                  fill="#983E36"
                  fillOpacity="0.08"
                />
                <text x="360" y="42" fill="#626864" fontSize="10" fontFamily="IBM Plex Mono">
                  REGIME II: CLUSTERED VOLATILITY
                </text>

                {/* Reference Gridlines */}
                <line x1="20" y1="120" x2="520" y2="120" stroke="#CFD4D0" strokeWidth="1" strokeDasharray="3 3" />

                {/* Paths */}
                <g ref={pathsGroupRef}>
                  {pathsData.map((d, i) => (
                    <path
                      key={`mkt-${i}`}
                      d={d}
                      fill="none"
                      stroke={i === 0 ? '#315F7A' : '#101311'}
                      strokeWidth={i === 0 ? '1.8' : '1'}
                      strokeOpacity={i === 0 ? '0.95' : '0.45'}
                      strokeDasharray="600"
                      strokeDashoffset="0"
                      className="mi-market-path"
                    />
                  ))}
                </g>
              </svg>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-mi-rule font-mono text-[11px] text-mi-muted">
              <span>drift: +0.2 / vol: 1.2</span>
              <span className="text-mi-data-red font-medium">shock: −18%</span>
              <span>drift: −0.4 / vol: 4.2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
