// Shared TypeScript types used across frontend and backend

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Simulation {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: SimulationType;
  status: SimulationStatus;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type SimulationType =
  | 'monte_carlo'
  | 'linear_regression'
  | 'neural_net'
  | 'fourier_analysis'
  | 'markov_chain'
  | 'black_scholes';

export type SimulationStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface SimulationResult {
  id: string;
  simulationId: string;
  data: Record<string, unknown>;
  metrics?: Record<string, number>;
  executionTime?: number;
  createdAt: string;
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description?: string;
  algorithm: string;
  parameters: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
