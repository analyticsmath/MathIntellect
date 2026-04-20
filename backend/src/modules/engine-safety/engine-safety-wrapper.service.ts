import { Injectable, Logger } from '@nestjs/common';

export const ENGINE_TIMEOUT_MS = 5_000;
export const ENGINE_MAX_ITERATIONS = 2_000_000;
export const DEFAULT_ENGINE_MEMORY_CAP_MB = 256;

export interface SafetyViolation {
  type:
    | 'timeout'
    | 'iteration_limit'
    | 'input_invalid'
    | 'runtime_error'
    | 'memory_cap';
  message: string;
  engineType: string;
}

export interface SafeExecutionResult<T> {
  result: T;
  status: 'ok' | 'degraded';
  fallbackUsed: boolean;
  safeOutput: T | null;
  violation: SafetyViolation | null;
  executionTimeMs: number;
  inputSizeBytes: number;
  outputSizeBytes: number;
  memoryUsageBytes: number;
}

const FALLBACK_RESULTS: Record<string, Record<string, unknown>> = {
  monte_carlo: {
    type: 'monte_carlo',
    iterations: 1,
    samples: [0.5],
    expectedValue: 0.5,
    variance: 0,
    stdDev: 0,
    min: 0.5,
    max: 0.5,
    median: 0.5,
    percentile95: 0.5,
    percentile5: 0.5,
    histogram: [
      {
        min: 0.5,
        max: 0.5,
        count: 1,
        frequency: 1,
      },
    ],
    scenarioBranches: [],
    riskEvolutionCurve: [],
    confidenceStory: [
      'Safe fallback output used after guarded execution degraded.',
    ],
    executionTimeMs: 0,
    compression: {
      compressed: false,
      strategy: 'none',
      originalSize: 1,
      retainedSize: 1,
    },
  },
  game_theory: {
    type: 'game_theory',
    players: ['Player A', 'Player B'],
    dominantStrategies: { 'Player A': null, 'Player B': null },
    nashEquilibria: [],
    expectedPayoffs: { 'Player A': 0, 'Player B': 0 },
    payoffMatrix: [],
    strategyEvolution: {},
    coalitionFormations: [],
    repeatedGameLearning: {
      rounds: 0,
      convergenceScore: 0,
      trajectory: {},
    },
    reputationScores: {},
    executionTimeMs: 0,
  },
  market: {
    type: 'market',
    paths: [[100]],
    finalPrices: [100],
    expectedFinalPrice: 100,
    valueAtRisk95: 100,
    maxDrawdown: 0,
    annualizedReturn: 0,
    annualizedVolatility: 0,
    detectedRegimes: [],
    shockEventsApplied: [],
    priceStats: {
      mean: 100,
      stdDev: 0,
      min: 100,
      max: 100,
      median: 100,
    },
    executionTimeMs: 0,
  },
  conflict: {
    type: 'conflict',
    rounds: 0,
    agentResults: [],
    roundHistory: [],
    winner: null,
    cooperationRate: 0,
    coalitionMetrics: [],
    allianceMatrix: [],
    betrayalProbabilities: {},
    trustScores: {},
    executionTimeMs: 0,
  },
};

@Injectable()
export class EngineSafetyWrapperService {
  private readonly logger = new Logger(EngineSafetyWrapperService.name);

  validateInput(type: string, params: Record<string, unknown>): string | null {
    if (!params || typeof params !== 'object') {
      return 'Parameters must be a non-null object';
    }

    switch (type) {
      case 'monte_carlo': {
        const iters = Number(params.iterations ?? 1000);
        if (iters > ENGINE_MAX_ITERATIONS) {
          return `Iterations ${iters} exceeds maximum ${ENGINE_MAX_ITERATIONS}`;
        }
        if (!Array.isArray(params.variables) || params.variables.length === 0) {
          return 'variables array is required';
        }
        if (
          !params.outputExpression ||
          typeof params.outputExpression !== 'string'
        ) {
          return 'outputExpression is required';
        }
        break;
      }
      case 'game_theory': {
        if (!Array.isArray(params.players) || params.players.length < 2) {
          return 'At least 2 players are required';
        }
        if (!Array.isArray(params.payoffMatrix)) {
          return 'payoffMatrix array is required';
        }
        break;
      }
      case 'market': {
        const paths = Number(params.paths ?? 1000);
        if (paths > 100_000) return `paths ${paths} exceeds maximum 100,000`;
        const days = Number(params.timeHorizonDays ?? 252);
        if (days > 3650) return `timeHorizonDays ${days} exceeds maximum 3,650`;
        break;
      }
      case 'conflict': {
        if (!Array.isArray(params.agents) || params.agents.length < 2) {
          return 'At least 2 agents are required';
        }
        const rounds = Number(params.rounds ?? 100);
        if (rounds > 100_000) return `rounds ${rounds} exceeds maximum 100,000`;
        break;
      }
    }

    return null;
  }

