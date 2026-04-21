import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('AppErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center px-6" style={{ background: 'var(--bg-main)' }}>
          <section
            className="w-full max-w-lg rounded-3xl p-7 text-center"
            style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(14, 22, 36, 0.9)' }}
          >
            <p className="section-kicker">System Recovery</p>
            <h1 className="mt-3 text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              We hit an unexpected rendering error. Reload the workspace or return to login.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                className="primary-cta"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
              <Link to="/login" className="secondary-cta">
                Go to Login
              </Link>
            </div>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
