import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  onMenuToggle?: () => void;
}

export function Topbar({ title, subtitle, action, onMenuToggle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 px-3 md:px-6 pt-2.5">
      <div
        className="rounded-3xl px-4 md:px-5 py-2.5"
        style={{
          border: '1px solid var(--glass-stroke)',
          background: 'rgba(14, 22, 36, 0.82)',
          backdropFilter: 'blur(16px) saturate(130%)',
          WebkitBackdropFilter: 'blur(16px) saturate(130%)',
          boxShadow: '0 16px 36px rgba(2, 8, 20, 0.56)',
        }}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg shrink-0"
            style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(22, 32, 51, 0.9)' }}
            aria-label="Toggle menu"
          >
            <span className="w-4 h-px rounded-full" style={{ background: 'var(--text-primary)' }} />
            <span className="w-4 h-px rounded-full" style={{ background: 'var(--text-primary)' }} />
            <span className="w-2.5 h-px rounded-full" style={{ background: 'var(--text-primary)' }} />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
              Workspace / {title}
            </p>
            <h1 className="text-sm md:text-base font-semibold truncate tracking-tight mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
            {subtitle && (
              <p className="text-[11px] mt-0.5 truncate capitalize" style={{ color: 'var(--text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2 min-w-0 w-[34%]">
            <input
              aria-label="Search"
              placeholder="Search simulations, users, insights"
              className="w-full rounded-xl px-3 py-2 text-sm"
              style={{
                border: '1px solid var(--line-soft)',
                background: 'rgba(22, 32, 51, 0.74)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="rounded-xl px-2.5 py-2 text-xs hidden sm:inline-flex"
              style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(22, 32, 51, 0.82)', color: 'var(--text-secondary)' }}
              aria-label="Quick actions"
            >
              + Quick Action
            </button>
            <button
              type="button"
              className="rounded-xl px-2.5 py-2 text-xs"
              style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(22, 32, 51, 0.82)', color: 'var(--text-secondary)' }}
              data-ripple
              aria-label="Notifications"
            >
              🔔
            </button>
            <Link to="/app/simulations/new" viewTransition className="secondary-cta hidden md:inline-flex" style={{ paddingTop: 9, paddingBottom: 9 }}>
              Quick Launch
            </Link>
            <Link to="/" viewTransition className="secondary-cta hidden md:inline-flex" style={{ paddingTop: 9, paddingBottom: 9 }}>
              Visit Main Site
            </Link>
            {action && <div className="shrink-0">{action}</div>}
            <button
              type="button"
              className="w-9 h-9 rounded-xl text-xs font-semibold"
              style={{
                border: '1px solid rgba(110, 231, 255, 0.36)',
                background: 'linear-gradient(140deg, rgba(110, 231, 255, 0.2), rgba(139, 92, 246, 0.2))',
                color: 'var(--text-main)',
              }}
              aria-label="Open profile menu"
            >
              MI
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
