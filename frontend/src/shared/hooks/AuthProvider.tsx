import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { authService } from '../../services/auth.service';
import type { AuthSession, LoginRequest, RegisterRequest } from '../../types/auth.types';
import {
  clearAuthSession,
  persistAuthSession,
  readAuthSession,
} from '../utils/auth-session';
import { AuthContext } from './auth-context';

const UNAUTHORIZED_EVENT_NAME = 'math-intellect:unauthorized';

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession());
  const initialized = true;

  useEffect(() => {
    const handleStorage = () => {
      setSession(readAuthSession());
    };

    const handleUnauthorized = () => {
      clearAuthSession();
      setSession(null);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(UNAUTHORIZED_EVENT_NAME, handleUnauthorized);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(UNAUTHORIZED_EVENT_NAME, handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const nextSession = await authService.login(payload);
    persistAuthSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const nextSession = await authService.register(payload);
    persistAuthSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.accessToken),
      initialized,
      login,
      register,
      logout,
    }),
    [initialized, login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
