import { useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { useAuth } from '../../shared/hooks/useAuth';

interface LoginFormValues {
  email: string;
  password: string;
}

function validate(values: LoginFormValues): string | null {
  if (!values.email.trim()) {
    return 'Email is required.';
  }
  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    return 'Enter a valid email address.';
  }
  if (!values.password) {
    return 'Password is required.';
  }
  return null;
}

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    return next && next.startsWith('/') ? next : '/app';
  }, [location.search]);

  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values);
    if (validation) {
      setError(validation);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await login(values);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Return to your models and previous simulations."
      footerPrompt="Need an account?"
      footerLinkLabel="Create one"
      footerLinkTo="/signup"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-mi-muted uppercase mb-1.5" htmlFor="login-email">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={values.email}
            autoComplete="email"
            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
            className={`mi-input ${error && !values.email ? 'mi-input-error' : ''}`}
            placeholder="analyst@math-intellect.ai"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-mi-muted uppercase mb-1.5" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={values.password}
            autoComplete="current-password"
            onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
            className="mi-input"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div role="alert" className="p-3 bg-mi-danger/10 border border-mi-danger/30 text-xs font-mono text-mi-danger">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mi-btn-primary w-full h-12 text-sm mt-2"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
