import { useState } from 'react';

const STEPS = [
  {
    label: 'Configure',
    copy: 'Define objective, constraints, and core variables with precision-ready controls.',
    accent: 'var(--brand-blue)',
    detail: 'Engine profile + assumptions locked.',
  },
  {
    label: 'Simulate',
    copy: 'Execute Monte Carlo, Game Theory, Market, or Conflict runs against your scenario envelope.',
    accent: 'var(--signal-cyan)',
    detail: 'Live run telemetry + confidence drift.',
  },
  {
    label: 'Analyze',
    copy: 'Review summary metrics, chart layers, and 3D intelligence scenes to isolate decisive signals.',
    accent: 'var(--quantum-violet)',
    detail: 'Insights ranked by relevance and risk.',
  },
  {
    label: 'Improve',
    copy: 'Apply AI coach recommendations and rerun to optimize downside control and strategic resilience.',
    accent: 'var(--emerald-success)',
    detail: 'Decision quality and confidence improved.',
  },
  {
    label: 'Share',
    copy: 'Publish runs to the intelligence feed, fork high-performing strategies, and accelerate team learning.',
    accent: 'var(--amber-warning)',
    detail: 'Feed-ready simulation capsule generated.',
  },
] as const;

export function HowItWorksStorySection() {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section id="how-it-works" className="relative" data-reveal>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-8 md:pb-10">
        <p className="section-kicker">How It Works</p>
        <h2 className="section-title">Configure, simulate, analyze, improve, and share in one intelligence loop.</h2>
      </div>

      <div className="px-4 md:px-8 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="hidden lg:flex gap-3 items-stretch">
            {STEPS.map((step, index) => {
              const active = activeIndex === index;
              return (
                <article
                  key={step.label}
                  className="premium-card p-5 transition-all duration-300 cursor-pointer"
                  style={{
                    flex: active ? 1.55 : 1,
                    borderColor: active ? `${step.accent}66` : 'var(--glass-stroke)',
                    boxShadow: active ? `0 24px 52px ${step.accent}26` : 'var(--shadow-card)',
                    transform: active ? 'translateY(-2px)' : 'translateY(0px)',
                    borderRadius: 24,
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-8 h-8 rounded-xl grid place-items-center text-xs font-semibold"
                      style={{ border: `1px solid ${step.accent}60`, background: `${step.accent}1f`, color: step.accent }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: active ? step.accent : 'var(--text-muted)' }}>
                      {active ? 'Expanded' : 'Step'}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[1.15rem] font-semibold" style={{ color: 'var(--text-main)' }}>{step.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {step.copy}
                  </p>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.14em]" style={{ color: step.accent }}>
                    {step.detail}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="lg:hidden space-y-3">
            {STEPS.map((step, index) => (
              <article key={step.label} className="premium-card p-5" style={{ borderRadius: 24 }}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg grid place-items-center text-xs font-semibold"
                    style={{ border: `1px solid ${step.accent}66`, background: `${step.accent}1f`, color: step.accent }}
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-base font-semibold">{step.label}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
