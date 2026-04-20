import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgression } from './entities/user-progression.entity';
import { SkillTreeNode } from './entities/skill-tree-node.entity';
import {
  INTELLIGENCE_RANK_BANDS,
  ProgressionTrack,
  TRACK_SIMULATION_MAP,
} from './progression.types';
import { SimulationType } from '../simulations/entities/simulation.entity';

export interface ProgressionPromptAdaptation {
  track: ProgressionTrack;
  behaviorStyle: string;
  explanationDepth: 'concise' | 'balanced' | 'deep';
  visualizationRichness: number;
  complexityScale: number;
  rankLabel: string;
}

export interface SimulationEvolutionInput {
  simulationType: SimulationType;
  levelAfter: number;
  xpGain: number;
  behaviorType: string;
  performanceScore: number;
}

export interface SimulationEvolutionOutput {
  state: UserProgression;
  intelligenceRankChange: number;
  unlocks: string[];
  behaviorShift: string;
  nextRecommendedSimulation: SimulationType;
}

@Injectable()
export class ProgressionService {
  constructor(
    @InjectRepository(UserProgression)
    private readonly progressionRepo: Repository<UserProgression>,
    @InjectRepository(SkillTreeNode)
    private readonly skillTreeRepo: Repository<SkillTreeNode>,
  ) {}

  async getOrCreate(userId: string): Promise<UserProgression> {
    const existing = await this.progressionRepo.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }

    const created = this.progressionRepo.create({
      userId,
      currentTrack: ProgressionTrack.STRATEGIST,
      trackExperienceJson: this.emptyTrackExperience(),
      skillPoints: 0,
      intelligenceRank: 1,
      intelligenceRankLabel: this.rankLabelFor(1),
      unlockedEnginesJson: ['monte_carlo'],
      unlockedFeaturesJson: ['adaptive_simulation_core'],
      behaviorStyle: this.trackBehaviorStyle(ProgressionTrack.STRATEGIST),
      explanationDepth: 1,
      visualizationRichness: 1,
      complexityScale: 1,
    });

