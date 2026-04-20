import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBehaviorGraph } from './entities/user-behavior-graph.entity';

export interface BehaviorGraphIngestInput {
  simulationType: string;
  behaviorType: string;
  riskScore: number;
  explorationRatio?: number;
  performanceScore: number;
  learningVelocity?: number;
  engagementScore?: number;
  skillLevel?: number;
}

export interface BehaviorGraphProfile {
  userId: string;
  intelligenceSummary: string;
  behavior_summary: string;
  drift_direction: 'increasing' | 'decreasing' | 'stable';
  recommended_next_strategy: string;
  explorationRatio: number;
  exploitationRatio: number;
  dominantEngineType: string;
  riskTrajectory: 'increasing' | 'decreasing' | 'stable';
  strategyLabel: string;
  totalSimulations: number;
}

@Injectable()
export class AiBehaviorGraphService {
  private readonly logger = new Logger(AiBehaviorGraphService.name);

  constructor(
    @InjectRepository(UserBehaviorGraph)
    private readonly graphRepo: Repository<UserBehaviorGraph>,
  ) {}

  async ingest(userId: string, input: BehaviorGraphIngestInput): Promise<void> {
    let graph = await this.graphRepo.findOne({ where: { userId } });

    if (!graph) {
      graph = this.graphRepo.create({
        userId,
        nodeWeights: {},
        edgeTransitions: {},
        behaviorTransitions: {},
        riskTrajectory: [],
        enginePreferenceGraph: {},
        aiAdaptationCurve: [],
        explorationRatio: 0.5,
        exploitationRatio: 0.5,
        totalSimulations: 0,
        nodeSkillLevel: 0,
        nodeStrategyType: 'balanced',
        nodeRiskProfile: 50,
        nodeEngagementScore: 50,
        driftDirection: 'stable',
        recommendedNextStrategy: null,
        behaviorSummary: null,
        lastBehaviorType: null,
      });
    }

    const simulationType = input.simulationType;
    const previousSimulationType = graph.lastSimulationType;
    const previousBehaviorType = graph.lastBehaviorType;

    graph.nodeWeights = {
      ...graph.nodeWeights,
      [simulationType]: (graph.nodeWeights[simulationType] ?? 0) + 1,
    };

    if (previousSimulationType && previousSimulationType !== simulationType) {
      const edgeKey = `${previousSimulationType}:${simulationType}`;
      graph.edgeTransitions = {
        ...graph.edgeTransitions,
        [edgeKey]: (graph.edgeTransitions[edgeKey] ?? 0) + 1,
      };
    }

    if (previousBehaviorType) {
      const behaviorEdge = `${previousBehaviorType}:${input.behaviorType}`;
      graph.behaviorTransitions = {
        ...graph.behaviorTransitions,
        [behaviorEdge]: (graph.behaviorTransitions[behaviorEdge] ?? 0) + 1,
      };
    }

    const riskWindow = [...(graph.riskTrajectory ?? []), this.clamp(input.riskScore, 0, 100)].slice(-20);
    graph.riskTrajectory = riskWindow;

    graph.enginePreferenceGraph = {
      ...graph.enginePreferenceGraph,
      [simulationType]:
        ((graph.enginePreferenceGraph[simulationType] ?? input.performanceScore) + input.performanceScore) /
        2,
    };

    const explorationRatio = input.explorationRatio ?? (previousSimulationType !== simulationType ? 0.8 : 0.2);
    graph.explorationRatio = graph.explorationRatio * 0.85 + this.clamp(explorationRatio, 0, 1) * 0.15;
    graph.exploitationRatio = 1 - graph.explorationRatio;

    graph.aiAdaptationCurve = [...(graph.aiAdaptationCurve ?? []), this.clamp(input.performanceScore, 0, 100)].slice(-10);

    graph.nodeSkillLevel = Number(
      (graph.nodeSkillLevel * 0.7 + this.clamp(input.skillLevel ?? input.performanceScore, 0, 100) * 0.3).toFixed(4),
    );
    graph.nodeStrategyType = input.behaviorType;
    graph.nodeRiskProfile = Number((graph.nodeRiskProfile * 0.75 + this.clamp(input.riskScore, 0, 100) * 0.25).toFixed(4));
    graph.nodeEngagementScore = Number(
      (graph.nodeEngagementScore * 0.7 + this.clamp(input.engagementScore ?? input.learningVelocity ?? 50, 0, 100) * 0.3).toFixed(4),
    );

    graph.totalSimulations += 1;
    graph.lastSimulationType = simulationType;
    graph.lastBehaviorType = input.behaviorType;

    graph.driftDirection = this.deriveRiskTrajectory(graph.riskTrajectory);
    graph.recommendedNextStrategy = this.recommendNextStrategy(graph);
    graph.behaviorSummary = this.buildBehaviorSummary(graph);
    graph.intelligenceSummary = this.buildSummary(graph);

    try {
      await this.graphRepo.save(graph);
    } catch (err) {
      this.logger.warn(
        `BehaviorGraph save failed for user ${userId}: ${(err as Error).message}`,
      );
    }
  }

