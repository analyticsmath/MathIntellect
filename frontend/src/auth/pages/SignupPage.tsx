import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { useAuth } from '../../shared/hooks/useAuth';

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function validate(values: SignupFormValues): string | null {
  if (!values.name.trim()) {
    return 'Name is required.';
  }

  if (values.name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    return 'Enter a valid email address.';
  }

  if (values.password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (values.password !== values.confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [values, setValues] = useState<SignupFormValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate('/app', { replace: true, viewTransition: true });
    } catch (err) {
      setError((err as Error).message || 'Account creation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Launch simulations, analyze outcomes, and collaborate with mathematical intelligence."
      footerPrompt="Already have an account?"
      footerLinkLabel="Log in"
      footerLinkTo="/login"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Full Name</span>
          <input
            type="text"
            value={values.name}
            autoComplete="name"
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            className="auth-input"
            placeholder="Ada Lovelace"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Email</span>
          <input
            type="email"
            value={values.email}
            autoComplete="email"
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            className="auth-input"
            placeholder="ada@math-intellect.ai"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Password</span>
          <input
            type="password"
            value={values.password}
            autoComplete="new-password"
            onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
            className="auth-input"
            placeholder="Minimum 8 characters"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Confirm Password</span>
          <input
            type="password"
            value={values.confirmPassword}
            autoComplete="new-password"
            onChange={(event) => setValues((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            className="auth-input"
            placeholder="Repeat password"
            required
          />
        </label>

        {error && (
          <div className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: 'rgba(244,63,94,0.4)', background: 'rgba(244,63,94,0.12)', color: '#fecdd3' }}>
            {error}
          </div>
        )}

        <button type="submit" className="primary-cta w-full justify-center" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  );
}
