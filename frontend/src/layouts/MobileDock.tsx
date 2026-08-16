import { NavLink, useLocation } from 'react-router-dom';

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

  const items = [
    { to: '/app', label: 'Home', end: true },
    { to: '/app/simulations/new', label: 'Builder' },
    { to: resolveInsightsRoute(location.pathname), label: 'Results' },
    { to: '/app/feed', label: 'Feed' },
    { to: '/app/profile', label: 'Profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-mi-paper border-t border-mi-rule flex items-center justify-around py-2 px-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
      aria-label="Mobile Bottom Navigation"
    >
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[11px] font-mono transition-colors ${
              isActive ? 'text-mi-ink font-bold' : 'text-mi-muted hover:text-mi-text'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>{item.label}</span>
              <span className={`w-1 h-1 rounded-full mt-0.5 ${isActive ? 'bg-mi-ink' : 'bg-transparent'}`} />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
