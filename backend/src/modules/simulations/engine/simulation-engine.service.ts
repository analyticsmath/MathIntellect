import { Injectable, BadRequestException } from '@nestjs/common';
import { SimulationType } from '../entities/simulation.entity';
import { MonteCarloEngine } from './monte-carlo.engine';
import { GameTheoryEngine } from './game-theory.engine';
import { MarketEngine } from './market.engine';
import { ConflictEngine } from './conflict.engine';
import {
  SimulationEngineResult,
  MonteCarloParams,
  GameTheoryParams,
  MarketParams,
  ConflictParams,
  ProgressCallback,
} from '../interfaces/engine.interfaces';

export interface EngineExecuteOptions {
  deterministic?: boolean;
  seed?: string | number;
}

@Injectable()
export class SimulationEngineService {
  constructor(
    private readonly monteCarlo: MonteCarloEngine,
    private readonly gameTheory: GameTheoryEngine,
    private readonly market: MarketEngine,
    private readonly conflict: ConflictEngine,
  ) {}

  async execute(
    type: SimulationType,
    parameters: Record<string, unknown>,
    onProgress?: ProgressCallback,
    options?: EngineExecuteOptions,
  ): Promise<SimulationEngineResult> {
    const resolvedParams = this.withDeterministicOptions(parameters, options);

    switch (type) {
      case SimulationType.MONTE_CARLO:
        return this.monteCarlo.run(
          this.cast<MonteCarloParams>(resolvedParams, type),
          onProgress,
        );

      case SimulationType.GAME_THEORY:
        return this.gameTheory.run(
          this.cast<GameTheoryParams>(resolvedParams, type),
          onProgress,
        );

      case SimulationType.MARKET:
        return this.market.run(
          this.cast<MarketParams>(resolvedParams, type),
          onProgress,
        );

      case SimulationType.CONFLICT:
        return this.conflict.run(
          this.cast<ConflictParams>(resolvedParams, type),
          onProgress,
        );

      case SimulationType.CUSTOM:
        return this.monteCarlo.run(
          {
            iterations: 1000,
            variables: [
              {
                name: 'x',
                distribution: 'uniform',
                params: { min: 0, max: 1 },
              },
            ],
            outputExpression: 'x',
            ...(resolvedParams as Partial<MonteCarloParams>),
          },
          onProgress,
        );

      default:
        throw new BadRequestException(
          `Unsupported simulation type: ${type as string}`,
        );
    }
  }

  private withDeterministicOptions(
    parameters: Record<string, unknown>,
    options?: EngineExecuteOptions,
  ): Record<string, unknown> {
    if (!options?.deterministic) {
      return parameters;
    }

    return {
      ...parameters,
      deterministic: true,
      seed:
        typeof options.seed === 'string'
          ? Number.parseInt(options.seed, 10)
          : options.seed,
    };
  }

  private cast<T>(params: Record<string, unknown>, type: SimulationType): T {
    if (!params || Object.keys(params).length === 0) {
      throw new BadRequestException(
        `parameters are required for ${type as string} simulation`,
      );
    }
    return params as unknown as T;
  }
}
