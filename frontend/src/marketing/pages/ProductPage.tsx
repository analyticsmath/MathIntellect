import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../components/MarketingLayout';

const SHOWCASE_SLIDES = [
  {
    id: 'dashboard',
    title: 'Dashboard Carousel',
    copy: 'See mission velocity, rank momentum, and engine availability from one command layer.',
  },
  {
    id: 'analytics',
    title: 'Analytics Preview',
    copy: 'Dark-optimized charts and 3D intelligence render confidence, risk, and trend shifts clearly.',
  },
  {
    id: 'feed',
    title: 'Feed Preview',
    copy: 'Live posts from strategists with chart thumbnails, scores, insights, likes, and forks.',
  },
  {
    id: 'rank',
    title: 'Rank Progression',
    copy: 'XP, level-up rewards, missions, and badge vaults connect performance to growth.',
  },
] as const;

function DashboardPreview() {
  return (
    <div className="rounded-2xl p-4" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.76)' }}>
      <div className="grid grid-cols-3 gap-2">
        {['Signal', 'Runs', 'Risk'].map((label, index) => (
          <div key={label} className="rounded-xl px-3 py-2" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.8)' }}>
            <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: index === 2 ? 'var(--amber-warning)' : 'var(--text-primary)' }}>{index === 0 ? '94.8%' : index === 1 ? '12.8k' : 'Moderate'}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 h-28 rounded-xl" style={{ border: '1px solid var(--glass-stroke)', background: 'linear-gradient(180deg, rgba(59,130,246,0.12), rgba(17,24,39,0.36))' }} />
    </div>
  );
}

function AnalyticsPreview() {
  return (
    <div className="rounded-2xl p-4" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.76)' }}>
      <div className="h-32 rounded-xl p-3" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.82)' }}>
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <polyline points="0,52 14,44 30,40 45,34 60,22 78,18 100,8" fill="none" stroke="#3B82F6" strokeWidth="2.2" />
          <polyline points="0,50 14,48 30,44 45,39 60,30 78,28 100,16" fill="none" stroke="#22D3EE" strokeWidth="1.8" opacity="0.86" />
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg px-3 py-2" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.84)' }}>
          <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Confidence</p>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--emerald-success)' }}>+12.4%</p>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.84)' }}>
          <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Tail Risk</p>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--rose-alert)' }}>-8.1%</p>
        </div>
      </div>
    </div>
  );
}

function FeedPreview() {
  return (
    <div className="rounded-2xl p-4 space-y-2" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.76)' }}>
      {['Sarah Chen', 'Omar Khan', 'Elena Park'].map((name, index) => (
        <div key={name} className="rounded-xl px-3 py-2 flex items-center justify-between" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.82)' }}>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{name}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Score {88 + index * 3} · AI insight published</p>
          </div>
          <span className="text-xs" style={{ color: 'var(--signal-cyan)' }}>{82 + index * 11} likes</span>
        </div>
      ))}
    </div>
  );
}

function RankPreview() {
  return (
    <div className="rounded-2xl p-4" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.76)' }}>
      <div className="rounded-xl p-3" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.82)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Strategist Rank</p>
        <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Level 24</p>
        <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.24)' }}>
          <div className="h-full rounded-full" style={{ width: '78%', background: 'linear-gradient(90deg, #3B82F6, #22D3EE, #8B5CF6)' }} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {['Risk Master', 'Signal Architect', 'Market Sage'].map((badge) => (
          <div key={badge} className="rounded-lg px-2 py-2 text-[10px]" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.84)', color: 'var(--text-secondary)' }}>
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowcaseCard({ id }: { id: string }) {
  if (id === 'dashboard') {
    return <DashboardPreview />;
  }
  if (id === 'analytics') {
    return <AnalyticsPreview />;
  }
  if (id === 'feed') {
    return <FeedPreview />;
  }
  return <RankPreview />;
}

export default function ProductPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const active = SHOWCASE_SLIDES[activeSlide];

  const progressLabel = useMemo(() => `${activeSlide + 1} / ${SHOWCASE_SLIDES.length}`, [activeSlide]);

  return (
    <MarketingLayout>
      <main className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16 space-y-8">
        <header className="max-w-3xl" data-reveal>
          <p className="section-kicker">Product</p>
          <h1 className="section-title">
            Real product showcase.
            <br />
            No placeholder lines.
          </h1>
          <p className="section-copy">
            Explore dashboard, analytics, feed, and rank progression previews through a polished carousel built on the same premium dark language as the app.
          </p>
        </header>

        <section className="premium-card p-6 md:p-8" data-reveal data-tilt>
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5 mb-6">
            <div>
              <p className="section-kicker">Product Showcase</p>
              <h2 className="mt-3 card-title" style={{ fontSize: 'clamp(1.9rem,3vw,2.5rem)' }}>{active.title}</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{active.copy}</p>
            </div>
            <span className="rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.14em]" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.72)', color: 'var(--text-muted)' }}>
              {progressLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
            <div className="space-y-2">
              {SHOWCASE_SLIDES.map((slide, index) => {
                const activeItem = index === activeSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className="w-full text-left rounded-xl px-3 py-2.5 transition-all duration-300"
                    style={{
                      border: activeItem ? '1px solid rgba(59,130,246,0.5)' : '1px solid var(--glass-stroke)',
                      background: activeItem ? 'rgba(59,130,246,0.16)' : 'rgba(11,16,32,0.74)',
                      color: activeItem ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    <span className="text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Scene {index + 1}</span>
                    <p className="mt-1 text-sm font-medium">{slide.title}</p>
                  </button>
                );
              })}
            </div>

            <div>
              <ShowcaseCard id={active.id} />
            </div>
          </div>
        </section>

        <section className="premium-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" data-reveal>
          <div>
            <p className="section-kicker">Launch Live</p>
            <h2 className="mt-4 card-title" style={{ fontSize: 'clamp(1.8rem,2.8vw,2.3rem)' }}>Enter the platform and run a strategic simulation now.</h2>
          </div>
          <Link to="/app/simulations/new" viewTransition className="primary-cta shrink-0">Run Simulation</Link>
        </section>
      </main>
    </MarketingLayout>
  );
}
