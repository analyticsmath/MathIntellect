import React from 'react';
import { Link } from 'react-router-dom';

export const WorkbenchBridge: React.FC = () => {
  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 max-w-[1720px] mx-auto border-t border-mi-rule">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[12px] font-mono text-mi-muted uppercase tracking-wider">
            Chapter 06 — Workbench Bridge
          </div>
          <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-medium text-mi-ink tracking-tight mt-2 leading-[1.08]">
            Build the model yourself.
          </h2>
          <p className="mt-3 text-[16px] md:text-[17px] text-mi-text max-w-2xl">
            Transition directly from narrative explanation into the real mathematical workbench. Complete control over parameter vectors, solvers, and simulation runs.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/app/simulations/new"
            className="mi-btn-primary px-6 h-12 text-sm"
          >
            Launch simulation
          </Link>
          <Link
            to="/workbench"
            className="mi-btn-secondary px-6 h-12 text-sm"
          >
            Interactive tour
          </Link>
        </div>
      </div>

      {/* Production-Faithful Product Model Builder Workspace Projection (No Fake Device Frames) */}
      <div className="mt-10 border border-mi-rule bg-mi-paper">
        {/* Workspace Contextual Bar */}
        <div className="h-12 px-5 border-b border-mi-rule bg-mi-surface-soft flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-mi-success"></span>
            <span className="font-semibold text-mi-ink">MODEL-SIM-2026-08</span>
            <span className="text-mi-muted">•</span>
            <span className="text-mi-muted">ENGINE: STOCHASTIC DIFFUSION</span>
          </div>
          <div className="flex items-center gap-4 text-mi-muted">
            <span>STATE: READY (M2)</span>
            <span>SOLVER: RUNGE-KUTTA 4</span>
          </div>
        </div>

        {/* 3 Functional Territories: Assumptions | Model Field | Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          {/* Territory 1: Assumptions (Left Column) */}
          <div className="lg:col-span-3 border-r border-mi-rule p-5 space-y-4 bg-mi-paper">
            <div className="text-xs font-mono text-mi-muted uppercase">1. Assumptions</div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-mi-ink font-medium">Drift Coefficient (μ)</label>
                <input
                  type="text"
                  readOnly
                  value="0.05"
                  className="mi-input h-9 text-xs font-mono mt-1"
                />
              </div>

              <div>
                <label className="text-mi-ink font-medium">Diffusion Scale (σ)</label>
                <input
                  type="text"
                  readOnly
                  value="0.35"
                  className="mi-input h-9 text-xs font-mono mt-1"
                />
              </div>

              <div>
                <label className="text-mi-ink font-medium">Horizon Time Steps (N)</label>
                <input
                  type="text"
                  readOnly
                  value="100"
                  className="mi-input h-9 text-xs font-mono mt-1"
                />
              </div>

              <div>
                <label className="text-mi-ink font-medium">Boundary Rule</label>
                <select
                  disabled
                  className="mi-input h-9 text-xs font-mono mt-1"
                >
                  <option>Absorbing Barrier (Lower)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Territory 2: Model Field (Dominant Center Column) */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-mi-surface-soft">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-mi-muted mb-4">
                <span>2. MODEL STRUCTURE FIELD</span>
                <span>REALTIME VISUALIZATION</span>
              </div>

              <div className="w-full aspect-[16/10] bg-mi-paper border border-mi-rule p-4 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 280">
                  <line x1="40" y1="240" x2="460" y2="240" stroke="#78807C" strokeWidth="1" />
                  <line x1="40" y1="40" x2="40" y2="240" stroke="#78807C" strokeWidth="1" />
                  <path
                    d="M 40 180 C 140 140 220 200 320 100 C 380 60 420 120 460 80"
                    fill="none"
                    stroke="#111412"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 40 180 C 140 180 220 220 320 160 C 380 140 420 180 460 150"
                    fill="none"
                    stroke="#E35A35"
                    strokeWidth="2"
                  />
                  <line x1="320" y1="40" x2="320" y2="240" stroke="#2457E6" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="320" cy="100" r="4" fill="#111412" />
                  <circle cx="320" cy="160" r="4" fill="#E35A35" />
                </svg>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-mi-rule flex items-center justify-between text-xs font-mono text-mi-text">
              <span>ACTIVE ENGINE: STOCHASTIC BROWNIAN</span>
              <span className="text-mi-success">CONVERGENCE TOLERANCE: 1e-6</span>
            </div>
          </div>

          {/* Territory 3: Inspector (Right Column) */}
          <div className="lg:col-span-3 border-l border-mi-rule p-5 space-y-4 bg-mi-paper">
            <div className="text-xs font-mono text-mi-muted uppercase">3. Parameter Inspector</div>

            <div className="p-3 bg-mi-surface-soft border border-mi-rule text-xs space-y-2">
              <div className="font-semibold text-mi-ink">Diffusion Scale (σ)</div>
              <p className="text-mi-text leading-relaxed">
                Determines instantaneous standard deviation of the Wiener increment. Governs trajectory dispersion width over time.
              </p>
              <div className="pt-2 border-t border-mi-rule text-[11px] font-mono text-mi-muted">
                UNIT: [dimensionless]<br/>
                VALID RANGE: (0.01, 2.00]
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/app/simulations/new"
                className="mi-btn-primary w-full h-10 text-xs"
              >
                Open in Workbench
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