  async execute<T>(
    type: string,
    engineFn: () => Promise<T>,
    params: Record<string, unknown>,
  ): Promise<SafeExecutionResult<T>> {
    const startedAt = Date.now();
    const inputSizeBytes = this.estimateSize(params);

    const inputError = this.validateInput(type, params);
    if (inputError) {
      this.logger.warn(
        `Safety: input validation failed for ${type}: ${inputError}`,
      );
      return this.degradedResult(
        type,
        {
          type: 'input_invalid',
          message: inputError,
          engineType: type,
        },
        startedAt,
        inputSizeBytes,
      );
    }

    const memoryViolationBeforeRun = this.checkMemoryCap(type);
    if (memoryViolationBeforeRun) {
      return this.degradedResult(
        type,
        memoryViolationBeforeRun,
        startedAt,
        inputSizeBytes,
      );
    }

    let timeoutHandle: NodeJS.Timeout | null = null;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error(`Engine timeout after ${ENGINE_TIMEOUT_MS}ms`));
        }, ENGINE_TIMEOUT_MS);
      });

      const result = await Promise.race([engineFn(), timeoutPromise]);

      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      const memoryViolationAfterRun = this.checkMemoryCap(type);
      if (memoryViolationAfterRun) {
        return this.degradedResult(
          type,
          memoryViolationAfterRun,
          startedAt,
          inputSizeBytes,
        );
      }

      return {
        result,
        status: 'ok',
        fallbackUsed: false,
        safeOutput: null,
        violation: null,
        executionTimeMs: Date.now() - startedAt,
        inputSizeBytes,
        outputSizeBytes: this.estimateSize(result),
        memoryUsageBytes: process.memoryUsage().heapUsed,
      };
    } catch (err) {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      const message = (err as Error).message;
      const violation: SafetyViolation = {
        type: message.includes('timeout') ? 'timeout' : 'runtime_error',
        message,
        engineType: type,
      };

      this.logger.warn(
        `Safety: engine ${type} ${violation.type === 'timeout' ? 'timed out' : 'crashed'}: ${message}`,
      );

      return this.degradedResult(type, violation, startedAt, inputSizeBytes);
    }
  }

  private degradedResult<T>(
    type: string,
    violation: SafetyViolation,
    startedAt: number,
    inputSizeBytes: number,
  ): SafeExecutionResult<T> {
    const safeOutput = this.getFallback(type) as T;

    return {
      result: safeOutput,
      status: 'degraded',
      fallbackUsed: true,
      safeOutput,
      violation,
      executionTimeMs: Date.now() - startedAt,
      inputSizeBytes,
      outputSizeBytes: this.estimateSize(safeOutput),
      memoryUsageBytes: process.memoryUsage().heapUsed,
    };
  }

  private checkMemoryCap(type: string): SafetyViolation | null {
    const memoryCapBytes = this.memoryCapBytes();
    const heapUsed = process.memoryUsage().heapUsed;

    if (heapUsed <= memoryCapBytes) {
      return null;
    }

    const capMb = Math.round(memoryCapBytes / (1024 * 1024));
    const usedMb = Math.round(heapUsed / (1024 * 1024));

    const message = `Memory cap exceeded (${usedMb}MB > ${capMb}MB)`;
    this.logger.warn(`Safety: ${type} ${message}`);

    return {
      type: 'memory_cap',
      message,
      engineType: type,
    };
  }

  private memoryCapBytes(): number {
    const fromEnv = Number(process.env.ENGINE_MEMORY_CAP_MB);
    const capMb =
      Number.isFinite(fromEnv) && fromEnv > 0
        ? fromEnv
        : DEFAULT_ENGINE_MEMORY_CAP_MB;

    return Math.floor(capMb * 1024 * 1024);
  }

  private getFallback(type: string): Record<string, unknown> {
    return (
      FALLBACK_RESULTS[type] ?? {
        type,
        executionTimeMs: 0,
        fallback: true,
      }
    );
  }

  private estimateSize(payload: unknown): number {
    try {
      return Buffer.byteLength(JSON.stringify(payload ?? null), 'utf8');
    } catch {
      return 0;
    }
  }
}
