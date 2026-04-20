import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent, MetricType } from './entities/analytics-event.entity';
import { TransformerRegistry } from './transformers/transformer.registry';
import { ChartsResponse } from './view-models/chart-data.viewmodel';
import { ThreeDResponse } from './view-models/visualization-3d.viewmodel';
import { SummaryResponse } from './view-models/summary.viewmodel';
import { Result } from '../results/entities/result.entity';
import { Simulation } from '../simulations/entities/simulation.entity';
import { SimulationEngineResult } from '../simulations/interfaces/engine.interfaces';

// ─── Cache entry ─────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// ─── Public metric summary type (used by SimulationsService) ─────────────────

export interface SimulationMetrics {
  mean: number;
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  median: number;
  count: number;
}

@Injectable()
export class AnalyticsService {
  // TTL: 5 minutes per simulation analytics object
  private readonly TTL_MS = 5 * 60 * 1_000;

  private readonly chartsCache = new Map<string, CacheEntry<ChartsResponse>>();
  private readonly threeDCache = new Map<string, CacheEntry<ThreeDResponse>>();
  private readonly summaryCache = new Map<
    string,
    CacheEntry<SummaryResponse>
  >();

  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly eventsRepo: Repository<AnalyticsEvent>,
    @InjectRepository(Result)
    private readonly resultsRepo: Repository<Result>,
    @InjectRepository(Simulation)
    private readonly simulationsRepo: Repository<Simulation>,
    private readonly registry: TransformerRegistry,
  ) {}

  // ─── Core metrics (used by SimulationsService after run) ─────────────────

  computeMetrics(values: number[]): SimulationMetrics {
    if (!values.length)
      return {
        mean: 0,
        variance: 0,
        stdDev: 0,
        min: 0,
        max: 0,
        median: 0,
        count: 0,
      };
    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const mean = values.reduce((s, v) => s + v, 0) / count;
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / count;
    const stdDev = Math.sqrt(variance);
    const mid = Math.floor(count / 2);
    const median =
      count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    return {
      mean,
      variance,
      stdDev,
      min: sorted[0],
      max: sorted[count - 1],
      median,
      count,
    };
  }

  async recordEvent(
    simulationId: string,
    metricType: MetricType,
    value: number,
    metadata?: Record<string, unknown>,
  ): Promise<AnalyticsEvent> {
    const event = this.eventsRepo.create({
      simulationId,
      metricType,
      value,
      metadata,
    });
    return this.eventsRepo.save(event);
  }

  async recordMetrics(
    simulationId: string,
    values: number[],
  ): Promise<AnalyticsEvent[]> {
    const m = this.computeMetrics(values);
    const entries = [
      { simulationId, metricType: MetricType.MEAN, value: m.mean },
      { simulationId, metricType: MetricType.VARIANCE, value: m.variance },
      { simulationId, metricType: MetricType.STD_DEV, value: m.stdDev },
      { simulationId, metricType: MetricType.MIN, value: m.min },
      { simulationId, metricType: MetricType.MAX, value: m.max },
      { simulationId, metricType: MetricType.MEDIAN, value: m.median },
    ];
    const events = this.eventsRepo.create(entries as AnalyticsEvent[]);
    return this.eventsRepo.save(events);
  }

  async getBySimulation(simulationId: string): Promise<AnalyticsEvent[]> {
    return this.eventsRepo.find({
      where: { simulationId },
      order: { timestamp: 'ASC' },
    });
  }

  // ─── /charts ─────────────────────────────────────────────────────────────

  async getCharts(simulationId: string): Promise<ChartsResponse> {
    const cached = this.getCache(this.chartsCache, simulationId);
    if (cached) return cached;

    const { simulation, engineResult } =
      await this.loadSimulationResult(simulationId);
    const result = this.registry.charts(
      {
        id: simulation.id,
        name: simulation.name,
        status: simulation.status,
        type: simulation.type,
      },
      engineResult,
    );

    this.setCache(this.chartsCache, simulationId, result);
    return result;
  }

  // ─── /3d ─────────────────────────────────────────────────────────────────

  async get3D(simulationId: string): Promise<ThreeDResponse> {
    const cached = this.getCache(this.threeDCache, simulationId);
    if (cached) return cached;

    const { simulation, engineResult } =
      await this.loadSimulationResult(simulationId);
    const result = this.registry.threeD(
      {
        id: simulation.id,
        name: simulation.name,
        status: simulation.status,
        type: simulation.type,
      },
      engineResult,
    );

    this.setCache(this.threeDCache, simulationId, result);
    return result;
  }

  // ─── /summary ────────────────────────────────────────────────────────────

  async getSummary(simulationId: string): Promise<SummaryResponse> {
    const cached = this.getCache(this.summaryCache, simulationId);
    if (cached) return cached;

    const { simulation, engineResult } =
      await this.loadSimulationResult(simulationId);
    const result = this.registry.summary(
      {
        id: simulation.id,
        name: simulation.name,
        status: simulation.status,
        type: simulation.type,
      },
      engineResult,
    );

    this.setCache(this.summaryCache, simulationId, result);
    return result;
  }

  // ─── Internal helpers ────────────────────────────────────────────────────

  private async loadSimulationResult(
    simulationId: string,
  ): Promise<{ simulation: Simulation; engineResult: SimulationEngineResult }> {
    const simulation = await this.simulationsRepo.findOne({
      where: { id: simulationId },
    });
    if (!simulation)
      throw new NotFoundException(`Simulation ${simulationId} not found`);

    const resultRecord = await this.resultsRepo.findOne({
      where: { simulationId },
      order: { createdAt: 'DESC' },
    });
    if (!resultRecord) {
      throw new NotFoundException(
        `No result found for simulation ${simulationId}. Run the simulation first.`,
      );
    }

    return {
      simulation,
      engineResult:
        resultRecord.outcomeData as unknown as SimulationEngineResult,
    };
  }

  // ─── Cache helpers ────────────────────────────────────────────────────────

  private getCache<T>(map: Map<string, CacheEntry<T>>, key: string): T | null {
    const entry = map.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      map.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache<T>(
    map: Map<string, CacheEntry<T>>,
    key: string,
    data: T,
  ): void {
    map.set(key, { data, expiresAt: Date.now() + this.TTL_MS });
  }

  /** Invalidate all cached data for a simulation (call after re-run) */
  invalidateCache(simulationId: string): void {
    this.chartsCache.delete(simulationId);
    this.threeDCache.delete(simulationId);
    this.summaryCache.delete(simulationId);
  }
}
