import { Link } from 'react-router-dom';
import { MarketingCard } from '../components/MarketingCard';

const CAPABILITIES = [
  {
    title: 'Monte Carlo Engine',
    description:
      'Probabilistic simulation pipelines with variance controls, confidence bands, and scenario weighting.',
    accent: 'from-blue-500/25 to-blue-500/5',
  },
  {
    title: 'Game Theory Engine',
    description:
      'Payoff matrix evaluation with equilibrium detection and strategy sensitivity breakdown.',
    accent: 'from-violet-500/25 to-violet-500/5',
  },
  {
    title: 'Market Simulation',
    description:
      'Path-dependent stochastic modeling for volatility-aware market trajectory forecasting.',
    accent: 'from-cyan-500/25 to-cyan-500/5',
  },
  {
    title: 'Conflict Modeling',
    description:
      'Agent-based strategy interaction with coalition pressure, convergence rate, and failure risk flags.',
    accent: 'from-emerald-500/25 to-emerald-500/5',
  },
];

export function CoreCapabilitiesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 reveal-section" data-gsap="reveal">
      <div className="max-w-3xl mb-10">
        <p className="section-kicker">Decision Intelligence Layer</p>
        <h2 className="section-title">Data-first systems for mathematical decision pipelines.</h2>
        <p className="section-copy mt-4">
          Move from static analysis to real-time, simulation-driven intelligence with consistent performance characteristics and explainable outputs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAPABILITIES.map((capability) => (
          <MarketingCard
            key={capability.title}
            title={capability.title}
            description={capability.description}
            className={`relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br ${capability.accent} before:pointer-events-none`}
          >
            <div className="relative z-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-soft)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--text-soft)' }} />
              Performance-optimized
            </div>
          </MarketingCard>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/features" viewTransition className="secondary-cta px-5 py-2.5 text-sm">
          Explore All Features
        </Link>
        <Link to="/product" viewTransition className="primary-cta px-5 py-2.5 text-sm">
          Open Product Demo
        </Link>
      </div>
    </section>
  );
}
