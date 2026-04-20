import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Simulation,
  SimulationStatus,
  SimulationType,
} from './entities/simulation.entity';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { RunSimulationDto } from './dto/run-simulation.dto';
import { SimulationEngineService } from './engine/simulation-engine.service';
import { ResultsService } from '../results/results.service';
import {
  AnalyticsService,
  SimulationMetrics,
} from '../analytics/analytics.service';
import { SimulationEngineResult } from './interfaces/engine.interfaces';
import { RealtimeService } from '../realtime/realtime.service';
import { SimulationStreamService } from '../realtime/simulation-stream.service';
import {
  BehaviorAnalysisOutput,
  BehaviorAnalyzerService,
} from '../gabe/services/behavior-analyzer.service';
import {
  AdaptiveDifficultyResult,
  AdaptiveDifficultyService,
} from '../gabe/services/adaptive-difficulty.service';
import { SkillModelService } from '../gabe/services/skill-model.service';
import {
  XpComputationResult,
  XpIntelligenceService,
  XpSignalOutput,
} from '../gabe/services/xp-intelligence.service';
import {
  EngagementDirectives,
  EngagementEngineService,
} from '../gabe/services/engagement-engine.service';
import {
  ProgressionEngineService,
  ProgressionResult,
} from '../gabe/services/progression-engine.service';
import {
  SimulationAdaptationResult,
  SimulationAdapterService,
} from '../gabe/services/simulation-adapter.service';
import { UserIntelligenceProfileService } from '../gabe/services/user-intelligence-profile.service';
import {
  DEFAULT_ENGAGEMENT_STATE,
  LastGamificationEventState,
} from '../gabe/interfaces/engagement-state.interface';
import {
  DEFAULT_SKILL_PROFILE,
  SkillProfile,
} from '../gabe/interfaces/skill-profile.interface';
import { SkillEvalDto } from '../gabe/dto/skill-eval.dto';
import { EconomyService } from '../economy/economy.service';
import { ProgressionService } from '../progression/progression.service';
import { AiMetaLearningService } from '../ai-meta-learning/ai-meta-learning.service';
import { AiBehaviorGraphService } from '../ai-meta-learning/ai-behavior-graph.service';
import { SimulationSnapshotService } from '../determinism/simulation-snapshot.service';
import { EngineSafetyWrapperService } from '../engine-safety/engine-safety-wrapper.service';
import { ObservabilityService } from '../observability/observability.service';

export interface GabeRunSummary {
  behavior: BehaviorAnalysisOutput;
  adaptive_difficulty: {
    difficulty_score: number;
    mode_label: string;
    rationale: string[];
    complexity_features: string[];
  };
  xp_intelligence: {
    xp_gain: number;
    novelty_score: number;
    improvement_score: number;
    repetition_ratio: number;
    low_effort_score: number;
    components: Omit<XpComputationResult, 'xpGain'>;
  };
  progression: {
    level: number;
    level_title: string;
    level_progress: number;
    level_delta: number;
    xp: number;
    unlocked_features: string[];
  };
  engagement: EngagementDirectives & {
    engagement_score: number;
    learning_velocity: number;
  };
  skill_profile: SkillProfile;
  simulation_adaptation: SimulationAdaptationResult;
}

export interface IntelligenceLoopOutput {
  xpGain: number;
  skillDelta: number;
  intelligenceRankChange: number;
  unlocks: string[];
  behaviorShift: string;
  nextRecommendedSimulation: SimulationType;
}

@Injectable()
export class SimulationsService implements OnModuleInit {
  private readonly logger = new Logger(SimulationsService.name);

  /** On startup: mark any RUNNING or PENDING simulations as FAILED.
   *  These were in-flight when the server last crashed/restarted. */
  async onModuleInit() {
    const result = await this.simulationsRepo.update(
      { status: In([SimulationStatus.RUNNING, SimulationStatus.PENDING]) },
      { status: SimulationStatus.FAILED },
    );
    if (result.affected && result.affected > 0) {
      this.logger.warn(
        `Marked ${result.affected} stale simulation(s) as FAILED on startup`,
      );
    }
  }

