import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveMedia } from '../../media/ResponsiveMedia';
import { MathExpression } from '../../math/MathExpression';
import {
  runDeterministicMonteCarlo,
  calculateGameEquilibrium,
  runMarketDynamics,
  runConflictInteraction,
} from '../../math/deterministicModels';

type WorldId = 'uncertainty' | 'strategy' | 'dynamics' | 'interaction' | 'build';

export const ModelWorlds: React.FC = () => {
  const [activeWorld, setActiveWorld] = useState<WorldId>('uncertainty');

  // Interactive controls for each deterministic engine demo
  const [sigma, setSigma] = useState<number>(0.35);
  const [payoffA, setPayoffA] = useState<number>(4);
  const [rho, setRho] = useState<number>(0.65);
  const [radius, setRadius] = useState<number>(0.4);

  // Deterministic calculations
  const mcResult = useMemo(() => runDeterministicMonteCarlo(sigma, 0.05, 40, 16), [sigma]);
  const gameResult = useMemo(() => calculateGameEquilibrium(payoffA, 1, 2, 5), [payoffA]);
  const marketResult = useMemo(() => runMarketDynamics(rho, 50), [rho]);
  const conflictResult = useMemo(() => runConflictInteraction(radius, 0.5, 28), [radius]);

  const worlds = [
    { id: 'uncertainty', name: 'Uncertainty', engine: 'Monte Carlo', verb: 'Accumulate / Resolve' },
    { id: 'strategy', name: 'Strategy', engine: 'Game Theory', verb: 'Rebalance' },
    { id: 'dynamics', name: 'Dynamics', engine: 'Market / AR(1)', verb: 'Propagate' },
    { id: 'interaction', name: 'Interaction', engine: 'Agent Conflict', verb: 'Reorganize' },
    { id: 'build', name: 'Build', engine: 'Custom Model', verb: 'Define' },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 max-w-[1720px] mx-auto border-t border-mi-rule">
      {/* Header & World Index */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[12px] font-mono text-mi-muted uppercase tracking-wider">
            Chapter 03 — Model Worlds
          </div>
          <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-medium text-mi-ink tracking-tight mt-2 leading-[1.08]">
            Five engines. Direct mathematics.
          </h2>
        </div>

        {/* World Selector Index */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-mi-surface-soft border border-mi-rule">
          {worlds.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWorld(w.id as WorldId)}
              className={`px-3.5 py-1.5 text-xs font-mono transition-all ${
                activeWorld === w.id
                  ? 'bg-mi-ink text-mi-paper font-semibold shadow-sm'
                  : 'text-mi-text hover:text-mi-ink'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active World Stage */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 cols: Narrative, Mathematical Equation, and Parameter Controls */}
        <div className="lg:col-span-4 space-y-6">
          {activeWorld === 'uncertainty' && (
            <div className="space-y-4">
              <div className="inline-block text-[11px] font-mono text-mi-change border border-mi-change/30 px-2 py-0.5">
                ENGINE: MONTE CARLO
              </div>
              <h3 className="text-2xl font-medium text-mi-ink">Vary uncertainty. Inspect the spread.</h3>
              <p className="text-sm text-mi-text leading-relaxed">
                Stochastic differential pathways aggregate into deterministic probability densities and tail risk metrics.
              </p>
              <div className="pt-2">
                <div className="text-xs font-mono text-mi-muted">MODEL SPECIFICATION</div>
                <MathExpression tex="x_t = x_{t-1} + \mu\cdot\Delta t + \sigma\sqrt{\Delta t}\cdot\varepsilon_t" display={false} />
              </div>

              {/* Direct interactive control */}
              <div className="p-4 border border-mi-rule bg-mi-paper space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label htmlFor="sigma-input" className="text-mi-ink font-medium">Diffusion parameter (σ):</label>
                  <span className="text-mi-change font-bold">{sigma.toFixed(2)}</span>
                </div>
                <input
                  id="sigma-input"
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={sigma}
                  onChange={(e) => setSigma(parseFloat(e.target.value))}
                  className="w-full accent-mi-ink"
                  aria-label="Diffusion parameter sigma"
                />
                <div className="flex justify-between text-[11px] text-mi-muted font-mono">
                  <span>Low variance (0.10)</span>
                  <span>High dispersion (0.80)</span>
                </div>
              </div>

              <div className="p-3 bg-mi-surface-soft border border-mi-rule text-xs font-mono flex justify-between">
                <span>P(X &gt; 0): <strong>{(mcResult.probAboveZero * 100).toFixed(0)}%</strong></span>
                <span>Tail Risk (P &lt; -0.5): <strong className="text-mi-danger">{(mcResult.probTailRisk * 100).toFixed(0)}%</strong></span>
              </div>
            </div>
          )}

          {activeWorld === 'strategy' && (
            <div className="space-y-4">
              <div className="inline-block text-[11px] font-mono text-mi-change border border-mi-change/30 px-2 py-0.5">
                ENGINE: GAME THEORY
              </div>
              <h3 className="text-2xl font-medium text-mi-ink">Change a payoff. Watch equilibrium move.</h3>
              <p className="text-sm text-mi-text leading-relaxed">
                2×2 mixed strategy equilibrium recalculates deterministically as agent payoffs shift.
              </p>
              <div className="pt-2">
                <div className="text-xs font-mono text-mi-muted">NASH EQUILIBRIUM CONDITION</div>
                <MathExpression tex="p^* = \frac{d - c}{(a - b) + (d - c)}" display={false} />
              </div>

              {/* Direct interactive control */}
              <div className="p-4 border border-mi-rule bg-mi-paper space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label htmlFor="payoff-a-input" className="text-mi-ink font-medium">Payoff Matrix A (Top-Left):</label>
                  <span className="text-mi-change font-bold">{payoffA}</span>
                </div>
                <input
                  id="payoff-a-input"
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={payoffA}
                  onChange={(e) => setPayoffA(parseInt(e.target.value, 10))}
                  className="w-full accent-mi-ink"
                  aria-label="Payoff parameter A"
                />
              </div>

              <div className="p-3 bg-mi-surface-soft border border-mi-rule text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Row Action 1 Prob (p*):</span>
                  <strong>{(gameResult.rowProbA * 100).toFixed(1)}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Expected Value:</span>
                  <strong>{gameResult.expectedValue.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {activeWorld === 'dynamics' && (
            <div className="space-y-4">
              <div className="inline-block text-[11px] font-mono text-mi-change border border-mi-change/30 px-2 py-0.5">
                ENGINE: DYNAMICS &amp; REGIMES
              </div>
              <h3 className="text-2xl font-medium text-mi-ink">Change persistence. Follow the state through time.</h3>
              <p className="text-sm text-mi-text leading-relaxed">
                Autoregressive persistence controls memory length, mean-reversion speed, and cyclical state stability.
              </p>
              <div className="pt-2">
                <div className="text-xs font-mono text-mi-muted">AUTOREGRESSIVE PROCESS</div>
                <MathExpression tex="x_t = \rho\cdot x_{t-1} + \varepsilon_t" display={false} />
              </div>

              <div className="p-4 border border-mi-rule bg-mi-paper space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label htmlFor="rho-input" className="text-mi-ink font-medium">Persistence factor (ρ):</label>
                  <span className="text-mi-change font-bold">{rho.toFixed(2)}</span>
                </div>
                <input
                  id="rho-input"
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={rho}
                  onChange={(e) => setRho(parseFloat(e.target.value))}
                  className="w-full accent-mi-ink"
                  aria-label="Persistence factor rho"
                />
              </div>

              <div className="p-3 bg-mi-surface-soft border border-mi-rule text-xs font-mono flex justify-between">
                <span>Theoretical Var: <strong>{marketResult.theoreticalVariance.toFixed(2)}</strong></span>
                <span>Regime Transitions: <strong>{marketResult.regimeSwitches}</strong></span>
              </div>
            </div>
          )}

          {activeWorld === 'interaction' && (
            <div className="space-y-4">
              <div className="inline-block text-[11px] font-mono text-mi-change border border-mi-change/30 px-2 py-0.5">
                ENGINE: AGENT CONFLICT &amp; NETWORK
              </div>
              <h3 className="text-2xl font-medium text-mi-ink">Change the rule. See the system reorganize.</h3>
              <p className="text-sm text-mi-text leading-relaxed">
                Micro-level coupling parameters govern macro-level synchronization, flocking, and cluster formation.
              </p>
              <div className="pt-2">
                <div className="text-xs font-mono text-mi-muted">ORDER PARAMETER</div>
                <MathExpression tex="\Phi = \frac{1}{N}\left|\sum_{j=1}^N e^{i\theta_j}\right|" display={false} />
              </div>

              <div className="p-4 border border-mi-rule bg-mi-paper space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label htmlFor="radius-input" className="text-mi-ink font-medium">Interaction Coupling (r):</label>
                  <span className="text-mi-change font-bold">{radius.toFixed(2)}</span>
                </div>
                <input
                  id="radius-input"
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full accent-mi-ink"
                  aria-label="Coupling radius"
                />
              </div>

              <div className="p-3 bg-mi-surface-soft border border-mi-rule text-xs font-mono flex justify-between">
                <span>Global Coherence: <strong>{(conflictResult.coherence * 100).toFixed(0)}%</strong></span>
                <span>Stable Clusters: <strong>{conflictResult.clusterCount}</strong></span>
              </div>
            </div>
          )}

          {activeWorld === 'build' && (
            <div className="space-y-4">
              <div className="inline-block text-[11px] font-mono text-mi-change border border-mi-change/30 px-2 py-0.5">
                ENGINE: CUSTOM MODEL BUILDER
              </div>
              <h3 className="text-2xl font-medium text-mi-ink">Define the assumptions. Build your own model.</h3>
              <p className="text-sm text-mi-text leading-relaxed">
                Compose custom state variables, parameter boundaries, and stochastic shocks in the real interactive workbench.
              </p>
              <div className="pt-4">
                <Link
                  to="/app/simulations/new"
                  className="mi-btn-primary w-full h-12 text-sm"
                >
                  Open Model Builder
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right 8 cols: Dynamic Mathematical Canvas & Media Context */}
        <div className="lg:col-span-8 border border-mi-rule bg-mi-paper p-6 md:p-8 min-h-[460px] flex flex-col justify-between">
          <div className="relative w-full aspect-[16/10] border border-mi-rule bg-mi-surface-soft overflow-hidden">
            {/* World Media Backdrop (Restrained opacity) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {activeWorld === 'uncertainty' && <ResponsiveMedia mediaKey="mi-05" className="w-full h-full object-cover" />}
              {activeWorld === 'strategy' && <ResponsiveMedia mediaKey="mi-02" className="w-full h-full object-cover" />}
              {activeWorld === 'dynamics' && <ResponsiveMedia mediaKey="mi-06" className="w-full h-full object-cover" />}
              {activeWorld === 'interaction' && <ResponsiveMedia mediaKey="mi-07" className="w-full h-full object-cover" />}
              {activeWorld === 'build' && <ResponsiveMedia mediaKey="mi-08" className="w-full h-full object-cover" />}
            </div>

            {/* Deterministic Mathematical Visual Canvas */}
            <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
              {activeWorld === 'uncertainty' && (
                <svg className="w-full h-full" viewBox="0 0 600 360">
                  {/* Zero line */}
                  <line x1="40" y1="180" x2="560" y2="180" stroke="#BAC1BD" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Path ensemble */}
                  {mcResult.paths.map((path, idx) => {
                    const d = path.reduce((acc, val, i) => {
                      const x = 40 + (i / (path.length - 1)) * 460;
                      const y = 180 - val * 70;
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                    }, '');
                    return (
                      <path
                        key={idx}
                        d={d}
                        fill="none"
                        stroke={idx === 0 ? '#E35A35' : idx === 1 ? '#2457E6' : '#505753'}
                        strokeWidth={idx < 2 ? 2 : 1}
                        opacity={idx < 2 ? 1 : 0.45}
                      />
                    );
                  })}
                  {/* Endpoint density histogram bar on right side */}
                  <line x1="500" y1="40" x2="500" y2="320" stroke="#78807C" strokeWidth="1" />
                  {mcResult.endpoints.slice(0, 16).map((val, i) => {
                    const y = 180 - val * 70;
                    return (
                      <circle
                        key={i}
                        cx="500"
                        cy={Math.max(45, Math.min(315, y))}
                        r="3.5"
                        fill={val < -0.5 ? '#B64049' : '#111412'}
                      />
                    );
                  })}
                </svg>
              )}

              {activeWorld === 'strategy' && (
                <div className="w-full max-w-md bg-mi-paper/95 border border-mi-rule p-6 space-y-4">
                  <div className="text-xs font-mono text-mi-muted uppercase">2×2 Zero-Sum Payoff Matrix</div>
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="p-3 border border-mi-ink bg-mi-paper font-semibold text-mi-ink">
                      A₁ = {payoffA}
                    </div>
                    <div className="p-3 border border-mi-rule bg-mi-surface-soft text-mi-text">
                      A₂ = 1
                    </div>
                    <div className="p-3 border border-mi-rule bg-mi-surface-soft text-mi-text">
                      B₁ = 2
                    </div>
                    <div className="p-3 border border-mi-rule bg-mi-surface-soft text-mi-text">
                      B₂ = 5
                    </div>
                  </div>
                  <div className="pt-2 text-xs font-mono text-mi-ink-2 flex justify-between border-t border-mi-rule">
                    <span>Equilibrium Strategy p*: {(gameResult.rowProbA).toFixed(3)}</span>
                    <span className="text-mi-change">Value v: {gameResult.expectedValue.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {activeWorld === 'dynamics' && (
                <svg className="w-full h-full" viewBox="0 0 600 360">
                  <line x1="40" y1="180" x2="560" y2="180" stroke="#BAC1BD" strokeWidth="1" strokeDasharray="3 3" />
                  {/* AR(1) state curve */}
                  <path
                    d={marketResult.series.reduce((acc, val, i) => {
                      const x = 40 + (i / (marketResult.series.length - 1)) * 520;
                      const y = 180 - val * 65;
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                    }, '')}
                    fill="none"
                    stroke="#111412"
                    strokeWidth="2"
                  />
                  {/* Variance bands */}
                  <rect
                    x="40"
                    y={180 - Math.sqrt(marketResult.theoreticalVariance) * 65}
                    width="520"
                    height={Math.sqrt(marketResult.theoreticalVariance) * 130}
                    fill="#E35A35"
                    opacity="0.06"
                  />
                </svg>
              )}

              {activeWorld === 'interaction' && (
                <svg className="w-full h-full" viewBox="0 0 600 360">
                  {conflictResult.agents.map((ag, i) => {
                    const cx = 50 + (ag.x / 100) * 500;
                    const cy = 30 + (ag.y / 100) * 300;
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="4" fill="#111412" />
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx + ag.vx * 18}
                          y2={cy + ag.vy * 18}
                          stroke="#E35A35"
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}
                </svg>
              )}

              {activeWorld === 'build' && (
                <div className="w-full max-w-md bg-mi-paper/95 border border-mi-rule p-6 space-y-3 font-mono text-xs">
                  <div className="text-mi-muted">MODEL COMPOSITION RUNTIME</div>
                  <div className="p-2 border border-mi-rule bg-mi-surface-soft">
                    &gt; ENGINE: Continuous Stochastic Field<br/>
                    &gt; STATE DIMENSIONS: [X₁, X₂, X₃]<br/>
                    &gt; BOUNDARY CONDITIONS: Reflected at 0<br/>
                    &gt; SOLVER: Runge-Kutta 4th Order / Euler-Maruyama
                  </div>
                  <div className="text-mi-success">&gt; READY TO SIMULATE</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-mi-rule flex items-center justify-between text-xs font-mono text-mi-muted">
            <span>DETERMINISTIC SIMULATION BENCHMARK</span>
            <span>SEED: FIXED PRNG (ZERO RANDOM THEATER)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
