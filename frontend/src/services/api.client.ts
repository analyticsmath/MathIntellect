import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types/api.types';
import { clearAuthSession, readAuthSession } from '../shared/utils/auth-session';

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:5000/api/v1';

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
});

client.interceptors.request.use((config) => {
  const token = readAuthSession()?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the standard { success, data, timestamp } envelope
client.interceptors.response.use(
  (res) => {
    const body = res.data as ApiResponse<unknown>;
    if (body && 'data' in body) {
      res.data = body.data;
    }
    return res;
  },
  (err: AxiosError<{ message?: string | string[] }>) => {
    const status = err.response?.status;

    if (err.response?.status === 401) {
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('math-intellect:unauthorized'));
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
      }
    }

    const msg =
      err.response?.data?.message ??
      err.message ??
      'Unknown error';
    const readable = Array.isArray(msg) ? msg.join('; ') : msg;

    if (typeof window !== 'undefined' && status === 500) {
      window.dispatchEvent(
        new CustomEvent('math-intellect:api-error', {
          detail: {
            status,
            message: readable || 'Internal server error',
          },
        }),
      );
    }

    return Promise.reject(new Error(readable));
  },
);

export default client;
