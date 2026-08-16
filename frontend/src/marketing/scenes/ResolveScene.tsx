import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveMedia } from '../../media/ResponsiveMedia';

export const ResolveScene: React.FC = () => {
  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 max-w-[1720px] mx-auto border-t border-mi-rule">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 cols: Core Thesis on Epistemic Clarity */}
        <div className="lg:col-span-6 space-y-6">
          <div className="text-[12px] font-mono text-mi-muted uppercase tracking-wider">
            Chapter 07 — Resolve &amp; Epistemic Boundaries
          </div>
          <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-medium text-mi-ink tracking-tight leading-[1.08]">
            Know what came from the model.
          </h2>
          <p className="text-[18px] md:text-[20px] text-mi-text font-normal leading-relaxed">
            Calculated evidence, uncertainty and generated interpretation stay distinct.
          </p>

          {/* Three Explicit Epistemic Layers */}
          <div className="space-y-4 pt-4">
            <div className="p-4 border-l-2 border-mi-ink bg-mi-paper border border-mi-rule space-y-1">
              <div className="text-xs font-mono text-mi-ink uppercase font-semibold">
                1. Calculated Evidence (Mathematical Truth)
              </div>
              <p className="text-xs text-mi-text leading-relaxed">
                Exact outputs derived from numerical solvers, matrix algorithms, and deterministic probability integrals. Fully reproducible from initial parameters and seeds.
              </p>
            </div>

            <div className="p-4 border-l-2 border-mi-change bg-mi-paper border border-mi-rule space-y-1">
              <div className="text-xs font-mono text-mi-change uppercase font-semibold">
                2. Model Uncertainty &amp; Boundary Limits
              </div>
              <p className="text-xs text-mi-text leading-relaxed">
                Confidence intervals, parameter sensitivity limits, and variance bounds. Explicit identification of where model assumptions break down.
              </p>
            </div>

            <div className="p-4 border-l-2 border-mi-focus bg-mi-paper border border-mi-rule space-y-1">
              <div className="text-xs font-mono text-mi-focus uppercase font-semibold">
                3. Generated Interpretation (Contextual Layer)
              </div>
              <p className="text-xs text-mi-text leading-relaxed">
                Language model synthesis designed to explain trade-offs and suggest scenario variations. Clearly demarcated as synthetic commentary, never calculation.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Link
              to="/app/simulations/new"
              className="mi-btn-primary px-7 h-12 text-sm"
            >
              Start in the Workbench
            </Link>
            <Link
              to="/method"
              className="mi-btn-secondary px-6 h-12 text-sm"
            >
              Read full methodology
            </Link>
          </div>
        </div>

        {/* Right 6 cols: Method Engineering Detail (MI-08) */}
        <div className="lg:col-span-6 border border-mi-rule bg-mi-paper p-4 md:p-6 space-y-4">
          <ResponsiveMedia mediaKey="mi-08" aspectRatio="16/10" className="w-full" />
          <div className="flex items-center justify-between text-xs font-mono text-mi-muted pt-2 border-t border-mi-rule">
            <span>MI-08 • BLUEPRINT VALIDATION</span>
            <span>SPEC: RIGOROUS PROVENANCE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
