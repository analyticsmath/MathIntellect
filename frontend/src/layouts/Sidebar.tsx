import { NavLink } from 'react-router-dom';
import { BrandLogo } from '../components/ui/BrandLogo';

function resolveInsightsRoute(): string {
  const stored = window.localStorage.getItem('math-intellect.lastAnalyticsRoute');
  if (stored && stored.startsWith('/app/analytics/')) {
    return stored;
  }
  return '/app';
}

const NAV = [
  { to: '/app', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/app/simulations/new', label: 'Run Simulation', icon: PlayIcon },
  { to: '/app/feed', label: 'Feed', icon: FeedIcon },
  { to: resolveInsightsRoute(), label: 'Analytics', icon: ChartIcon },
  { to: '/app/profile', label: 'Profile', icon: ProfileIcon },
];

function DashboardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2 5.5A1.5 1.5 0 013.5 4h13A1.5 1.5 0 0118 5.5v2A1.5 1.5 0 0116.5 9h-13A1.5 1.5 0 012 7.5v-2zm0 7A1.5 1.5 0 013.5 11h5A1.5 1.5 0 0110 12.5v2A1.5 1.5 0 018.5 16h-5A1.5 1.5 0 012 14.5v-2zm9 0A1.5 1.5 0 0112.5 11h4A1.5 1.5 0 0118 12.5v2a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  );
}

function FeedIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 3.5A1.5 1.5 0 014.5 2h11A1.5 1.5 0 0117 3.5v13a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13zm3 3a1 1 0 100 2h8a1 1 0 100-2H6zm0 4a1 1 0 100 2h6a1 1 0 100-2H6z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 11.5A1.5 1.5 0 014.5 10h2A1.5 1.5 0 018 11.5V16a1.5 1.5 0 01-1.5 1.5h-2A1.5 1.5 0 013 16v-4.5zm4.5-5A1.5 1.5 0 019 5h2a1.5 1.5 0 011.5 1.5V16A1.5 1.5 0 0111 17.5H9A1.5 1.5 0 017.5 16V6.5zm4.5-3A1.5 1.5 0 0113.5 2h2A1.5 1.5 0 0117 3.5V16a1.5 1.5 0 01-1.5 1.5h-2A1.5 1.5 0 0112 16V3.5z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 2.5a4 4 0 110 8 4 4 0 010-8zM4 16a5.7 5.7 0 1111.4 0v.6A1.4 1.4 0 0114 18H6a1.4 1.4 0 01-1.4-1.4V16z" />
    </svg>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const ENGINE_TYPES = [
  { label: 'Monte Carlo', color: '#3B82F6' },
  { label: 'Game Theory', color: '#22D3EE' },
  { label: 'Market', color: '#8B5CF6' },
  { label: 'Conflict', color: '#F43F5E' },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 h-screen w-72 z-30 flex flex-col',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        style={{
          background: 'linear-gradient(180deg, rgba(17,24,39,0.97) 0%, rgba(11,16,32,0.97) 100%)',
          borderRight: '1px solid var(--glass-stroke)',
          boxShadow: '12px 0 40px rgba(2, 6, 23, 0.55)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--glass-stroke)' }}>
          <BrandLogo compact showTagline={false} className="w-full" />
          <p className="text-[10px] mt-3 uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
            Intelligence Cockpit
          </p>
        </div>

        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
            Navigation
          </p>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              viewTransition
              end={item.end}
              onClick={onClose}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1"
              style={({ isActive }) => ({
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(59, 130, 246, 0.16)' : 'rgba(17, 24, 39, 0.72)',
                border: isActive ? '1px solid rgba(59, 130, 246, 0.46)' : '1px solid var(--glass-stroke)',
                boxShadow: isActive ? '0 0 0 1px rgba(59,130,246,0.24)' : 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="nav-active-indicator" />}
                  <span style={{ color: isActive ? 'var(--signal-cyan)' : 'var(--text-muted)' }}>
                    <item.icon />
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div
            className="mt-4 rounded-2xl p-3"
            style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17, 24, 39, 0.78)' }}
          >
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
              Engine Fleet
            </p>
            <div className="mt-3 space-y-2">
              {ENGINE_TYPES.map((engine) => (
                <div key={engine.label} className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>{engine.label}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: engine.color, boxShadow: `0 0 10px ${engine.color}` }} />
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--glass-stroke)' }}>
          <div
            className="rounded-2xl p-3"
            style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17, 24, 39, 0.86)' }}
          >
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>System Health</p>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Realtime sync active. Engines available.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