  constructor(
    @InjectRepository(Simulation)
    private readonly simulationsRepo: Repository<Simulation>,
    private readonly engineService: SimulationEngineService,
    private readonly resultsService: ResultsService,
    private readonly analyticsService: AnalyticsService,
    private readonly realtimeService: RealtimeService,
    private readonly simulationStreamService: SimulationStreamService,
    private readonly behaviorAnalyzer: BehaviorAnalyzerService,
    private readonly adaptiveDifficulty: AdaptiveDifficultyService,
    private readonly skillModel: SkillModelService,
    private readonly xpIntelligence: XpIntelligenceService,
    private readonly engagementEngine: EngagementEngineService,
    private readonly progressionEngine: ProgressionEngineService,
    private readonly simulationAdapter: SimulationAdapterService,
    private readonly userIntelligenceProfile: UserIntelligenceProfileService,
    private readonly economyService: EconomyService,
    private readonly progressionService: ProgressionService,
    private readonly aiMetaLearningService: AiMetaLearningService,
    private readonly aiBehaviorGraphService: AiBehaviorGraphService,
    private readonly snapshotService: SimulationSnapshotService,
    private readonly engineSafetyWrapper: EngineSafetyWrapperService,
    private readonly observabilityService: ObservabilityService,
  ) {}

  // ─── Basic CRUD ─────────────────────────────────────────────────────────────

  async create(dto: CreateSimulationDto): Promise<Simulation> {
    const simulation = this.simulationsRepo.create({
      name: dto.name,
      description: dto.description,
      type: dto.type,
      parameters: dto.parameters,
      status: SimulationStatus.PENDING,
      ...(dto.createdById ? { createdBy: { id: dto.createdById } } : {}),
    });
    return this.simulationsRepo.save(simulation);
  }