    return this.progressionRepo.save(created);
  }

  async selectTrack(userId: string, track: ProgressionTrack): Promise<UserProgression> {
    const state = await this.getOrCreate(userId);
    state.currentTrack = track;
    state.behaviorStyle = this.trackBehaviorStyle(track);
    return this.progressionRepo.save(state);
  }

  async getPromptAdaptation(userId: string): Promise<ProgressionPromptAdaptation> {
    const state = await this.getOrCreate(userId);

    return {
      track: state.currentTrack,
      behaviorStyle: state.behaviorStyle,
      explanationDepth:
        state.explanationDepth >= 3
          ? 'deep'
          : state.explanationDepth <= 1
            ? 'concise'
            : 'balanced',
      visualizationRichness: this.clampInt(state.visualizationRichness, 1, 3),
      complexityScale: this.clamp(state.complexityScale, 0.85, 2.4),
      rankLabel: state.intelligenceRankLabel,
    };
  }

  async evolveAfterSimulation(
    userId: string,
    input: SimulationEvolutionInput,
  ): Promise<SimulationEvolutionOutput> {
    const state = await this.getOrCreate(userId);
    const previousRank = this.clampInt(state.intelligenceRank, 1, 100);

    const rank = this.clampInt(input.levelAfter, 1, 100);
    state.intelligenceRank = rank;
    state.intelligenceRankLabel = this.rankLabelFor(rank);

    const skillPointGain = Math.max(
      1,
      Math.round(input.xpGain / 70 + this.clamp(input.performanceScore, 0, 100) / 40),
    );
    state.skillPoints = Math.max(0, state.skillPoints + skillPointGain);

    const trackExperience = this.normalizeTrackExperience(state.trackExperienceJson);
    const simulationTrack = this.trackFromSimulationType(input.simulationType);
    trackExperience[simulationTrack] += input.xpGain;
    trackExperience[state.currentTrack] += Math.round(input.xpGain * 0.2);
    state.trackExperienceJson = trackExperience;

    state.explanationDepth = rank >= 55 ? 3 : rank >= 20 ? 2 : 1;
    state.visualizationRichness = rank >= 60 ? 3 : rank >= 25 ? 2 : 1;
    state.complexityScale = Number(this.clamp(0.9 + rank / 125, 0.9, 1.85).toFixed(4));

    const unlocks = await this.resolveUnlocks(state.currentTrack, rank);
    const unlocked = new Set([...(state.unlockedFeaturesJson ?? []), ...unlocks.features]);
    const unlockedEngines = new Set([
      ...(state.unlockedEnginesJson ?? []),
      ...unlocks.engines,
    ]);

    state.unlockedFeaturesJson = [...unlocked];
    state.unlockedEnginesJson = [...unlockedEngines];

    const previousStyle = state.behaviorStyle;
    state.behaviorStyle = this.trackBehaviorStyle(state.currentTrack);

    const saved = await this.progressionRepo.save(state);

    return {
      state: saved,
      intelligenceRankChange: rank - previousRank,
      unlocks: [...unlocks.features, ...unlocks.engines],
      behaviorShift:
        previousStyle === state.behaviorStyle
          ? `maintain:${state.behaviorStyle}`
          : `${previousStyle}->${state.behaviorStyle}`,
      nextRecommendedSimulation: this.recommendNextSimulation(trackExperience),
    };
  }

  adaptSimulationParameters(
    simulationType: SimulationType,
    rawParameters: Record<string, unknown>,
    state: UserProgression,
    complexityMultiplier: number,
  ): Record<string, unknown> {
    const params = { ...rawParameters };
    const scale = this.clamp(
      complexityMultiplier * this.clamp(state.complexityScale, 0.85, 2.2),
      0.75,
      2.5,
    );

    switch (simulationType) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        params.iterations = this.clampInt(this.number(params.iterations, 3_500) * scale, 500, 220_000);
        params.scenarioBranchDepth = this.clampInt(
          this.number(params.scenarioBranchDepth, 2) + Math.floor(state.explanationDepth / 2),
          2,
          5,
        );
        params.riskCurveWindows = this.clampInt(
          this.number(params.riskCurveWindows, 16) + state.visualizationRichness * 4,
          8,
          64,
        );
        break;

      case SimulationType.GAME_THEORY:
        params.dynamicStrategyEvolution = true;
        params.dynamicEvolutionRounds = this.clampInt(
          this.number(params.dynamicEvolutionRounds, 8) * (0.9 + scale / 2),
          4,
          40,
        );
        params.coalitionFormationEnabled =
          state.currentTrack === ProgressionTrack.GAME_THEORY_SPECIALIST ||
          state.currentTrack === ProgressionTrack.STRATEGIST;
        params.repeatedLearningRounds = this.clampInt(8 + state.visualizationRichness * 6, 8, 36);
        params.reputationDecay = Number(this.clamp(0.03 + state.explanationDepth * 0.02, 0.02, 0.2).toFixed(4));
        break;

      case SimulationType.MARKET:
        params.paths = this.clampInt(this.number(params.paths, 80) * scale, 20, 4_000);
        params.timeHorizonDays = this.clampInt(
          this.number(params.timeHorizonDays, 160) * (0.85 + scale / 2),
          30,
          1_200,
        );
        params.regimeSwitching = true;
        params.sentimentModeling = true;
        params.shockEventProbability = Number(
          this.clamp(this.number(params.shockEventProbability, 0.012) + state.visualizationRichness * 0.002, 0, 0.08).toFixed(4),
        );
        params.shockMagnitude = Number(this.clamp(this.number(params.shockMagnitude, 0.06), 0.02, 0.4).toFixed(4));
        break;

      case SimulationType.CONFLICT:
        params.rounds = this.clampInt(this.number(params.rounds, 120) * scale, 20, 3_000);
        params.alliances = Array.isArray(params.alliances) ? params.alliances : params.coalitions;
        params.betrayalSensitivity = Number(
          this.clamp(
            this.number(params.betrayalSensitivity, 0.5) +
              (state.currentTrack === ProgressionTrack.CHAOS_CONFLICT_ANALYST ? 0.12 : 0),
            0.05,
            0.95,
          ).toFixed(3),
        );
        break;

      default:
        break;
    }

    return params;
  }

  async getSkillTree(track?: ProgressionTrack): Promise<SkillTreeNode[]> {
    if (!track) {
      return this.skillTreeRepo.find({ order: { unlockLevel: 'ASC', key: 'ASC' } });
    }

    return this.skillTreeRepo.find({
      where: { track },
      order: { unlockLevel: 'ASC', key: 'ASC' },
    });
  }

  async upsertSkillTreeNodes(nodes: Array<Partial<SkillTreeNode>>): Promise<void> {
    for (const node of nodes) {
      if (!node.key || !node.track || !node.name || !node.description) {
        throw new NotFoundException('Skill tree node is missing required fields');
      }

      const existing = await this.skillTreeRepo.findOne({ where: { key: node.key } });
      if (existing) {
        existing.track = node.track;
        existing.name = node.name;
        existing.description = node.description;
        existing.unlockLevel = this.clampInt(node.unlockLevel ?? existing.unlockLevel, 1, 100);
        existing.engineUnlock = node.engineUnlock ?? existing.engineUnlock;
        existing.aiStyleModifierJson = node.aiStyleModifierJson ?? existing.aiStyleModifierJson;
        existing.uiComplexityModifier = Number(
          this.clamp(node.uiComplexityModifier ?? existing.uiComplexityModifier, -3, 3).toFixed(3),
        );
        await this.skillTreeRepo.save(existing);
        continue;
      }

      await this.skillTreeRepo.save(
        this.skillTreeRepo.create({
          key: node.key,
          track: node.track,
          name: node.name,
          description: node.description,
          unlockLevel: this.clampInt(node.unlockLevel ?? 1, 1, 100),
          engineUnlock: node.engineUnlock ?? null,
          aiStyleModifierJson: node.aiStyleModifierJson ?? null,
          uiComplexityModifier: Number(this.clamp(node.uiComplexityModifier ?? 0, -3, 3).toFixed(3)),
        }),
      );
    }
  }

  private rankLabelFor(rank: number): string {
    const normalized = this.clampInt(rank, 1, 100);
    const found = INTELLIGENCE_RANK_BANDS.find(
      (band) => normalized >= band.min && normalized <= band.max,
    );
    return found?.label ?? 'Analyst';
  }

  private recommendNextSimulation(trackExperience: Record<ProgressionTrack, number>): SimulationType {
    const entries = Object.entries(trackExperience) as Array<[ProgressionTrack, number]>;
    const lowest = entries.sort((a, b) => a[1] - b[1])[0]?.[0] ?? ProgressionTrack.STRATEGIST;
    return TRACK_SIMULATION_MAP[lowest];
  }

  private async resolveUnlocks(
    track: ProgressionTrack,
    rank: number,
  ): Promise<{ features: string[]; engines: string[] }> {
    const baseFeatures = this.staticFeatureUnlocks(track, rank);
    const baseEngines = this.staticEngineUnlocks(track, rank);

    const dynamicNodes = await this.skillTreeRepo.find({ where: { track } });
    const unlockedNodes = dynamicNodes.filter((node) => rank >= node.unlockLevel);

    return {
      features: [
        ...baseFeatures,
        ...unlockedNodes.map((node) => `skill_node:${node.key}`),
      ],
      engines: [
        ...baseEngines,
        ...unlockedNodes
          .map((node) => node.engineUnlock)
          .filter((engine): engine is string => Boolean(engine)),
      ],
    };
  }

  private staticFeatureUnlocks(track: ProgressionTrack, rank: number): string[] {
    const featureMap: Record<ProgressionTrack, string[]> = {
      [ProgressionTrack.STRATEGIST]: [
        'mission_briefing',
        'branching_strategy_overlay',
        'confidence_story_panel',
      ],
      [ProgressionTrack.MARKET_ANALYST]: [
        'regime_shift_overlay',
        'shock_replay_timeline',
        'sentiment_proxy_panel',
      ],
      [ProgressionTrack.GAME_THEORY_SPECIALIST]: [
        'coalition_formation_matrix',
        'reputation_drift_monitor',
        'repeated_game_learning_curve',
      ],
      [ProgressionTrack.CHAOS_CONFLICT_ANALYST]: [
        'alliance_stability_graph',
        'betrayal_probability_layer',
        'dynamic_trust_matrix',
      ],
    };

    const unlockedCount = rank >= 70 ? 3 : rank >= 35 ? 2 : 1;
    return featureMap[track].slice(0, unlockedCount);
  }

  private staticEngineUnlocks(track: ProgressionTrack, rank: number): string[] {
    if (rank < 12) {
      return [];
    }

    const unlocks: Record<ProgressionTrack, string[]> = {
      [ProgressionTrack.STRATEGIST]: ['monte_carlo', 'game_theory'],
      [ProgressionTrack.MARKET_ANALYST]: ['market'],
      [ProgressionTrack.GAME_THEORY_SPECIALIST]: ['game_theory'],
      [ProgressionTrack.CHAOS_CONFLICT_ANALYST]: ['conflict'],
    };

    return unlocks[track];
  }

  private trackBehaviorStyle(track: ProgressionTrack): string {
    switch (track) {
      case ProgressionTrack.MARKET_ANALYST:
        return 'evidence_weighted';
      case ProgressionTrack.GAME_THEORY_SPECIALIST:
        return 'strategic_counterfactual';
      case ProgressionTrack.CHAOS_CONFLICT_ANALYST:
        return 'adversarial_systemic';
      case ProgressionTrack.STRATEGIST:
      default:
        return 'systems_planning';
    }
  }

  private trackFromSimulationType(type: SimulationType): ProgressionTrack {
    switch (type) {
      case SimulationType.MARKET:
        return ProgressionTrack.MARKET_ANALYST;
      case SimulationType.GAME_THEORY:
        return ProgressionTrack.GAME_THEORY_SPECIALIST;
      case SimulationType.CONFLICT:
        return ProgressionTrack.CHAOS_CONFLICT_ANALYST;
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
      default:
        return ProgressionTrack.STRATEGIST;
    }
  }

  private emptyTrackExperience(): Record<ProgressionTrack, number> {
    return {
      [ProgressionTrack.STRATEGIST]: 0,
      [ProgressionTrack.MARKET_ANALYST]: 0,
      [ProgressionTrack.GAME_THEORY_SPECIALIST]: 0,
      [ProgressionTrack.CHAOS_CONFLICT_ANALYST]: 0,
    };
  }

  private normalizeTrackExperience(
    payload: Record<string, number> | null | undefined,
  ): Record<ProgressionTrack, number> {
    const base = this.emptyTrackExperience();
    if (!payload || typeof payload !== 'object') {
      return base;
    }

    for (const track of Object.values(ProgressionTrack)) {
      const value = payload[track];
      base[track] = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
    }

    return base;
  }

  private number(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  private clampInt(value: number, min: number, max: number): number {
    return Math.round(this.clamp(value, min, max));
  }
}
