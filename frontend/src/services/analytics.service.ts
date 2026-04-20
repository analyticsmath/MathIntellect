import client from './api.client';
import type {
  ChartsResponse,
  ThreeDResponse,
  SummaryResponse,
} from '../types/api.types';

export const analyticsService = {
  getCharts(simulationId: string): Promise<ChartsResponse> {
    return client
      .get<ChartsResponse>(`/analytics/${simulationId}/charts`)
      .then((r) => r.data);
  },

  get3D(simulationId: string): Promise<ThreeDResponse> {
    return client
      .get<ThreeDResponse>(`/analytics/${simulationId}/3d`)
      .then((r) => r.data);
  },

  getSummary(simulationId: string): Promise<SummaryResponse> {
    return client
      .get<SummaryResponse>(`/analytics/${simulationId}/summary`)
      .then((r) => r.data);
  },
};
