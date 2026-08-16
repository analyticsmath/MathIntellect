import type { ReactNode } from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-10 h-10 border border-mi-danger bg-mi-danger/10 flex items-center justify-center text-mi-danger">
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 01-1.299 2.25H2.804a1.5 1.5 0 01-1.3-2.25l5.197-9zM8 4a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-mi-danger">Simulation calculation issue</p>
        <p className="text-xs mt-1 max-w-sm text-mi-text font-mono">
          {message ?? 'An unexpected calculation error occurred.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mi-btn-secondary text-xs h-9 px-4"
        >
          Retry calculation
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center border border-mi-rule bg-mi-paper p-8">
      <div className="text-xs font-mono text-mi-muted uppercase">
        NO DATA AVAILABLE
      </div>
      <p className="text-sm max-w-sm text-mi-text">
        {message}
      </p>
      {action}
    </div>
  );
}
