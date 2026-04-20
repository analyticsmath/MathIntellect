import { Injectable, Logger } from '@nestjs/common';
import { CoachRequestDto } from '../dto/coach-request.dto';
import { CacheAiService } from './cache-ai.service';
import { SimulationContextService } from './simulation-context.service';
import { UserIntelligenceProfileService } from '../../gabe/services/user-intelligence-profile.service';
import { ProgressionService } from '../../progression/progression.service';
import { AiMetaLearningService } from '../../ai-meta-learning/ai-meta-learning.service';
import { AiBehaviorGraphService } from '../../ai-meta-learning/ai-behavior-graph.service';
import { SimulationType } from '../../simulations/entities/simulation.entity';
import { PROMPT_VERSION_LOCK } from '../../ai-consistency/ai-prompt-versioning.service';

export interface AiCoachResponse {
  recommendation: string;
  reasoning: string[];
  behavior_summary: string;
  drift_direction: 'increasing' | 'decreasing' | 'stable';
  recommended_next_strategy: string;
  difficultyAdjustment: {
    direction: 'increase' | 'decrease' | 'maintain';
    magnitude: number;
    rationale: string;
  };
  nextSimulationBlueprint: {
    type: SimulationType;
    name: string;
    objective: string;
    parameters: Record<string, unknown>;
  };
  meta: {
    cached: boolean;
    debounced: boolean;
    generatedAt: string;
  };
}

@Injectable()
export class AiCoachService {
  private readonly logger = new Logger(AiCoachService.name);
  private readonly debounceWindowMs = 4_500;
  private readonly lastRequestAtByUser = new Map<string, number>();

  constructor(
    private readonly cacheAiService: CacheAiService,
    private readonly contextService: SimulationContextService,
    private readonly userStateService: UserIntelligenceProfileService,
    private readonly progressionService: ProgressionService,
    private readonly metaLearningService: AiMetaLearningService,
    private readonly behaviorGraphService: AiBehaviorGraphService,
  ) {}

  async generateCoach(
    userId: string,
    dto: CoachRequestDto,
  ): Promise<AiCoachResponse> {
    const promptVersion = PROMPT_VERSION_LOCK;
    const cacheKey = this.cacheAiService.buildCoachKey(
      userId,
      dto.simulationId ?? 'global',
      promptVersion,
    );

    const now = Date.now();
    const lastRequestAt = this.lastRequestAtByUser.get(userId) ?? 0;

    if (!dto.forceRefresh) {
      const cached = this.cacheAiService.get<AiCoachResponse>(cacheKey);

      if (cached && now - lastRequestAt < this.debounceWindowMs) {
        return {
          ...cached,
          meta: {
            ...cached.meta,
            cached: true,
            debounced: true,
            generatedAt: new Date().toISOString(),
          },
        };
      }

      if (cached) {
        this.lastRequestAtByUser.set(userId, now);
        return {
          ...cached,
          meta: {
            ...cached.meta,
            cached: true,
            debounced: false,
            generatedAt: new Date().toISOString(),
          },
        };
      }
    }

    const [userState, progression, metaTuning, behaviorGraph] = await Promise.all([
      this.userStateService.getState(userId),
      this.progressionService.getPromptAdaptation(userId),
      this.metaLearningService.getPromptTuning(userId),
      this.behaviorGraphService.getProfile(userId),
    ]);

    const context = dto.simulationId
      ? await this.contextService.getContext(dto.simulationId)
      : null;

    const baselinePerformance =
      userState.engagementState.recent_performance_scores.length > 0
        ? userState.engagementState.recent_performance_scores.reduce(
            (sum, value) => sum + value,
            0,
          ) / userState.engagementState.recent_performance_scores.length
        : 50;

    const stagnationSignal = this.clamp(
      metaTuning.stagnationScore * 0.62 +
        userState.engagementState.simulation_repetition_cycles * 1.8,
      0,
      100,
    );

    const difficultyAdjustment = this.resolveDifficultyAdjustment(
      baselinePerformance,
      stagnationSignal,
      progression.explanationDepth,
    );

    const nextType = this.resolveNextSimulationType(
      metaTuning.preferredSimulationType,
      stagnationSignal,
      context?.simulation_type,
    );

    const blueprint = this.buildBlueprint(nextType, difficultyAdjustment.direction);

    const reasoning = [
      `Profile cluster: ${metaTuning.clusterLabel}; explanation style: ${metaTuning.explanationStyle}.`,
      `Stagnation signal is ${stagnationSignal.toFixed(1)} and baseline performance is ${baselinePerformance.toFixed(1)}.`,
      context
        ? `Current simulation risk score is ${context.derived_metrics.risk_score.toFixed(1)} with expected value ${context.derived_metrics.expected_value.toFixed(3)}.`
        : 'No single simulation context supplied, so recommendation is track-level.',
      `Progression rank is ${progression.rankLabel} with ${progression.behaviorStyle} coaching posture.`,
    ];

    const recommendation =
      difficultyAdjustment.direction === 'increase'
        ? 'You are ready for a higher-complexity mission. Run a harder scenario and validate robustness under stress.'
        : difficultyAdjustment.direction === 'decrease'
          ? 'Stabilize first: run a controlled mission with narrower variance and rebuild consistency before scaling up.'
          : 'Maintain current complexity and focus on diversifying scenario assumptions to avoid local optimum behavior.';

    const response: AiCoachResponse = {
      recommendation,
      reasoning,
      behavior_summary:
        behaviorGraph?.behavior_summary ??
        'Behavior graph is initializing from recent simulations.',
      drift_direction: behaviorGraph?.drift_direction ?? 'stable',
      recommended_next_strategy:
        behaviorGraph?.recommended_next_strategy ??
        'maintain balanced strategy and continue deterministic replays',
      difficultyAdjustment,
      nextSimulationBlueprint: blueprint,
      meta: {
        cached: false,
        debounced: false,
        generatedAt: new Date().toISOString(),
      },
    };

    this.cacheAiService.set(cacheKey, response, 5 * 60 * 1_000);
    this.lastRequestAtByUser.set(userId, now);

    await this.metaLearningService.rememberCoachRecommendation(userId, {
      recommendation,
      difficultyAdjustment,
      nextSimulationBlueprint: blueprint,
      generatedAt: response.meta.generatedAt,
    });

    this.logger.debug(`Coach response generated for user ${userId}`);

    return response;
  }

