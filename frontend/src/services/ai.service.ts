import client from './api.client';
import type {
  AiCompareRequest,
  AiCompareResponse,
  AiDecisionRequest,
  AiDecisionResponse,
  AiExplainResponse,
  AiIntelligenceResponse,
  AiInsightResponse,
} from '../types/api.types';

export const aiService = {
  getInsight(simulationId: string): Promise<AiInsightResponse> {
    return client
      .get<AiInsightResponse>(`/ai/insight/${simulationId}`)
      .then((r) => r.data);
  },

  getIntelligence(simulationId: string): Promise<AiIntelligenceResponse> {
    return client
      .get<AiIntelligenceResponse>(`/ai/intelligence/${simulationId}`)
      .then((r) => r.data);
  },

  getDecision(payload: AiDecisionRequest): Promise<AiDecisionResponse> {
    return client
      .post<AiDecisionResponse>('/ai/decision', payload)
      .then((r) => r.data);
  },

  compareSimulations(payload: AiCompareRequest): Promise<AiCompareResponse> {
    return client
      .post<AiCompareResponse>('/ai/compare', payload)
      .then((r) => r.data);
  },

  explainSimulation(simulationId: string): Promise<AiExplainResponse> {
    return client
      .get<AiExplainResponse>(`/ai/explain/${simulationId}`)
      .then((r) => r.data);
  },
};
