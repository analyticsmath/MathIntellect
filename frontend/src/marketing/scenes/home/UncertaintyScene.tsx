import React, { useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KaTeXBlock } from '../../../math/KaTeXBlock';

gsap.registerPlugin(ScrollTrigger);

// Seeded PRNG for deterministic path generation
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianPair(prng: () => number): [number, number] {
  const u1 = Math.max(1e-7, prng());
  const u2 = prng();
  const r = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

export const UncertaintyScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const pathsGroupRef = useRef<SVGGElement | null>(null);
  const histGroupRef = useRef<SVGGElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  // Compute 24 deterministic sample paths
  const { paths, endpoints, mean, variance, histogramBins } = useMemo(() => {
    const prng = mulberry32(108);
    const numPaths = 24;
    const steps = 40;
    const mu = 0.04;
    const sigma = 0.32;
    const dt = 1.0 / steps;
    const sqrtDt = Math.sqrt(dt);

    const generatedPaths: number[][] = [];
    const eps: number[] = [];

    for (let p = 0; p < numPaths; p++) {
      const path = [0];
      let val = 0;
      for (let s = 1; s <= steps; s += 2) {
        const [z1, z2] = gaussianPair(prng);
        val += mu * dt + sigma * sqrtDt * z1;
        path.push(val);
        if (s + 1 <= steps) {
          val += mu * dt + sigma * sqrtDt * z2;
          path.push(val);
        }
      }
      generatedPaths.push(path);
      eps.push(val);
    }

    const m = eps.reduce((a, b) => a + b, 0) / eps.length;
    const v = eps.reduce((a, b) => a + Math.pow(b - m, 2), 0) / eps.length;

    // 8-bin histogram
    const minVal = Math.min(...eps);
    const maxVal = Math.max(...eps);
    const range = Math.max(0.01, maxVal - minVal);
    const binCount = 7;
    const bins = new Array(binCount).fill(0);
    eps.forEach((val) => {
      const idx = Math.min(binCount - 1, Math.floor(((val - minVal) / range) * binCount));
      bins[idx]++;
    });

    return {
      paths: generatedPaths,
      endpoints: eps,
      mean: m,
      variance: v,
      histogramBins: bins,
    };
  }, []);

  // SVG dimensions: 600 width, 240 height
  const pathStrings = useMemo(() => {
    const steps = 40;
    const dx = 420 / steps;
    return paths.map((p) => {
      return p
        .map((yVal, i) => {
          const x = 30 + i * dx;
          // Scale y: map -0.8..0.8 to 210..30
          const y = 120 - yVal * 95;
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
    });
  }, [paths]);

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
          end: '+=135%',
          pin: pinStageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // 1. Sample -> Scatter: Paths reveal from origin
      tl.fromTo(
        pathsGroupRef.current?.querySelectorAll('.mi-mc-path') ?? [],
        { strokeDashoffset: 500 },
        { strokeDashoffset: 0, stagger: 0.015, duration: 0.45, ease: 'none' }
      );

      // 2. Accumulate: Endpoints form
      tl.fromTo(
        pathsGroupRef.current?.querySelectorAll('.mi-mc-endpoint') ?? [],
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, stagger: 0.01, duration: 0.2, ease: 'power1.out' },
        0.4
      );

      // 3. Distribute: Histogram bars emerge
      tl.fromTo(
        histGroupRef.current?.querySelectorAll('.mi-hist-bar') ?? [],
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.03, duration: 0.25, ease: 'power2.out' },
        0.55
      );

      // 4. Quantify: Summary metrics settle
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' },
        0.75
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-canvas border-b border-mi-rule"
      aria-label="Uncertainty Becomes Inspectable"
    >
      <div
        ref={pinStageRef}
        className="w-full min-h-[100svh] py-16 px-6 sm:px-8 lg:px-16 flex flex-col justify-center max-w-[1600px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left 4 Cols: Editorial Context */}
          <div className="lg:col-span-4 space-y-6">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Movement 02: Stochastic Diffusion
            </span>
            <h2 className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-ink">
              Uncertainty becomes inspectable.
            </h2>
            <p className="text-mi-ink-2 text-base leading-relaxed">
              Paths diverge under numerical integration, accumulating into a calibrated terminal distribution. The outcome is not guessed; the variance is explicitly quantified.
            </p>

            <div className="pt-2">
              <KaTeXBlock math="dx_t = \mu x_t dt + \sigma x_t dW_t" />
            </div>

            {/* Computed Statistics Display */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-4 pt-4 border-t border-mi-rule font-mono text-xs"
            >
              <div>
                <span className="text-mi-muted block uppercase">Sample Mean</span>
                <span className="text-mi-ink text-sm font-medium">
                  {mean.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="text-mi-muted block uppercase">Sample Variance</span>
                <span className="text-mi-ink text-sm font-medium">
                  {variance.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Right 8 Cols: Product-Native Path Field & Histogram */}
          <div className="lg:col-span-8 bg-mi-paper border border-mi-rule p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4 text-xs font-mono text-mi-muted">
              <span>ENSEMBLE TRAJECTORY (N=24)</span>
              <span>TERMINAL DENSITY</span>
            </div>

            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1]">
              <svg
                viewBox="0 0 540 240"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Axis lines */}
                <line x1="30" y1="20" x2="30" y2="220" stroke="#CFD4D0" strokeWidth="1" />
                <line x1="30" y1="120" x2="450" y2="120" stroke="#CFD4D0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="450" y1="20" x2="450" y2="220" stroke="#CFD4D0" strokeWidth="1" />

                {/* Path Traces */}
                <g ref={pathsGroupRef}>
                  {pathStrings.map((d, idx) => (
                    <path
                      key={`mc-${idx}`}
                      d={d}
                      fill="none"
                      stroke={idx === 0 ? '#315F7A' : '#101311'}
                      strokeWidth={idx === 0 ? '1.5' : '1'}
                      strokeOpacity={idx === 0 ? '0.9' : '0.4'}
                      strokeDasharray="500"
                      strokeDashoffset="0"
                      className="mi-mc-path"
                    />
                  ))}

                  {/* Endpoints */}
                  {endpoints.map((val, idx) => {
                    const y = 120 - val * 95;
                    return (
                      <circle
                        key={`pt-${idx}`}
                        cx="450"
                        cy={y}
                        r="2.5"
                        fill={idx === 0 ? '#315F7A' : '#101311'}
                        className="mi-mc-endpoint"
                      />
                    );
                  })}
                </g>

                {/* Histogram Bars emerging from x=456 to right */}
                <g ref={histGroupRef}>
                  {histogramBins.map((count, bIdx) => {
                    const barY = 32 + bIdx * 24;
                    const barW = count * 14;
                    return (
                      <rect
                        key={`bin-${bIdx}`}
                        x="456"
                        y={barY}
                        width={barW}
                        height="18"
                        fill="#315F7A"
                        fillOpacity="0.25"
                        stroke="#315F7A"
                        strokeWidth="1"
                        className="mi-hist-bar origin-left"
                      />
                    );
                  })}
                </g>
              </svg>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-mi-rule font-mono text-[11px] text-mi-muted">
              <span>t = 0 (origin)</span>
              <span>t = 1 (T)</span>
              <span>f(x_T)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
