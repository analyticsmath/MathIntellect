import React, { useState } from 'react';
import { ResponsiveMedia } from '../../media/ResponsiveMedia';
import { MathExpression } from '../../math/MathExpression';

export const WorldStructureTransition: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    { id: 0, label: 'Physical world', desc: 'Raw engineered landscape and continuous physical flow' },
    { id: 1, label: 'Attention', desc: 'Isolating critical boundaries, bottlenecks and crossings' },
    { id: 2, label: 'Structure', desc: 'Abstracting topology into discrete state vectors and links' },
    { id: 3, label: 'Model language', desc: 'Expressing governing differential and stochastic equations' },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 max-w-[1720px] mx-auto border-t border-mi-rule">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-baseline">
        <div className="lg:col-span-4">
          <div className="text-[12px] font-mono text-mi-muted uppercase tracking-wider">
            Chapter 02 — Transition
          </div>
          <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-medium text-mi-ink tracking-tight mt-2 leading-[1.08]">
            World → Structure
          </h2>
          <p className="mt-4 text-[16px] md:text-[17px] text-mi-text leading-relaxed">
            Simulation begins by translating complex observed realities into inspectable mathematical primitives without losing the core dynamics.
          </p>

          {/* Interactive State Selector */}
          <div className="mt-8 space-y-2" role="tablist" aria-label="World to structure transformation steps">
            {steps.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={activeStep === s.id}
                onClick={() => setActiveStep(s.id)}
                className={`w-full text-left p-3.5 border transition-all text-sm ${
                  activeStep === s.id
                    ? 'border-mi-ink bg-mi-paper text-mi-ink font-medium shadow-sm'
                    : 'border-mi-rule bg-transparent text-mi-text hover:border-mi-rule-strong hover:bg-mi-paper/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-mi-muted">0{s.id + 1}</span>
                  <span className={activeStep === s.id ? 'text-mi-change text-xs font-mono' : 'text-xs text-mi-muted font-mono'}>
                    {activeStep === s.id ? 'ACTIVE STATE' : 'SELECT'}
                  </span>
                </div>
                <div className="mt-1 font-medium">{s.label}</div>
                <div className="text-xs text-mi-muted mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Transformation Field */}
        <div className="lg:col-span-8 relative border border-mi-rule bg-mi-paper p-6 md:p-8 min-h-[460px] flex flex-col justify-between">
          <div className="relative w-full aspect-[16/9] border border-mi-rule overflow-hidden bg-mi-surface-soft">
            {/* Step 0 & 1: Physical Imagery */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: activeStep === 0 ? 1 : activeStep === 1 ? 0.75 : activeStep === 2 ? 0.35 : 0.1 }}
            >
              <ResponsiveMedia mediaKey="mi-04" aspectRatio="16/9" className="w-full h-full" />
            </div>

            {/* Step 2 & 3: Structural Vector Lines & Mathematical Nodes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
              viewBox="0 0 800 450"
              style={{ opacity: activeStep === 0 ? 0 : activeStep === 1 ? 0.4 : activeStep === 2 ? 0.9 : 1 }}
            >
              <g stroke="#111412" strokeWidth="1.5" strokeDasharray={activeStep === 3 ? 'none' : '4 4'}>
                <line x1="120" y1="225" x2="400" y2="120" />
                <line x1="400" y1="120" x2="680" y2="225" />
                <line x1="400" y1="120" x2="400" y2="340" />
                <line x1="120" y1="225" x2="400" y2="340" />
                <line x1="680" y1="225" x2="400" y2="340" />
              </g>
              <circle cx="120" cy="225" r="7" fill={activeStep === 3 ? '#E35A35' : '#111412'} />
              <circle cx="400" cy="120" r="8" fill="#111412" />
              <circle cx="680" cy="225" r="7" fill={activeStep === 3 ? '#2457E6' : '#111412'} />
              <circle cx="400" cy="340" r="7" fill="#23755B" />

              {activeStep >= 2 && (
                <>
                  <text x="415" y="115" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#111412">Node₀ (Hub)</text>
                  <text x="135" y="220" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#E35A35">Inflow A</text>
                  <text x="695" y="220" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#2457E6">Outflow B</text>
                  <text x="415" y="345" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#23755B">Sink S</text>
                </>
              )}
            </svg>
          </div>

          {/* Mathematical Formulation Footer */}
          <div className="mt-6 pt-4 border-t border-mi-rule flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-mi-muted">GOVERNING EQUATION</div>
              <MathExpression tex="\frac{d\mathbf{x}}{dt} = \mathbf{A}\mathbf{x}(t) + \mathbf{B}\mathbf{u}(t) + \mathbf{\Sigma} d\mathbf{W}_t" display={false} />
            </div>
            <div className="text-xs font-mono text-mi-text">
              DISCRETE STATE SPACE: <span className="font-semibold text-mi-ink">4 NODES • 5 LINKS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
