import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../components/MarketingLayout';
import { MathExpression } from '../../math/MathExpression';
import { ResponsiveMedia } from '../../media/ResponsiveMedia';

export const ModelsPage: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState<string>('monte-carlo');

  const engines = [
    {
      id: 'monte-carlo',
      name: 'Monte Carlo & Diffusion',
      category: 'STOCHASTIC SYSTEMS',
      equation: 'dx_t = \\mu dt + \\sigma dW_t',
      mediaKey: 'world-01' as const,
      inputParams: ['Initial State (x₀)', 'Drift Rate (μ)', 'Diffusion Scale (σ)', 'Time Horizon (T)', 'Sample Count (N)'],
      outputs: ['Path Realization Ensembles', 'Terminal State Quantiles', 'Empirical Probability Density', 'Value-at-Risk / Tail Probability'],
      inspectable: ['Sample paths variance', 'Upper/lower quantile bounds (5%, 95%)', 'Convergence stability'],
      link: '/app/simulations/new?engine=monte-carlo',
      summary: 'Models system uncertainty through repeated stochastic trajectory integration. Ideal for multi-path financial, operational, and physical systems under high variance.'
    },
    {
      id: 'game-theory',
      name: 'Game Theory & Equilibria',
      category: 'STRATEGIC INTERACTIONS',
      equation: 'u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*)',
      mediaKey: 'world-03' as const,
      inputParams: ['Payoff Tensor Matrix [A]', 'Player Strategy Sets', 'Discount Factor (δ)', 'Information Horizon'],
      outputs: ['Pure / Mixed Nash Equilibrium', 'Minimax Value Bounds', 'Best-Response Trajectories', 'Regret Minimization Metric'],
      inspectable: ['Dominant strategy conditions', 'Equilibrium probability distribution', 'Payoff sensitivity to deviations'],
      link: '/app/simulations/new?engine=game-theory',
      summary: 'Solves non-cooperative and zero-sum strategic conflicts between rational decision agents. Computes deterministic mixed equilibria and optimal defensive baselines.'
    },
    {
      id: 'market',
      name: 'Market Dynamics & AR(1)',
      category: 'TIME-SERIES DYNAMICS',
      equation: 'x_t = \\rho x_{t-1} + \\varepsilon_t, \\quad \\varepsilon_t \\sim \\mathcal{N}(0, \\sigma^2)',
      mediaKey: 'world-05' as const,
      inputParams: ['Autoregressive Persistence (ρ)', 'Innovation Variance (σ²)', 'Regime Thresholds', 'Observation Window'],
      outputs: ['State Realization Curves', 'Autocorrelation Function (ACF)', 'Asymptotic Variance Bounds', 'Regime Switching Durations'],
      inspectable: ['Mean reversion half-life', 'Stationarity criteria (|ρ| < 1)', 'State transition frequencies'],
      link: '/app/simulations/new?engine=market',
      summary: 'Models temporal inertia, price formations, and regime transitions with mathematical persistence tracking. Replaces naive charting with formal stochastic processes.'
    },
    {
      id: 'conflict',
      name: 'Agent Interaction & Network',
      category: 'MULTI-AGENT TOPOLOGY',
      equation: '\\dot{\\mathbf{x}}_i = \\sum_{j \\in \\mathcal{N}_i} A_{ij}(\\mathbf{x}_j - \\mathbf{x}_i) + \\mathbf{F}_{ext}',
      mediaKey: 'world-06' as const,
      inputParams: ['Spatial Density (N)', 'Interaction Coupling Radius (r)', 'Alignment Strength (γ)', 'Boundary Permeability'],
      outputs: ['Spatial Coordinate Vectors', 'Global Order Parameter (Φ)', 'Cluster Separation Metrics', 'Phase Transition Boundaries'],
      inspectable: ['Individual agent velocity vectors', 'Local flocking density', 'Network connectivity graph'],
      link: '/app/simulations/new?engine=conflict',
      summary: 'Simulates decentralized multi-actor coordination and adversarial conflict in continuous 2D/3D space with deterministic neighborhood coupling rules.'
    },
    {
      id: 'custom',
      name: 'Custom Model Builder',
      category: 'COMPOSITIONAL WORKBENCH',
      equation: '\\mathbf{x}_{t+1} = f(\\mathbf{x}_t, \\mathbf{u}_t; \\mathbf{\\theta}) + \\mathbf{\\omega}_t',
      mediaKey: 'world-04' as const,
      inputParams: ['Custom State Variables', 'Differential Equation Specifications', 'Parameter Vectors', 'Boundary Constraints'],
      outputs: ['User-Defined Metric Fields', 'Multi-Dimensional State Surfaces', 'Realtime Parameter Sensitivity', 'Exportable Tensor Traces'],
      inspectable: ['Symbolic equation validation', 'Numerical stability conditions', 'Stepwise tensor inspector'],
      link: '/app/simulations/new?engine=custom',
      summary: 'Complete freedom to author state spaces, transition matrices, and differential equations in an inspectable, deterministic simulation engine.'
    },
  ];

  const current = engines.find((e) => e.id === selectedEngine) || engines[0];

  return (
    <MarketingLayout>
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 pt-28 pb-20">
        {/* Page Header */}
        <div className="border-b border-mi-rule pb-10">
          <div className="text-xs font-mono text-mi-muted uppercase tracking-wider">
            Scientific Reference
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-mi-ink tracking-tight mt-2">
            Models Atlas
          </h1>
          <p className="mt-4 text-lg text-mi-text max-w-3xl leading-relaxed">
            Five simulation engines engineered for distinct structural challenges. Inspect equations, required parameter vectors, and analytical output guarantees.
          </p>
        </div>

        {/* Engine Navigation Index */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-mi-rule pb-6" role="tablist">
          {engines.map((eng) => (
            <button
              key={eng.id}
              role="tab"
              aria-selected={selectedEngine === eng.id}
              onClick={() => setSelectedEngine(eng.id)}
              className={`px-4 py-2 text-xs font-mono transition-all border ${
                selectedEngine === eng.id
                  ? 'border-mi-ink bg-mi-paper text-mi-ink font-semibold shadow-sm'
                  : 'border-mi-rule bg-mi-surface-soft text-mi-text hover:border-mi-rule-strong hover:text-mi-ink'
              }`}
            >
              {eng.name}
            </button>
          ))}
        </div>

        {/* Selected Engine Deep Detail Field */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 cols: Mathematical Specification and Parameters */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-mono text-mi-change border border-mi-change/30 px-2 py-0.5">
                {current.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-medium text-mi-ink mt-3">
                {current.name}
              </h2>
              <p className="text-sm text-mi-text mt-2 leading-relaxed">
                {current.summary}
              </p>
            </div>

            <div className="p-4 border border-mi-rule bg-mi-paper space-y-2">
              <div className="text-xs font-mono text-mi-muted uppercase">Governing Mathematical Formulation</div>
              <div className="pt-1">
                <MathExpression tex={current.equation} display />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-mi-muted uppercase mb-2">Input Parameter Vectors</div>
                <ul className="space-y-1 text-xs font-mono text-mi-ink-2">
                  {current.inputParams.map((param, i) => (
                    <li key={i} className="flex items-center gap-2 p-1.5 bg-mi-surface-soft border border-mi-rule">
                      <span className="text-mi-change">▸</span>
                      <span>{param}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-mono text-mi-muted uppercase mb-2">Inspectable Analytical Outputs</div>
                <ul className="space-y-1 text-xs font-mono text-mi-ink-2">
                  {current.outputs.map((out, i) => (
                    <li key={i} className="flex items-center gap-2 p-1.5 bg-mi-surface-soft border border-mi-rule">
                      <span className="text-mi-success">✓</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={current.link}
                className="mi-btn-primary w-full h-12 text-sm"
              >
                Launch {current.name} in Workbench
              </Link>
            </div>
          </div>

          {/* Right 7 cols: Photographic System Context & Technical Diagram */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-mi-rule bg-mi-paper p-4">
              <ResponsiveMedia mediaKey={current.mediaKey} aspectRatio="16/10" className="w-full" />
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-mi-muted">
                <span>SYSTEM ANALOGY CONTEXT</span>
                <span>DETERMINISTIC REPRODUCIBILITY: 100%</span>
              </div>
            </div>

            <div className="p-6 border border-mi-rule bg-mi-paper space-y-3">
              <div className="text-xs font-mono text-mi-muted uppercase">Verification &amp; Invariants</div>
              <p className="text-xs text-mi-text leading-relaxed">
                All engines operate on validated numerical algorithms with explicit boundary convergence tests. Results are strictly calculated from provided initial conditions without artificial smoothing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default ModelsPage;
