import { Injectable } from '@nestjs/common';
import {
  EngagementState,
  LastGamificationEventState,
} from '../interfaces/engagement-state.interface';
import { BehaviorAnalysisOutput } from './behavior-analyzer.service';

export interface EngagementEngineInput {
  previousState: EngagementState;
  behavior: BehaviorAnalysisOutput;
  xpGain: number;
  parameterHash: string;
  performanceScore: number;
  repetitionRatio: number;
  lowEffortScore: number;
  eventPreview: LastGamificationEventState;
}

export interface EngagementDirectives {
  reward_frequency_multiplier: number;
  increase_reward_frequency: boolean;
  reduce_cognitive_overload: boolean;
  guided_mode: boolean;
  drop_off_risk: number;
}

export interface EngagementEngineResult {
  updatedState: EngagementState;
  directives: EngagementDirectives;
}

@Injectable()
export class EngagementEngineService {
  update(input: EngagementEngineInput): EngagementEngineResult {
    const prev = input.previousState;
    const recentEngagement = prev.recent_engagement_scores;
    const engagementAvg =
      recentEngagement.length > 0
        ? recentEngagement.reduce((sum, value) => sum + value, 0) /
          recentEngagement.length
        : input.behavior.engagement_score;

    const engagementDrop = engagementAvg - input.behavior.engagement_score;

    const dropOffRisk = this.clamp(
      42 +
        input.behavior.hesitation_index * 36 +
        input.repetitionRatio * 28 +
        input.lowEffortScore * 24 -
        input.behavior.engagement_score * 0.44,
      0,
      100,
    );

    const cognitiveLoad = this.clamp(
      prev.cognitive_load_index * 0.55 +
        (input.behavior.hesitation_index * 100 * 0.48 +
          (100 - input.behavior.learning_velocity) * 0.34 +
          input.lowEffortScore * 100 * 0.18) *
          0.45,
      0,
      100,
    );

    const increaseReward = engagementDrop > 6 || dropOffRisk > 58;
    const rewardFrequency = this.clamp(
      prev.reward_frequency + (increaseReward ? 0.11 : -0.04),
      0.15,
      1,
    );

    const guidedMode =
      cognitiveLoad > 66 ||
      dropOffRisk > 68 ||
      input.behavior.learning_velocity < 30;

    const nextState: EngagementState = {
      ...prev,
      session_duration_ms_avg: Math.round(
        this.ema(
          prev.session_duration_ms_avg,
          input.behavior.session_duration_ms,
          0.24,
        ),
      ),
      simulation_repetition_cycles:
        prev.simulation_repetition_cycles +
        (input.repetitionRatio > 0.58 ? 1 : 0),
      drop_off_points: prev.drop_off_points + (dropOffRisk > 66 ? 1 : 0),
      engagement_spikes:
        prev.engagement_spikes + (input.behavior.engagement_score > 84 ? 1 : 0),
      reward_frequency: Number(rewardFrequency.toFixed(3)),
      cognitive_load_index: Number(cognitiveLoad.toFixed(3)),
      guided_mode: guidedMode,
      recent_parameter_hashes: this.pushLimited(
        prev.recent_parameter_hashes,
        input.parameterHash,
        16,
      ),
      recent_performance_scores: this.pushLimited(
        prev.recent_performance_scores,
        Number(input.performanceScore.toFixed(3)),
        16,
      ),
      recent_xp_gains: this.pushLimited(prev.recent_xp_gains, input.xpGain, 16),
      recent_engagement_scores: this.pushLimited(
        prev.recent_engagement_scores,
        input.behavior.engagement_score,
        16,
      ),
      last_event: input.eventPreview,
    };

    const directives: EngagementDirectives = {
      reward_frequency_multiplier: Number(
        (0.72 + rewardFrequency * 0.9).toFixed(3),
      ),
      increase_reward_frequency: increaseReward,
      reduce_cognitive_overload: cognitiveLoad > 62,
      guided_mode: guidedMode,
      drop_off_risk: Number(dropOffRisk.toFixed(2)),
    };

    return {
      updatedState: nextState,
      directives,
    };
  }

  private pushLimited<T>(source: T[], value: T, limit: number): T[] {
    const merged = [...source, value];
    if (merged.length <= limit) return merged;
    return merged.slice(merged.length - limit);
  }

  private ema(previous: number, next: number, alpha: number): number {
    return previous * (1 - alpha) + next * alpha;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
