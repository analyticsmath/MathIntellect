import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../shared/hooks/useAuth';

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  onMenuToggle?: () => void;
}

export function Topbar({ title, subtitle, action, onMenuToggle }: TopbarProps) {
  const { session, logout } = useAuth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-20 h-14 bg-mi-paper border-b border-mi-rule px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 border border-mi-rule text-mi-ink"
          aria-label="Toggle navigation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-semibold text-mi-ink truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-mono text-mi-muted truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {action && <div>{action}</div>}

        <Link
          to="/app/simulations/new"
          className="mi-btn-primary h-8 px-3 text-xs"
        >
          + New Simulation
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-mi-rule text-xs font-mono">
          <span className="text-mi-text hidden sm:inline">{user?.name || user?.email || 'Analyst'}</span>
          <button
            onClick={() => logout()}
            className="text-mi-muted hover:text-mi-danger px-1"
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
