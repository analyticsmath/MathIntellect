import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { BrandLogo } from '../../components/ui/BrandLogo';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/product', label: 'Product' },
  { to: '/pricing', label: 'Pricing' },
];

const FOOTER_COLUMNS = {
  Platform: [
    { label: 'Dashboard', to: '/app' },
    { label: 'Run Simulation', to: '/app/simulations/new' },
    { label: 'Intelligence Feed', to: '/app/feed' },
  ],
  Engines: [
    { label: 'Monte Carlo', to: '/features#monte-carlo' },
    { label: 'Game Theory', to: '/features#game-theory' },
    { label: 'Market', to: '/features#market-engine' },
    { label: 'Conflict', to: '/features#conflict-engine' },
  ],
  Company: [
    { label: 'Home', to: '/' },
    { label: 'Product', to: '/product' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Resources: [
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Live Demo', to: '/#live-demo' },
    { label: 'System Access', to: '/login' },
  ],
  Legal: [
    { label: 'Privacy', to: '/pricing#privacy' },
    { label: 'Terms', to: '/pricing#terms' },
    { label: 'Compliance', to: '/pricing#compliance' },
  ],
};

const SOCIAL_LINKS = [
  {
    label: 'X',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="m18.9 2 2.6 0-5.8 6.6 6.8 9.3h-5.3l-4.2-5.6-4.9 5.6H5.4l6.2-7-6.5-8.9h5.5l3.8 5.1L18.9 2Zm-1 14.1h1.5L9.9 3.8H8.3l9.6 12.3Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M6.9 8.3H3.2V20h3.7V8.3Zm.3-3.6a2.1 2.1 0 1 0-4.2 0 2.1 2.1 0 0 0 4.2 0ZM20.8 13c0-3.5-1.9-5.1-4.4-5.1-2 0-2.9 1.1-3.3 1.8V8.3H9.4V20h3.7v-6.5c0-1.7.3-3.4 2.4-3.4 2 0 2 1.9 2 3.5V20h3.7V13Z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.5-1.1-1.5-.9-.6 0-.6 0-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.5 1.1 3.1.8.1-.7.4-1.1.7-1.4-2.2-.2-4.6-1.1-4.6-5a4 4 0 0 1 1-2.8c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.8 9.8 0 0 1 5.2 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a4 4 0 0 1 1 2.8c0 3.9-2.4 4.8-4.7 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5C.6 9.4.6 12 .6 12s0 2.6.4 4.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-4.5.4-4.5s0-2.6-.4-4.5ZM9.8 15.1V8.9L15.8 12l-6 3.1Z" />
      </svg>
    ),
  },
];

interface MarketingLayoutProps {
  children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [newsletter, setNewsletter] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 18);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navHeight = useMemo(() => (compact ? 'h-14' : 'h-16 md:h-[74px]'), [compact]);

  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 px-3 md:px-6 pt-3">
        <div
          className="mx-auto max-w-7xl rounded-2xl transition-all duration-300"
          style={{
            border: compact ? '1px solid rgba(59, 130, 246, 0.42)' : '1px solid var(--glass-stroke)',
            background: compact ? 'rgba(11, 16, 32, 0.9)' : 'rgba(11, 16, 32, 0.74)',
            boxShadow: compact ? '0 18px 42px rgba(2,6,23,0.56)' : '0 12px 28px rgba(2,6,23,0.42)',
            backdropFilter: 'blur(14px) saturate(125%)',
            WebkitBackdropFilter: 'blur(14px) saturate(125%)',
          }}
        >
          <div className={`px-4 md:px-6 flex items-center justify-between gap-3 transition-all duration-300 ${navHeight}`}>
            <BrandLogo compact={compact} showTagline={!compact} className="shrink-0" />

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  viewTransition
                  end={item.to === '/'}
                  className={({ isActive }) => [
                    'px-3 py-2 rounded-xl text-sm transition-all duration-200 relative',
                    isActive ? '' : 'hover:opacity-100 opacity-85',
                  ].join(' ')}
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(59, 130, 246, 0.16)' : 'transparent',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.44)' : '1px solid transparent',
                    boxShadow: isActive ? '0 0 0 1px rgba(59,130,246,0.2)' : 'none',
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              {!isAuthenticated && (
                <Link to="/login" viewTransition className="secondary-cta">Log In</Link>
              )}
              <Link to="/app" viewTransition className="primary-cta" style={{ viewTransitionName: 'launch-cta' }}>
                {isAuthenticated ? 'Enter Platform' : 'Start Free'}
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden rounded-xl px-3 py-2 text-xs uppercase tracking-[0.16em]"
              style={{
                border: '1px solid rgba(59, 130, 246, 0.38)',
                background: 'rgba(17, 24, 39, 0.9)',
                color: 'var(--text-primary)',
              }}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              Menu
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t px-4 pb-4 pt-2 space-y-1" style={{ borderColor: 'var(--glass-stroke)' }}>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  viewTransition
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(59, 130, 246, 0.14)' : 'rgba(17, 24, 39, 0.86)',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.42)' : '1px solid var(--glass-stroke)',
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {!isAuthenticated && (
                  <Link to="/login" viewTransition className="secondary-cta text-center" onClick={() => setMobileOpen(false)}>Log In</Link>
                )}
                <Link to="/app" viewTransition className="primary-cta text-center" onClick={() => setMobileOpen(false)}>
                  Enter Platform
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {children}

      <footer className="px-4 md:px-8 py-12 mt-10">
        <div
          className="mx-auto max-w-7xl rounded-3xl p-6 md:p-8"
          style={{
            border: '1px solid var(--glass-stroke)',
            background: 'linear-gradient(180deg, rgba(17,24,39,0.94), rgba(11,16,32,0.94))',
            boxShadow: '0 24px 56px rgba(2, 6, 23, 0.52)',
          }}
        >
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))] gap-8">
            <div>
              <BrandLogo showTagline className="inline-flex" />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Where Math Meets Intelligence.
              </p>
              <div className="mt-4 flex items-center gap-2">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg w-8 h-8 transition-all duration-200"
                    style={{
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--glass-stroke)',
                      background: 'rgba(17,24,39,0.76)',
                    }}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(FOOTER_COLUMNS).map(([column, links]) => (
              <div key={column}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>{column}</p>
                <div className="mt-3 space-y-2 text-sm">
                  {links.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      viewTransition
                      className="block transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center" style={{ borderColor: 'var(--glass-stroke)' }}>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!newsletter.trim()) {
                  return;
                }
                setNewsletter('');
                setNewsletterState('saved');
                window.setTimeout(() => setNewsletterState('idle'), 2400);
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">Newsletter email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={newsletter}
                onChange={(event) => setNewsletter(event.target.value)}
                placeholder="Subscribe for product updates"
                className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm"
                style={{
                  border: '1px solid var(--line-soft)',
                  background: 'rgba(11, 16, 32, 0.76)',
                  color: 'var(--text-primary)',
                }}
              />
              <button type="submit" className="primary-cta" style={{ paddingTop: 10, paddingBottom: 10 }}>
                Join Newsletter
              </button>
              {newsletterState === 'saved' && (
                <span className="text-xs self-center" style={{ color: 'var(--emerald-success)' }}>
                  Subscribed successfully.
                </span>
              )}
            </form>

            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Math Intellect. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
