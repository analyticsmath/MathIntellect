import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  AiIntelligenceResponse,
  CompareResponse,
  ExplainResponse,
  GamificationEventResponse,
} from '../interfaces/ai-response.interface';
import { DecisionResponse } from '../interfaces/decision.interface';
import { InsightResponse } from '../interfaces/insight.interface';
import { DecisionRequestDto } from '../dto/decision-request.dto';
import { CacheAiService } from './cache-ai.service';
import { DecisionEngineService } from './decision-engine.service';
import { InsightEngineService } from './insight-engine.service';
import { OpenAIClientService } from './openai-client.service';
import {
  PromptBuilderService,
  PromptContract,
  PromptPersonalization,
} from './prompt-builder.service';
import {
  SimulationContext,
  SimulationContextService,
} from './simulation-context.service';
import { UserIntelligenceProfileService } from '../../gabe/services/user-intelligence-profile.service';
import { ProgressionEngineService } from '../../gabe/services/progression-engine.service';
import { DEFAULT_SKILL_PROFILE } from '../../gabe/interfaces/skill-profile.interface';
import { ProgressionService } from '../../progression/progression.service';
import { AiMetaLearningService } from '../../ai-meta-learning/ai-meta-learning.service';
import { AiConsistencyLockService } from '../../ai-consistency/ai-consistency-lock.service';
import { PROMPT_VERSION_LOCK } from '../../ai-consistency/ai-prompt-versioning.service';

@Injectable()
export class AiOrchestratorService {
  private readonly logger = new Logger(AiOrchestratorService.name);

  constructor(
    private readonly contextService: SimulationContextService,
    private readonly promptBuilder: PromptBuilderService,
    private readonly insightEngine: InsightEngineService,
    private readonly decisionEngine: DecisionEngineService,
    private readonly openAiClient: OpenAIClientService,
    private readonly cacheAiService: CacheAiService,
    private readonly userIntelligenceProfile: UserIntelligenceProfileService,
    private readonly progressionEngine: ProgressionEngineService,
    private readonly progressionService: ProgressionService,
    private readonly aiMetaLearningService: AiMetaLearningService,
    private readonly aiConsistencyLock: AiConsistencyLockService,
  ) {}

  async generateInsight(
    simulationId: string,
    forceRefresh = false,
  ): Promise<InsightResponse> {
    const context = await this.contextService.getContext(simulationId);
    return this.resolveInsight(context, forceRefresh);
  }

  async generateIntelligence(
    simulationId: string,
    forceRefresh = false,
  ): Promise<AiIntelligenceResponse> {
    const context = await this.contextService.getContext(simulationId);
    const insight = await this.resolveInsight(context, forceRefresh);
    const decision = await this.resolveDecision(
      context,
      insight,
      undefined,
      forceRefresh,
    );
    const gamificationEvent = await this.resolveGamificationEvent(context);

    return {
      insight,
      decision,
      gamification_event: gamificationEvent,
    };
  }

  async generateDecision(dto: DecisionRequestDto): Promise<DecisionResponse> {
    const context = await this.contextService.getContext(dto.simulationId);
    const insight = await this.resolveInsight(
      context,
      dto.forceRefresh ?? false,
    );

    return this.resolveDecision(
      context,
      insight,
      dto.userContext,
      dto.forceRefresh ?? false,
    );
  }

