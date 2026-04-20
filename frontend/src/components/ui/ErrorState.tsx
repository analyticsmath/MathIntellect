import type { ReactNode } from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ border: '1px solid rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.14)' }}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5" style={{ color: '#F43F5E' }}>
          <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 01-1.299 2.25H2.804a1.5 1.5 0 01-1.3-2.25l5.197-9zM8 4a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#FDA4AF' }}>Something went wrong</p>
        <p className="text-xs mt-1 max-w-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {message ?? 'An unexpected error occurred.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="secondary-cta text-xs"
          style={{ paddingTop: 8, paddingBottom: 8 }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl"
        style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17, 24, 39, 0.86)' }}
      >
        ...
      </div>
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
      {action}
    </div>
  );
}
