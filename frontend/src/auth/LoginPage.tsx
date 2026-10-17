import { useState, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "./components/AuthShell";
import { useAuth } from "../shared/hooks/useAuth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      emailInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate("/app");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ??
            "Authentication failed. Please verify your credentials.");
      setError(message);
      emailInputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Pick up your question where you left it."
      footerPrompt="New to Math Intellect?"
      footerLinkLabel="Create an account"
      footerLinkTo="/signup"
    >
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
            className="w-full h-11 px-3.5 bg-mi-white border border-mi-rule font-sans text-sm text-mi-ink placeholder:text-mi-muted/60 focus:outline-none focus:border-mi-ink"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-mi-ink text-mi-paper font-sans text-sm font-medium hover:bg-mi-ink-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
