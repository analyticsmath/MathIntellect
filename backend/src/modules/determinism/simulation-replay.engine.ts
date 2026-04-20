import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SimulationType } from '../simulations/entities/simulation.entity';
import {
  ConflictParams,
  GameTheoryParams,
  MarketParams,
  MonteCarloParams,
  SimulationEngineResult,
} from '../simulations/interfaces/engine.interfaces';
import { ConflictEngine } from '../simulations/engine/conflict.engine';
import { GameTheoryEngine } from '../simulations/engine/game-theory.engine';
import { MarketEngine } from '../simulations/engine/market.engine';
import { MonteCarloEngine } from '../simulations/engine/monte-carlo.engine';
import {
  PROMPT_VERSION_LOCK,
  SimulationSnapshotService,
} from './simulation-snapshot.service';
import { SimulationReplay } from './entities/simulation-replay.entity';
import { DeterminismViolationError } from './errors/determinism-violation.error';

export interface ReplayStep {
  step: number;
  event: string;
  progress: number;
  timestamp: string;
  partial?: Record<string, unknown>;
}

export interface ReplayRunInput {
  simulationId: string;
  seed?: string;
}

export interface ReplayResult {
  simulationId: string;
  engineType: string;
  seed: string;
  deterministicOptions: {
    deterministic: true;
    seed: string;
  };
  promptVersion: string;
  parameterHash: string;
  replayedAt: string;
  executionSteps: ReplayStep[];
  originalOutputHash: string;
  replayOutputHash: string;
  deterministicMatch: boolean;
  output: SimulationEngineResult;
}

@Injectable()
export class SimulationReplayEngine {
  private readonly logger = new Logger(SimulationReplayEngine.name);

  constructor(
    private readonly snapshotService: SimulationSnapshotService,
    private readonly monteCarloEngine: MonteCarloEngine,
    private readonly gameTheoryEngine: GameTheoryEngine,
    private readonly marketEngine: MarketEngine,
    private readonly conflictEngine: ConflictEngine,
  ) {}

  async replay(simulationId: string): Promise<ReplayResult> {
    const snapshot = await this.snapshotService.findBySimulation(simulationId);

    if (!snapshot) {
      throw new NotFoundException(
        `No replay snapshot found for simulation ${simulationId}. ` +
          'Only runs captured with Phase 6 determinism are replayable.',
      );
    }

    return this.executeReplay(snapshot);
  }

  async replayRun(input: ReplayRunInput): Promise<ReplayResult> {
    const snapshot = await this.snapshotService.findBySimulation(
      input.simulationId,
    );

    if (!snapshot) {
      throw new NotFoundException(
        `No replay snapshot found for simulation ${input.simulationId}.`,
      );
    }

    const replaySnapshot: SimulationReplay = {
      ...snapshot,
      seed: input.seed ?? snapshot.seed,
      deterministicOptions: this.snapshotService.buildDeterministicOptions(
        input.seed ?? snapshot.seed,
      ),
    };

    return this.executeReplay(replaySnapshot);
  }

  private async executeReplay(
    snapshot: SimulationReplay,
  ): Promise<ReplayResult> {
    const seed = String(snapshot.seed);
    const deterministicOptions =
      this.snapshotService.buildDeterministicOptions(seed);

    const engineType = snapshot.engineType ?? snapshot.simulationType;
    const replayParams = {
      ...(snapshot.inputParametersSnapshot ??
        snapshot.effectiveParameters ??
        {}),
      deterministic: true,
      seed: Number(seed),
    } as Record<string, unknown>;

    const executionSteps: ReplayStep[] = [];
    const output = await this.executeEngine(
      engineType,
      replayParams,
      executionSteps,
    );

    const normalizedReplayOutput =
      this.snapshotService.normalizeOutputForHash(output);
    const replayOutputHash = this.snapshotService.hashPayload(
      normalizedReplayOutput,
    );
    const originalOutputHash =
      snapshot.finalOutputHash ??
      snapshot.checksum ??
      this.snapshotService.hashPayload(
        this.snapshotService.normalizeOutputForHash(
          snapshot.originalOutput ?? {},
        ),
      );

    if (replayOutputHash !== originalOutputHash) {
      throw new DeterminismViolationError(
        snapshot.simulationId,
        originalOutputHash,
        replayOutputHash,
      );
    }

    await this.snapshotService.finalizeSnapshot({
      simulationId: snapshot.simulationId,
      executionSteps,
      finalOutput: output as unknown as Record<string, unknown>,
      promptVersion: snapshot.promptVersion || PROMPT_VERSION_LOCK,
    });

    this.logger.log(
      `Deterministic replay verified for ${snapshot.simulationId} (hash=${replayOutputHash.slice(0, 12)}...)`,
    );

    return {
      simulationId: snapshot.simulationId,
      engineType,
      seed,
      deterministicOptions,
      promptVersion: snapshot.promptVersion || PROMPT_VERSION_LOCK,
      parameterHash: snapshot.parameterHash,
      replayedAt: new Date().toISOString(),
      executionSteps,
      originalOutputHash,
      replayOutputHash,
      deterministicMatch: true,
      output,
    };
  }

  private async executeEngine(
    engineType: string,
    params: Record<string, unknown>,
    executionSteps: ReplayStep[],
  ): Promise<SimulationEngineResult> {
    let step = 0;
    const onProgress = (
      progress: number,
      partial?: Record<string, unknown>,
    ) => {
      step += 1;
      executionSteps.push({
        step,
        event: 'engine_step',
        progress,
        partial,
        timestamp: new Date().toISOString(),
      });
    };

    switch (engineType as SimulationType) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return this.monteCarloEngine.run(
          params as unknown as MonteCarloParams,
          onProgress,
        );
      case SimulationType.GAME_THEORY:
        return this.gameTheoryEngine.run(
          params as unknown as GameTheoryParams,
          onProgress,
        );
      case SimulationType.MARKET:
        return this.marketEngine.run(
          params as unknown as MarketParams,
          onProgress,
        );
      case SimulationType.CONFLICT:
        return this.conflictEngine.run(
          params as unknown as ConflictParams,
          onProgress,
        );
      default:
        throw new BadRequestException(
          `Unsupported replay engine type: ${engineType}`,
        );
    }
  }
}
