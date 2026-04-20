import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiBehaviorProfile } from './entities/ai-behavior-profile.entity';
import { SimulationType } from '../simulations/entities/simulation.entity';

export interface MetaLearningRunInput {
  simulationType: SimulationType;
  behaviorType: string;
  learningVelocity: number;
  noveltyScore: number;
  repetitionRatio: number;
  riskScore: number;
  accuracyScore: number;
  performanceScore: number;
  parameters: Record<string, unknown>;
}

export interface PromptTuningProfile {
  clusterLabel: string;
  explanationStyle: 'concise' | 'balanced' | 'deep';
  stagnationScore: number;
  consistencyDrift: number;
  personalityDrift: number;
  preferredSimulationType: SimulationType;
  promptDirectives: Record<string, unknown>;
}

@Injectable()
export class AiMetaLearningService {
  constructor(
    @InjectRepository(AiBehaviorProfile)
    private readonly behaviorRepo: Repository<AiBehaviorProfile>,
  ) {}

  async getOrCreate(userId: string): Promise<AiBehaviorProfile> {
    const existing = await this.behaviorRepo.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }

    const created = this.behaviorRepo.create({
      userId,
      clusterLabel: 'balanced_explorer',
      explanationStyle: 'balanced',
      simulationPreferenceJson: this.emptyPreferenceMap(),
      consistencyDrift: 0,
      stagnationScore: 0,
      personalityDrift: 0,
      adaptivePromptTuningJson: {
        reasoning_depth: 'balanced',
        tone: 'coach',
        focus: ['risk_balance', 'counterfactuals'],
      },
      recentSimulationHashesJson: [],
      recommendationMemoryJson: null,
      lastCoachAt: null,
    });

