import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { EngineExecutionLog } from './entities/engine-execution-log.entity';
import { AiConsistencyLockService } from '../ai-consistency/ai-consistency-lock.service';

export interface LogExecutionInput {
  simulationId: string;
  userId?: string;
  engineType: string;
  executionTimeMs: number;
  aiResponseTimeMs?: number;
  status: 'completed' | 'failed' | 'timeout' | 'aborted' | 'degraded';
  success: boolean;
  fallbackUsed?: boolean;
  failureReason?: string;
  memoryEstimateKb?: number;
  iterationCount?: number;
  safetyTriggered?: boolean;
  inputSizeBytes?: number;
  outputSizeBytes?: number;
  metadata?: Record<string, unknown>;
}

export interface EngineBreakdownStats {
  count: number;
  successRate: number;
  failureRate: number;
  fallbackRate: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  avgLatencyMs: number;
}

export interface SystemHealthReport {
  window: string;
  totalExecutions: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  failureRate: number;
  engineBreakdown: Record<string, EngineBreakdownStats>;
  aiCacheHitRate: number;
  // Compatibility fields retained
  successRate: number;
  timeoutRate: number;
  safetyTriggerRate: number;
  latency: { p50: number; p95: number; avg: number };
}

@Injectable()
export class ObservabilityService {
  private readonly logger = new Logger(ObservabilityService.name);

  constructor(
    @InjectRepository(EngineExecutionLog)
    private readonly logRepo: Repository<EngineExecutionLog>,
    private readonly aiConsistencyLock: AiConsistencyLockService,
  ) {}

  async logExecution(input: LogExecutionInput): Promise<void> {
    try {
      const log = this.logRepo.create({
        simulationId: input.simulationId,
        userId: input.userId ?? null,
        engineType: input.engineType,
        executionTimeMs: input.executionTimeMs,
        aiResponseTimeMs: input.aiResponseTimeMs ?? null,
        status: input.status,
        success: input.success,
        fallbackUsed: input.fallbackUsed ?? false,
        failureReason: input.failureReason ?? null,
        memoryEstimateKb: input.memoryEstimateKb ?? null,
        iterationCount: input.iterationCount ?? null,
        safetyTriggered: input.safetyTriggered ?? false,
        inputSizeBytes: input.inputSizeBytes ?? null,
        outputSizeBytes: input.outputSizeBytes ?? null,
        metadata: input.metadata ?? null,
      });
      await this.logRepo.save(log);
    } catch (err) {
      this.logger.warn(`Observability log failed: ${(err as Error).message}`);
    }
  }

  async getSystemHealth(windowHours = 24): Promise<SystemHealthReport> {
    const since = new Date(Date.now() - windowHours * 3_600_000);

    const logs = await this.logRepo.find({
      where: { createdAt: MoreThan(since) },
      select: [
        'engineType',
        'executionTimeMs',
        'status',
        'success',
        'fallbackUsed',
        'safetyTriggered',
      ],
    });

    const total = logs.length;
    const aiCacheHitRate = this.aiConsistencyLock.getStats().hitRate;

    if (total === 0) {
      return {
        window: `${windowHours}h`,
        totalExecutions: 0,
        p50LatencyMs: 0,
        p95LatencyMs: 0,
        failureRate: 0,
        engineBreakdown: {},
        aiCacheHitRate,
        successRate: 1,
        timeoutRate: 0,
        safetyTriggerRate: 0,
        latency: { p50: 0, p95: 0, avg: 0 },
      };
    }

    const completed = logs.filter((entry) => entry.success).length;
    const failed = logs.filter((entry) => !entry.success).length;
    const timedOut = logs.filter((entry) => entry.status === 'timeout').length;
    const safetyHits = logs.filter((entry) => entry.safetyTriggered).length;

    const latencyValues = logs
      .map((entry) => entry.executionTimeMs)
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);

    const engineBreakdown: Record<string, EngineBreakdownStats> = {};

    for (const log of logs) {
      if (!engineBreakdown[log.engineType]) {
        engineBreakdown[log.engineType] = {
          count: 0,
          successRate: 0,
          failureRate: 0,
          fallbackRate: 0,
          p50LatencyMs: 0,
          p95LatencyMs: 0,
          avgLatencyMs: 0,
        };
      }

      engineBreakdown[log.engineType].count += 1;
    }

    for (const engineType of Object.keys(engineBreakdown)) {
      const engineLogs = logs.filter(
        (entry) => entry.engineType === engineType,
      );
      const latencies = engineLogs
        .map((entry) => entry.executionTimeMs)
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);

      const successes = engineLogs.filter((entry) => entry.success).length;
      const fallbacks = engineLogs.filter((entry) => entry.fallbackUsed).length;

      engineBreakdown[engineType] = {
        count: engineLogs.length,
        successRate: successes / engineLogs.length,
        failureRate: (engineLogs.length - successes) / engineLogs.length,
        fallbackRate: fallbacks / engineLogs.length,
        p50LatencyMs: this.percentile(latencies, 50),
        p95LatencyMs: this.percentile(latencies, 95),
        avgLatencyMs:
          latencies.length > 0
            ? latencies.reduce((sum, value) => sum + value, 0) /
              latencies.length
            : 0,
      };
    }

    const p50LatencyMs = this.percentile(latencyValues, 50);
    const p95LatencyMs = this.percentile(latencyValues, 95);
    const avgLatencyMs =
      latencyValues.length > 0
        ? latencyValues.reduce((sum, value) => sum + value, 0) /
          latencyValues.length
        : 0;

    return {
      window: `${windowHours}h`,
      totalExecutions: total,
      p50LatencyMs,
      p95LatencyMs,
      failureRate: failed / total,
      engineBreakdown,
      aiCacheHitRate,
      successRate: completed / total,
      timeoutRate: timedOut / total,
      safetyTriggerRate: safetyHits / total,
      latency: {
        p50: p50LatencyMs,
        p95: p95LatencyMs,
        avg: avgLatencyMs,
      },
    };
  }

  private percentile(sorted: number[], percentile: number): number {
    if (sorted.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)] ?? 0;
  }
}
