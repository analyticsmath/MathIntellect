import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Simulation,
  SimulationType,
} from '../../simulations/entities/simulation.entity';
import { Result } from '../../results/entities/result.entity';
import {
  ConflictResult,
  GameTheoryResult,
  MarketResult,
  MonteCarloResult,
  SimulationEngineResult,
} from '../../simulations/interfaces/engine.interfaces';

export interface SimulationDerivedMetrics {
  expected_value: number;
  variance: number;
  risk_score: number;
  return_score: number;
  stability_score: number;
  drawdown?: number;
  volatility?: number;
  downside_risk?: number;
  payoff_spread?: number;
  cooperation_rate?: number;
}

export interface SimulationContext {
  simulation_id: string;
  created_by_id: string | null;
  simulation_name: string;
  simulation_type: SimulationType;
  simulation_status: string;
  parameters: Record<string, unknown>;
  raw_output: SimulationEngineResult;
  execution_time_ms: number;
  derived_metrics: SimulationDerivedMetrics;
}

@Injectable()
export class SimulationContextService {
  constructor(
    @InjectRepository(Simulation)
    private readonly simulationsRepo: Repository<Simulation>,
    @InjectRepository(Result)
    private readonly resultsRepo: Repository<Result>,
  ) {}

  async getContext(simulationId: string): Promise<SimulationContext> {
    const simulation = await this.simulationsRepo.findOne({
      where: { id: simulationId },
      relations: ['createdBy'],
    });

    if (!simulation) {
      throw new NotFoundException(`Simulation ${simulationId} not found`);
    }

    const result = await this.resultsRepo.findOne({
      where: { simulationId },
      order: { createdAt: 'DESC' },
    });

    if (!result) {
      throw new NotFoundException(
        `No result found for simulation ${simulationId}. Run the simulation first.`,
      );
    }

    const rawOutput = result.outcomeData as unknown as SimulationEngineResult;

    return {
      simulation_id: simulation.id,
      created_by_id: simulation.createdBy?.id ?? null,
      simulation_name: simulation.name,
      simulation_type: simulation.type,
      simulation_status: simulation.status,
      parameters: simulation.parameters ?? {},
      raw_output: rawOutput,
      execution_time_ms: result.executionTime ?? 0,
      derived_metrics: this.deriveMetrics(simulation.type, rawOutput),
    };
  }

