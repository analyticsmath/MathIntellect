import { SimulationType } from '../../simulations/entities/simulation.entity';
import { CompareResponse } from '../interfaces/ai-response.interface';
import { DecisionResponse } from '../interfaces/decision.interface';
import { InsightResponse } from '../interfaces/insight.interface';
import { AiOrchestratorService } from './ai-orchestrator.service';
import { CacheAiService } from './cache-ai.service';
import { SimulationContext } from './simulation-context.service';

const createContext = (
  simulationId: string,
  risk: number,
  returnScore: number,
  stability: number,
): SimulationContext => ({
  simulation_id: simulationId,
  created_by_id: null,
  simulation_name: `Simulation ${simulationId}`,
  simulation_type: SimulationType.MARKET,
  simulation_status: 'completed',
  parameters: {},
  execution_time_ms: 15,
  derived_metrics: {
    expected_value: 105,
    variance: 16,
    risk_score: risk,
    return_score: returnScore,
    stability_score: stability,
  },
  raw_output: {
    type: 'market',
    paths: [[100, 103, 105]],
    finalPrices: [105],
    expectedFinalPrice: 105,
    valueAtRisk95: 94,
    maxDrawdown: 0.11,
    annualizedReturn: 0.08,
    annualizedVolatility: 0.16,
    priceStats: {
      mean: 105,
      stdDev: 4,
      min: 100,
      max: 108,
      median: 105,
    },
    executionTimeMs: 15,
  },
});