  async compareSimulations(simulationIds: string[]): Promise<CompareResponse> {
    const uniqueIds = [...new Set(simulationIds)];
    if (uniqueIds.length < 2) {
      throw new BadRequestException(
        'At least 2 unique simulationIds are required',
      );
    }

    const compareCacheKey = this.cacheAiService.buildComparisonKey(
      uniqueIds,
      PROMPT_VERSION_LOCK,
    );

    const cached = this.cacheAiService.get<CompareResponse>(compareCacheKey);
    if (cached) {
      return cached;
    }

    const contexts = await Promise.all(
      uniqueIds.map((simulationId) =>
        this.contextService.getContext(simulationId),
      ),
    );
    const insights = await Promise.all(
      contexts.map((context) => this.resolveInsight(context, false)),
    );

    const riskValues = contexts.map(
      (context) => context.derived_metrics.risk_score,
    );
    const returnValues = contexts.map(
      (context) => context.derived_metrics.return_score,
    );
    const stabilityValues = contexts.map(
      (context) => context.derived_metrics.stability_score,
    );

    const normalizedRisk = this.normalizeSeries(riskValues, true);
    const normalizedReturn = this.normalizeSeries(returnValues, false);
    const normalizedStability = this.normalizeSeries(stabilityValues, false);

    const comparisons = contexts.map((context, index) => {
      const rankingScore = this.clamp(
        normalizedRisk[index] * 0.4 +
          normalizedReturn[index] * 0.4 +
          normalizedStability[index] * 0.2,
      );

      return {
        simulation_id: context.simulation_id,
        summary: insights[index].summary,
        risk: insights[index].risk_analysis.level,
        expected_value: this.formatExpectedValue(
          context.derived_metrics.expected_value,
        ),
        ranking_score: Math.round(rankingScore),
      };
    });

    const rankedComparisons = [...comparisons].sort(
      (a, b) => b.ranking_score - a.ranking_score,
    );

    const best = rankedComparisons[0];
    const reasoning =
      `Weighted ranking applied with risk 40%, return 40%, stability 20%. ` +
      `Best option is ${best.simulation_id} with score ${best.ranking_score}, ` +
      `driven by its normalized risk-return-stability balance.`;

    const response: CompareResponse = {
      comparisons: rankedComparisons,
      best_option: best.simulation_id,
      reasoning,
    };

    this.cacheAiService.set(compareCacheKey, response);
    return response;
  }

  async explainSimulation(
    simulationId: string,
    forceRefresh = false,
  ): Promise<ExplainResponse> {
    const context = await this.contextService.getContext(simulationId);
    const personalization = await this.resolvePersonalization(
      context.created_by_id,
    );

    const simulationInput = {
      kind: 'explain',
      context,
      personalization,
      prompt_version: PROMPT_VERSION_LOCK,
    };

    return this.resolveAiResponse<ExplainResponse>({
      simulationId: context.simulation_id,
      engineType: context.simulation_type,
      simulationInput,
      forceRefresh,
      buildPrompt: () =>
        this.promptBuilder.buildExplainPrompt(
          context,
          (payload): payload is ExplainResponse =>
            this.insightEngine.isExplainResponse(payload),
          personalization ?? undefined,
        ),
      validator: (payload): payload is ExplainResponse =>
        this.insightEngine.isExplainResponse(payload),
      normalize: (payload) => this.insightEngine.normalizeExplain(payload),
      deterministicFallback: () =>
        this.insightEngine.buildFallbackExplain(context),
      staticSafeTemplate: () => this.staticSafeExplainTemplate(context),
    });
  }

  private async resolveInsight(
    context: SimulationContext,
    forceRefresh: boolean,
  ): Promise<InsightResponse> {
    const personalization = await this.resolvePersonalization(
      context.created_by_id,
    );

    const simulationInput = {
      kind: 'insight',
      context,
      personalization,
      prompt_version: PROMPT_VERSION_LOCK,
    };

    return this.resolveAiResponse<InsightResponse>({
      simulationId: context.simulation_id,
      engineType: context.simulation_type,
      simulationInput,
      forceRefresh,
      buildPrompt: () =>
        this.promptBuilder.buildInsightPrompt(
          context,
          (payload): payload is InsightResponse =>
            this.insightEngine.isInsightResponse(payload),
          personalization ?? undefined,
        ),
      validator: (payload): payload is InsightResponse =>
        this.insightEngine.isInsightResponse(payload),
      normalize: (payload) => this.insightEngine.normalizeInsight(payload),
      deterministicFallback: () =>
        this.insightEngine.buildFallbackInsight(context),
      staticSafeTemplate: () => this.staticSafeInsightTemplate(context),
    });
  }

  private async resolveDecision(
    context: SimulationContext,
    insight: InsightResponse,
    userContext?: Record<string, unknown>,
    forceRefresh = false,
  ): Promise<DecisionResponse> {
    const personalization = await this.resolvePersonalization(
      context.created_by_id,
    );

    const simulationInput = {
      kind: 'decision',
      context,
      insight,
      user_context: userContext ?? {},
      personalization,
      prompt_version: PROMPT_VERSION_LOCK,
    };

    return this.resolveAiResponse<DecisionResponse>({
      simulationId: context.simulation_id,
      engineType: context.simulation_type,
      simulationInput,
      forceRefresh,
      buildPrompt: () =>
        this.promptBuilder.buildDecisionPrompt(
          context,
          insight,
          userContext,
          (payload): payload is DecisionResponse =>
            this.decisionEngine.isDecisionResponse(payload),
          personalization ?? undefined,
        ),
      validator: (payload): payload is DecisionResponse =>
        this.isValidDecisionOutput(payload),
      normalize: (payload) => this.decisionEngine.normalizeDecision(payload),
      deterministicFallback: () =>
        this.decisionEngine.buildFallbackDecision(
          context,
          insight,
          userContext,
        ),
      staticSafeTemplate: () => this.staticSafeDecisionTemplate(context),
    });
  }

