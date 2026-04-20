import client from './api.client';
import type { AuthSession, LoginRequest, RegisterRequest } from '../types/auth.types';

export const authService = {
  login(payload: LoginRequest): Promise<AuthSession> {
    return client.post<AuthSession>('/auth/login', payload).then((response) => response.data);
  },

  register(payload: RegisterRequest): Promise<AuthSession> {
    return client.post<AuthSession>('/auth/register', payload).then((response) => response.data);
  },
};
