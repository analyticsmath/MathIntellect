import type { ReactElement } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

interface DockItem {
  to: string;
  label: string;
  icon: ReactElement;
  end?: boolean;
}

function resolveInsightsRoute(pathname: string): string {
  if (pathname.startsWith('/app/analytics/')) {
    return pathname;
  }

  const stored = window.localStorage.getItem('math-intellect.lastAnalyticsRoute');
  if (stored && stored.startsWith('/app/analytics/')) {
    return stored;
  }

  return '/app';
}

export function MobileDock() {
  const location = useLocation();

  const items: DockItem[] = [
    {
      to: '/app',
      label: 'Home',
      end: true,
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10.8 2.6a1.2 1.2 0 00-1.6 0l-6.5 5.8a1.2 1.2 0 00.8 2h.7V16a1.5 1.5 0 001.5 1.5h2.9A1.5 1.5 0 0010 16v-2.5h0V16a1.5 1.5 0 001.5 1.5h2.9A1.5 1.5 0 0015.9 16v-5.6h.7a1.2 1.2 0 00.8-2l-6.6-5.8z" />
        </svg>
      ),
    },
    {
      to: '/app/feed',
      label: 'Feed',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M3 3.5A1.5 1.5 0 014.5 2h11A1.5 1.5 0 0117 3.5v13a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13zm3 3a1 1 0 100 2h8a1 1 0 100-2H6zm0 4a1 1 0 100 2h6a1 1 0 100-2H6z" />
        </svg>
      ),
    },
    {
      to: resolveInsightsRoute(location.pathname),
      label: 'Analytics',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M3 11.5A1.5 1.5 0 014.5 10h2A1.5 1.5 0 018 11.5V16a1.5 1.5 0 01-1.5 1.5h-2A1.5 1.5 0 013 16v-4.5zm4.5-5A1.5 1.5 0 019 5h2a1.5 1.5 0 011.5 1.5V16A1.5 1.5 0 0111 17.5H9A1.5 1.5 0 017.5 16V6.5zm4.5-3A1.5 1.5 0 0113.5 2h2A1.5 1.5 0 0117 3.5V16a1.5 1.5 0 01-1.5 1.5h-2A1.5 1.5 0 0112 16V3.5z" />
        </svg>
      ),
    },
    {
      to: '/app/profile',
      label: 'Profile',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10 2.5a4 4 0 110 8 4 4 0 010-8zM4 16a5.7 5.7 0 1111.4 0v.6A1.4 1.4 0 0114 18H6a1.4 1.4 0 01-1.4-1.4V16z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none px-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
    >
      <div
        className="pointer-events-auto mx-auto max-w-[720px] px-2 pb-2 pt-3 rounded-3xl relative"
        style={{
          border: '1px solid var(--glass-stroke)',
          background: 'rgba(14, 22, 36, 0.9)',
          backdropFilter: 'blur(18px) saturate(125%)',
          WebkitBackdropFilter: 'blur(18px) saturate(125%)',
          boxShadow: '0 22px 46px rgba(2, 8, 20, 0.62)',
        }}
      >
        <Link
          to="/app/simulations/new"
          viewTransition
          className="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 rounded-2xl grid place-items-center"
          style={{
            border: '1px solid rgba(110, 231, 255, 0.55)',
            background: 'var(--brand-gradient)',
            boxShadow: '0 14px 28px rgba(110, 231, 255, 0.3)',
            color: 'var(--text-main)',
          }}
          aria-label="Run simulation"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6 3.2A1.2 1.2 0 004.2 4.2v11.6A1.2 1.2 0 006 16.8l9.2-5.8a1.2 1.2 0 000-2L6 3.2z" />
          </svg>
        </Link>

        <div className="grid grid-cols-4 gap-1 mt-2">
          {items.map((item) => (
            <NavLink
              key={`${item.label}-${item.to}`}
              to={item.to}
              end={item.end}
              viewTransition
              className="rounded-xl px-1 py-2.5 inline-flex flex-col items-center gap-1.5 text-[10px] font-semibold transition-all duration-200"
              style={({ isActive }) => ({
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive ? 'rgba(110, 231, 255, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(110, 231, 255, 0.3)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 14px rgba(110, 231, 255, 0.18)' : 'none',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0px)',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
