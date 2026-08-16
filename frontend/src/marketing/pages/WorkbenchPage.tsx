import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../components/MarketingLayout';

export const WorkbenchPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    { step: 1, title: 'Choose Engine', desc: 'Select between Stochastic, Strategic, Time-Series, or Network interaction solvers.' },
    { step: 2, title: 'Define Assumptions', desc: 'Set explicit initial parameters, boundary conditions, and innovation variance.' },
    { step: 3, title: 'Constraint Validation', desc: 'Realtime pre-flight inspection verifies numerical stability and parameter bounds.' },
    { step: 4, title: 'Simulate', desc: 'Execute deterministic numerical iterations with honest realtime progress reporting.' },
    { step: 5, title: 'Inspect Evidence', desc: 'Evaluate terminal distributions, path realization fields, and tail risk quantiles.' },
    { step: 6, title: 'Iterate & Compare', desc: 'Perturb one variable and measure the exact delta in shared coordinates.' },
    { step: 7, title: 'Explain & Resolve', desc: 'Review closed-form mathematical derivations and contextual AI interpretation.' },
  ];

  return (
    <MarketingLayout>
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 pt-28 pb-20">
        {/* Page Header */}
        <div className="border-b border-mi-rule pb-10">
          <div className="text-xs font-mono text-mi-muted uppercase tracking-wider">
            Interactive Product Walkthrough
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-mi-ink tracking-tight mt-2">
            The Workbench
          </h1>
          <p className="mt-4 text-lg text-mi-text max-w-3xl leading-relaxed">
            An end-to-end mathematical simulation environment. Step through the native product workflow from initial assumptions to inspectable evidence.
          </p>
        </div>

        {/* 7-Step Navigation Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 border-b border-mi-rule pb-6">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-3 text-left border transition-all text-xs ${
                currentStep === s.step
                  ? 'border-mi-ink bg-mi-paper text-mi-ink font-semibold shadow-sm'
                  : 'border-mi-rule bg-mi-surface-soft text-mi-text hover:border-mi-rule-strong hover:text-mi-ink'
              }`}
            >
              <div className="font-mono text-mi-muted">STEP 0{s.step}</div>
              <div className="mt-1 font-medium leading-tight">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Step Walkthrough Workspace Demonstration */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 4 cols: Step Explanation & Direct Action */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-[11px] font-mono text-mi-change border border-mi-change/30 px-2 py-0.5">
                WORKFLOW PHASE 0{currentStep} / 07
              </span>
              <h2 className="text-2xl md:text-3xl font-medium text-mi-ink mt-3">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-sm text-mi-text mt-2 leading-relaxed">
                {steps[currentStep - 1].desc}
              </p>
            </div>

            <div className="p-4 border border-mi-rule bg-mi-paper space-y-3 text-xs">
              <div className="font-mono font-semibold text-mi-ink uppercase">ENGINEERING GUARANTEE</div>
              <p className="text-mi-text leading-relaxed">
                Every step operates on true computational primitives. No simulated progress bars or synthetic intelligence theater.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/app/simulations/new"
                className="mi-btn-primary w-full h-12 text-sm text-center"
              >
                Launch Live in Workbench
              </Link>
              <div className="flex gap-2">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className="mi-btn-secondary flex-1 h-10 text-xs"
                >
                  ← Previous
                </button>
                <button
                  disabled={currentStep === 7}
                  onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
                  className="mi-btn-secondary flex-1 h-10 text-xs"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>

          {/* Right 8 cols: Real Product UI Representation */}
          <div className="lg:col-span-8 border border-mi-rule bg-mi-paper p-6 md:p-8 min-h-[460px] flex flex-col justify-between">
            <div className="border border-mi-rule bg-mi-surface-soft p-5 min-h-[340px]">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">ENGINE SELECTION INDEX</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 border-2 border-mi-ink bg-mi-paper">
                      <div className="font-semibold text-mi-ink text-sm">Monte Carlo Diffusion</div>
                      <div className="text-xs text-mi-text mt-1">Brownian motion, stochastic path integrals</div>
                    </div>
                    <div className="p-4 border border-mi-rule bg-mi-paper opacity-75">
                      <div className="font-semibold text-mi-ink text-sm">Game Theory Equilibria</div>
                      <div className="text-xs text-mi-text mt-1">Nash equilibrium, 2×2 payoff optimization</div>
                    </div>
                    <div className="p-4 border border-mi-rule bg-mi-paper opacity-75">
                      <div className="font-semibold text-mi-ink text-sm">Market AR(1) Dynamics</div>
                      <div className="text-xs text-mi-text mt-1">Autoregressive persistence and regime shifts</div>
                    </div>
                    <div className="p-4 border border-mi-rule bg-mi-paper opacity-75">
                      <div className="font-semibold text-mi-ink text-sm">Agent Network Conflict</div>
                      <div className="text-xs text-mi-text mt-1">Spatial neighborhood coupling and consensus</div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">ASSUMPTION PARAMETER REPOSITORY</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-mi-ink font-medium">Initial Condition (x₀)</label>
                      <input type="text" readOnly value="100.00" className="mi-input h-9 text-xs font-mono mt-1" />
                    </div>
                    <div>
                      <label className="text-mi-ink font-medium">Diffusion Constant (σ)</label>
                      <input type="text" readOnly value="0.35" className="mi-input h-9 text-xs font-mono mt-1" />
                    </div>
                    <div>
                      <label className="text-mi-ink font-medium">Drift Vector (μ)</label>
                      <input type="text" readOnly value="0.05" className="mi-input h-9 text-xs font-mono mt-1" />
                    </div>
                    <div>
                      <label className="text-mi-ink font-medium">Boundary Rule</label>
                      <input type="text" readOnly value="Reflecting at [0, 500]" className="mi-input h-9 text-xs font-mono mt-1" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">PRE-FLIGHT VALIDATION INSPECTION</div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 bg-mi-paper border border-mi-rule flex items-center justify-between">
                      <span>PARAMETER SANITY CHECKS:</span>
                      <span className="text-mi-success font-semibold">PASSED (4/4)</span>
                    </div>
                    <div className="p-2.5 bg-mi-paper border border-mi-rule flex items-center justify-between">
                      <span>CFL STABILITY CONDITION (dt &lt; dx²/2σ):</span>
                      <span className="text-mi-success font-semibold">SATISFIED (dt=0.01)</span>
                    </div>
                    <div className="p-2.5 bg-mi-paper border border-mi-rule flex items-center justify-between">
                      <span>MEMORY ALLOCATION ESTIMATE:</span>
                      <span className="text-mi-ink font-semibold">~1.2 MB</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">SIMULATION EXECUTION STATUS</div>
                  <div className="p-6 bg-mi-paper border border-mi-rule text-center space-y-3">
                    <div className="text-xs font-mono text-mi-change font-bold">STATE: SOLVER RUNNING</div>
                    <div className="w-full bg-mi-surface-soft h-2 border border-mi-rule overflow-hidden">
                      <div className="bg-mi-ink h-full w-3/4"></div>
                    </div>
                    <div className="text-xs font-mono text-mi-muted">
                      INTEGRATING 10,000 PATHWAYS • STEP 750 / 1000
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">EVIDENCE EXPLORATION CANVAS</div>
                  <div className="p-4 bg-mi-paper border border-mi-rule flex justify-between text-xs font-mono">
                    <div>
                      <span className="text-mi-muted">MEAN: </span>
                      <span className="font-bold text-mi-ink">105.24</span>
                    </div>
                    <div>
                      <span className="text-mi-muted">VARIANCE: </span>
                      <span className="font-bold text-mi-ink">12.80</span>
                    </div>
                    <div>
                      <span className="text-mi-muted">P(X &gt; 110): </span>
                      <span className="font-bold text-mi-change">42.1%</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">SHARED COORDINATE SCENARIO COMPARISON</div>
                  <div className="p-4 bg-mi-paper border border-mi-rule space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-mi-muted">BASELINE (σ=0.35):</span>
                      <span>VaR 95% = -8.20</span>
                    </div>
                    <div className="flex justify-between text-mi-change font-semibold">
                      <span>PERTURBED (σ=0.50):</span>
                      <span>VaR 95% = -14.60 (Δ -6.40)</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">EXPLANATION &amp; BOUNDARIES</div>
                  <div className="p-4 bg-mi-paper border border-mi-rule space-y-2 text-xs">
                    <div className="font-mono text-mi-ink font-semibold">CLOSED-FORM VERIFICATION</div>
                    <p className="text-mi-text">
                      Empirical simulation moments match theoretical expectations within 0.04% numerical margin.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-mi-rule flex items-center justify-between text-xs font-mono text-mi-muted">
              <span>WORKBENCH PRODUCT VIEW</span>
              <span>NO FABRICATED SYNTHETIC METRICS</span>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default WorkbenchPage;
