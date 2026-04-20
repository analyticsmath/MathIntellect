import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
      navigate(nextPath, { replace: true, viewTransition: true });
    } catch (err) {
      setError((err as Error).message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to access your simulation workspace and live intelligence analytics."
      footerPrompt="Need an account?"
      footerLinkLabel="Create one"
      footerLinkTo="/signup"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Email</span>
          <input
            type="email"
            value={values.email}
            autoComplete="email"
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            className="auth-input"
            placeholder="you@company.com"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Password</span>
          <input
            type="password"
            value={values.password}
            autoComplete="current-password"
            onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
            className="auth-input"
            placeholder="Your secure password"
            required
          />
        </label>

        {error && (
          <div className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: 'rgba(244,63,94,0.4)', background: 'rgba(244,63,94,0.12)', color: '#fecdd3' }}>
            {error}
          </div>
        )}

        <button type="submit" className="primary-cta w-full justify-center" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Want to preview first? <Link to="/" viewTransition style={{ color: 'var(--brand-blue)' }}>Explore site</Link>
        </p>
      </form>
    </AuthShell>
  );
}
