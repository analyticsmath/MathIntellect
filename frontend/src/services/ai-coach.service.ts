import client from './api.client';
import type { CoachRecommendation } from '../types/phase5.types';

interface AiCoachApiResponse {
  recommendation: string;
  reasoning: string[];
  difficultyAdjustment: {
    direction: 'increase' | 'decrease' | 'maintain';
  };
  nextSimulationBlueprint: {
    type: string;
    name: string;
    objective: string;
  };
  behavior_summary?: string;
  drift_direction?: string;
  recommended_next_strategy?: string;
}

const FALLBACK_RECOMMENDATION: CoachRecommendation = {
  nextSimulation: {
    type: 'monte_carlo',
    name: 'Deterministic Confidence Run',
    description:
      'Run a bounded Monte Carlo scenario and verify replay consistency before scaling complexity.',
  },
  reasoning:
    'Fallback coach mode: use deterministic replay and stable confidence bounds for the next step.',
  difficultyAdjustment: 'maintain',
  growthDirection: 'Stability',
  estimatedXpGain: 120,
};

function toCoachRecommendation(payload: AiCoachApiResponse): CoachRecommendation {
  return {
    nextSimulation: {
      type: payload.nextSimulationBlueprint.type,
      name: payload.nextSimulationBlueprint.name,
      description: payload.nextSimulationBlueprint.objective,
    },
    reasoning: [
      payload.recommendation,
      ...(payload.reasoning ?? []),
      payload.behavior_summary ?? '',
      payload.recommended_next_strategy ?? '',
    ]
      .map((entry) => entry.trim())
      .filter(Boolean)
      .join(' '),
    difficultyAdjustment: payload.difficultyAdjustment.direction,
    growthDirection: payload.drift_direction ?? 'Stable',
    estimatedXpGain:
      payload.difficultyAdjustment.direction === 'increase'
        ? 180
        : payload.difficultyAdjustment.direction === 'decrease'
          ? 95
          : 130,
  };
}

export const aiCoachService = {
  async getRecommendation(lastSimulationId?: string): Promise<CoachRecommendation> {
    try {
      const payload = await client
        .post<AiCoachApiResponse>('/v2/ai/coach', {
          simulationId: lastSimulationId,
        })
        .then((r) => r.data);

      return toCoachRecommendation(payload);
    } catch {
      return FALLBACK_RECOMMENDATION;
    }
  },
};
