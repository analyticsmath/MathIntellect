import { Injectable } from '@nestjs/common';
import { EngagementState } from '../interfaces/engagement-state.interface';
import { BehaviorAnalysisOutput } from './behavior-analyzer.service';

export interface XpSignalInput {
  parameters: Record<string, unknown>;
  difficultyScore: number;
  riskScore: number;
  accuracyScore: number;
  performanceScore: number;
  behavior: BehaviorAnalysisOutput;
  engagementState: EngagementState;
}

export interface XpSignalOutput {
  parameterHash: string;
  noveltyScore: number;
  repetitionRatio: number;
  improvementScore: number;
  lowEffortScore: number;
}

export interface XpComputationResult {
  xpGain: number;
  difficultyComponent: number;
  noveltyComponent: number;
  riskComponent: number;
  accuracyComponent: number;
  improvementMultiplier: number;
  repetitionPenalty: number;
  lowEffortDecay: number;
}

@Injectable()
export class XpIntelligenceService {
  deriveSignals(input: XpSignalInput): XpSignalOutput {
    const parameterHash = this.hash(input.parameters);
    const hashHistory = input.engagementState.recent_parameter_hashes;
    const repeats = hashHistory.filter((entry) => entry === parameterHash).length;
    const historyDepth = Math.max(hashHistory.length, 1);

    const repetitionRatio = this.clamp(repeats / historyDepth, 0, 1);
    const noveltyScore = this.clamp(
      96 - repetitionRatio * 70 - repeats * 8 + input.behavior.exploration_ratio * 12,
      5,
      100,
    );

    const baselinePerformance =
      input.engagementState.recent_performance_scores.length > 0
        ? input.engagementState.recent_performance_scores.reduce(
            (sum, value) => sum + value,
            0,
          ) / input.engagementState.recent_performance_scores.length
        : input.performanceScore;

    const improvementRaw =
      ((input.performanceScore - baselinePerformance) /
        Math.max(8, Math.abs(baselinePerformance))) *
      100;

    const improvementScore = this.clamp(50 + improvementRaw * 0.5, 0, 100);

    const lowEffortScore = this.computeLowEffortScore(
      input.behavior,
      repetitionRatio,
    );

    return {
      parameterHash,
      noveltyScore: Math.round(noveltyScore),
      repetitionRatio: Number(repetitionRatio.toFixed(3)),
      improvementScore: Math.round(improvementScore),
      lowEffortScore: Number(lowEffortScore.toFixed(3)),
    };
  }

  computeXp(
    difficultyScore: number,
    riskScore: number,
    accuracyScore: number,
    signals: XpSignalOutput,
  ): XpComputationResult {
    const difficultyComponent = this.clamp(difficultyScore * 0.34, 0, 34);
    const noveltyComponent = this.clamp(signals.noveltyScore * 0.26, 0, 26);
    const riskComponent = this.clamp(riskScore * 0.14, 0, 14);
    const accuracyComponent = this.clamp(accuracyScore * 0.2, 0, 20);

    const improvementMultiplier = Math.exp(
      this.clamp((signals.improvementScore - 50) / 58, -0.7, 1.15),
    );

    const repetitionPenalty = this.clamp(1 - signals.repetitionRatio * 0.72, 0.2, 1);
    const lowEffortDecay = this.clamp(1 - signals.lowEffortScore * 0.78, 0.2, 1);

    const rawXp =
      (6 + difficultyComponent + noveltyComponent + riskComponent + accuracyComponent) *
      improvementMultiplier *
      repetitionPenalty *
      lowEffortDecay;

    const xpGain = this.clamp(Math.round(rawXp), 2, 420);

    return {
      xpGain,
      difficultyComponent: Number(difficultyComponent.toFixed(3)),
      noveltyComponent: Number(noveltyComponent.toFixed(3)),
      riskComponent: Number(riskComponent.toFixed(3)),
      accuracyComponent: Number(accuracyComponent.toFixed(3)),
      improvementMultiplier: Number(improvementMultiplier.toFixed(3)),
      repetitionPenalty: Number(repetitionPenalty.toFixed(3)),
      lowEffortDecay: Number(lowEffortDecay.toFixed(3)),
    };
  }

  private computeLowEffortScore(
    behavior: BehaviorAnalysisOutput,
    repetitionRatio: number,
  ): number {
    const lowAdjustment = behavior.parameter_adjustment_count <= 1 ? 0.3 : 0;
    const shortSession = behavior.session_duration_ms < 70_000 ? 0.28 : 0;
    const lowLearning = behavior.learning_velocity < 28 ? 0.24 : 0;
    const heavyRepetition = repetitionRatio > 0.6 ? 0.22 : 0;

    return this.clamp(
      lowAdjustment + shortSession + lowLearning + heavyRepetition,
      0,
      1,
    );
  }

  private hash(payload: Record<string, unknown>): string {
    const stable = this.stableStringify(payload);
    let h = 2166136261;
    for (let i = 0; i < stable.length; i++) {
      h ^= stable.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return `p_${(h >>> 0).toString(16)}`;
  }

  private stableStringify(value: unknown): string {
    return JSON.stringify(this.sort(value));
  }

  private sort(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((entry) => this.sort(entry));
    }

    if (value && typeof value === 'object') {
      const sorted: Record<string, unknown> = {};
      const objectValue = value as Record<string, unknown>;
      for (const key of Object.keys(objectValue).sort()) {
        sorted[key] = this.sort(objectValue[key]);
      }
      return sorted;
    }

    return value;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