  async findAll(): Promise<Simulation[]> {
    return this.simulationsRepo.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
      cache: 3_000, // ms — reduces repeated DB hits on dashboard load
    });
  }

  async findById(id: string): Promise<Simulation> {
    const simulation = await this.simulationsRepo.findOne({
      where: { id },
      relations: ['createdBy', 'strategies', 'results'],
    });
    if (!simulation) throw new NotFoundException(`Simulation ${id} not found`);
    return simulation;
  }

  async updateStatus(
    id: string,
    status: SimulationStatus,
  ): Promise<Simulation> {
    const simulation = await this.findById(id);
    simulation.status = status;
    return this.simulationsRepo.save(simulation);
  }

  async remove(id: string): Promise<void> {
    const simulation = await this.findById(id);
    await this.simulationsRepo.remove(simulation);
  }

  // ─── Run simulation — full execution flow ────────────────────────────────────

  async run(dto: RunSimulationDto): Promise<{
    simulation: Simulation;
    result: SimulationEngineResult;
    metrics: SimulationMetrics;
    gabe: GabeRunSummary;
    intelligenceLoop: IntelligenceLoopOutput;
    execution: {
      status: 'ok' | 'degraded';
      fallbackUsed: boolean;
      safeOutput?: Record<string, unknown>;
    };
    status: 'ok' | 'degraded';
    fallbackUsed: boolean;
    safeOutput?: Record<string, unknown>;
  }> {
    let currentSkillProfile: SkillProfile = { ...DEFAULT_SKILL_PROFILE };
    let currentEngagementState = { ...DEFAULT_ENGAGEMENT_STATE };
    let currentXp = 0;
    let currentLevel = 1;
    let progressionState = null as Awaited<
      ReturnType<ProgressionService['getOrCreate']>
    > | null;
    let complexityMultiplier = 1;

    if (dto.createdById) {
      const state = await this.userIntelligenceProfile.getState(dto.createdById);
      currentSkillProfile = state.skillProfile;
      currentEngagementState = state.engagementState;
      currentXp = state.profile.xp;
      currentLevel = state.profile.level;
      progressionState = await this.progressionService.getOrCreate(dto.createdById);
      complexityMultiplier = this.economyService.computeComplexityMultiplier(
        currentLevel,
        currentXp,
      );
    }

    const behavior = this.behaviorAnalyzer.analyze(
      dto.behaviorSignals,
      currentEngagementState,
    );

    const adaptiveDifficulty = this.adaptiveDifficulty.adapt(
      {
        simulationType: dto.type,
        parameters: dto.parameters,
      },
      currentSkillProfile,
      behavior,
    );

    let effectiveParameters = adaptiveDifficulty.adaptedParameters;

    if (progressionState) {
      effectiveParameters = this.progressionService.adaptSimulationParameters(
        dto.type,
        effectiveParameters,
        progressionState,
        complexityMultiplier,
      );
    }

    // 1. Persist simulation record (status = PENDING -> RUNNING once queued)
    const simulation = await this.simulationsRepo.save(
      this.simulationsRepo.create({
        name: dto.name,
        description: dto.description,
        type: dto.type,
        parameters: {
          ...effectiveParameters,
          gabe_user_input: dto.parameters,
        },
        status: SimulationStatus.PENDING,
        ...(dto.createdById ? { createdBy: { id: dto.createdById } } : {}),
      }),
    );

    const resolvedSeed = this.resolveDeterministicSeed({
      simulationId: simulation.id,
      simulationType: dto.type,
      userId: dto.createdById,
      effectiveParameters,
      inputParameters: dto.parameters,
    });
    effectiveParameters = {
      ...effectiveParameters,
      seed: resolvedSeed,
    };

    simulation.parameters = {
      ...effectiveParameters,
      gabe_user_input: dto.parameters,
    };
    simulation.status = SimulationStatus.RUNNING;
    await this.simulationsRepo.save(simulation);

    await this.snapshotService.snapshot({
      simulationId: simulation.id,
      userId: dto.createdById,
      simulationType: dto.type,
      engineType: dto.type,
      seed: resolvedSeed,
      inputParametersSnapshot: effectiveParameters,
      effectiveParameters,
    });

    const ts = () => new Date().toISOString();
    const executionSteps: Array<Record<string, unknown>> = [];

    this.simulationStreamService.emitQueued(simulation.id, dto.type);
    this.simulationStreamService.emitExecutionStart(
      simulation.id,
      dto.type,
      String(resolvedSeed),
    );

    // 2. Emit simulation:started
    this.realtimeService.emitStarted({
      simulationId: simulation.id,
      type: dto.type,
      name: dto.name,
      timestamp: ts(),
    });

    try {
      // 3. Execute engine with progress callback
      this.logger.log(`Running ${dto.type} simulation: ${simulation.id}`);

      const safeExecution = await this.engineSafetyWrapper.execute(
        dto.type,
        () =>
          this.engineService.execute(
            dto.type,
            effectiveParameters,
            (progress, partial) => {
              executionSteps.push({
                event: 'engine_step',
                progress,
                timestamp: ts(),
                partial: partial ?? null,
              });

              this.realtimeService.emitProgress({
                simulationId: simulation.id,
                progress,
                message: `${progress}% complete`,
                partial,
              });

              this.simulationStreamService.emitEngineStep(
                simulation.id,
                dto.type,
                progress,
                partial,
              );
            },
            {
              deterministic: true,
              seed: resolvedSeed,
            },
          ),
        effectiveParameters,
      );
      const engineResult = safeExecution.result;

      if (safeExecution.status === 'degraded') {
        this.simulationStreamService.emitAiThinking(
          simulation.id,
          'Engine execution degraded. Returning deterministic safe output.',
        );
      }

      // 4. Store compressed result payload (keeps heavy arrays bounded)
      const compressedEngineResult = this.compressResultForStorage(engineResult);
      await this.resultsService.create({
        simulationId: simulation.id,
        outcomeData: compressedEngineResult as unknown as Record<string, unknown>,
        executionTime: engineResult.executionTimeMs,
      });

      // 5. Auto-trigger analytics
      const numericValues = this.extractNumericValues(engineResult);
      const metrics = this.analyticsService.computeMetrics(numericValues);

      if (numericValues.length > 0) {
        await this.analyticsService.recordMetrics(simulation.id, numericValues);
      }

      const riskScore = this.estimateRiskScore(engineResult, metrics);
      const accuracyScore = this.skillModel.estimateAccuracyScore(
        metrics,
        engineResult.executionTimeMs,
      );

      const provisionalPerformance = this.estimateProvisionalPerformance(
        accuracyScore,
        adaptiveDifficulty.difficultyScore,
        behavior,
      );

      let xpSignals = this.xpIntelligence.deriveSignals({
        parameters: effectiveParameters,
        difficultyScore: adaptiveDifficulty.difficultyScore,
        riskScore,
        accuracyScore,
        performanceScore: provisionalPerformance,
        behavior,
        engagementState: currentEngagementState,
      });

      const skillEval: SkillEvalDto = {
        simulationType: dto.type,
        executionTimeMs: engineResult.executionTimeMs,
        difficultyScore: adaptiveDifficulty.difficultyScore,
        noveltyScore: xpSignals.noveltyScore,
        improvementScore: xpSignals.improvementScore,
        riskScore,
        accuracyScore,
        behavior: {
          engagement_score: behavior.engagement_score,
          learning_velocity: behavior.learning_velocity,
          behavior_type: behavior.behavior_type,
        },
        outcomeMetrics: {
          mean: metrics.mean,
          variance: metrics.variance,
          min: metrics.min,
          max: metrics.max,
          median: metrics.median,
        },
      };

      const skillResult = this.skillModel.evaluate(
        currentSkillProfile,
        skillEval,
        behavior,
        currentEngagementState,
      );

      xpSignals = this.xpIntelligence.deriveSignals({
        parameters: effectiveParameters,
        difficultyScore: adaptiveDifficulty.difficultyScore,
        riskScore,
        accuracyScore,
        performanceScore: skillResult.performanceScore,
        behavior,
        engagementState: currentEngagementState,
      });

      const baseXpOutcome = this.xpIntelligence.computeXp(
        adaptiveDifficulty.difficultyScore,
        riskScore,
        accuracyScore,
        xpSignals,
      );

      const economyReward = this.economyService.computeReward({
        baseXp: baseXpOutcome.xpGain,
        noveltyScore: xpSignals.noveltyScore,
        riskScore,
        accuracyScore,
        improvementScore: xpSignals.improvementScore,
        repetitionRatio: xpSignals.repetitionRatio,
        difficultyScore: adaptiveDifficulty.difficultyScore,
      });

      const xpOutcome: XpComputationResult = {
        ...baseXpOutcome,
        xpGain: economyReward.adjustedXpGain,
      };

      const progression = this.progressionEngine.compute(
        currentXp,
        currentLevel,
        skillResult.updatedProfile,
        xpOutcome.xpGain,
      );

      const eventPreview: LastGamificationEventState = {
        xp_gain: economyReward.adjustedXpGain,
        level_progress: progression.levelProgress,
        skill_update: skillResult.updatedProfile,
        behavior_tag: behavior.behavior_type,
        timestamp: ts(),
      };

      const engagementResult = this.engagementEngine.update({
        previousState: currentEngagementState,
        behavior,
        xpGain: economyReward.adjustedXpGain,
        parameterHash: xpSignals.parameterHash,
        performanceScore: skillResult.performanceScore,
        repetitionRatio: xpSignals.repetitionRatio,
        lowEffortScore: xpSignals.lowEffortScore,
        eventPreview,
      });

      let evolutionResult: Awaited<
        ReturnType<ProgressionService['evolveAfterSimulation']>
      > | null = null;

      const simulationAdaptation = this.simulationAdapter.build({
        simulationType: dto.type,
        modeLabel: adaptiveDifficulty.modeLabel,
        skillProfile: skillResult.updatedProfile,
        behavior,
        engagement: engagementResult.directives,
        difficultyScore: adaptiveDifficulty.difficultyScore,
      });

      if (dto.createdById) {
        try {
          evolutionResult = await this.progressionService.evolveAfterSimulation(
            dto.createdById,
            {
              simulationType: dto.type,
              levelAfter: progression.levelAfter,
              xpGain: economyReward.adjustedXpGain,
              behaviorType: behavior.behavior_type,
              performanceScore: skillResult.performanceScore,
            },
          );

          await this.aiMetaLearningService.ingestSimulationRun(dto.createdById, {
            simulationType: dto.type,
            behaviorType: behavior.behavior_type,
            learningVelocity: behavior.learning_velocity,
            noveltyScore: xpSignals.noveltyScore,
            repetitionRatio: xpSignals.repetitionRatio,
            riskScore,
            accuracyScore,
            performanceScore: skillResult.performanceScore,
            parameters: effectiveParameters,
          });

          await this.aiBehaviorGraphService.ingest(dto.createdById, {
            simulationType: dto.type,
            behaviorType: behavior.behavior_type,
            riskScore,
            explorationRatio: xpSignals.repetitionRatio < 0.5 ? 0.75 : 0.25,
            performanceScore: skillResult.performanceScore,
            learningVelocity: behavior.learning_velocity,
            engagementScore: behavior.engagement_score,
            skillLevel: skillResult.updatedProfile.skill_level,
          });

          await this.economyService.recordTransaction({
            userId: dto.createdById,
            simulationId: simulation.id,
            baseXp: baseXpOutcome.xpGain,
            reward: economyReward,
            metadata: {
              simulationType: dto.type,
              noveltyScore: xpSignals.noveltyScore,
              repetitionRatio: xpSignals.repetitionRatio,
              riskScore,
              accuracyScore,
            },
          });
        } catch (phase5Error) {
          this.logger.warn(
            `Phase 5 evolution persistence skipped for simulation ${simulation.id}: ${(phase5Error as Error).message}`,
          );
        }
      }

      this.simulationStreamService.emitAiThinking(
        simulation.id,
        'Synthesizing AI behavior profile and progression updates.',
      );

      // 6. Mark completed
      simulation.status = SimulationStatus.COMPLETED;
      await this.simulationsRepo.save(simulation);

      if (dto.createdById) {
        try {
          await this.userIntelligenceProfile.persistSimulationUpdate({
            userId: dto.createdById,
            skillProfile: skillResult.updatedProfile,
            engagementState: engagementResult.updatedState,
            xpAfter: progression.xpAfter,
            levelAfter: progression.levelAfter,
            behaviorTag: behavior.behavior_type,
          });
        } catch (persistErr) {
          this.logger.warn(
            `GABE state persistence skipped for simulation ${simulation.id}: ${(persistErr as Error).message}`,
          );
        }
      }

      this.logger.log(
        `Simulation ${simulation.id} completed in ${engineResult.executionTimeMs}ms`,
      );

      this.simulationStreamService.emitFinalizing(simulation.id, dto.type);

      // 7. Emit simulation:completed
      this.realtimeService.emitCompleted({
        simulationId: simulation.id,
        executionTimeMs: engineResult.executionTimeMs,
        timestamp: ts(),
      });

      await this.snapshotService.finalizeSnapshot({
        simulationId: simulation.id,
        executionSteps,
        finalOutput: engineResult as unknown as Record<string, unknown>,
      });

      await this.observabilityService.logExecution({
        simulationId: simulation.id,
        userId: dto.createdById,
        engineType: dto.type,
        executionTimeMs: safeExecution.executionTimeMs,
        status: safeExecution.status === 'ok' ? 'completed' : 'degraded',
        success: safeExecution.status === 'ok',
        fallbackUsed: safeExecution.fallbackUsed,
        failureReason: safeExecution.violation?.message,
        safetyTriggered: safeExecution.status === 'degraded',
        inputSizeBytes: safeExecution.inputSizeBytes,
        outputSizeBytes: safeExecution.outputSizeBytes,
        metadata: {
          deterministic: true,
          seed: String(resolvedSeed),
          violation: safeExecution.violation,
        },
      });

      return {
        simulation,
        result: engineResult,
        metrics,
        gabe: this.buildGabeSummary(
          behavior,
          adaptiveDifficulty,
          xpSignals,
          xpOutcome,
          progression,
          engagementResult.directives,
          skillResult.updatedProfile,
          simulationAdaptation,
        ),
        intelligenceLoop: this.buildIntelligenceLoop(
          dto.type,
          economyReward,
          evolutionResult,
        ),
        execution: {
          status: safeExecution.status,
          fallbackUsed: safeExecution.fallbackUsed,
          safeOutput:
            safeExecution.safeOutput as unknown as Record<string, unknown>,
        },
        status: safeExecution.status,
        fallbackUsed: safeExecution.fallbackUsed,
        safeOutput:
          safeExecution.safeOutput as unknown as Record<string, unknown>,
      };
    } catch (err) {
      simulation.status = SimulationStatus.FAILED;
      await this.simulationsRepo.save(simulation);

      const errorMsg = (err as Error).message;
      this.logger.error(`Simulation ${simulation.id} failed: ${errorMsg}`);

      this.simulationStreamService.emitFinalizing(simulation.id, dto.type);
      this.simulationStreamService.emitSystemWarning(
        simulation.id,
        'critical',
        'ENGINE_FAILURE',
        errorMsg,
      );

      await this.observabilityService.logExecution({
        simulationId: simulation.id,
        userId: dto.createdById,
        engineType: dto.type,
        executionTimeMs: 0,
        status: 'failed',
        success: false,
        failureReason: errorMsg,
        fallbackUsed: false,
        safetyTriggered: true,
        metadata: {
          deterministic: true,
        },
      });

      // Emit simulation:error
      this.realtimeService.emitError({
        simulationId: simulation.id,
        error: errorMsg,
        timestamp: ts(),
      });

      throw err;
    }
  }

  // ─── Extract representative numeric values for analytics ────────────────────

  private extractNumericValues(result: SimulationEngineResult): number[] {
    switch (result.type) {
      case 'monte_carlo':
        return result.samples.length > 0
          ? result.samples
          : [result.expectedValue, result.variance, result.stdDev];

      case 'game_theory':
        return Object.values(result.expectedPayoffs);

      case 'market':
        return result.finalPrices;

      case 'conflict':
        return result.agentResults.map((a) => a.finalResources);

      default:
        return [];
    }
  }

  private estimateRiskScore(
    result: SimulationEngineResult,
    metrics: SimulationMetrics,
  ): number {
    switch (result.type) {
      case 'market':
        return this.clamp(
          result.maxDrawdown * 60 + result.annualizedVolatility * 85,
          0,
          100,
        );
      case 'monte_carlo': {
        const volatility = Math.sqrt(Math.max(result.variance, 0));
        const spread = Math.abs(result.percentile95 - result.percentile5);
        return this.clamp(volatility * 0.9 + spread * 0.22, 0, 100);
      }
      case 'game_theory': {
        const payoffs = Object.values(result.expectedPayoffs);
        if (payoffs.length === 0) return 50;
        const max = Math.max(...payoffs);
        const min = Math.min(...payoffs);
        const spread = max - min;
        return this.clamp(38 + spread * 8 - result.nashEquilibria.length * 6, 0, 100);
      }
      case 'conflict':
        return this.clamp(
          (1 - result.cooperationRate) * 70 +
            Math.max(
              0,
              result.agentResults.reduce(
                (sum, item) => sum + item.losses,
                0,
              ) / Math.max(1, result.agentResults.length),
            ) *
              0.25,
          0,
          100,
        );
      default:
        return this.clamp(Math.sqrt(Math.max(metrics.variance, 0)) * 0.7, 0, 100);
    }
  }

  private estimateProvisionalPerformance(
    accuracyScore: number,
    difficultyScore: number,
    behavior: BehaviorAnalysisOutput,
  ): number {
    return this.clamp(
      accuracyScore * 0.45 +
        difficultyScore * 0.22 +
        behavior.learning_velocity * 0.2 +
        behavior.engagement_score * 0.13,
      0,
      100,
    );
  }

  private buildGabeSummary(
    behavior: BehaviorAnalysisOutput,
    adaptiveDifficulty: AdaptiveDifficultyResult,
    xpSignals: XpSignalOutput,
    xpOutcome: XpComputationResult,
    progression: ProgressionResult,
    engagementDirectives: EngagementDirectives,
    skillProfile: SkillProfile,
    simulationAdaptation: SimulationAdaptationResult,
  ): GabeRunSummary {
    const { xpGain: _omit, ...xpComponents } = xpOutcome;

    return {
      behavior,
      adaptive_difficulty: {
        difficulty_score: adaptiveDifficulty.difficultyScore,
        mode_label: adaptiveDifficulty.modeLabel,
        rationale: adaptiveDifficulty.rationale,
        complexity_features: adaptiveDifficulty.complexityFeatures,
      },
      xp_intelligence: {
        xp_gain: xpOutcome.xpGain,
        novelty_score: xpSignals.noveltyScore,
        improvement_score: xpSignals.improvementScore,
        repetition_ratio: xpSignals.repetitionRatio,
        low_effort_score: xpSignals.lowEffortScore,
        components: xpComponents,
      },
      progression: {
        level: progression.levelAfter,
        level_title: progression.levelTitle,
        level_progress: progression.levelProgress,
        level_delta: progression.levelDelta,
        xp: progression.xpAfter,
        unlocked_features: progression.unlockedFeatures,
      },
      engagement: {
        ...engagementDirectives,
        engagement_score: behavior.engagement_score,
        learning_velocity: behavior.learning_velocity,
      },
      skill_profile: skillProfile,
      simulation_adaptation: simulationAdaptation,
    };
  }

  private buildIntelligenceLoop(
    simulationType: SimulationType,
    economyReward: {
      adjustedXpGain: number;
      skillDelta: number;
    },
    evolutionResult: Awaited<
      ReturnType<ProgressionService['evolveAfterSimulation']>
    > | null,
  ): IntelligenceLoopOutput {
    return {
      xpGain: economyReward.adjustedXpGain,
      skillDelta: Number(economyReward.skillDelta.toFixed(3)),
      intelligenceRankChange: evolutionResult?.intelligenceRankChange ?? 0,
      unlocks: evolutionResult?.unlocks ?? [],
      behaviorShift: evolutionResult?.behaviorShift ?? 'maintain:balanced',
      nextRecommendedSimulation:
        evolutionResult?.nextRecommendedSimulation ?? simulationType,
    };
  }

  private compressResultForStorage(
    result: SimulationEngineResult,
  ): SimulationEngineResult {
    switch (result.type) {
      case 'monte_carlo': {
        const samples =
          result.samples.length > 3_000
            ? this.sampleArray(result.samples, 3_000)
            : result.samples;
        return {
          ...result,
          samples,
          compression:
            samples.length === result.samples.length
              ? result.compression
              : {
                  compressed: true,
                  strategy: 'sampled_arrays',
                  originalSize: result.samples.length,
                  retainedSize: samples.length,
                },
        };
      }
      case 'market': {
        const finalPrices =
          result.finalPrices.length > 4_000
            ? this.sampleArray(result.finalPrices, 4_000)
            : result.finalPrices;
        const paths =
          result.paths.length > 140 ? this.sampleArray(result.paths, 140) : result.paths;

        return {
          ...result,
          finalPrices,
          paths,
          compression:
            finalPrices.length === result.finalPrices.length &&
            paths.length === result.paths.length
              ? result.compression
              : {
                  compressed: true,
                  strategy: 'sampled_arrays',
                  originalSize: result.finalPrices.length + result.paths.length,
                  retainedSize: finalPrices.length + paths.length,
                },
        };
      }
      case 'conflict': {
        const roundHistory =
          result.roundHistory.length > 700
            ? this.sampleArray(result.roundHistory, 700)
            : result.roundHistory;

        return {
          ...result,
          roundHistory,
          compression:
            roundHistory.length === result.roundHistory.length
              ? result.compression
              : {
                  compressed: true,
                  strategy: 'sampled_arrays',
                  originalSize: result.roundHistory.length,
                  retainedSize: roundHistory.length,
                },
        };
      }
      case 'game_theory': {
        const payoffMatrix =
          result.payoffMatrix.length > 500
            ? this.sampleArray(result.payoffMatrix, 500)
            : result.payoffMatrix;
        return {
          ...result,
          payoffMatrix,
          compression:
            payoffMatrix.length === result.payoffMatrix.length
              ? result.compression
              : {
                  compressed: true,
                  strategy: 'sampled_arrays',
                  originalSize: result.payoffMatrix.length,
                  retainedSize: payoffMatrix.length,
                },
        };
      }
      default:
        return result;
    }
  }

  private sampleArray<T>(items: T[], targetSize: number): T[] {
    if (items.length <= targetSize) {
      return items;
    }

    const step = Math.max(1, Math.floor(items.length / targetSize));
    const sampled = items.filter((_, index) => index % step === 0);
    return sampled.slice(0, targetSize);
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  private resolveDeterministicSeed(input: {
    simulationId: string;
    simulationType: SimulationType;
    userId?: string;
    effectiveParameters: Record<string, unknown>;
    inputParameters: Record<string, unknown>;
  }): number {
    const effectiveSeed = this.asFiniteNumber(input.effectiveParameters.seed);
    if (effectiveSeed !== null) {
      return Math.max(0, Math.floor(effectiveSeed));
    }

    const inputSeed = this.asFiniteNumber(input.inputParameters.seed);
    if (inputSeed !== null) {
      return Math.max(0, Math.floor(inputSeed));
    }

    return this.snapshotService.generateSeed({
      simulationId: input.simulationId,
      userId: input.userId,
      simulationType: input.simulationType,
      parameters: input.effectiveParameters,
    });
  }

  private asFiniteNumber(value: unknown): number | null {
    const parsed =
      typeof value === 'string' ? Number.parseFloat(value) : Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return parsed;
  }
}