  private resolveDifficultyAdjustment(
    performance: number,
    stagnation: number,
    explanationDepth: 'concise' | 'balanced' | 'deep',
  ): AiCoachResponse['difficultyAdjustment'] {
    if (stagnation > 68 || performance < 42) {
      return {
        direction: 'decrease',
        magnitude: Number(this.clamp((stagnation - performance) / 38, 0.1, 0.9).toFixed(3)),
        rationale:
          'High stagnation and low consistency indicate cognitive overload. Reduce simulation complexity temporarily.',
      };
    }

    if (performance > 66 && stagnation < 45 && explanationDepth !== 'concise') {
      return {
        direction: 'increase',
        magnitude: Number(this.clamp((performance - stagnation) / 55, 0.12, 1).toFixed(3)),
        rationale:
          'Strong consistency and low stagnation suggest readiness for more complex branching and uncertainty depth.',
      };
    }

    return {
      direction: 'maintain',
      magnitude: 0,
      rationale:
        'Current trajectory is stable; preserve complexity while changing scenario assumptions for better exploration.',
    };
  }

  private resolveNextSimulationType(
    preferredType: SimulationType,
    stagnationSignal: number,
    currentType?: SimulationType,
  ): SimulationType {
    if (stagnationSignal > 62 && currentType) {
      const alternatives = [
        SimulationType.MONTE_CARLO,
        SimulationType.MARKET,
        SimulationType.GAME_THEORY,
        SimulationType.CONFLICT,
      ].filter((type) => type !== currentType);

      return alternatives[0] ?? preferredType;
    }

    if (preferredType === SimulationType.CUSTOM) {
      return SimulationType.MONTE_CARLO;
    }

    return preferredType;
  }

  private buildBlueprint(
    type: SimulationType,
    adjustment: 'increase' | 'decrease' | 'maintain',
  ): AiCoachResponse['nextSimulationBlueprint'] {
    switch (type) {
      case SimulationType.MARKET:
        return {
          type,
          name: 'Regime Shift Stress Mission',
          objective:
            'Quantify robustness across bull/bear transitions with explicit shock probes.',
          parameters: {
            initialPrice: 100,
            volatility: adjustment === 'increase' ? 0.34 : 0.22,
            drift: 0.08,
            timeHorizonDays: adjustment === 'increase' ? 360 : 180,
            paths: adjustment === 'increase' ? 850 : 420,
            regimeSwitching: true,
            sentimentModeling: true,
            shockEventProbability: adjustment === 'decrease' ? 0.01 : 0.018,
          },
        };
      case SimulationType.GAME_THEORY:
        return {
          type,
          name: 'Coalition Learning Mission',
          objective:
            'Study equilibrium stability under repeated game adaptation and reputation drift.',
          parameters: {
            players: ['Player A', 'Player B', 'Player C'],
            dynamicStrategyEvolution: true,
            coalitionFormationEnabled: true,
            repeatedLearningRounds: adjustment === 'increase' ? 24 : 12,
          },
        };
      case SimulationType.CONFLICT:
        return {
          type,
          name: 'Alliance Volatility Mission',
          objective:
            'Model trust stability and betrayal pressure under multi-agent conflict dynamics.',
          parameters: {
            rounds: adjustment === 'increase' ? 340 : 160,
            alliances: [['a1', 'a2'], ['a3', 'a4']],
            betrayalSensitivity: adjustment === 'decrease' ? 0.36 : 0.58,
          },
        };
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
      default:
        return {
          type: SimulationType.MONTE_CARLO,
          name: 'Branching Confidence Mission',
          objective:
            'Expand probabilistic branching and narrative confidence intervals for decision calibration.',
          parameters: {
            iterations: adjustment === 'increase' ? 30_000 : 12_000,
            scenarioBranchDepth: adjustment === 'decrease' ? 2 : 3,
            riskCurveWindows: adjustment === 'increase' ? 42 : 24,
            tailRiskAmplifier: adjustment === 'increase' ? 1.35 : 1.15,
          },
        };
    }
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