  private deriveMetrics(
    simulationType: SimulationType,
    raw: SimulationEngineResult,
  ): SimulationDerivedMetrics {
    switch (simulationType) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return this.deriveMonteCarloMetrics(raw as MonteCarloResult);
      case SimulationType.MARKET:
        return this.deriveMarketMetrics(raw as MarketResult);
      case SimulationType.GAME_THEORY:
        return this.deriveGameTheoryMetrics(raw as GameTheoryResult);
      case SimulationType.CONFLICT:
        return this.deriveConflictMetrics(raw as ConflictResult);
      default:
        return {
          expected_value: 0,
          variance: 0,
          risk_score: 50,
          return_score: 50,
          stability_score: 50,
        };
    }
  }

  private deriveMonteCarloMetrics(
    raw: MonteCarloResult,
  ): SimulationDerivedMetrics {
    const expected = Number.isFinite(raw.expectedValue) ? raw.expectedValue : 0;
    const variance = Number.isFinite(raw.variance) ? raw.variance : 0;
    const stdDev = Number.isFinite(raw.stdDev) ? raw.stdDev : 0;
    const p5 = Number.isFinite(raw.percentile5) ? raw.percentile5 : 0;
    const p95 = Number.isFinite(raw.percentile95) ? raw.percentile95 : 1;

    const cv = stdDev / Math.max(1, Math.abs(expected));
    const downsideRisk =
      p5 < 0
        ? this.clamp((Math.abs(p5) / Math.max(1, Math.abs(p95))) * 100)
        : 0;

    return {
      expected_value: expected,
      variance,
      risk_score: this.clamp(cv * 55 + downsideRisk * 0.45),
      return_score: this.clamp(
        50 + (expected / Math.max(1, Math.abs(p95))) * 55,
      ),
      stability_score: this.clamp(100 - cv * 70),
      downside_risk: downsideRisk,
    };
  }

  private deriveMarketMetrics(raw: MarketResult): SimulationDerivedMetrics {
    const expected = Number.isFinite(raw.expectedFinalPrice)
      ? raw.expectedFinalPrice
      : 0;
    const stdDev = Number.isFinite(raw.priceStats?.stdDev)
      ? raw.priceStats.stdDev
      : 0;

    const drawdown = this.clamp((raw.maxDrawdown ?? 0) * 100);
    const volatility = this.clamp((raw.annualizedVolatility ?? 0) * 100);

    return {
      expected_value: expected,
      variance: stdDev ** 2,
      risk_score: this.clamp(drawdown * 0.6 + volatility * 0.4),
      return_score: this.clamp(50 + (raw.annualizedReturn ?? 0) * 120),
      stability_score: this.clamp(100 - volatility),
      drawdown,
      volatility,
    };
  }

  private deriveGameTheoryMetrics(
    raw: GameTheoryResult,
  ): SimulationDerivedMetrics {
    const payoffs = Object.values(raw.expectedPayoffs ?? {});
    const meanPayoff = this.mean(payoffs);
    const spread =
      payoffs.length > 0 ? Math.max(...payoffs) - Math.min(...payoffs) : 0;
    const nashCount = raw.nashEquilibria?.length ?? 0;
    const paretoCount =
      raw.nashEquilibria?.filter((eq) => eq.isPareto).length ?? 0;
    const dominantCount = Object.values(raw.dominantStrategies ?? {}).filter(
      Boolean,
    ).length;

    let riskScore = 65 - nashCount * 12 - paretoCount * 8 + spread * 6;
    if (nashCount === 0) {
      riskScore += 15;
    }

    return {
      expected_value: meanPayoff,
      variance: this.stdDev(payoffs) ** 2,
      risk_score: this.clamp(riskScore),
      return_score: this.clamp(50 + meanPayoff * 12),
      stability_score: this.clamp(
        35 + nashCount * 18 + dominantCount * 8 - spread * 4,
      ),
      payoff_spread: spread,
    };
  }

  private deriveConflictMetrics(raw: ConflictResult): SimulationDerivedMetrics {
    const finalResources = raw.agentResults?.map((a) => a.finalResources) ?? [];
    const meanResources = this.mean(finalResources);
    const resourceStd = this.stdDev(finalResources);
    const cooperationRate = this.clamp((raw.cooperationRate ?? 0) * 100);
    const gini = this.gini(finalResources);

    const meanNetGain = this.mean(
      raw.agentResults?.map((a) => a.totalGained - a.totalLost) ?? [],
    );

    return {
      expected_value: meanResources,
      variance: resourceStd ** 2,
      risk_score: this.clamp((100 - cooperationRate) * 0.55 + gini * 45),
      return_score: this.clamp(
        50 + (meanNetGain / Math.max(1, Math.abs(meanResources))) * 80,
      ),
      stability_score: this.clamp(
        cooperationRate * 0.7 +
          (1 -
            Math.min(1, resourceStd / Math.max(1, Math.abs(meanResources)))) *
            30,
      ),
      cooperation_rate: cooperationRate,
    };
  }

  private mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private stdDev(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = this.mean(values);
    const variance =
      values.reduce((sum, value) => sum + (value - avg) ** 2, 0) /
      values.length;
    return Math.sqrt(variance);
  }

  private gini(values: number[]): number {
    const n = values.length;
    if (n === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mean = this.mean(sorted);
    if (mean === 0) return 0;

    let sumDiff = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        sumDiff += Math.abs(sorted[i] - sorted[j]);
      }
    }

    return sumDiff / (2 * n * n * mean);
  }

  private clamp(value: number, min = 0, max = 100): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