  private async resolveAiResponse<T extends object>(input: {
    simulationId: string;
    engineType: string;
    simulationInput: Record<string, unknown>;
    forceRefresh: boolean;
    buildPrompt: () => PromptContract<T>;
    validator: (payload: unknown) => payload is T;
    normalize?: (payload: T) => T;
    deterministicFallback: () => T;
    staticSafeTemplate: () => T;
  }): Promise<T> {
    if (!input.forceRefresh) {
      const cached = await this.aiConsistencyLock.get(
        input.simulationInput,
        input.engineType,
      );

      if (cached && input.validator(cached.responsePayload)) {
        return cached.responsePayload;
      }
    }

    const prompt = input.buildPrompt();
    const aiResult = await this.openAiClient.generateStructured(prompt);

    if (aiResult.ok && aiResult.data) {
      const normalized = input.normalize
        ? input.normalize(aiResult.data)
        : aiResult.data;

      if (input.validator(normalized)) {
        await this.aiConsistencyLock.set({
          simulationId: input.simulationId,
          simulationInput: input.simulationInput,
          engineType: input.engineType,
          responsePayload: normalized as unknown as Record<string, unknown>,
          reasoningSteps: [
            `Prompt version ${PROMPT_VERSION_LOCK} applied.`,
            'OpenAI structured response validated against strict schema.',
          ],
          tokenUsage: aiResult.tokenUsage,
          source: 'openai',
          latencyMs: aiResult.latencyMs,
        });

        return normalized;
      }
    }

    // Strict fallback step 3: deterministic fallback engine
    try {
      const deterministic = input.deterministicFallback();
      if (input.validator(deterministic)) {
        await this.aiConsistencyLock.set({
          simulationId: input.simulationId,
          simulationInput: input.simulationInput,
          engineType: input.engineType,
          responsePayload: deterministic as unknown as Record<string, unknown>,
          reasoningSteps: [
            'OpenAI response unavailable or invalid.',
            'Deterministic fallback engine response returned.',
          ],
          source: 'deterministic_fallback',
        });
        return deterministic;
      }
    } catch (error) {
      this.logger.warn(
        `Deterministic fallback failed for ${input.simulationId}: ${(error as Error).message}`,
      );
    }

    // Strict fallback step 4: static safe template
    const safeTemplate = input.staticSafeTemplate();
    await this.aiConsistencyLock.set({
      simulationId: input.simulationId,
      simulationInput: input.simulationInput,
      engineType: input.engineType,
      responsePayload: safeTemplate as unknown as Record<string, unknown>,
      reasoningSteps: [
        'Deterministic fallback unavailable or invalid.',
        'Static safe template returned as final guard.',
      ],
      source: 'static_safe_template',
    });

    return safeTemplate;
  }

  private async resolveGamificationEvent(
    context: SimulationContext,
  ): Promise<GamificationEventResponse> {
    const fallback: GamificationEventResponse = {
      xp_gain: 0,
      level_progress: 0,
      skill_update: { ...DEFAULT_SKILL_PROFILE },
      behavior_tag: DEFAULT_SKILL_PROFILE.behavior_pattern,
    };

    if (!context.created_by_id) {
      return fallback;
    }

    try {
      const state = await this.userIntelligenceProfile.getState(
        context.created_by_id,
      );
      const latestEvent = state.engagementState.last_event;

      if (latestEvent) {
        return {
          xp_gain: latestEvent.xp_gain,
          level_progress: latestEvent.level_progress,
          skill_update: latestEvent.skill_update,
          behavior_tag: latestEvent.behavior_tag,
        };
      }

      const progressionPreview = this.progressionEngine.compute(
        state.profile.xp,
        state.profile.level,
        state.skillProfile,
        0,
      );

      return {
        xp_gain: 0,
        level_progress: progressionPreview.levelProgress,
        skill_update: state.skillProfile,
        behavior_tag:
          state.profile.lastBehaviorTag ?? state.skillProfile.behavior_pattern,
      };
    } catch (error) {
      this.logger.warn(
        `Gamification fallback used for ${context.simulation_id}: ${(error as Error).message}`,
      );
      return fallback;
    }
  }