  async getProfile(userId: string): Promise<BehaviorGraphProfile | null> {
    const graph = await this.graphRepo.findOne({ where: { userId } });
    if (!graph || graph.totalSimulations === 0) return null;

    const dominantEngineType =
      Object.entries(graph.nodeWeights).sort(([, a], [, b]) => b - a)[0]?.[0] ??
      'monte_carlo';

    const riskTrajectory = this.deriveRiskTrajectory(graph.riskTrajectory);
    const strategyLabel = this.deriveStrategyLabel(graph);

    return {
      userId,
      intelligenceSummary: graph.intelligenceSummary ?? this.buildSummary(graph),
      behavior_summary: graph.behaviorSummary ?? this.buildBehaviorSummary(graph),
      drift_direction: graph.driftDirection,
      recommended_next_strategy:
        graph.recommendedNextStrategy ?? this.recommendNextStrategy(graph),
      explorationRatio: graph.explorationRatio,
      exploitationRatio: graph.exploitationRatio,
      dominantEngineType,
      riskTrajectory,
      strategyLabel,
      totalSimulations: graph.totalSimulations,
    };
  }

  private buildSummary(graph: UserBehaviorGraph): string {
    const dominant =
      Object.entries(graph.nodeWeights).sort(([, a], [, b]) => b - a)[0]?.[0] ??
      'unknown';
    const explorationLabel =
      graph.explorationRatio > 0.65
        ? 'high exploration'
        : graph.explorationRatio < 0.35
          ? 'strong exploitation'
          : 'balanced exploration';
    const riskDir = this.deriveRiskTrajectory(graph.riskTrajectory);
    const riskLabel =
      riskDir === 'increasing'
        ? 'increasing risk appetite'
        : riskDir === 'decreasing'
          ? 'risk-reduction tendency'
          : 'stable risk profile';

    return `User demonstrates ${explorationLabel} with ${riskLabel}. Dominant simulation pattern: ${dominant.replace(/_/g, ' ')}. ${graph.totalSimulations} missions completed.`;
  }

  private buildBehaviorSummary(graph: UserBehaviorGraph): string {
    return `Behavior graph nodes => skill_level=${graph.nodeSkillLevel.toFixed(1)}, strategy_type=${graph.nodeStrategyType}, risk_profile=${graph.nodeRiskProfile.toFixed(1)}, engagement_score=${graph.nodeEngagementScore.toFixed(1)}.`;
  }

  private deriveRiskTrajectory(
    trajectory: number[],
  ): 'increasing' | 'decreasing' | 'stable' {
    if (trajectory.length < 3) return 'stable';
    const half = Math.floor(trajectory.length / 2);
    const firstHalfAvg = trajectory.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const secondHalfAvg =
      trajectory.slice(half).reduce((a, b) => a + b, 0) /
      Math.max(1, trajectory.length - half);
    const delta = secondHalfAvg - firstHalfAvg;
    if (delta > 4) return 'increasing';
    if (delta < -4) return 'decreasing';
    return 'stable';
  }

  private deriveStrategyLabel(graph: UserBehaviorGraph): string {
    const isHighRisk = (graph.riskTrajectory.at(-1) ?? 50) > 65;
    const isExplorer = graph.explorationRatio > 0.6;
    if (isHighRisk && isExplorer) return 'High-Risk Iterative Strategist';
    if (isHighRisk && !isExplorer) return 'Calculated Risk Optimizer';
    if (!isHighRisk && isExplorer) return 'Conservative Explorer';
    return 'Balanced Strategist';
  }

  private recommendNextStrategy(graph: UserBehaviorGraph): string {
    if (graph.driftDirection === 'increasing' && graph.nodeRiskProfile > 65) {
      return 'reduce variance and run a stability-focused scenario next';
    }

    if (graph.driftDirection === 'decreasing' && graph.nodeEngagementScore < 45) {
      return 'increase challenge gradually with one higher-complexity branch';
    }

    if (graph.nodeSkillLevel > 70 && graph.explorationRatio < 0.4) {
      return 'explore one alternate strategy branch to avoid local optimum lock';
    }

    return 'maintain balanced strategy and iterate with deterministic replay checks';
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