    return this.behaviorRepo.save(created);
  }

  async ingestSimulationRun(
    userId: string,
    input: MetaLearningRunInput,
  ): Promise<AiBehaviorProfile> {
    const profile = await this.getOrCreate(userId);

    const preferences = this.normalizePreferenceMap(profile.simulationPreferenceJson);
    for (const key of Object.keys(preferences)) {
      preferences[key] *= 0.92;
    }
    preferences[input.simulationType] += 8 + this.clamp(input.performanceScore / 14, 0, 9);

    const consistencyDrift = this.clamp(
      profile.consistencyDrift * 0.68 +
        Math.abs(input.learningVelocity - input.accuracyScore) * 0.22,
      0,
      100,
    );

    const stagnationScore = this.clamp(
      profile.stagnationScore * 0.82 +
        input.repetitionRatio * 46 +
        (input.noveltyScore < 40 ? 12 : -5) +
        (input.performanceScore < 45 ? 7 : -4),
      0,
      100,
    );

    const personalityDrift = this.clamp(
      profile.personalityDrift * 0.72 +
        Math.abs(input.riskScore - input.accuracyScore) * 0.18 +
        Math.abs(input.noveltyScore - input.performanceScore) * 0.15,
      0,
      100,
    );

    const clusterLabel = this.classifyCluster(input, stagnationScore, consistencyDrift);
    const explanationStyle = this.resolveExplanationStyle(
      stagnationScore,
      consistencyDrift,
      input.noveltyScore,
    );

    profile.simulationPreferenceJson = preferences;
    profile.consistencyDrift = Number(consistencyDrift.toFixed(4));
    profile.stagnationScore = Number(stagnationScore.toFixed(4));
    profile.personalityDrift = Number(personalityDrift.toFixed(4));
    profile.clusterLabel = clusterLabel;
    profile.explanationStyle = explanationStyle;
    profile.adaptivePromptTuningJson = {
      reasoning_depth: explanationStyle,
      tone: stagnationScore > 60 ? 'intervention' : 'coach',
      focus:
        input.simulationType === SimulationType.CONFLICT
          ? ['trust_drift', 'coalition_instability']
          : input.simulationType === SimulationType.MARKET
            ? ['regime_detection', 'drawdown_protection']
            : ['confidence_intervals', 'counterfactuals'],
      cluster: clusterLabel,
    };

    const hash = this.hash({
      simulationType: input.simulationType,
      parameters: input.parameters,
    });

    profile.recentSimulationHashesJson = [
      ...(profile.recentSimulationHashesJson ?? []).slice(-19),
      hash,
    ];

    return this.behaviorRepo.save(profile);
  }

  async getPromptTuning(userId: string): Promise<PromptTuningProfile> {
    const profile = await this.getOrCreate(userId);
    const preferences = this.normalizePreferenceMap(profile.simulationPreferenceJson);

    const preferredSimulationType = (Object.entries(preferences)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ??
      SimulationType.MONTE_CARLO) as SimulationType;

    const explanationStyle =
      profile.explanationStyle === 'concise' ||
      profile.explanationStyle === 'deep' ||
      profile.explanationStyle === 'balanced'
        ? profile.explanationStyle
        : 'balanced';

    return {
      clusterLabel: profile.clusterLabel,
      explanationStyle,
      stagnationScore: this.clamp(profile.stagnationScore, 0, 100),
      consistencyDrift: this.clamp(profile.consistencyDrift, 0, 100),
      personalityDrift: this.clamp(profile.personalityDrift, 0, 100),
      preferredSimulationType,
      promptDirectives: profile.adaptivePromptTuningJson ?? {},
    };
  }

  async rememberCoachRecommendation(
    userId: string,
    recommendation: Record<string, unknown>,
  ): Promise<void> {
    const profile = await this.getOrCreate(userId);
    profile.recommendationMemoryJson = recommendation;
    profile.lastCoachAt = new Date();
    await this.behaviorRepo.save(profile);
  }

  private resolveExplanationStyle(
    stagnation: number,
    consistencyDrift: number,
    novelty: number,
  ): 'concise' | 'balanced' | 'deep' {
    if (stagnation > 68 || consistencyDrift > 60) {
      return 'concise';
    }

    if (novelty > 70 && consistencyDrift < 35) {
      return 'deep';
    }

    return 'balanced';
  }

  private classifyCluster(
    input: MetaLearningRunInput,
    stagnation: number,
    consistencyDrift: number,
  ): string {
    if (stagnation > 65) {
      return 'stagnating_repeater';
    }

    if (input.noveltyScore > 70 && input.repetitionRatio < 0.25) {
      return 'exploratory_builder';
    }

    if (input.riskScore > 65 && input.accuracyScore > 58) {
      return 'risk_balanced_operator';
    }

    if (consistencyDrift > 52) {
      return 'style_drifting_agent';
    }

    return 'balanced_explorer';
  }

  private normalizePreferenceMap(
    payload: Record<string, number> | null | undefined,
  ): Record<SimulationType, number> {
    const base = this.emptyPreferenceMap();
    if (!payload) {
      return base;
    }

    for (const type of Object.values(SimulationType)) {
      const value = payload[type];
      base[type] = Number.isFinite(value) ? Math.max(0, value) : 0;
    }

    return base;
  }

  private emptyPreferenceMap(): Record<SimulationType, number> {
    return {
      [SimulationType.MONTE_CARLO]: 0,
      [SimulationType.GAME_THEORY]: 0,
      [SimulationType.MARKET]: 0,
      [SimulationType.CONFLICT]: 0,
      [SimulationType.CUSTOM]: 0,
    };
  }

  private hash(payload: Record<string, unknown>): string {
    const stable = JSON.stringify(this.sort(payload));
    let hash = 2166136261;
    for (let index = 0; index < stable.length; index++) {
      hash ^= stable.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `s_${(hash >>> 0).toString(16)}`;
  }

  private sort(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((entry) => this.sort(entry));
    }

    if (value && typeof value === 'object') {
      const sorted: Record<string, unknown> = {};
      for (const key of Object.keys(value as Record<string, unknown>).sort()) {
        sorted[key] = this.sort((value as Record<string, unknown>)[key]);
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
