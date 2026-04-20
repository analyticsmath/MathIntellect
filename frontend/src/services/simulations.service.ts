import client from './api.client';
import type {
  Simulation,
  RunSimulationRequest,
  RunSimulationResponse,
} from '../types/api.types';

export const simulationsService = {
  list(): Promise<Simulation[]> {
    return client.get<Simulation[]>('/simulations').then((r) => r.data);
  },

  getById(id: string): Promise<Simulation> {
    return client.get<Simulation>(`/simulations/${id}`).then((r) => r.data);
  },

  run(payload: RunSimulationRequest): Promise<RunSimulationResponse> {
    return client
      .post<RunSimulationResponse>('/simulations/run', payload)
      .then((r) => r.data);
  },

  remove(id: string): Promise<void> {
    return client.delete(`/simulations/${id}`).then(() => undefined);
  },
};
