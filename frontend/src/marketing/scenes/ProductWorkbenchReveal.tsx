import { useState } from 'react';
import { Link } from 'react-router-dom';

type ActiveTab = 'moments' | 'distribution' | 'invariants';

export function ProductWorkbenchReveal() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('moments');

  return (
    <section className="w-full py-24 md:py-36 bg-mi-dark-0 text-mi-cream overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 space-y-6 mb-16 text-center">
        <span className="font-sans text-xs md:text-sm text-mi-muted tracking-wider uppercase">
          Live Analytical Environment
        </span>
        <h2 className="font-serif text-mi-cream text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] tracking-tight max-w-3xl mx-auto">
          Then work with the model itself.
        </h2>
        <p className="font-sans text-sm md:text-base text-mi-copy max-w-2xl mx-auto leading-relaxed">
          The Math Intellect workbench transforms abstract formulations into interactive simulations, empirical quantile distributions, and actionable decision criteria.
        </p>
      </div>

      {/* Real Workbench UI Presentation (No Device Mockup / No Fake Frame) */}
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="rounded-2xl border border-mi-photo-line bg-mi-paper text-mi-ink shadow-2xl overflow-hidden">
          {/* Workbench Header Rail */}
          <div className="h-14 px-6 bg-mi-canvas border-b border-mi-rule flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-mi-success" />
              <span className="font-sans text-xs font-semibold tracking-wide text-mi-ink">
                SIMULATION WORKBENCH: STOCHASTIC DIFFUSION RUN #0412
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-mi-muted">N = 5,000 PATHS</span>
              <span className="text-mi-rule">•</span>
              <span className="font-mono text-[11px] text-mi-success">CONVERGED</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-mi-rule bg-mi-surface-soft px-6">
            <button
              onClick={() => setActiveTab('moments')}
              className={`py-3 px-4 font-sans text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'moments'
                  ? 'border-mi-ink text-mi-ink font-semibold'
                  : 'border-transparent text-mi-muted hover:text-mi-ink'
              }`}
            >
              1. Key Moments (Summary)
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`py-3 px-4 font-sans text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'distribution'
                  ? 'border-mi-ink text-mi-ink font-semibold'
                  : 'border-transparent text-mi-muted hover:text-mi-ink'
              }`}
            >
              2. Distribution &amp; Quantiles
            </button>
            <button
              onClick={() => setActiveTab('invariants')}
              className={`py-3 px-4 font-sans text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'invariants'
                  ? 'border-mi-ink text-mi-ink font-semibold'
                  : 'border-transparent text-mi-muted hover:text-mi-ink'
              }`}
            >
              3. Governing Invariants
            </button>
          </div>

          {/* Workbench Body */}
          <div className="p-6 md:p-8 space-y-6">
            {activeTab === 'moments' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-mi-canvas border border-mi-rule rounded-lg">
                    <div className="font-mono text-[11px] text-mi-muted uppercase">Expected Value (Mean)</div>
                    <div className="font-sans text-2xl font-bold text-mi-ink mt-1">142.84</div>
                    <div className="font-mono text-[10px] text-mi-success mt-1">Δ +4.2% vs baseline</div>
                  </div>
                  <div className="p-4 bg-mi-canvas border border-mi-rule rounded-lg">
                    <div className="font-mono text-[11px] text-mi-muted uppercase">Std Deviation (σ)</div>
                    <div className="font-sans text-2xl font-bold text-mi-ink mt-1">18.62</div>
                    <div className="font-mono text-[10px] text-mi-muted mt-1">Variance: 346.70</div>
                  </div>
                  <div className="p-4 bg-mi-canvas border border-mi-rule rounded-lg">
                    <div className="font-mono text-[11px] text-mi-muted uppercase">10th Percentile (P10)</div>
                    <div className="font-sans text-2xl font-bold text-mi-change mt-1">118.40</div>
                    <div className="font-mono text-[10px] text-mi-muted mt-1">Downside support</div>
                  </div>
                  <div className="p-4 bg-mi-canvas border border-mi-rule rounded-lg">
                    <div className="font-mono text-[11px] text-mi-muted uppercase">90th Percentile (P90)</div>
                    <div className="font-sans text-2xl font-bold text-mi-ink mt-1">167.15</div>
                    <div className="font-mono text-[10px] text-mi-muted mt-1">Upside ceiling</div>
                  </div>
                </div>

                {/* SVG Simulated Trajectory Field */}
                <div className="p-6 bg-mi-canvas border border-mi-rule rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-semibold text-mi-ink">SAMPLE TRAJECTORIES (N=50 TRACES)</span>
                    <span className="font-mono text-[11px] text-mi-muted">t = 0 to 100 STEPS</span>
                  </div>
                  <svg className="w-full h-48 md:h-64 stroke-current" viewBox="0 0 800 200" fill="none">
                    <path d="M 0 100 L 800 100" stroke="#D8DDDA" strokeWidth="1" strokeDasharray="4 4" />
                    {/* Simulated deterministic path traces */}
                    <path d="M 0 100 Q 200 80 400 60 T 800 45" stroke="#BAC1BD" strokeWidth="1.2" opacity="0.6" />
                    <path d="M 0 100 Q 180 120 400 110 T 800 90" stroke="#BAC1BD" strokeWidth="1.2" opacity="0.6" />
                    <path d="M 0 100 Q 220 90 400 130 T 800 140" stroke="#BAC1BD" strokeWidth="1.2" opacity="0.6" />
                    <path d="M 0 100 Q 150 70 400 85 T 800 70" stroke="#2457E6" strokeWidth="2.5" opacity="1" />
                    <path d="M 0 100 Q 240 140 400 150 T 800 165" stroke="#E35A35" strokeWidth="2" opacity="0.9" />
                  </svg>
                </div>
              </div>
            )}

            {activeTab === 'distribution' && (
              <div className="space-y-4">
                <div className="p-6 bg-mi-canvas border border-mi-rule rounded-lg">
                  <div className="font-sans text-xs font-semibold text-mi-ink mb-4">EMPIRICAL DENSITY HISTOGRAM</div>
                  <div className="grid grid-cols-12 gap-2 h-44 items-end pt-4">
                    {[12, 24, 45, 80, 140, 195, 240, 210, 160, 95, 50, 20].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div
                          className="w-full bg-mi-ink rounded-t-sm transition-all duration-500"
                          style={{ height: `${(h / 240) * 100}%` }}
                        />
                        <span className="font-mono text-[9px] text-mi-muted">{100 + i * 8}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invariants' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-mi-canvas border border-mi-rule rounded-lg space-y-2">
                  <div className="font-sans text-xs font-semibold text-mi-ink">Conservation Law</div>
                  <p className="font-sans text-xs text-mi-text leading-relaxed">
                    Total probability integral ∑ P(x) dx = 1.0000 across all 5,000 trajectories.
                  </p>
                </div>
                <div className="p-5 bg-mi-canvas border border-mi-rule rounded-lg space-y-2">
                  <div className="font-sans text-xs font-semibold text-mi-ink">Martingale Property</div>
                  <p className="font-sans text-xs text-mi-text leading-relaxed">
                    Drift-adjusted conditional expectation E[X_t | F_s] = X_s confirmed within 0.02% numerical tolerance.
                  </p>
                </div>
              </div>
            )}

            {/* Direct Link to Workbench Action */}
            <div className="pt-4 flex items-center justify-between border-t border-mi-rule">
              <span className="font-sans text-xs text-mi-muted">
                Inspect raw matrix datasets and export full LaTeX derivations.
              </span>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mi-ink text-mi-paper font-sans text-xs font-semibold hover:bg-mi-ink-2 transition-colors"
              >
                Launch Workbench →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
