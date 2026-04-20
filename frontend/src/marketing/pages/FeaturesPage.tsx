import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../components/MarketingLayout';

function AnimatedWave() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setPhase((value) => value + 0.38), 620);
    return () => window.clearInterval(timer);
  }, []);

  const points = Array.from({ length: 40 }, (_, index) => {
    const x = (index / 39) * 100;
    const y = 68 - Math.sin(index * 0.35 + phase) * 24 - Math.cos(index * 0.18 + phase * 0.6) * 10;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-28">
      <polyline points={points} fill="none" stroke="url(#waveGradient)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="waveGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="60%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DynamicMatrix() {
  const values = [
    ['4, 2', '2, 6', '3, 5'],
    ['6, 2', '5, 5', '4, 6'],
    ['5, 4', '6, 3', '8, 8'],
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {values.flatMap((row, i) => row.map((value, j) => (
        <div
          key={`${i}-${j}`}
          className="rounded-lg px-2 py-2 text-center text-xs"
          style={{
            border: i === 2 && j === 2 ? '1px solid rgba(16,185,129,0.55)' : '1px solid var(--glass-stroke)',
            background: i === 2 && j === 2 ? 'rgba(16,185,129,0.2)' : 'rgba(17,24,39,0.72)',
            color: 'var(--text-primary)',
          }}
        >
          {value}
        </div>
      )))}
    </div>
  );
}

function LiveCandles() {
  const [candles, setCandles] = useState([30, 44, 40, 56, 52, 66, 60, 72]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCandles((current) => [
        ...current.slice(1),
        Math.max(28, Math.min(78, current[current.length - 1] + (Math.random() - 0.45) * 12)),
      ]);
    }, 780);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="h-28 grid grid-cols-8 gap-1.5 items-end">
      {candles.map((value, index) => (
        <div key={index} className="rounded-md" style={{ height: `${value}%`, background: index % 2 ? '#8B5CF6' : '#3B82F6' }} />
      ))}
    </div>
  );
}

function AgentClusters() {
  return (
    <div className="relative h-28 rounded-xl" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.72)' }}>
      {[{ x: 14, y: 26, c: '#3B82F6' }, { x: 72, y: 24, c: '#22D3EE' }, { x: 36, y: 72, c: '#8B5CF6' }, { x: 84, y: 76, c: '#F43F5E' }].map((node) => (
        <span
          key={`${node.x}-${node.y}`}
          className="absolute h-3 w-3 rounded-full"
          style={{ left: `${node.x}%`, top: `${node.y}%`, background: node.c, boxShadow: `0 0 0 5px ${node.c}1f` }}
        />
      ))}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <line x1="14" y1="26" x2="72" y2="24" stroke="rgba(59,130,246,0.48)" strokeWidth="1.3" />
        <line x1="14" y1="26" x2="36" y2="72" stroke="rgba(139,92,246,0.42)" strokeWidth="1.3" />
        <line x1="36" y1="72" x2="84" y2="76" stroke="rgba(244,63,94,0.44)" strokeWidth="1.3" />
        <line x1="72" y1="24" x2="84" y2="76" stroke="rgba(34,211,238,0.46)" strokeWidth="1.3" />
      </svg>
    </div>
  );
}

function ThinkingPulse() {
  return (
    <div className="rounded-xl px-3 py-3" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.72)' }}>
      <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--signal-cyan)' }}>AI Coach</p>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Counterparty pressure is rising. Rebalance to a defensive payoff path before rerun.
      </p>
      <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.24)' }}>
        <div className="h-full rounded-full animate-pulse" style={{ width: '72%', background: 'linear-gradient(90deg, #22D3EE, #3B82F6)' }} />
      </div>
    </div>
  );
}

const FEATURE_ROWS = [
  {
    id: 'monte-carlo',
    title: 'Monte Carlo',
    description: 'Moving probability wave with premium confidence layering.',
    preview: <AnimatedWave />,
  },
  {
    id: 'game-theory',
    title: 'Game Theory',
    description: 'Dynamic payoff matrix with equilibrium highlights and strategic spread.',
    preview: <DynamicMatrix />,
  },
  {
    id: 'market-engine',
    title: 'Market',
    description: 'Live chart candles reveal drift and volatility regime transitions.',
    preview: <LiveCandles />,
  },
  {
    id: 'conflict-engine',
    title: 'Conflict',
    description: 'Agent dots battle across pressure links to surface coalition risk.',
    preview: <AgentClusters />,
  },
  {
    id: 'ai-layer',
    title: 'AI Coach',
    description: 'Thinking pulse UI converts simulation output into direct action.',
    preview: <ThinkingPulse />,
  },
] as const;

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <main className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16 space-y-7">
        <header className="max-w-3xl" data-reveal>
          <p className="section-kicker">Features</p>
          <h1 className="section-title">
            Interactive engine cards built for
            <br />
            high-trust decision workflows.
          </h1>
          <p className="section-copy">
            Each engine ships with a live behavior preview so teams can understand how scenarios evolve before they commit execution time.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" data-reveal>
          {FEATURE_ROWS.map((feature) => (
            <article id={feature.id} key={feature.id} className="premium-card p-5 md:p-6" data-tilt>
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--signal-cyan)' }}>
                {feature.title}
              </p>
              <h2 className="card-title mt-2">{feature.title} Engine</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              <div className="mt-4">{feature.preview}</div>
              <Link to="/app/simulations/new" viewTransition className="secondary-cta mt-4">Run {feature.title}</Link>
            </article>
          ))}
        </section>

        <section id="security" className="premium-card p-6 md:p-8" data-reveal>
          <p className="section-kicker">Security</p>
          <h2 className="mt-4 card-title" style={{ fontSize: 'clamp(1.7rem,2.8vw,2.3rem)' }}>Enterprise controls without UX friction.</h2>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Audit trails, deterministic replay, and governance-friendly simulation history are integrated into the same premium interface layer.
          </p>
        </section>
      </main>
    </MarketingLayout>
  );
}
