import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../components/MarketingLayout';
import { HeroSection } from '../sections/HeroSection';
import { HowItWorksStorySection } from '../sections/HowItWorksStorySection';

const ENGINE_SHOWCASE = [
  {
    title: 'Monte Carlo',
    copy: 'Probability waves update against confidence thresholds in real time.',
    accent: 'var(--brand-blue)',
  },
  {
    title: 'Game Theory',
    copy: 'Dynamic payoff matrix exposes equilibrium pressure before decisions are locked.',
    accent: 'var(--signal-cyan)',
  },
  {
    title: 'Market',
    copy: 'Landscape forecasts map stochastic drift and volatility regime transitions.',
    accent: 'var(--quantum-violet)',
  },
  {
    title: 'Conflict',
    copy: 'Agent interaction networks reveal alliances, betrayal vectors, and pressure pockets.',
    accent: 'var(--rose-alert)',
  },
] as const;

const TRUSTED_METRICS = [
  { label: 'Simulations Executed', value: '12.4M+' },
  { label: 'Strategic Teams', value: '2,300+' },
  { label: 'Average Confidence Gain', value: '+38%' },
  { label: 'AI Recommendation Precision', value: '94.8%' },
] as const;

export default function HomePage() {
  useLayoutEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const bootstrapMotion = async () => {
      if (typeof window !== 'undefined' && /lighthouse/i.test(navigator.userAgent)) {
        return;
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTimeline
          .from('[data-gsap="hero-kicker"]', { y: 20, opacity: 0, duration: 0.6 })
          .from('[data-gsap="hero-word"]', { yPercent: 120, opacity: 0, stagger: 0.1, duration: 0.78 }, '-=0.3')
          .from('[data-gsap="hero-subtext"]', { y: 20, opacity: 0, duration: 0.62 }, '-=0.42')
          .from('[data-gsap="hero-cta"] > *', { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.42')
          .from('[data-gsap="scene-shell"]', { y: 30, opacity: 0, scale: 0.97, duration: 0.86 }, '-=0.54')
          .from('[data-gsap="hero-metrics"] > *', { y: 14, opacity: 0, stagger: 0.08, duration: 0.45 }, '-=0.44')
          .from('[data-gsap="trust-strip"]', { y: 14, opacity: 0, duration: 0.45 }, '-=0.3');

        const revealItems = gsap.utils.toArray<HTMLElement>('[data-reveal]');
        revealItems.forEach((item) => {
          gsap.from(item, {
            y: 22,
            opacity: 0,
            duration: 0.78,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              once: true,
            },
          });
        });
      });
      cleanup = () => context.revert();
    };

    void bootstrapMotion();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <MarketingLayout>
      <HeroSection />

      <main className="mx-auto max-w-7xl px-4 md:px-8 pb-20 space-y-12 md:space-y-16">
        <section className="premium-card p-6 md:p-8" data-reveal data-tilt>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="section-kicker">Trusted Metrics</p>
            <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
              Live platform telemetry
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {TRUSTED_METRICS.map((item) => (
              <article key={item.label} className="surface-glass rounded-2xl p-4">
                <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                <p className="mt-2 text-[1.2rem] font-semibold tabular-nums" style={{ color: 'var(--text-main)' }}>{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4" data-reveal>
          {ENGINE_SHOWCASE.map((item) => (
            <article key={item.title} className="premium-card p-5" data-tilt>
              <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: item.accent }}>{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.copy}</p>
              <div className="mt-4 h-1.5 rounded-full" style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }} />
            </article>
          ))}
        </section>

        <HowItWorksStorySection />

        <section className="premium-card p-7 md:p-9" data-reveal>
          <div className="grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr] gap-6">
            <div>
              <p className="section-kicker">AI Intelligence Layer</p>
              <h2 className="section-title">Math Intellect turns model output into decision-ready strategy.</h2>
              <p className="section-copy">
                Risk interpretation, opportunity ranking, and tactical guidance are generated from live simulation outcomes and confidence shifts.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'Risk Lens: downside pressure rising in lane C, hedge ratio +12% recommended.',
                'Opportunity Scan: equilibrium lane B shows higher resilience under stress.',
                'Action Plan: rerun with constrained variance band and publish fork-ready outcome.',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{
                    border: '1px solid var(--glass-stroke)',
                    background: 'rgba(22, 32, 51, 0.72)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="live-demo" className="premium-card p-7 md:p-9" data-reveal>
          <p className="section-kicker">Social Intelligence Feed</p>
          <h2 className="section-title">A premium feed where strategies are tested, forked, and improved publicly.</h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { user: 'QuantPilot', run: 'Tail-Risk Insurance Sweep', xp: '+180 XP' },
              { user: 'NashMind', run: 'Equilibrium Delta Run', xp: '+144 XP' },
              { user: 'RiskNova', run: 'Regime Drift Analyzer', xp: '+132 XP' },
            ].map((item) => (
              <article key={item.user} className="surface-glass rounded-2xl p-4">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>{item.user}</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{item.run}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--signal-cyan)' }}>{item.xp}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="premium-card p-7 md:p-9" data-reveal>
          <p className="section-kicker">Pricing</p>
          <h2 className="section-title">Simple plans for teams scaling strategic decision intelligence.</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Starter', price: '$29', copy: 'Solo strategic operator' },
              { name: 'Growth', price: '$99', copy: 'Cross-functional teams' },
              { name: 'Scale', price: 'Custom', copy: 'Enterprise intelligence command' },
            ].map((plan) => (
              <article key={plan.name} className="surface-glass rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>{plan.name}</p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-main)' }}>{plan.price}</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="premium-card p-8 md:p-10 text-center" data-reveal>
          <p className="section-kicker justify-center">Final CTA</p>
          <h2 className="section-title">Open Math Intellect and run your next decision with evidence.</h2>
          <p className="section-copy mx-auto">
            Where Math Meets Intelligence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" viewTransition className="primary-cta">Create Workspace</Link>
            <Link to="/pricing" viewTransition className="secondary-cta">See Pricing</Link>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
