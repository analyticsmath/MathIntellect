export type LearningCurve = 'rising' | 'stable' | 'declining';

export type BehaviorPattern =
  | 'explorer'
  | 'optimizer'
  | 'risk_taker'
  | 'balanced';

export interface SkillProfile {
  skill_level: number;
  risk_tolerance: number;
  decision_speed: number;
  strategy_depth: number;
  consistency_score: number;
  learning_curve: LearningCurve;
  behavior_pattern: BehaviorPattern;
}

export const DEFAULT_SKILL_PROFILE: SkillProfile = {
  skill_level: 28,
  risk_tolerance: 45,
  decision_speed: 42,
  strategy_depth: 34,
  consistency_score: 50,
  learning_curve: 'stable',
  behavior_pattern: 'balanced',
};

export function clampScore(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function normalizeSkillProfile(
  profile: Partial<SkillProfile> | null | undefined,
): SkillProfile {
  if (!profile) {
    return { ...DEFAULT_SKILL_PROFILE };
  }

  const learningCurve: LearningCurve =
    profile.learning_curve === 'rising' ||
    profile.learning_curve === 'declining' ||
    profile.learning_curve === 'stable'
      ? profile.learning_curve
      : DEFAULT_SKILL_PROFILE.learning_curve;

  const behaviorPattern: BehaviorPattern =
    profile.behavior_pattern === 'explorer' ||
    profile.behavior_pattern === 'optimizer' ||
    profile.behavior_pattern === 'risk_taker' ||
    profile.behavior_pattern === 'balanced'
      ? profile.behavior_pattern
      : DEFAULT_SKILL_PROFILE.behavior_pattern;

  return {
    skill_level: clampScore(profile.skill_level ?? DEFAULT_SKILL_PROFILE.skill_level),
    risk_tolerance: clampScore(
      profile.risk_tolerance ?? DEFAULT_SKILL_PROFILE.risk_tolerance,
    ),
    decision_speed: clampScore(
      profile.decision_speed ?? DEFAULT_SKILL_PROFILE.decision_speed,
    ),
    strategy_depth: clampScore(
      profile.strategy_depth ?? DEFAULT_SKILL_PROFILE.strategy_depth,
    ),
    consistency_score: clampScore(
      profile.consistency_score ?? DEFAULT_SKILL_PROFILE.consistency_score,
    ),
    learning_curve: learningCurve,
    behavior_pattern: behaviorPattern,
  };
}
