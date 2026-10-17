import { useState, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "./components/AuthShell";
import { useAuth } from "../shared/hooks/useAuth";

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      nameInputRef.current?.focus();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      passwordInputRef.current?.focus();
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      passwordInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate("/app");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Registration failed. Please try again.");
      setError(message);
      nameInputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Make room for possibility."
      subtitle="Create your account to build, run and revisit your simulations."
      footerPrompt="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
    >
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="signup-name"
            className="block font-mono text-xs text-mi-ink-2 mb-1.5 uppercase tracking-wider"
          >
            Full name
          </label>
          <input
            id="signup-name"
            ref={nameInputRef}
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3.5 bg-mi-white border border-mi-rule font-sans text-sm text-mi-ink placeholder:text-mi-muted/60 focus:outline-none focus:border-mi-ink"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="block font-mono text-xs text-mi-ink-2 mb-1.5 uppercase tracking-wider"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3.5 bg-mi-white border border-mi-rule font-sans text-sm text-mi-ink placeholder:text-mi-muted/60 focus:outline-none focus:border-mi-ink"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="block font-mono text-xs text-mi-ink-2 mb-1.5 uppercase tracking-wider"
          >
            Password
          </label>
          <input
            id="signup-password"
            ref={passwordInputRef}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            aria-describedby="password-guidance"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-3.5 bg-mi-white border border-mi-rule font-sans text-sm text-mi-ink placeholder:text-mi-muted/60 focus:outline-none focus:border-mi-ink"
          />
        </div>

        <p id="password-guidance" className="mi-auth-help">
          Use at least eight characters.
        </p>
        <div>
          <label
            htmlFor="signup-confirm-password"
            className="block font-mono text-xs text-mi-ink-2 mb-1.5 uppercase tracking-wider"
          >
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-11 px-3.5 bg-mi-white border border-mi-rule font-sans text-sm text-mi-ink placeholder:text-mi-muted/60 focus:outline-none focus:border-mi-ink"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-mi-ink text-mi-paper font-sans text-sm font-medium hover:bg-mi-ink-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-3"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

export default SignupPage;
