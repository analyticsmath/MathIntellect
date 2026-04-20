import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../components/MarketingLayout';

type BillingMode = 'monthly' | 'annual';

const PLANS = [
  {
    name: 'Starter',
    monthly: 39,
    annual: 31,
    description: 'For independent analysts validating strategy with premium analytics.',
    features: ['10k simulation runs / month', 'Monte Carlo + Game Theory', 'Core AI guidance'],
    cta: 'Start Starter',
  },
  {
    name: 'Pro',
    monthly: 129,
    annual: 99,
    recommended: true,
    description: 'For teams shipping model-driven decisions every week.',
    features: ['250k simulation runs / month', 'All engines + 3D intelligence', 'Collaboration + mission workflows'],
    cta: 'Choose Pro',
  },
  {
    name: 'Elite',
    monthly: 349,
    annual: 279,
    description: 'For organizations requiring scale, governance, and dedicated strategy support.',
    features: ['2M simulation runs / month', 'Private environments + controls', 'Advanced exports + onboarding'],
    cta: 'Go Elite',
  },
] as const;

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingMode>('annual');
  const [teamSize, setTeamSize] = useState(18);

  const roi = useMemo(() => {
    const averageAnalystCost = 52;
    const hoursSavedPerPersonMonthly = 9 + teamSize * 0.48;
    const monthlySaved = hoursSavedPerPersonMonthly * averageAnalystCost * teamSize;
    const annualSaved = monthlySaved * 12;
    const proAnnualCost = PLANS[1].annual * 12;
    const roiMultiple = annualSaved / Math.max(1, proAnnualCost);

    return {
      monthlySaved,
      annualSaved,
      roiMultiple,
    };
  }, [teamSize]);

  return (
    <MarketingLayout>
      <main className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16 space-y-8">
        <header className="max-w-3xl" data-reveal>
          <p className="section-kicker">Pricing</p>
          <h1 className="section-title">Premium plans for simulation-first intelligence teams.</h1>
          <p className="section-copy">
            Switch monthly or annual billing and estimate the strategic value created by faster, model-backed decision cycles.
          </p>
        </header>

        <section className="premium-card p-5 md:p-6" data-reveal>
          <div className="inline-flex items-center gap-1 p-1 rounded-xl" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.76)' }}>
            {(['monthly', 'annual'] as BillingMode[]).map((option) => {
              const active = billing === option;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => setBilling(option)}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    color: active ? '#f8fafc' : 'var(--text-secondary)',
                    background: active ? 'linear-gradient(130deg, #3B82F6, #22D3EE)' : 'transparent',
                    boxShadow: active ? '0 8px 20px rgba(59,130,246,0.3)' : 'none',
                  }}
                >
                  {option === 'monthly' ? 'Monthly' : 'Annual (Save 23%)'}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch" data-reveal>
          {PLANS.map((plan) => {
            const price = billing === 'monthly' ? plan.monthly : plan.annual;
            const isRecommended = 'recommended' in plan && plan.recommended === true;
            return (
              <article
                key={plan.name}
                className="premium-card p-6 relative"
                data-tilt
                style={isRecommended
                  ? {
                    borderColor: 'rgba(59, 130, 246, 0.52)',
                    boxShadow: '0 22px 52px rgba(59,130,246,0.24), 0 0 0 1px rgba(59,130,246,0.26)',
                  }
                  : undefined}
              >
                {isRecommended && (
                  <span
                    className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-full"
                    style={{
                      background: 'rgba(59, 130, 246, 0.18)',
                      color: 'var(--brand-blue)',
                      border: '1px solid rgba(59, 130, 246, 0.42)',
                    }}
                  >
                    Recommended
                  </span>
                )}

                <p className="section-kicker">{plan.name}</p>
                <h2 className="mt-4 text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  ${price}
                  <span className="text-base font-medium ml-1" style={{ color: 'var(--text-muted)' }}>/mo</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>

                <ul className="mt-5 space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span style={{ color: 'var(--signal-cyan)' }}>●</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  viewTransition
                  className={isRecommended ? 'primary-cta w-full text-center mt-6' : 'secondary-cta w-full text-center mt-6'}
                >
                  {plan.cta}
                </Link>
              </article>
            );
          })}
        </section>

        <section className="premium-card p-6 md:p-8" data-reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="section-kicker">ROI Comparison</p>
              <h2 className="mt-4 card-title" style={{ fontSize: 'clamp(1.8rem,2.9vw,2.3rem)' }}>Estimate strategic savings by team size.</h2>
              <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Move the slider to estimate annual value generated by simulation automation and faster insight cycles.
              </p>
            </div>
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--glass-stroke)', background: 'rgba(11,16,32,0.74)' }}>
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Team Size</p>
              <p className="mt-1 text-2xl font-semibold" style={{ color: 'var(--brand-blue)' }}>{teamSize} analysts</p>
            </div>
          </div>

          <div className="mt-6">
            <input
              type="range"
              min={5}
              max={60}
              value={teamSize}
              onChange={(event) => setTeamSize(Number(event.target.value))}
              className="w-full"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(34,211,238,0.34)', background: 'rgba(34,211,238,0.12)' }}>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Monthly Value</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--signal-cyan)' }}>${Math.round(roi.monthlySaved).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(59,130,246,0.34)', background: 'rgba(59,130,246,0.12)' }}>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Annual Value</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--brand-blue)' }}>${Math.round(roi.annualSaved).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(139,92,246,0.34)', background: 'rgba(139,92,246,0.12)' }}>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>ROI Multiple</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--quantum-violet)' }}>{roi.roiMultiple.toFixed(1)}x</p>
            </div>
          </div>
        </section>

        <section className="premium-card p-6 md:p-8" data-reveal id="privacy">
          <p className="section-kicker">Legal</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4" id="terms">
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--glass-stroke)', background: 'rgba(17,24,39,0.76)' }}>
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Privacy</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Data is isolated per workspace with controlled model access.</p>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--glass-stroke)', background: 'rgba(17,24,39,0.76)' }} id="compliance">
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Compliance</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Audit-ready logs and deterministic replay support governance standards.</p>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--glass-stroke)', background: 'rgba(17,24,39,0.76)' }}>
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Terms</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Transparent usage rules and flexible plan transitions across all tiers.</p>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
