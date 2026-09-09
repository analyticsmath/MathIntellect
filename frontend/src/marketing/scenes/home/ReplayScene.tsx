import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ReplayScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [replaying, setReplaying] = useState(false);

  // Function to manually trigger replay animation
  const handleReplayClick = () => {
    if (replaying) return;
    setReplaying(true);
    gsap.fromTo(
      pathRef.current,
      { strokeDashoffset: 500 },
      {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => setReplaying(false),
      }
    );
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pathRef.current,
        { strokeDashoffset: 500 },
        {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-canvas border-b border-mi-rule py-20 px-6 sm:px-8 lg:px-16"
      aria-label="Replay the Same State"
    >
      <div
        ref={pinStageRef}
        className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
      >
        {/* Left 5 Cols: Reproducibility Proposition */}
        <div className="lg:col-span-5 space-y-6">
          <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
            Movement 09: Deterministic Reproducibility
          </span>
          <h2 className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-ink">
            Replay the same state.
          </h2>
          <p className="text-mi-ink-2 text-base leading-relaxed">
            Replay the same analytical state and check the evidence again. With fixed pseudo-random seeds and immutable parameter snapshots, the exact numerical trajectory re-emerges every time.
          </p>

          {/* Seed State Capsule */}
          <div className="p-4 bg-mi-paper border border-mi-rule space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-mi-muted uppercase">Execution Seed</span>
              <span className="text-mi-ink font-semibold">seed = 42</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mi-muted uppercase">PRNG Algorithm</span>
              <span className="text-mi-ink">mulberry32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mi-muted uppercase">Floating Precision</span>
              <span className="text-mi-ink">IEEE-754 64-bit float</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReplayClick}
            disabled={replaying}
            className="inline-flex items-center gap-3 bg-mi-ink text-mi-paper font-sans text-sm font-medium px-5 py-3 hover:bg-mi-ink-2 transition-colors disabled:opacity-50"
          >
            <span>{replaying ? 'Reconstructing path...' : 'Replay identical state'}</span>
            <span className="font-mono text-xs text-mi-muted">↺</span>
          </button>
        </div>

        {/* Right 7 Cols: State Reconstruction Geometry */}
        <div className="lg:col-span-7 bg-mi-paper border border-mi-rule p-8 sm:p-10">
          <div className="flex justify-between items-center mb-6 text-xs font-mono text-mi-muted">
            <span>DETERMINISTIC TRAJECTORY RECONSTRUCTION</span>
            <span>IDENTICAL RUN HASH GUARANTEE</span>
          </div>

          <div className="relative w-full aspect-[16/9] bg-mi-canvas border border-mi-rule p-6 flex items-center justify-center">
            <svg viewBox="0 0 480 200" className="w-full h-full overflow-visible">
              {/* Coordinates */}
              <line x1="20" y1="100" x2="460" y2="100" stroke="#CFD4D0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="20" x2="20" y2="180" stroke="#CFD4D0" strokeWidth="1" />
              <line x1="460" y1="20" x2="460" y2="180" stroke="#CFD4D0" strokeWidth="1" />

              {/* Deterministic Path: Reconstructs to exact same coordinates */}
              <path
                ref={pathRef}
                d="M 20 100 Q 80 40 160 85 T 300 60 T 400 130 T 460 70"
                fill="none"
                stroke="#101311"
                strokeWidth="2"
                strokeDasharray="500"
                strokeDashoffset="0"
              />
              <circle cx="20" cy="100" r="3.5" fill="#101311" />
              <circle cx="460" cy="70" r="3.5" fill="#315F7A" />
            </svg>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-mi-rule font-mono text-[11px] text-mi-muted">
            <span>Input state locked</span>
            <span className="text-mi-ink font-medium">Coordinate divergence: 0.000000</span>
          </div>
        </div>
      </div>
    </section>
  );
};