describe('AiOrchestratorService', () => {
  let service: AiOrchestratorService;
  let cache: CacheAiService;

  const contexts: Record<string, SimulationContext> = {
    'sim-insight': createContext('sim-insight', 42, 62, 75),
    'sim-decision': createContext('sim-decision', 68, 55, 59),
    'sim-a': createContext('sim-a', 20, 80, 80),
    'sim-b': createContext('sim-b', 80, 60, 60),
  };

  const contextService = {
    getContext: jest.fn(async (simulationId: string) => {
      const context = contexts[simulationId];
      if (!context) throw new Error(`Missing context for ${simulationId}`);
      return context;
    }),
  };

  const promptBuilder = {
    promptVersion: 'v3.2-lock',
    buildInsightPrompt: jest.fn((_: SimulationContext, validator) => ({
      promptVersion: 'v3.2-lock',
      schemaName: 'insight_schema',
      schema: {},
      systemPrompt: 'system',
      userPrompt: 'user',
      validator,
    })),
    buildDecisionPrompt: jest.fn(
      (
        _: SimulationContext,
        __: InsightResponse,
        ___: Record<string, unknown> | undefined,
        validator,
      ) => ({
        promptVersion: 'v3.2-lock',
        schemaName: 'decision_schema',
        schema: {},
        systemPrompt: 'system',
        userPrompt: 'user',
        validator,
      }),
    ),
    buildExplainPrompt: jest.fn((_: SimulationContext, validator) => ({
      promptVersion: 'v3.2-lock',
      schemaName: 'explain_schema',
      schema: {},
      systemPrompt: 'system',
      userPrompt: 'user',
      validator,
    })),
  };

  const fallbackInsight: InsightResponse = {
    summary: 'Fallback insight',
    key_findings: ['k1', 'k2'],
    risk_analysis: {
      level: 'medium',
      explanation: 'fallback',
    },
    opportunity_analysis: ['o1'],
    mathematical_interpretation: 'math',
    confidence_score: 70,
    recommendation: 'recommendation',
  };

  const insightEngine = {
    isInsightResponse: jest.fn(() => true),
    normalizeInsight: jest.fn((input: InsightResponse) => input),
    buildFallbackInsight: jest.fn(() => fallbackInsight),
    isExplainResponse: jest.fn(() => true),
    normalizeExplain: jest.fn((input) => input),
    buildFallbackExplain: jest.fn(() => ({
      summary: 'fallback explain',
      steps: [
        { step: 's1', formula: 'f1', interpretation: 'i1' },
        { step: 's2', formula: 'f2', interpretation: 'i2' },
        { step: 's3', formula: 'f3', interpretation: 'i3' },
      ],
      final_takeaway: 'takeaway',
      confidence_score: 70,
    })),
  };

  const fallbackDecision: DecisionResponse = {
    decision: 'Fallback decision',
    reasoning: ['r1', 'r2', 'r3'],
    risk_tradeoff: 'downside and upside are balanced',
    alternatives: [
      { option: 'A', pros: ['p1'], cons: ['c1'] },
      { option: 'B', pros: ['p2'], cons: ['c2'] },
      { option: 'C', pros: ['p3'], cons: ['c3'] },
    ],
    confidence: 68,
  };

  const decisionEngine = {
    isDecisionResponse: jest.fn(() => true),
    normalizeDecision: jest.fn((input: DecisionResponse) => input),
    buildFallbackDecision: jest.fn(() => fallbackDecision),
  };

  const openAiClient = {
    generateStructured: jest.fn(),
  };

  const userIntelligenceProfile = {
    getState: jest.fn(async () => ({
      profile: { xp: 0, level: 1, lastBehaviorTag: 'balanced' },
      skillProfile: {
        skill_level: 28,
        risk_tolerance: 45,
        decision_speed: 42,
        strategy_depth: 34,
        consistency_score: 50,
        learning_curve: 'stable',
        behavior_pattern: 'balanced',
      },
      engagementState: { last_event: null },
    })),
  };

  const progressionEngine = {
    compute: jest.fn(() => ({ levelProgress: 0 })),
  };

  const progressionService = {
    getPromptAdaptation: jest.fn(async () => ({
      explanationDepth: 'balanced',
      behaviorStyle: 'neutral',
      track: 'strategist',
      rankLabel: 'Analyst',
    })),
  };

  const aiMetaLearningService = {
    getPromptTuning: jest.fn(async () => ({
      clusterLabel: 'balanced_explorer',
      explanationStyle: 'balanced',
      stagnationScore: 0,
      consistencyDrift: 0,
      personalityDrift: 0,
      preferredSimulationType: SimulationType.MONTE_CARLO,
      promptDirectives: {},
    })),
  };

  const aiConsistencyStore = new Map<string, { responsePayload: unknown }>();
  const aiConsistencyLock = {
    get: jest.fn(async (simulationInput: Record<string, unknown>, engineType: string) => {
      const key = `${engineType}:${JSON.stringify(simulationInput)}`;
      const hit = aiConsistencyStore.get(key);
      if (!hit) return null;
      return {
        cacheKey: key,
        inputHash: key,
        promptVersion: 'v3.2-lock',
        engineType,
        simulationId: null,
        responsePayload: hit.responsePayload as Record<string, unknown>,
        reasoningSteps: [],
        tokenUsage: null,
        source: 'cache',
        timestamp: new Date().toISOString(),
        latencyMs: null,
      };
    }),
    set: jest.fn(
      async ({
        simulationInput,
        engineType,
        responsePayload,
      }: {
        simulationInput: Record<string, unknown>;
        engineType: string;
        responsePayload: Record<string, unknown>;
      }) => {
        const key = `${engineType}:${JSON.stringify(simulationInput)}`;
        aiConsistencyStore.set(key, { responsePayload });
        return {
          cacheKey: key,
          inputHash: key,
          promptVersion: 'v3.2-lock',
          engineType,
          simulationId: null,
          responsePayload,
          reasoningSteps: [],
          tokenUsage: null,
          source: 'openai',
          timestamp: new Date().toISOString(),
          latencyMs: null,
        };
      },
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new CacheAiService();
    aiConsistencyStore.clear();

    service = new AiOrchestratorService(
      contextService as never,
      promptBuilder as never,
      insightEngine as never,
      decisionEngine as never,
      openAiClient as never,
      cache,
      userIntelligenceProfile as never,
      progressionEngine as never,
      progressionService as never,
      aiMetaLearningService as never,
      aiConsistencyLock as never,
    );
  });

  it('uses deterministic fallback and cache for insight generation', async () => {
    openAiClient.generateStructured.mockResolvedValue({
      ok: false,
      error: 'missing key',
      latencyMs: 0,
      attempts: 0,
    });

    const first = await service.generateInsight('sim-insight');
    const second = await service.generateInsight('sim-insight');

    expect(first).toEqual(fallbackInsight);
    expect(second).toEqual(fallbackInsight);
    expect(openAiClient.generateStructured).toHaveBeenCalledTimes(1);
    expect(insightEngine.buildFallbackInsight).toHaveBeenCalledTimes(1);
  });

  it('ensures decision output contains 2-3 alternatives and is cached', async () => {
    openAiClient.generateStructured.mockResolvedValue({
      ok: false,
      error: 'missing key',
      latencyMs: 0,
      attempts: 0,
    });

    const first = await service.generateDecision({ simulationId: 'sim-decision' });
    const second = await service.generateDecision({ simulationId: 'sim-decision' });

    expect(first.alternatives.length).toBeGreaterThanOrEqual(2);
    expect(first.alternatives.length).toBeLessThanOrEqual(3);
    expect(second).toEqual(first);
    // First call computes both insight + decision; second call is served from cache.
    expect(openAiClient.generateStructured).toHaveBeenCalledTimes(2);
  });

  it('ranks compare endpoint with weighted scoring (risk 40, return 40, stability 20)', async () => {
    openAiClient.generateStructured.mockResolvedValue({
      ok: false,
      error: 'missing key',
      latencyMs: 0,
      attempts: 0,
    });

    const response = await service.compareSimulations(['sim-a', 'sim-b']);

    expect(response.best_option).toBe('sim-a');
    expect(response.comparisons[0].simulation_id).toBe('sim-a');
    expect(response.comparisons[0].ranking_score).toBeGreaterThan(
      response.comparisons[1].ranking_score,
    );
  });

  it('caches compare response for repeated requests', async () => {
    openAiClient.generateStructured.mockResolvedValue({
      ok: false,
      error: 'missing key',
      latencyMs: 0,
      attempts: 0,
    });

    const first = await service.compareSimulations(['sim-a', 'sim-b']);
    const second = await service.compareSimulations(['sim-a', 'sim-b']);

    expect(second).toEqual(first);
    expect(contextService.getContext).toHaveBeenCalledTimes(2);
    expect((second as CompareResponse).comparisons.length).toBe(2);
  });
});