  private isValidDecisionOutput(
    response: unknown,
  ): response is DecisionResponse {
    return (
      this.decisionEngine.isDecisionResponse(response) &&
      response.alternatives.length >= 2 &&
      response.alternatives.length <= 3
    );
  }

  private normalizeSeries(values: number[], invert: boolean): number[] {
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) {
      return values.map(() => 50);
    }

    const normalized = values.map((value) => ((value - min) / range) * 100);
    return invert ? normalized.map((value) => 100 - value) : normalized;
  }

  private formatExpectedValue(value: number): string {
    if (!Number.isFinite(value)) return '0';

    if (Math.abs(value) >= 1_000) {
      return value.toFixed(2);
    }

    return value.toFixed(4);
  }

  private clamp(value: number, min = 0, max = 100): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  private async resolvePersonalization(
    userId: string | null,
  ): Promise<PromptPersonalization | null> {
    if (!userId) {
      return null;
    }

    try {
      const [progression, meta] = await Promise.all([
        this.progressionService.getPromptAdaptation(userId),
        this.aiMetaLearningService.getPromptTuning(userId),
      ]);

      return {
        explanationDepth: meta.explanationStyle ?? progression.explanationDepth,
        behaviorStyle: progression.behaviorStyle,
        track: progression.track,
        rankLabel: progression.rankLabel,
        clusterLabel: meta.clusterLabel,
        stagnationScore: meta.stagnationScore,
        promptDirectives: meta.promptDirectives,
      };
    } catch (error) {
      this.logger.warn(
        `Prompt personalization fallback for user ${userId}: ${(error as Error).message}`,
      );
      return null;
    }
  }

  private staticSafeInsightTemplate(
    context: SimulationContext,
  ): InsightResponse {
    return {
      summary: `Static safe insight template for ${context.simulation_type} simulation due to transient AI unavailability.`,
      key_findings: [
        'Core output was processed successfully.',
        'Use replay and deterministic checks before acting on high-impact decisions.',
      ],
      risk_analysis: {
        level: 'medium',
        explanation:
          'Risk level defaulted to medium under static-safe mode to avoid overconfident recommendations.',
      },
      opportunity_analysis: [
        'Run one additional deterministic replay before production action.',
      ],
      mathematical_interpretation:
        'Interpretation in static-safe mode is conservative and bounded.',
      confidence_score: 50,
      recommendation:
        'Proceed incrementally and validate with deterministic replay.',
    };
  }

  private staticSafeDecisionTemplate(
    context: SimulationContext,
  ): DecisionResponse {
    return {
      decision: `Static safe decision template for ${context.simulation_type}: choose the conservative execution path.`,
      reasoning: [
        'AI reasoning degraded to static-safe mode.',
        'Conservative path minimizes downside while maintaining optionality.',
        'Replay validation is required before irreversible actions.',
      ],
      risk_tradeoff:
        'Downside risk is minimized at the cost of reduced upside capture under static-safe mode.',
      alternatives: [
        {
          option: 'Conservative staged rollout',
          pros: ['Lower downside exposure', 'Higher control over uncertainty'],
          cons: ['Slower upside realization'],
        },
        {
          option: 'Balanced rollout with checkpoints',
          pros: ['Moderate upside participation', 'Controlled monitoring'],
          cons: ['Requires stricter operational discipline'],
        },
      ],
      confidence: 50,
    };
  }

  private staticSafeExplainTemplate(
    context: SimulationContext,
  ): ExplainResponse {
    return {
      summary: `Static safe explanation template for ${context.simulation_type} simulation.`,
      steps: [
        {
          step: 'Capture core output metrics',
          formula: 'Core Metrics = {expected, risk, stability}',
          interpretation:
            'Use stable output metrics first before deeper interpretation.',
        },
        {
          step: 'Apply deterministic replay check',
          formula: 'Replay Hash == Original Hash',
          interpretation:
            'If hashes match, interpretation confidence increases.',
        },
        {
          step: 'Decide under conservative bounds',
          formula: 'Decision = bounded-risk action with checkpoints',
          interpretation:
            'Choose reversible actions while AI reasoning is in safe mode.',
        },
      ],
      final_takeaway:
        'Static-safe mode prioritizes reliability over aggressive optimization.',
      confidence_score: 50,
    };
  }
}
