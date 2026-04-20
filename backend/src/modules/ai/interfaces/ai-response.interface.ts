import { SkillProfile } from '../../gabe/interfaces/skill-profile.interface';
import { DecisionResponse } from './decision.interface';
import { InsightResponse } from './insight.interface';

export interface AiResponseMeta {
  prompt_version: string;
  source: 'ai' | 'fallback';
  latency_ms: number;
  cached: boolean;
}

export interface ExplainStep {
  step: string;
  formula: string;
  interpretation: string;
}

export interface ExplainResponse {
  summary: string;
  steps: ExplainStep[];
  final_takeaway: string;
  confidence_score: number;
}

export interface SimulationComparisonItem {
  simulation_id: string;
  summary: string;
  risk: string;
  expected_value: string;
  ranking_score: number;
}

export interface CompareResponse {
  comparisons: SimulationComparisonItem[];
  best_option: string;
  reasoning: string;
}

export interface GamificationEventResponse {
  xp_gain: number;
  level_progress: number;
  skill_update: SkillProfile;
  behavior_tag: string;
}

export interface AiIntelligenceResponse {
  insight: InsightResponse;
  decision: DecisionResponse;
  gamification_event: GamificationEventResponse;
}

export interface AiCoachResponse {
  recommendation: string;
  reasoning: string[];
  behavior_summary: string;
  drift_direction: 'increasing' | 'decreasing' | 'stable';
  recommended_next_strategy: string;
  difficultyAdjustment: {
    direction: 'increase' | 'decrease' | 'maintain';
    magnitude: number;
    rationale: string;
  };
  nextSimulationBlueprint: {
    type: string;
    name: string;
    objective: string;
    parameters: Record<string, unknown>;
  };
  meta: {
    cached: boolean;
    debounced: boolean;
    generatedAt: string;
  };
}
