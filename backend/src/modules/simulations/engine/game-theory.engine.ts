import { Injectable, BadRequestException } from '@nestjs/common';
import {
  GameTheoryParams,
  GameTheoryResult,
  PayoffEntry,
  NashEquilibrium,
  ProgressCallback,
} from '../interfaces/engine.interfaces';

/**
 * Game Theory Engine
 *
 * Analyses a finite normal-form game defined by a payoff matrix.
 * Emits progress at logical computation stages (dominant strategies,
 * Nash equilibria, expected payoffs) since the computation is
 * typically fast (small payoff matrices).
 */
@Injectable()
export class GameTheoryEngine {
  async run(
    params: GameTheoryParams,
    onProgress?: ProgressCallback,
  ): Promise<GameTheoryResult> {
    const t0 = Date.now();
    const { players, strategies, payoffMatrix } = params;

    if (players.length < 2) {
      throw new BadRequestException('Game theory requires at least 2 players');
    }
    if (!payoffMatrix.length) {
      throw new BadRequestException('payoffMatrix must not be empty');
    }

    onProgress?.(20, { stage: 'Computing dominant strategies' });
    const dominantStrategies = this.findDominantStrategies(
      players,
      strategies,
      payoffMatrix,
    );

    onProgress?.(55, { stage: 'Finding Nash equilibria' });
    const nashEquilibria = this.findNashEquilibria(
      players,
      strategies,
      payoffMatrix,
    );

    onProgress?.(85, { stage: 'Computing expected payoffs' });
    let expectedPayoffs = this.computeExpectedPayoffs(players, payoffMatrix);
    let strategyEvolution: Record<string, number[]> | undefined;
    let coalitionFormations:
      | Array<{ coalition: string[]; coalitionScore: number; cohesion: number }>
      | undefined;
    let repeatedGameLearning:
      | {
          rounds: number;
          convergenceScore: number;
          trajectory: Record<string, number[]>;
        }
      | undefined;
    let reputationScores: Record<string, number> | undefined;

    if (params.dynamicStrategyEvolution) {
      onProgress?.(92, { stage: 'Simulating strategy evolution' });
      const rounds = Math.max(1, Math.min(30, params.dynamicEvolutionRounds ?? 8));
      const evolution = this.simulateStrategyEvolution(
        players,
        strategies,
        payoffMatrix,
        rounds,
      );
      strategyEvolution = evolution.trajectory;
      expectedPayoffs = evolution.expectedPayoffs;
    }

    if ((params.repeatedLearningRounds ?? 0) > 0) {
      onProgress?.(96, { stage: 'Repeated-game learning' });
      const repeated = this.simulateRepeatedLearning(
        players,
        strategies,
        payoffMatrix,
        Math.max(4, Math.min(60, params.repeatedLearningRounds ?? 12)),
        this.clamp(params.reputationDecay ?? 0.07, 0.01, 0.35),
      );
      repeatedGameLearning = repeated.learning;
      reputationScores = repeated.reputationScores;
      expectedPayoffs = repeated.expectedPayoffs;
      strategyEvolution = strategyEvolution ?? repeated.learning.trajectory;
    }

    if (params.coalitionFormationEnabled) {
      coalitionFormations = this.buildCoalitionFormations(
        players,
        payoffMatrix,
        reputationScores,
      );
    }

    onProgress?.(100, {
      stage: 'Analysis complete',
      equilibria: nashEquilibria.length,
    });

    return {
      type: 'game_theory',
      players,
      dominantStrategies,
      nashEquilibria,
      expectedPayoffs,
      payoffMatrix,
      strategyEvolution,
      coalitionFormations,
      repeatedGameLearning,
      reputationScores,
      executionTimeMs: Date.now() - t0,
    };
  }

  // ─── Dominant strategy detection ────────────────────────────────────────────

