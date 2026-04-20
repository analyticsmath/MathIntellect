import { Injectable } from '@nestjs/common';
import { UpdateBehaviorDto } from '../dto/update-behavior.dto';
import { EngagementState } from '../interfaces/engagement-state.interface';

export type BehaviorType =
  | 'explorer'
  | 'optimizer'
  | 'random_tester'
  | 'focused_strategist';

export interface BehaviorAnalysisOutput {
  behavior_type: BehaviorType;
  behavior_tag: string;
  engagement_score: number;
  learning_velocity: number;
  exploration_ratio: number;
  repetition_pressure: number;
  hesitation_index: number;
  strategy_change_intensity: number;
  session_duration_ms: number;
  parameter_adjustment_count: number;
}

@Injectable()
export class BehaviorAnalyzerService {
  analyze(
    behavior: UpdateBehaviorDto | undefined,
    previousState: EngagementState,
  ): BehaviorAnalysisOutput {
    const adjustments = Math.max(0, behavior?.parameterAdjustmentCount ?? 0);
    const durationMs = Math.max(
      0,
      behavior?.sessionDurationMs ??
        behavior?.parameterAdjustmentMs ??
        previousState.session_duration_ms_avg,
    );
    const reruns = Math.max(0, behavior?.rerunCount ?? 0);
    const strategyChanges = Math.max(0, behavior?.strategyChanges ?? 0);

    const explorationRatio = this.clamp(
      behavior?.explorationRatio ??
        this.estimateExploration(adjustments, reruns),
      0,
      1,
    );

    const hesitationNorm = this.clamp(
      (behavior?.decisionHesitationMs ?? 0) / 120_000,
      0,
      1,
    );
    const lagNorm = this.clamp((behavior?.interactionLagMs ?? 0) / 7_500, 0, 1);

    const durationNorm = this.clamp(durationMs / (22 * 60_000), 0, 1);
    const adjustmentNorm = this.clamp(adjustments / 20, 0, 1);
    const strategyNorm = this.clamp(strategyChanges / 12, 0, 1);
    const rerunPressure = this.clamp(reruns / 8, 0, 1);

    const engagement = this.clamp(
      18 +
        durationNorm * 30 +
        explorationRatio * 24 +
        adjustmentNorm * 8 +
        (1 - hesitationNorm) * 12 +
        (1 - lagNorm) * 8 -
        rerunPressure * 12,
      0,
      100,
    );

    const learningVelocity = this.clamp(
      14 +
        explorationRatio * 34 +
        strategyNorm * 18 +
        adjustmentNorm * 15 +
        (1 - hesitationNorm) * 15 +
        (1 - lagNorm) * 10 -
        rerunPressure * 10,
      0,
      100,
    );

    const behaviorType = this.classifyBehavior({
      explorationRatio,
      strategyNorm,
      hesitationNorm,
      rerunPressure,
      adjustmentNorm,
      learningVelocity,
    });

    return {
      behavior_type: behaviorType,
      behavior_tag: behaviorType,
      engagement_score: Math.round(engagement),
      learning_velocity: Math.round(learningVelocity),
      exploration_ratio: Number(explorationRatio.toFixed(3)),
      repetition_pressure: Number(rerunPressure.toFixed(3)),
      hesitation_index: Number(((hesitationNorm + lagNorm) / 2).toFixed(3)),
      strategy_change_intensity: Number(strategyNorm.toFixed(3)),
      session_duration_ms: Math.round(durationMs),
      parameter_adjustment_count: adjustments,
    };
  }

  private classifyBehavior(input: {
    explorationRatio: number;
    strategyNorm: number;
    hesitationNorm: number;
    rerunPressure: number;
    adjustmentNorm: number;
    learningVelocity: number;
  }): BehaviorType {
    if (input.explorationRatio > 0.62 && input.strategyNorm > 0.2) {
      return 'explorer';
    }

    if (
      input.rerunPressure > 0.55 &&
      input.explorationRatio < 0.3 &&
      input.adjustmentNorm < 0.35
    ) {
      return 'optimizer';
    }

    if (
      input.strategyNorm > 0.65 &&
      input.hesitationNorm > 0.45 &&
      input.learningVelocity < 45
    ) {
      return 'random_tester';
    }

    return 'focused_strategist';
  }

  private estimateExploration(adjustments: number, reruns: number): number {
    const value = 0.35 + adjustments * 0.03 - reruns * 0.04;
    return this.clamp(value, 0.05, 0.95);
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
