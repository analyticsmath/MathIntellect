import { createContext } from 'react';
import type { AuthSession, LoginRequest, RegisterRequest } from '../../types/auth.types';

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (payload: LoginRequest) => Promise<AuthSession>;
  register: (payload: RegisterRequest) => Promise<AuthSession>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
