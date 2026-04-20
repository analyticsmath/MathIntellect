import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ConflictParams,
  ConflictResult,
  AgentDefinition,
  AgentOutcome,
  RoundRecord,
  ProgressCallback,
} from '../interfaces/engine.interfaces';

/**
 * Conflict Simulation Engine — Iterative Multi-Agent System
 *
 * Models interactions between N agents across R rounds.
 * Each pair of agents interacts once per round.
 * Rounds are processed in batches of ~10% for real-time progress reporting.
 *
 * Payoff table per pairwise interaction (Prisoner's Dilemma variant):
 *   Both cooperate → each +3
 *   Both attack    → each −1
 *   One attacks, one cooperates → attacker +5, cooperator −2
 */
@Injectable()
export class ConflictEngine {
  private readonly PAYOFFS = {
    CC: [3, 3],
    DD: [-1, -1],
    DC: [5, -2],
    CD: [-2, 5],
  };

  async run(
    params: ConflictParams,
    onProgress?: ProgressCallback,
  ): Promise<ConflictResult> {
    const t0 = Date.now();
    const { agents, rounds, seed } = params;

    if (agents.length < 2)
      throw new BadRequestException('Need at least 2 agents');
    if (rounds < 1 || rounds > 10_000)
      throw new BadRequestException('rounds must be 1–10,000');

    const rng = this.buildRng(seed);
    const alliances = params.alliances ?? params.coalitions ?? [];
    const coalitionMap = this.buildCoalitionMap(alliances);
    const coalitionStats: Record<
      string,
      { interactions: number; cooperativeActions: number }
    > = {};
    const betrayalSensitivity = this.clamp(
      params.betrayalSensitivity ?? 0.5,
      0.05,
      0.95,
    );

    const resources: Record<string, number> = {};
    const lastActions: Record<string, Record<string, string>> = {};
    const trustMatrix: Record<string, Record<string, number>> = {};
    const betrayalCounters: Record<string, { betrayals: number; interactions: number }> = {};
    const stats: Record<
      string,
      {
        gains: number;
        losses: number;
        wins: number;
        losses2: number;
        draws: number;
      }
    > = {};

    for (const agent of agents) {
      resources[agent.id] = agent.resources;
      lastActions[agent.id] = {};
      trustMatrix[agent.id] = {};
      betrayalCounters[agent.id] = { betrayals: 0, interactions: 0 };
      stats[agent.id] = { gains: 0, losses: 0, wins: 0, losses2: 0, draws: 0 };
    }

    for (const a of agents) {
      for (const b of agents) {
        if (a.id === b.id) continue;
        const sameAlliance = coalitionMap[a.id] && coalitionMap[a.id] === coalitionMap[b.id];
        trustMatrix[a.id][b.id] = sameAlliance ? 0.72 : 0.45;
      }
    }

    const roundHistory: RoundRecord[] = [];
    let totalActions = 0;
    let totalCooperate = 0;

    const BATCH = Math.max(1, Math.ceil(rounds / 10));

    for (let batchStart = 1; batchStart <= rounds; batchStart += BATCH) {
      const batchEnd = Math.min(batchStart + BATCH - 1, rounds);

      for (let round = batchStart; round <= batchEnd; round++) {
        const actions: Record<string, Record<string, string>> = {};
        const roundPayoffs: Record<string, number> = {};

        for (const agent of agents) {
          actions[agent.id] = {};
          roundPayoffs[agent.id] = 0;
        }

        for (let i = 0; i < agents.length; i++) {
          for (let j = i + 1; j < agents.length; j++) {
            const a = agents[i];
            const b = agents[j];

            const actionA = this.chooseAction(
              a,
              b.id,
              lastActions[a.id],
              trustMatrix[a.id][b.id],
              betrayalSensitivity,
              rng,
            );
            const actionB = this.chooseAction(
              b,
              a.id,
              lastActions[b.id],
              trustMatrix[b.id][a.id],
              betrayalSensitivity,
              rng,
            );

            actions[a.id][b.id] = actionA;
            actions[b.id][a.id] = actionB;

            totalActions += 2;
            if (actionA === 'cooperate') totalCooperate++;
            if (actionB === 'cooperate') totalCooperate++;

            const [basePayA, basePayB] = this.computePayoff(actionA, actionB);
            const [payA, payB] = this.applyCoalitionEffects(
              a.id,
              b.id,
              actionA,
              actionB,
              basePayA,
              basePayB,
              coalitionMap,
            );

            betrayalCounters[a.id].interactions += 1;
            betrayalCounters[b.id].interactions += 1;
            if (
              coalitionMap[a.id] &&
              coalitionMap[a.id] === coalitionMap[b.id] &&
              actionA === 'attack'
            ) {
              betrayalCounters[a.id].betrayals += 1;
            }
            if (
              coalitionMap[a.id] &&
              coalitionMap[a.id] === coalitionMap[b.id] &&
              actionB === 'attack'
            ) {
              betrayalCounters[b.id].betrayals += 1;
            }

            this.updateTrustScores(
              trustMatrix,
              a.id,
              b.id,
              actionA,
              actionB,
              betrayalSensitivity,
            );

            roundPayoffs[a.id] += payA;
            roundPayoffs[b.id] += payB;

            const coalitionA = coalitionMap[a.id];
            const coalitionB = coalitionMap[b.id];
            if (coalitionA && coalitionA === coalitionB) {
              if (!coalitionStats[coalitionA]) {
                coalitionStats[coalitionA] = { interactions: 0, cooperativeActions: 0 };
              }
              coalitionStats[coalitionA].interactions += 2;
              coalitionStats[coalitionA].cooperativeActions +=
                (actionA === 'cooperate' ? 1 : 0) + (actionB === 'cooperate' ? 1 : 0);
            }

            if (payA > payB) {
              stats[a.id].wins++;
              stats[b.id].losses2++;
            } else if (payB > payA) {
              stats[b.id].wins++;
              stats[a.id].losses2++;
            } else {
              stats[a.id].draws++;
              stats[b.id].draws++;
            }
          }
        }

        const resourceSnapshot: Record<string, number> = {};
        for (const agent of agents) {
          const p = roundPayoffs[agent.id];
          resources[agent.id] += p;
          if (p > 0) stats[agent.id].gains += p;
          else stats[agent.id].losses += Math.abs(p);
          lastActions[agent.id] = actions[agent.id];
          resourceSnapshot[agent.id] = resources[agent.id];
        }

        const flatActions: Record<string, string> = {};
        for (const agent of agents) {
          const opponentActions = Object.values(actions[agent.id]);
          flatActions[agent.id] = opponentActions[0] ?? 'none';
        }

        roundHistory.push({
          round,
          actions: flatActions,
          payoffs: { ...roundPayoffs },
          resources: { ...resourceSnapshot },
        });
      }

      const progress = Math.round((batchEnd / rounds) * 100);
      onProgress?.(progress, {
        roundsProcessed: batchEnd,
        total: rounds,
        leaderResources: Math.max(...Object.values(resources)),
      });

      if (batchEnd < rounds) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
    }

    const agentResults: AgentOutcome[] = agents.map((agent) => ({
      agentId: agent.id,
      name: agent.name,
      finalResources: resources[agent.id],
      totalGained: stats[agent.id].gains,
      totalLost: stats[agent.id].losses,
      wins: stats[agent.id].wins,
      losses: stats[agent.id].losses2,
      draws: stats[agent.id].draws,
      winRate:
        stats[agent.id].wins /
        Math.max(
          stats[agent.id].wins +
            stats[agent.id].losses2 +
            stats[agent.id].draws,
          1,
        ),
    }));

    const maxRes = Math.max(...agentResults.map((a) => a.finalResources));
    const winners = agentResults.filter((a) => a.finalResources === maxRes);
    const winner = winners.length === 1 ? winners[0].agentId : null;

    const coalitionMetrics = alliances
      .map((coalition) => {
        const members = coalition.filter((agentId) =>
          agentResults.some((agent) => agent.agentId === agentId),
        );
        if (members.length === 0) return null;

        const avgResources =
          members.reduce((sum, agentId) => {
            const found = agentResults.find((agent) => agent.agentId === agentId);
            return sum + (found?.finalResources ?? 0);
          }, 0) / members.length;

        const stats = coalitionStats[members.join('|')];
        const cohesion =
          stats && stats.interactions > 0
            ? stats.cooperativeActions / stats.interactions
            : 0.5;

        return {
          coalition: members,
          averageResources: avgResources,
          cohesionScore: Number(cohesion.toFixed(4)),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    const trustScores: Record<string, number> = {};
    for (const agent of agents) {
      const trustValues = Object.values(trustMatrix[agent.id] ?? {});
      trustScores[agent.id] =
        trustValues.length > 0
          ? Number(
              (
                trustValues.reduce((sum, value) => sum + value, 0) /
                trustValues.length
              ).toFixed(4),
            )
          : 0.5;
    }

    const betrayalProbabilities: Record<string, number> = {};
    for (const agent of agents) {
      const stats = betrayalCounters[agent.id];
      betrayalProbabilities[agent.id] = Number(
        (
          stats.betrayals /
          Math.max(1, stats.interactions)
        ).toFixed(4),
      );
    }

    const allianceMatrix = alliances
      .map((alliance) => {
        const members = alliance.filter((member) =>
          agents.some((agent) => agent.id === member),
        );
        if (members.length < 2) return null;

        let trustSum = 0;
        let pairs = 0;
        for (let i = 0; i < members.length; i++) {
          for (let j = i + 1; j < members.length; j++) {
            trustSum += trustMatrix[members[i]][members[j]] ?? 0.5;
            trustSum += trustMatrix[members[j]][members[i]] ?? 0.5;
            pairs += 2;
          }
        }

        return {
          alliance: members,
          trust: Number((trustSum / Math.max(1, pairs)).toFixed(4)),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    return {
      type: 'conflict',
      rounds,
      agentResults,
      roundHistory,
      winner,
      cooperationRate: totalActions > 0 ? totalCooperate / totalActions : 0,
      coalitionMetrics: coalitionMetrics.length > 0 ? coalitionMetrics : undefined,
      allianceMatrix: allianceMatrix.length > 0 ? allianceMatrix : undefined,
      betrayalProbabilities,
      trustScores,
      executionTimeMs: Date.now() - t0,
    };
  }

  // ─── Strategy logic ────────────────────────────────────────────────────────

  private chooseAction(
    agent: AgentDefinition,
    opponentId: string,
    lastActions: Record<string, string>,
    trustScore: number,
    betrayalSensitivity: number,
    rng: () => number,
  ): string {
    const betrayalProbability = this.clamp(
      (1 - trustScore) * betrayalSensitivity,
      0,
      0.95,
    );

    switch (agent.strategy) {
      case 'cooperative':
        return rng() < betrayalProbability * 0.2 ? 'attack' : 'cooperate';
      case 'aggressive':
      case 'defector':
        return 'attack';
      case 'tit_for_tat': {
        const last = lastActions[opponentId];
        if (last === 'attack') {
          return 'attack';
        }
        return rng() < betrayalProbability * 0.4 ? 'attack' : 'cooperate';
      }
      case 'random': {
        const trustBias = trustScore >= 0.6 ? 0.62 : 0.42;
        return rng() < trustBias ? 'cooperate' : 'attack';
      }
      default:
        return rng() < betrayalProbability ? 'attack' : 'cooperate';
    }
  }

  private computePayoff(actionA: string, actionB: string): [number, number] {
    const key = `${actionA === 'cooperate' ? 'C' : 'D'}${actionB === 'cooperate' ? 'C' : 'D'}`;
    return this.PAYOFFS[key] as [number, number];
  }

  private buildCoalitionMap(coalitions: string[][]): Record<string, string> {
    const map: Record<string, string> = {};
    for (const coalition of coalitions) {
      const key = coalition.join('|');
      for (const agentId of coalition) {
        map[agentId] = key;
      }
    }
    return map;
  }

  private applyCoalitionEffects(
    agentA: string,
    agentB: string,
    actionA: string,
    actionB: string,
    payA: number,
    payB: number,
    coalitionMap: Record<string, string>,
  ): [number, number] {
    const coalitionA = coalitionMap[agentA];
    const coalitionB = coalitionMap[agentB];

    if (!coalitionA || coalitionA !== coalitionB) {
      return [payA, payB];
    }

    if (actionA === 'cooperate' && actionB === 'cooperate') {
      return [payA + 1, payB + 1];
    }

    if (actionA === 'attack' && actionB === 'cooperate') {
      return [payA - 2, payB + 1];
    }

    if (actionA === 'cooperate' && actionB === 'attack') {
      return [payA + 1, payB - 2];
    }

    return [payA - 1, payB - 1];
  }

  private updateTrustScores(
    trustMatrix: Record<string, Record<string, number>>,
    agentA: string,
    agentB: string,
    actionA: string,
    actionB: string,
    betrayalSensitivity: number,
  ): void {
    const currentAB = trustMatrix[agentA][agentB] ?? 0.5;
    const currentBA = trustMatrix[agentB][agentA] ?? 0.5;

    let deltaA = 0;
    let deltaB = 0;

    if (actionA === 'cooperate' && actionB === 'cooperate') {
      deltaA = 0.028;
      deltaB = 0.028;
    } else if (actionA === 'attack' && actionB === 'cooperate') {
      deltaA = -0.12 * betrayalSensitivity;
      deltaB = -0.18 * betrayalSensitivity;
    } else if (actionA === 'cooperate' && actionB === 'attack') {
      deltaA = -0.18 * betrayalSensitivity;
      deltaB = -0.12 * betrayalSensitivity;
    } else {
      deltaA = -0.04 * betrayalSensitivity;
      deltaB = -0.04 * betrayalSensitivity;
    }

    trustMatrix[agentA][agentB] = this.clamp(currentAB + deltaA, 0.02, 0.98);
    trustMatrix[agentB][agentA] = this.clamp(currentBA + deltaB, 0.02, 0.98);
  }

  // ─── Seeded RNG (Mulberry32) ────────────────────────────────────────────────

  private buildRng(seed?: number): () => number {
    if (seed === undefined) return Math.random;
    let s = seed >>> 0;
    return () => {
      s += 0x6d2b79f5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
