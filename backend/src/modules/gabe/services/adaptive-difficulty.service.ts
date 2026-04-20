import { Injectable } from '@nestjs/common';
import { AdaptDifficultyDto } from '../dto/adapt-difficulty.dto';
import {
  SkillProfile,
  clampScore,
} from '../interfaces/skill-profile.interface';
import { BehaviorAnalysisOutput } from './behavior-analyzer.service';
import { SimulationType } from '../../simulations/entities/simulation.entity';

export type SimulationModeLabel =
  | 'Beginner Mode'
  | 'Adaptive Mode'
  | 'Expert Mode';

export interface AdaptiveDifficultyResult {
  adaptedParameters: Record<string, unknown>;
  difficultyScore: number;
  modeLabel: SimulationModeLabel;
  rationale: string[];
  complexityFeatures: string[];
}

@Injectable()
export class AdaptiveDifficultyService {
  adapt(
    dto: AdaptDifficultyDto,
    skillProfile: SkillProfile,
    behavior: BehaviorAnalysisOutput,
  ): AdaptiveDifficultyResult {
    const difficultyScore = this.computeDifficultySignal(
      skillProfile,
      behavior,
    );
    const modeLabel = this.modeFromScore(difficultyScore);

    const base = dto.parameters ?? {};

    switch (dto.simulationType) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return this.adaptMonteCarlo(base, difficultyScore, modeLabel, behavior);
      case SimulationType.GAME_THEORY:
        return this.adaptGameTheory(base, difficultyScore, modeLabel, behavior);
      case SimulationType.MARKET:
        return this.adaptMarket(base, difficultyScore, modeLabel, behavior);
      case SimulationType.CONFLICT:
        return this.adaptConflict(base, difficultyScore, modeLabel, behavior);
      default:
        return {
          adaptedParameters: { ...base },
          difficultyScore,
          modeLabel,
          rationale: ['Adaptive layer skipped: unsupported simulation type.'],
          complexityFeatures: [],
        };
    }
  }

  private adaptMonteCarlo(
    rawParams: Record<string, unknown>,
    difficultyScore: number,
    modeLabel: SimulationModeLabel,
    behavior: BehaviorAnalysisOutput,
  ): AdaptiveDifficultyResult {
    const params = { ...rawParams };
    const variables = Array.isArray(params.variables)
      ? [...(params.variables as Array<Record<string, unknown>>)]
      : [];

    const targetVariableCount = this.clampInt(
      2 + Math.floor(Math.max(0, difficultyScore - 35) / 12),
      2,
      7,
    );

    while (variables.length < targetVariableCount) {
      const index = variables.length + 1;
      const dist =
        difficultyScore > 80
          ? 'normal'
          : difficultyScore > 58
            ? index % 2 === 0
              ? 'normal'
              : 'exponential'
            : 'uniform';

      variables.push({
        name: `x${index}`,
        distribution: dist,
        params:
          dist === 'normal'
            ? { mean: 0, std: Number((0.8 + index * 0.25).toFixed(2)) }
            : dist === 'exponential'
              ? { lambda: Number((0.9 + index * 0.2).toFixed(2)) }
              : { min: -1, max: Number((1 + index * 0.35).toFixed(2)) },
      });
    }

    params.variables = variables;

    const initialIterations = this.number(rawParams.iterations, 4_000);
    const iterationScale = 0.85 + difficultyScore / 135;
    params.iterations = this.clampInt(
      Math.round(initialIterations * iterationScale),
      500,
      160_000,
    );

    if (
      typeof params.outputExpression !== 'string' ||
      !params.outputExpression
    ) {
      const names = variables
        .map((entry) => (typeof entry.name === 'string' ? entry.name : null))
        .filter((entry): entry is string => Boolean(entry));
      params.outputExpression = names.slice(0, 3).join(' + ') || 'x1';
    }

    const normalVariableIndices = variables
      .map((variable, index) => ({
        index,
        distribution:
          typeof variable.distribution === 'string'
            ? variable.distribution
            : 'uniform',
      }))
      .filter((entry) => entry.distribution === 'normal')
      .map((entry) => entry.index);

    const complexityFeatures: string[] = [
      `variables:${variables.length}`,
      `iterations:${String(params.iterations)}`,
    ];

    if (difficultyScore > 74 && normalVariableIndices.length >= 2) {
      const size = normalVariableIndices.length;
      const baseCorrelation = this.clamp(
        0.24 + (difficultyScore - 74) / 95,
        0.2,
        0.68,
      );
      const correlationMatrix = Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) => {
          if (row === col) return 1;
          const weight = (row + col + 2) / (2 * size);
          return Number((baseCorrelation * weight).toFixed(3));
        }),
      );

      params.correlationMatrix = correlationMatrix;
      complexityFeatures.push('correlated_random_system');
    }

    if (difficultyScore > 83) {
      params.tailRiskAmplifier = Number(
        (1.2 + (difficultyScore - 83) / 28).toFixed(2),
      );
      complexityFeatures.push('tail_risk_modeling');
    }

    params.gabeDifficultyMeta = {
      modeLabel,
      difficultyScore,
      exploration: behavior.exploration_ratio,
    };

    return {
      adaptedParameters: params,
      difficultyScore,
      modeLabel,
      rationale: [
        'Monte Carlo complexity scales with dynamic skill, strategy depth, and live behavior.',
        'Parameter space expands when exploration and learning velocity are high.',
      ],
      complexityFeatures,
    };
  }

  private adaptGameTheory(
    rawParams: Record<string, unknown>,
    difficultyScore: number,
    modeLabel: SimulationModeLabel,
    behavior: BehaviorAnalysisOutput,
  ): AdaptiveDifficultyResult {
    const params = { ...rawParams };
    const initialPlayers = Array.isArray(params.players)
      ? [...(params.players as string[])]
      : ['Player A', 'Player B'];

    const playerTarget = this.clampInt(
      2 + Math.floor(Math.max(0, difficultyScore - 45) / 22),
      2,
      4,
    );

    const players = [...initialPlayers];
    while (players.length < playerTarget) {
      players.push(`Player ${players.length + 1}`);
    }
    params.players = players;

    const rawStrategies =
      params.strategies && typeof params.strategies === 'object'
        ? ({ ...(params.strategies as Record<string, unknown>) } as Record<
            string,
            string[]
          >)
        : {};

    const strategyTarget = this.clampInt(
      2 + Math.round(difficultyScore / 45),
      2,
      3,
    );

    const strategies: Record<string, string[]> = {};
    for (const player of players) {
      const current = Array.isArray(rawStrategies[player])
        ? [...rawStrategies[player]]
        : ['Cooperate', 'Compete'];

      while (current.length < strategyTarget) {
        current.push(`S${current.length + 1}`);
      }

      strategies[player] = current.slice(0, strategyTarget);
    }

    params.strategies = strategies;

    const profiles = this.generateProfiles(players, strategies, 64);
    const existingMatrix = Array.isArray(params.payoffMatrix)
      ? [...(params.payoffMatrix as Array<Record<string, unknown>>)]
      : [];

    const payoffMatrix = profiles.map((profile) => {
      const found = existingMatrix.find((entry) => {
        const entryStrategies =
          entry.strategies && typeof entry.strategies === 'object'
            ? (entry.strategies as Record<string, string>)
            : null;
        if (!entryStrategies) return false;

        return players.every(
          (player) => entryStrategies[player] === profile[player],
        );
      });

      if (found) {
        return found;
      }

      return {
        strategies: profile,
        payoffs: this.generateSyntheticPayoff(
          profile,
          players,
          difficultyScore,
        ),
      };
    });

    params.payoffMatrix = payoffMatrix;

    const complexityFeatures = [
      `players:${players.length}`,
      `profiles:${payoffMatrix.length}`,
    ];

    if (difficultyScore > 80) {
      params.dynamicStrategyEvolution = true;
      params.dynamicEvolutionRounds = this.clampInt(
        Math.round(6 + (difficultyScore - 80) / 2),
        6,
        20,
      );
      complexityFeatures.push('dynamic_strategy_evolution');
    }

    params.gabeDifficultyMeta = {
      modeLabel,
      difficultyScore,
      strategyChangeIntensity: behavior.strategy_change_intensity,
    };

    return {
      adaptedParameters: params,
      difficultyScore,
      modeLabel,
      rationale: [
        'Game theoretic complexity responds to observed strategy experimentation.',
        'Higher intelligence profiles trigger multi-agent payoffs and evolutionary dynamics.',
      ],
      complexityFeatures,
    };
  }

  private adaptMarket(
    rawParams: Record<string, unknown>,
    difficultyScore: number,
    modeLabel: SimulationModeLabel,
    behavior: BehaviorAnalysisOutput,
  ): AdaptiveDifficultyResult {
    const params = { ...rawParams };

    const initialPrice = this.number(params.initialPrice, 100);
    const baseVolatility = this.number(params.volatility, 0.22);
    const baseDrift = this.number(params.drift, 0.07);

    const paths = this.clampInt(
      Math.round(this.number(params.paths, 60) * (0.9 + difficultyScore / 160)),
      25,
      2_500,
    );
    const timeHorizonDays = this.clampInt(
      Math.round(
        this.number(params.timeHorizonDays, 120) *
          (0.95 + difficultyScore / 210),
      ),
      30,
      900,
    );

    params.initialPrice = initialPrice;
    params.volatility = baseVolatility;
    params.drift = baseDrift;
    params.paths = paths;
    params.timeHorizonDays = timeHorizonDays;

    const assetTarget =
      difficultyScore < 52
        ? 1
        : this.clampInt(Math.round(1 + difficultyScore / 30), 2, 5);

    const complexityFeatures = [`paths:${paths}`, `horizon:${timeHorizonDays}`];

    if (assetTarget > 1) {
      const assets = Array.from({ length: assetTarget }, (_, index) => {
        const vol = baseVolatility * (0.78 + index * 0.19);
        const drift = baseDrift * (0.82 + index * 0.16);

        return {
          id: `asset_${index + 1}`,
          initialPrice: Number((initialPrice * (1 + index * 0.14)).toFixed(3)),
          drift: Number(drift.toFixed(4)),
          volatility: Number(vol.toFixed(4)),
          weight: Number((1 / assetTarget).toFixed(4)),
        };
      });

      const baseCorr = this.clamp(0.14 + difficultyScore / 180, 0.12, 0.66);
      const correlationMatrix = Array.from({ length: assetTarget }, (_, row) =>
        Array.from({ length: assetTarget }, (_, col) => {
          if (row === col) return 1;
          return Number(
            (baseCorr * (1 - Math.abs(row - col) / assetTarget)).toFixed(3),
          );
        }),
      );

      params.assets = assets;
      params.portfolioCorrelationMatrix = correlationMatrix;
      complexityFeatures.push('portfolio_simulation');
    }

    if (difficultyScore > 78) {
      params.regimeSwitching = true;
      params.regimeTransitionMatrix = [
        [0.9, 0.1],
        [0.18, 0.82],
      ];
      params.regimeVolatilityMultipliers = [1, 1.9];
      complexityFeatures.push('regime_switching');
    }

    if (difficultyScore > 84) {
      params.volatilityClustering = true;
      params.garchAlpha = Number(
        (0.06 + (difficultyScore - 84) / 400).toFixed(4),
      );
      params.garchBeta = Number(
        (0.84 - (difficultyScore - 84) / 420).toFixed(4),
      );
      complexityFeatures.push('volatility_clustering');
    }

    params.gabeDifficultyMeta = {
      modeLabel,
      difficultyScore,
      exploration: behavior.exploration_ratio,
    };

    return {
      adaptedParameters: params,
      difficultyScore,
      modeLabel,
      rationale: [
        'Market engine migrates from single-asset paths to portfolio and regime-aware simulations as skill improves.',
        'Volatility complexity scales with both risk tolerance and observed engagement resilience.',
      ],
      complexityFeatures,
    };
  }

  private adaptConflict(
    rawParams: Record<string, unknown>,
    difficultyScore: number,
    modeLabel: SimulationModeLabel,
    behavior: BehaviorAnalysisOutput,
  ): AdaptiveDifficultyResult {
    const params = { ...rawParams };

    const initialAgents = Array.isArray(params.agents)
      ? [...(params.agents as Array<Record<string, unknown>>)]
      : [
          {
            id: 'a1',
            name: 'Agent 1',
            resources: 100,
            strategy: 'cooperative',
          },
          {
            id: 'a2',
            name: 'Agent 2',
            resources: 100,
            strategy: 'aggressive',
          },
        ];

    const targetAgents = this.clampInt(
      2 + Math.floor(Math.max(0, difficultyScore - 48) / 14),
      2,
      9,
    );

    const agents = [...initialAgents];
    while (agents.length < targetAgents) {
      const index = agents.length + 1;
      agents.push({
        id: `a${index}`,
        name: `Agent ${index}`,
        resources: 100 + index * 8,
        strategy:
          index % 4 === 0
            ? 'tit_for_tat'
            : index % 3 === 0
              ? 'random'
              : index % 2 === 0
                ? 'cooperative'
                : 'aggressive',
        adaptationRate: Number((0.08 + difficultyScore / 480).toFixed(3)),
      });
    }

    const finalizedAgents = agents.slice(0, targetAgents);
    params.agents = finalizedAgents;

    params.rounds = this.clampInt(
      Math.round(
        this.number(params.rounds, 120) * (0.85 + difficultyScore / 125),
      ),
      20,
      1_500,
    );

    const complexityFeatures = [
      `agents:${targetAgents}`,
      `rounds:${String(params.rounds)}`,
    ];

    if (difficultyScore > 76 && targetAgents >= 4) {
      const coalitionA = finalizedAgents
        .filter((_, index) => index % 2 === 0)
        .map((agent) => (agent as { id: string }).id);
      const coalitionB = finalizedAgents
        .filter((_, index) => index % 2 === 1)
        .map((agent) => (agent as { id: string }).id);

      params.coalitions = [coalitionA, coalitionB].filter(
        (coalition) => coalition.length >= 2,
      );
      complexityFeatures.push('coalition_ecosystem');
    }

    params.gabeDifficultyMeta = {
      modeLabel,
      difficultyScore,
      strategyIntensity: behavior.strategy_change_intensity,
    };

    return {
      adaptedParameters: params,
      difficultyScore,
      modeLabel,
      rationale: [
        'Conflict environment increases agent ecosystem depth based on adaptive skill profile signals.',
        'Coalition behavior is introduced only when the user sustains high strategy depth and engagement.',
      ],
      complexityFeatures,
    };
  }

  private computeDifficultySignal(
    skillProfile: SkillProfile,
    behavior: BehaviorAnalysisOutput,
  ): number {
    const signal =
      skillProfile.skill_level * 0.46 +
      skillProfile.strategy_depth * 0.2 +
      skillProfile.risk_tolerance * 0.14 +
      skillProfile.consistency_score * 0.08 +
      behavior.learning_velocity * 0.08 +
      behavior.engagement_score * 0.04;

    return clampScore(Math.round(signal));
  }

  private modeFromScore(score: number): SimulationModeLabel {
    if (score >= 78) return 'Expert Mode';
    if (score <= 38) return 'Beginner Mode';
    return 'Adaptive Mode';
  }

  private number(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : fallback;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  private clampInt(value: number, min: number, max: number): number {
    return Math.round(this.clamp(value, min, max));
  }

  private generateProfiles(
    players: string[],
    strategies: Record<string, string[]>,
    maxProfiles: number,
  ): Array<Record<string, string>> {
    let profiles: Array<Record<string, string>> = [{}];

    for (const player of players) {
      const playerStrategies = strategies[player] ?? ['S1'];
      const expanded: Array<Record<string, string>> = [];

      for (const profile of profiles) {
        for (const strategy of playerStrategies) {
          expanded.push({ ...profile, [player]: strategy });
          if (expanded.length >= maxProfiles) {
            return expanded;
          }
        }
      }

      profiles = expanded;
      if (profiles.length >= maxProfiles) {
        return profiles;
      }
    }

    return profiles;
  }

  private generateSyntheticPayoff(
    profile: Record<string, string>,
    players: string[],
    difficultyScore: number,
  ): Record<string, number> {
    const values = Object.values(profile);
    const aggressiveCount = values.filter((value) =>
      /defect|attack|compete|aggress/i.test(value),
    ).length;
    const cooperativeCount = values.filter((value) =>
      /cooperate|ally|share/i.test(value),
    ).length;

    const payoff: Record<string, number> = {};

    players.forEach((player, index) => {
      const choice = profile[player] ?? '';
      const aggressionBias = /defect|attack|compete|aggress/i.test(choice)
        ? 1.2
        : 0.45;
      const stabilityBonus = (cooperativeCount - aggressiveCount) * 0.35;
      const complexityPulse =
        Math.sin((index + 1) * difficultyScore * 0.06) * 0.8;
      const value =
        2.4 + aggressionBias + stabilityBonus + complexityPulse + index * 0.2;

      payoff[player] = Number(value.toFixed(3));
    });

    return payoff;
  }
}
