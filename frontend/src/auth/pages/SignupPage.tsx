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
    return 'Full name is required.';
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
      navigate('/app', { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Account creation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Access the simulation workbench and mathematical modeling tools."
      footerPrompt="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-mi-muted uppercase mb-1.5" htmlFor="signup-name">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            value={values.name}
            autoComplete="name"
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
            className="mi-input"
            placeholder="Henri Poincaré"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-mi-muted uppercase mb-1.5" htmlFor="signup-email">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            value={values.email}
            autoComplete="email"
            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
            className="mi-input"
            placeholder="poincare@math-intellect.ai"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-mi-muted uppercase mb-1.5" htmlFor="signup-password">
            Password (min. 8 characters)
          </label>
          <input
            id="signup-password"
            type="password"
            value={values.password}
            autoComplete="new-password"
            onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
            className="mi-input"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-mi-muted uppercase mb-1.5" htmlFor="signup-confirm">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            value={values.confirmPassword}
            autoComplete="new-password"
            onChange={(e) => setValues((prev) => ({ ...prev, confirmPassword: e.target.value }))}
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
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
