import { NavLink } from 'react-router-dom';

function resolveInsightsRoute(): string {
  const stored = window.localStorage.getItem('math-intellect.lastAnalyticsRoute');
  if (stored && stored.startsWith('/app/analytics/')) {
    return stored;
  }
  return '/app';
}

const NAV = [
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/simulations/new', label: 'Model Builder' },
  { to: '/app/feed', label: 'Activity Stream' },
  { to: resolveInsightsRoute(), label: 'Result Workbench' },
  { to: '/app/profile', label: 'Profile & Settings' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-mi-ink/30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 h-screen w-56 z-30 flex flex-col bg-mi-paper border-r border-mi-rule',
          'transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-mi-rule flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-base text-mi-ink">
            <span className="w-3 h-3 bg-mi-ink inline-block" aria-hidden="true" />
            <span>Math Intellect</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 flex-1 overflow-y-auto space-y-1" aria-label="Workspace Navigation">
          <div className="text-[10px] font-mono text-mi-muted uppercase px-3 py-2">
            WORKSPACE
          </div>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 text-xs font-medium border transition-colors ${
                  isActive
                    ? 'border-mi-ink bg-mi-surface-soft text-mi-ink font-semibold'
                    : 'border-transparent text-mi-text hover:text-mi-ink hover:bg-mi-canvas'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-mi-ink" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quiet System Environment Footer */}
        <div className="p-4 border-t border-mi-rule text-[11px] font-mono text-mi-muted">
          <div>WORKSPACE: ACTIVE</div>
          <div className="text-[10px] text-mi-text mt-0.5">MATH ENGINE v3.0</div>
        </div>
      </aside>
    </>
  );
}