  private findDominantStrategies(
    players: string[],
    strategies: Record<string, string[]>,
    matrix: PayoffEntry[],
  ): Record<string, string | null> {
    const result: Record<string, string | null> = {};

    for (const player of players) {
      const playerStrategies = strategies[player] ?? [];
      let dominant: string | null = null;

      for (const s of playerStrategies) {
        const isStrictlyDominant = playerStrategies
          .filter((other) => other !== s)
          .every((other) => {
            const opponents = players.filter((p) => p !== player);
            return this.allOpponentProfiles(opponents, strategies).every(
              (profile) => {
                const payoffS = this.lookupPayoff(
                  player,
                  { ...profile, [player]: s },
                  matrix,
                );
                const payoffOther = this.lookupPayoff(
                  player,
                  { ...profile, [player]: other },
                  matrix,
                );
                return payoffS >= payoffOther;
              },
            );
          });

        if (isStrictlyDominant) {
          dominant = s;
          break;
        }
      }
      result[player] = dominant;
    }
    return result;
  }

  // ─── Nash equilibrium (pure strategy) ───────────────────────────────────────

  private findNashEquilibria(
    players: string[],
    strategies: Record<string, string[]>,
    matrix: PayoffEntry[],
  ): NashEquilibrium[] {
    const equilibria: NashEquilibrium[] = [];
    const allProfiles = this.allOpponentProfiles(players, strategies);

    for (const profile of allProfiles) {
      let isNash = true;

      for (const player of players) {
        const currentPayoff = this.lookupPayoff(player, profile, matrix);
        const playerStrategies = strategies[player] ?? [];

        const canImprove = playerStrategies
          .filter((s) => s !== profile[player])
          .some((alt) => {
            const altPayoff = this.lookupPayoff(
              player,
              { ...profile, [player]: alt },
              matrix,
            );
            return altPayoff > currentPayoff;
          });

        if (canImprove) {
          isNash = false;
          break;
        }
      }

      if (isNash) {
        const payoffs: Record<string, number> = {};
        for (const p of players)
          payoffs[p] = this.lookupPayoff(p, profile, matrix);
        equilibria.push({
          strategies: { ...profile },
          payoffs,
          isPareto: this.isParetoOptimal(payoffs, players, strategies, matrix),
        });
      }
    }
    return equilibria;
  }

  // ─── Expected payoffs (uniform distribution over all profiles) ──────────────

  private computeExpectedPayoffs(
    players: string[],
    matrix: PayoffEntry[],
  ): Record<string, number> {
    const sums: Record<string, number> = {};
    players.forEach((p) => (sums[p] = 0));

    for (const entry of matrix) {
      for (const player of players) {
        sums[player] += entry.payoffs[player] ?? 0;
      }
    }

    const result: Record<string, number> = {};
    for (const player of players) {
      result[player] = matrix.length ? sums[player] / matrix.length : 0;
    }
    return result;
  }

  private simulateStrategyEvolution(
    players: string[],
    strategies: Record<string, string[]>,
    matrix: PayoffEntry[],
    rounds: number,
  ): {
    trajectory: Record<string, number[]>;
    expectedPayoffs: Record<string, number>;
  } {
    const weights: Record<string, Record<string, number>> = {};
    const trajectory: Record<string, number[]> = {};

    for (const player of players) {
      const playerStrategies = strategies[player] ?? [];
      const initialWeight = playerStrategies.length > 0 ? 1 / playerStrategies.length : 1;
      weights[player] = {};
      trajectory[player] = [];
      for (const strategy of playerStrategies) {
        weights[player][strategy] = initialWeight;
      }
    }

    const eta = 0.18;

    for (let round = 0; round < rounds; round++) {
      for (const player of players) {
        const playerStrategies = strategies[player] ?? [];
        const expected: Record<string, number> = {};

        for (const strategy of playerStrategies) {
          expected[strategy] = this.expectedPayoffForStrategy(
            player,
            strategy,
            players,
            matrix,
            weights,
          );
        }

        const average =
          playerStrategies.reduce((sum, strategy) => sum + expected[strategy], 0) /
          Math.max(1, playerStrategies.length);

        let normalization = 0;
        for (const strategy of playerStrategies) {
          const currentWeight = weights[player][strategy] ?? 0;
          const nextWeight =
            currentWeight * Math.exp(eta * (expected[strategy] - average));
          weights[player][strategy] = nextWeight;
          normalization += nextWeight;
        }

        for (const strategy of playerStrategies) {
          weights[player][strategy] =
            (weights[player][strategy] ?? 0) / Math.max(normalization, Number.EPSILON);
        }

        const bestWeight = Math.max(
          ...playerStrategies.map((strategy) => weights[player][strategy] ?? 0),
        );
        trajectory[player].push(Number((bestWeight * 100).toFixed(3)));
      }
    }

    const expectedPayoffs: Record<string, number> = {};
    for (const player of players) {
      let payoff = 0;
      for (const entry of matrix) {
        const probability = players.reduce((acc, agent) => {
          const strategy = entry.strategies[agent];
          return acc * (weights[agent][strategy] ?? 0);
        }, 1);

        payoff += probability * (entry.payoffs[player] ?? 0);
      }
      expectedPayoffs[player] = Number(payoff.toFixed(6));
    }

    return { trajectory, expectedPayoffs };
  }

