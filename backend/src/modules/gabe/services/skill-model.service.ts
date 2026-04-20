import { Injectable } from '@nestjs/common';
import { SkillEvalDto } from '../dto/skill-eval.dto';
import {
  BehaviorPattern,
  SkillProfile,
  clampScore,
} from '../interfaces/skill-profile.interface';
import { EngagementState } from '../interfaces/engagement-state.interface';
import { BehaviorAnalysisOutput } from './behavior-analyzer.service';

export interface SkillModelResult {
  updatedProfile: SkillProfile;
  performanceScore: number;
  accuracyScore: number;
  improvementScore: number;
  consistencyScore: number;
}

@Injectable()
export class SkillModelService {
  evaluate(
    current: SkillProfile,
    input: SkillEvalDto,
    behavior: BehaviorAnalysisOutput,
    engagement: EngagementState,
  ): SkillModelResult {
    const accuracy = clampScore(input.accuracyScore);
    const improvement = clampScore(input.improvementScore);
    const difficulty = clampScore(input.difficultyScore);

    const executionEfficiency = this.executionEfficiency(
      input.executionTimeMs,
      difficulty,
      behavior.parameter_adjustment_count,
    );

    const adaptationFit = clampScore(
      100 - Math.abs((input.riskScore ?? 50) - current.risk_tolerance) * 0.9,
    );

    const performance = clampScore(
      accuracy * 0.28 +
        improvement * 0.22 +
        behavior.learning_velocity * 0.2 +
        executionEfficiency * 0.16 +
        adaptationFit * 0.14,
    );

    const targetSkill = clampScore(performance * 0.62 + difficulty * 0.38);
    const nextSkill = this.ema(current.skill_level, targetSkill, 0.34);

    const targetDecisionSpeed = clampScore(
      100 - behavior.hesitation_index * 100 + behavior.engagement_score * 0.15,
    );

    const targetStrategyDepth = clampScore(
      difficulty * 0.5 +
        behavior.strategy_change_intensity * 35 +
        behavior.exploration_ratio * 20,
    );

    const riskShift =
      (input.riskScore - 50) * 0.1 +
      (behavior.exploration_ratio - 0.5) * 10 +
      (behavior.behavior_type === 'random_tester' ? 3 : 0);

    const targetRiskTolerance = clampScore(current.risk_tolerance + riskShift);

    const nextConsistency = this.deriveConsistency(
      engagement.recent_performance_scores,
      performance,
      current.consistency_score,
    );

    const updatedProfile: SkillProfile = {
      skill_level: Math.round(nextSkill),
      risk_tolerance: Math.round(this.ema(current.risk_tolerance, targetRiskTolerance, 0.24)),
      decision_speed: Math.round(this.ema(current.decision_speed, targetDecisionSpeed, 0.3)),
      strategy_depth: Math.round(this.ema(current.strategy_depth, targetStrategyDepth, 0.31)),
      consistency_score: Math.round(nextConsistency),
      learning_curve: this.deriveLearningCurve(
        performance,
        engagement.recent_performance_scores,
      ),
      behavior_pattern: this.toBehaviorPattern(behavior),
    };

    return {
      updatedProfile,
      performanceScore: Math.round(performance),
      accuracyScore: Math.round(accuracy),
      improvementScore: Math.round(improvement),
      consistencyScore: Math.round(nextConsistency),
    };
  }

  estimateAccuracyScore(
    metrics: {
      mean: number;
      variance: number;
      min: number;
      max: number;
      median: number;
    },
    executionTimeMs: number,
  ): number {
    const variance = this.number(metrics.variance, 0);
    const mean = Math.abs(this.number(metrics.mean, 0));
    const stdDev = Math.sqrt(Math.max(variance, 0));

    const variancePenalty = this.clamp(
      stdDev / Math.max(1, mean + stdDev),
      0,
      1,
    );
    const speedBonus = this.clamp(1 - executionTimeMs / 80_000, 0, 1);
    const stabilityBonus = this.clamp(
      1 - Math.abs(this.number(metrics.max, 0) - this.number(metrics.min, 0)) /
        Math.max(1, Math.abs(this.number(metrics.max, 0)) + 10),
      0,
      1,
    );

    return clampScore(
      58 + speedBonus * 20 + stabilityBonus * 15 - variancePenalty * 28,
    );
  }

  private executionEfficiency(
    executionTimeMs: number,
    difficultyScore: number,
    adjustmentCount: number,
  ): number {
    const toleranceMs = 3_200 + difficultyScore * 150 + adjustmentCount * 220;
    const ratio = this.clamp(1 - executionTimeMs / Math.max(1, toleranceMs), -0.8, 1);

    return clampScore(55 + ratio * 45);
  }

  private deriveConsistency(
    historical: number[],
    currentPerformance: number,
    previousConsistency: number,
  ): number {
    if (historical.length === 0) {
      return this.ema(previousConsistency, currentPerformance, 0.2);
    }

    const mean = historical.reduce((sum, value) => sum + value, 0) / historical.length;
    const variance =
      historical.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      historical.length;

    const deviation = Math.abs(currentPerformance - mean);
    const volatilityPenalty = this.clamp(Math.sqrt(variance) * 0.5 + deviation * 0.2, 0, 45);
    const consistencyTarget = clampScore(92 - volatilityPenalty);

    return this.ema(previousConsistency, consistencyTarget, 0.3);
  }

  private deriveLearningCurve(
    currentPerformance: number,
    historical: number[],
  ): SkillProfile['learning_curve'] {
    if (historical.length < 3) return 'stable';

    const recent = historical.slice(-5);
    const recentAvg = recent.reduce((sum, value) => sum + value, 0) / recent.length;

    if (currentPerformance - recentAvg > 5) return 'rising';
    if (recentAvg - currentPerformance > 5) return 'declining';
    return 'stable';
  }

  private toBehaviorPattern(
    behavior: BehaviorAnalysisOutput,
  ): BehaviorPattern {
    if (behavior.behavior_type === 'explorer') {
      return 'explorer';
    }

    if (behavior.behavior_type === 'optimizer') {
      return 'optimizer';
    }

    if (behavior.behavior_type === 'random_tester') {
      return 'risk_taker';
    }

    return 'balanced';
  }

  private ema(previous: number, next: number, alpha: number): number {
    return this.clamp(previous * (1 - alpha) + next * alpha, 0, 100);
  }

  private number(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
