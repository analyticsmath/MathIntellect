import { useState, useRef, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      emailInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/app');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Authentication failed. Please verify your credentials.';
      setError(message);
      emailInputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mi-canvas flex flex-col justify-between selection:bg-mi-ink selection:text-mi-paper">
      {/* Compact Brand Header */}
      <header className="h-16 px-6 sm:px-8 border-b border-mi-rule flex items-center justify-between bg-mi-paper">
        <Link
          to="/"
          className="font-sans font-medium text-base text-mi-ink tracking-tight hover:opacity-80 transition-opacity"
        >
          Math Intellect
        </Link>
        <Link
          to="/signup"
          className="font-sans text-sm text-mi-muted hover:text-mi-ink transition-colors"
        >
          Create an account
        </Link>
      </header>

      {/* Main Form Canvas */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px] bg-mi-paper border border-mi-rule p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-mi-ink">
              Sign in to Math Intellect
            </h1>
            <p className="text-mi-muted text-sm mt-2">
              Continue to your workbench.
            </p>
          </div>

          {/* Accessible Error Live Region */}
          <div aria-live="assertive" aria-atomic="true">
            {error && (
              <div
                role="alert"
                className="mb-6 p-3 bg-mi-canvas border border-mi-data-red text-mi-data-red font-mono text-xs"
              >
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block font-mono text-xs text-mi-ink-2 mb-1.5 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="login-email"
                ref={emailInputRef}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="w-full h-11 px-3.5 bg-mi-white border border-mi-rule font-sans text-sm text-mi-ink placeholder:text-mi-muted/60 focus:outline-none focus:border-mi-ink"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block font-mono text-xs text-mi-ink-2 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 px-3.5 bg-mi-white border border-mi-rule font-sans text-sm text-mi-ink placeholder:text-mi-muted/60 focus:outline-none focus:border-mi-ink"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-mi-ink text-mi-paper font-sans text-sm font-medium hover:bg-mi-ink-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-mi-rule flex justify-between items-center text-xs font-mono text-mi-muted">
            <span>Need an account?</span>
            <Link to="/signup" className="text-mi-ink hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      {/* Quiet Auth Footer */}
      <footer className="py-6 text-center text-xs font-mono text-mi-muted border-t border-mi-rule">
        <span>Math Intellect | Deterministic Simulation</span>
      </footer>
    </div>
  );
}

export default LoginPage;