  // ─── Pareto optimality ───────────────────────────────────────────────────────

  private isParetoOptimal(
    payoffs: Record<string, number>,
    players: string[],
    strategies: Record<string, string[]>,
    matrix: PayoffEntry[],
  ): boolean {
    const allProfiles = this.allOpponentProfiles(players, strategies);
    for (const profile of allProfiles) {
      const altPayoffs: Record<string, number> = {};
      for (const p of players) {
        altPayoffs[p] = this.lookupPayoff(p, profile, matrix);
      }
      const noneWorse = players.every((p) => altPayoffs[p] >= payoffs[p]);
      const someStrictlyBetter = players.some(
        (p) => altPayoffs[p] > payoffs[p],
      );
      if (noneWorse && someStrictlyBetter) return false;
    }
    return true;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private allOpponentProfiles(
    players: string[],
    strategies: Record<string, string[]>,
  ): Array<Record<string, string>> {
    let profiles: Array<Record<string, string>> = [{}];
    for (const player of players) {
      const playerStrategies = strategies[player] ?? [];
      const expanded: Array<Record<string, string>> = [];
      for (const existing of profiles) {
        for (const s of playerStrategies) {
          expanded.push({ ...existing, [player]: s });
        }
      }
      profiles = expanded;
    }
    return profiles;
  }

  private lookupPayoff(
    player: string,
    profile: Record<string, string>,
    matrix: PayoffEntry[],
  ): number {
    const entry = matrix.find((e) =>
      Object.entries(profile).every(([p, s]) => e.strategies[p] === s),
    );
    return entry?.payoffs[player] ?? 0;
  }

  private expectedPayoffForStrategy(
    player: string,
    strategy: string,
    players: string[],
    matrix: PayoffEntry[],
    weights: Record<string, Record<string, number>>,
  ): number {
    let expected = 0;

    for (const entry of matrix) {
      if (entry.strategies[player] !== strategy) continue;

      const probability = players.reduce((acc, otherPlayer) => {
        if (otherPlayer === player) return acc;
        const otherStrategy = entry.strategies[otherPlayer];
        return acc * (weights[otherPlayer][otherStrategy] ?? 0);
      }, 1);

      expected += probability * (entry.payoffs[player] ?? 0);
    }

    return expected;
  }

  private simulateRepeatedLearning(
    players: string[],
    strategies: Record<string, string[]>,
    matrix: PayoffEntry[],
    rounds: number,
    reputationDecay: number,
  ): {
    learning: {
      rounds: number;
      convergenceScore: number;
      trajectory: Record<string, number[]>;
    };
    reputationScores: Record<string, number>;
    expectedPayoffs: Record<string, number>;
  } {
    const weights: Record<string, Record<string, number>> = {};
    const trajectory: Record<string, number[]> = {};
    const reputationScores: Record<string, number> = {};

    for (const player of players) {
      const playerStrategies = strategies[player] ?? [];
      const initial = playerStrategies.length > 0 ? 1 / playerStrategies.length : 1;
      weights[player] = {};
      trajectory[player] = [];
      reputationScores[player] = 50;
      for (const strategy of playerStrategies) {
        weights[player][strategy] = initial;
      }
    }

    const eta = 0.14;
    for (let round = 0; round < rounds; round++) {
      for (const player of players) {
        const playerStrategies = strategies[player] ?? [];
        const expected: Record<string, number> = {};

        for (const strategy of playerStrategies) {
          expected[strategy] = this.expectedPayoffForStrategy(
            player,
            strategy,
            players,
            matrix,
            weights,
          );
        }

        const average =
          playerStrategies.reduce((sum, strategy) => sum + expected[strategy], 0) /
          Math.max(1, playerStrategies.length);

        let normalization = 0;
        for (const strategy of playerStrategies) {
          const currentWeight = weights[player][strategy] ?? 0;
          const nextWeight =
            currentWeight * Math.exp(eta * (expected[strategy] - average));
          weights[player][strategy] = nextWeight;
          normalization += nextWeight;
        }

        let bestStrategy = playerStrategies[0] ?? 'S1';
        let bestWeight = -Infinity;
        for (const strategy of playerStrategies) {
          weights[player][strategy] =
            (weights[player][strategy] ?? 0) /
            Math.max(normalization, Number.EPSILON);
          if (weights[player][strategy] > bestWeight) {
            bestWeight = weights[player][strategy];
            bestStrategy = strategy;
          }
        }

        trajectory[player].push(Number((bestWeight * 100).toFixed(3)));

        // Reputation score shifts toward cooperative or exploitative play.
        const coopSignal = this.cooperativeSignal(bestStrategy);
        reputationScores[player] = this.clamp(
          reputationScores[player] * (1 - reputationDecay) +
            (50 + coopSignal * 25) * reputationDecay +
            bestWeight * 4,
          0,
          100,
        );
      }
    }

    const expectedPayoffs: Record<string, number> = {};
    for (const player of players) {
      let payoff = 0;
      for (const entry of matrix) {
        const probability = players.reduce((acc, agent) => {
          const strategy = entry.strategies[agent];
          return acc * (weights[agent][strategy] ?? 0);
        }, 1);
        payoff += probability * (entry.payoffs[player] ?? 0);
      }
      expectedPayoffs[player] = Number(payoff.toFixed(6));
      reputationScores[player] = Number(reputationScores[player].toFixed(4));
    }

    const convergenceRaw =
      players.reduce((sum, player) => {
        const values = trajectory[player] ?? [];
        if (values.length < 2) return sum;
        const recent = values.slice(-Math.min(6, values.length));
        const max = Math.max(...recent);
        const min = Math.min(...recent);
        return sum + (100 - (max - min));
      }, 0) / Math.max(1, players.length);

    return {
      learning: {
        rounds,
        convergenceScore: Number(this.clamp(convergenceRaw, 0, 100).toFixed(4)),
        trajectory,
      },
      reputationScores,
      expectedPayoffs,
    };
  }

  private buildCoalitionFormations(
    players: string[],
    matrix: PayoffEntry[],
    reputationScores?: Record<string, number>,
  ): Array<{ coalition: string[]; coalitionScore: number; cohesion: number }> {
    const candidates: Array<{
      coalition: string[];
      coalitionScore: number;
      cohesion: number;
    }> = [];

    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const coalition = [players[i], players[j]];
        const coalitionEntries = matrix.filter((entry) =>
          coalition.every((player) =>
            this.cooperativeSignal(entry.strategies[player] ?? '') >= 0,
          ),
        );

        const score =
          coalitionEntries.length > 0
            ? coalitionEntries.reduce((sum, entry) => {
                const payoffSum = coalition.reduce(
                  (agg, player) => agg + (entry.payoffs[player] ?? 0),
                  0,
                );
                return sum + payoffSum;
              }, 0) / coalitionEntries.length
            : 0;

        const reputation =
          coalition.reduce(
            (sum, player) => sum + (reputationScores?.[player] ?? 50),
            0,
          ) / coalition.length;

        const cohesion = this.clamp(
          coalitionEntries.length / Math.max(1, matrix.length) + reputation / 140,
          0,
          1,
        );

        candidates.push({
          coalition,
          coalitionScore: Number(score.toFixed(4)),
          cohesion: Number(cohesion.toFixed(4)),
        });
      }
    }

    return candidates
      .sort((a, b) => b.coalitionScore - a.coalitionScore)
      .slice(0, 6);
  }

  private cooperativeSignal(strategy: string): number {
    if (/cooperate|ally|share|trust/i.test(strategy)) return 1;
    if (/defect|attack|aggress|compete/i.test(strategy)) return -1;
    return 0;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
