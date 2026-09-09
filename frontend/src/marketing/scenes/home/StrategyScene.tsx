import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KaTeXBlock } from '../../../math/KaTeXBlock';

gsap.registerPlugin(ScrollTrigger);

export const StrategyScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const cellNashRef = useRef<HTMLDivElement | null>(null);
  const dominantBadgeRef = useRef<HTMLDivElement | null>(null);

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
          end: '+=130%',
          pin: pinStageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // Oppose -> Counter: Highlight dominant strategies
      tl.fromTo(
        dominantBadgeRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power1.out' }
      );

      // Adapt -> Converge: Highlight Pure Nash Equilibrium Cell
      tl.fromTo(
        cellNashRef.current,
        { backgroundColor: 'transparent', borderColor: '#CFD4D0' },
        {
          backgroundColor: '#F8F9F8',
          borderColor: '#101311',
          duration: 0.45,
          ease: 'power2.out',
        },
        0.35
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-canvas border-b border-mi-rule"
      aria-label="Strategy Has Consequences"
    >
      <div
        ref={pinStageRef}
        className="w-full min-h-[100svh] py-16 px-6 sm:px-8 lg:px-16 flex flex-col justify-center max-w-[1600px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left 5 Cols: Strategic Context */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Movement 04: Strategic Equilibrium
            </span>
            <h2 className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-ink">
              Strategy has consequences.
            </h2>
            <p className="text-mi-ink-2 text-base leading-relaxed">
              When payoff states depend on another rational actor's choice, optimal decisions are determined by dominant strategy bounds and pure-strategy Nash equilibrium.
            </p>

            <div className="pt-2">
              <KaTeXBlock math="u_i(s_i^*, s_{-i}^*) \ge u_i(s_i, s_{-i}^*) \quad \forall s_i \in S_i" />
            </div>

            <div
              ref={dominantBadgeRef}
              className="p-4 bg-mi-paper border border-mi-rule space-y-1 font-mono text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Dominant Strategy</span>
                <span className="text-mi-ink font-medium">Detect: Defect (s₂)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Equilibrium Mode</span>
                <span className="text-mi-ink font-medium">Pure-Strategy Nash</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Pareto Status</span>
                <span className="text-mi-data-amber font-medium">Sub-optimal at (s₂, s₂)</span>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Product-Native Payoff Matrix Representation */}
          <div className="lg:col-span-7 bg-mi-paper border border-mi-rule p-8 sm:p-10">
            <div className="flex justify-between items-center mb-6 text-xs font-mono text-mi-muted">
              <span>NORMAL-FORM PAYOFF TENSOR</span>
              <span>2 PLAYERS × 2 STRATEGIES</span>
            </div>

            {/* Matrix Layout */}
            <div className="relative">
              {/* Column Player Header */}
              <div className="grid grid-cols-2 gap-4 ml-24 mb-3 text-center font-mono text-xs text-mi-ink-2">
                <div className="p-2 border border-mi-rule bg-mi-canvas">
                  <span className="text-mi-muted block text-[10px]">PLAYER 2</span>
                  <span>Cooperate (c₁)</span>
                </div>
                <div className="p-2 border border-mi-rule bg-mi-canvas">
                  <span className="text-mi-muted block text-[10px]">PLAYER 2</span>
                  <span>Defect (c₂)</span>
                </div>
              </div>

              {/* Row 1: Cooperate (r₁) */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 p-2 text-center border border-mi-rule bg-mi-canvas font-mono text-xs text-mi-ink-2">
                  <span className="text-mi-muted block text-[10px]">PLAYER 1</span>
                  <span>Cooperate (r₁)</span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {/* Cell (r1, c1) - Pareto optimal */}
                  <div className="p-6 border border-mi-rule bg-mi-white text-center space-y-1">
                    <span className="font-mono text-xs text-mi-muted block">Mutual Cooperation</span>
                    <span className="font-mono text-lg font-medium text-mi-ink block">(+3, +3)</span>
                    <span className="font-mono text-[10px] text-mi-data-green block">Pareto Optimal</span>
                  </div>
                  {/* Cell (r1, c2) - Sucker's payoff */}
                  <div className="p-6 border border-mi-rule bg-mi-white text-center space-y-1">
                    <span className="font-mono text-xs text-mi-muted block">Exploited</span>
                    <span className="font-mono text-lg font-medium text-mi-ink block">(−2, +5)</span>
                    <span className="font-mono text-[10px] text-mi-muted block">Asymmetric</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Defect (r₂) */}
              <div className="flex items-center gap-4">
                <div className="w-20 p-2 text-center border border-mi-rule bg-mi-canvas font-mono text-xs text-mi-ink-2">
                  <span className="text-mi-muted block text-[10px]">PLAYER 1</span>
                  <span>Defect (r₂)</span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {/* Cell (r2, c1) - Temptation */}
                  <div className="p-6 border border-mi-rule bg-mi-white text-center space-y-1">
                    <span className="font-mono text-xs text-mi-muted block">Temptation</span>
                    <span className="font-mono text-lg font-medium text-mi-ink block">(+5, −2)</span>
                    <span className="font-mono text-[10px] text-mi-muted block">Asymmetric</span>
                  </div>
                  {/* Cell (r2, c2) - Nash Equilibrium */}
                  <div
                    ref={cellNashRef}
                    className="p-6 border-2 border-mi-ink bg-mi-paper text-center space-y-1 relative"
                  >
                    <span className="font-mono text-xs text-mi-muted block">Mutual Defection</span>
                    <span className="font-mono text-lg font-semibold text-mi-ink block">(−1, −1)</span>
                    <span className="font-mono text-[10px] text-mi-data-red font-medium block">
                      ★ PURE NASH EQUILIBRIUM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-mi-rule flex justify-between items-center font-mono text-[11px] text-mi-muted">
              <span>Payoffs: (Player 1, Player 2)</span>
              <span>Strictly Dominant Equilibrium: (r₂, c₂)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
