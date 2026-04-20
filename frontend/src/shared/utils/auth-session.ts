import type { AuthSession } from '../../types/auth.types';

const AUTH_SESSION_KEY = 'math-intellect.auth.session';

function isSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AuthSession>;
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.user?.id === 'string' &&
    typeof candidate.user?.email === 'string'
  );
}

export function readAuthSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistAuthSession(session: AuthSession): void {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
