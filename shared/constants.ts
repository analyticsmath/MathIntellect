// Shared constants

export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000';

export const SIMULATION_TYPES = [
  { value: 'monte_carlo', label: 'Monte Carlo Simulation' },
  { value: 'linear_regression', label: 'Linear Regression' },
  { value: 'neural_net', label: 'Neural Network' },
  { value: 'fourier_analysis', label: 'Fourier Analysis' },
  { value: 'markov_chain', label: 'Markov Chain' },
  { value: 'black_scholes', label: 'Black-Scholes Model' },
] as const;

export const SIMULATION_STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  running: '#3B82F6',
  completed: '#10B981',
  failed: '#EF4444',
};

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
};
