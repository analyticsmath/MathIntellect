import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import type {
  SimulationAiThoughtEvent,
  SimulationEngineProgressEvent,
  SimulationFinalizingEvent,
  SimulationMetricStreamEvent,
  SimulationQueuedEvent,
  SimulationExecutionStartEvent,
  SimulationEngineStepEvent,
  SimulationStageUpdateEvent,
  SimulationSystemWarningEvent,
  StreamEnvelope,
} from './event-stream.types';

const MAX_EVENTS_PER_SECOND = 10;
const FLUSH_INTERVAL_MS = Math.ceil(1000 / MAX_EVENTS_PER_SECOND);
const MAX_DEDUP_KEYS = 64;

const STAGE_LABELS = [
  'Initializing engine',
  'Sampling parameter space',
  'Computing statistical distributions',
  'Rendering intelligence layer',
  'Finalizing outputs',
];

interface StreamState {
  sequence: number;
  queue: Array<{ event: string; payload: Record<string, unknown>; dedupeKey: string }>;
  dedupeKeys: string[];
  flushTimer: NodeJS.Timeout | null;
}

@Injectable()
export class SimulationStreamService {
  private readonly logger = new Logger(SimulationStreamService.name);
  private readonly states = new Map<string, StreamState>();

  constructor(private readonly gateway: RealtimeGateway) {}

  emitQueued(simulationId: string, engineType: string): void {
    const payload: SimulationQueuedEvent = {
      simulationId,
      engineType,
      status: 'queued',
      timestamp: new Date().toISOString(),
    };

    this.enqueue(simulationId, 'simulation:queued', this.asPayload(payload));
  }

  emitExecutionStart(simulationId: string, engineType: string, seed: string): void {
    const payload: SimulationExecutionStartEvent = {
      simulationId,
      engineType,
      status: 'execution_start',
      deterministic: true,
      seed,
      timestamp: new Date().toISOString(),
    };

    this.enqueue(
      simulationId,
      'simulation:execution_start',
      this.asPayload(payload),
    );
  }

  emitEngineStep(
    simulationId: string,
    engineType: string,
    progress: number,
    partial?: Record<string, unknown>,
  ): void {
    const payload: SimulationEngineStepEvent = {
      simulationId,
      engineType,
      progress,
      partial,
      timestamp: new Date().toISOString(),
    };

    this.enqueue(
      simulationId,
      'simulation:engine_step',
      this.asPayload(payload),
      true,
    );
  }

  emitAiThinking(simulationId: string, thought: string): void {
    const payload = {
      simulationId,
      thought,
      timestamp: new Date().toISOString(),
    };

    this.enqueue(simulationId, 'simulation:ai_thinking', payload);
  }

  emitFinalizing(simulationId: string, engineType: string): void {
    const payload: SimulationFinalizingEvent = {
      simulationId,
      engineType,
      status: 'finalizing',
      timestamp: new Date().toISOString(),
    };

    this.enqueue(
      simulationId,
      'simulation:finalizing',
      this.asPayload(payload),
    );
  }

  // Legacy methods retained for existing frontend subscribers
  emitStageUpdate(simulationId: string, stageIndex: number, engineType?: string): void {
    const idx = Math.max(0, Math.min(stageIndex - 1, STAGE_LABELS.length - 1));
    const event: SimulationStageUpdateEvent = {
      simulationId,
      stage: (['initializing', 'sampling', 'computing', 'rendering', 'finalizing'] as const)[idx],
      stageIndex,
      totalStages: 5,
      label: STAGE_LABELS[idx],
      timestamp: new Date().toISOString(),
    };
    this.enqueue(simulationId, 'simulation:stage_update', this.asPayload(event));

    if (engineType) {
      this.emitAiThought(simulationId, engineType, stageIndex);
    }
  }

  emitMetricStream(simulationId: string, partial: Record<string, number>): void {
    const event: SimulationMetricStreamEvent = {
      simulationId,
      metrics: partial,
      timestamp: new Date().toISOString(),
    };
    this.enqueue(
      simulationId,
      'simulation:metric_stream',
      this.asPayload(event),
      true,
    );
  }

  emitAiThought(simulationId: string, engineType: string, stageIndex: number): void {
    const phase: SimulationAiThoughtEvent['phase'] =
      stageIndex <= 1 ? 'pre-analysis' : stageIndex >= 4 ? 'post-result' : 'mid-run';

    const event: SimulationAiThoughtEvent = {
      simulationId,
      thought: `Engine ${engineType} processing stage ${stageIndex}.`,
      phase,
      timestamp: new Date().toISOString(),
    };
    this.enqueue(simulationId, 'simulation:ai_thought', this.asPayload(event));
  }

  emitEngineProgress(
    simulationId: string,
    engineType: string,
    iterationsDone: number,
    totalIterations: number,
    batchMs: number,
  ): void {
    const event: SimulationEngineProgressEvent = {
      simulationId,
      engineType,
      iterationsDone,
      totalIterations,
      currentBatchMs: batchMs,
      timestamp: new Date().toISOString(),
    };
    this.enqueue(
      simulationId,
      'simulation:engine_progress',
      this.asPayload(event),
      true,
    );
  }

  emitSystemWarning(
    simulationId: string,
    level: SimulationSystemWarningEvent['level'],
    code: string,
    message: string,
  ): void {
    const event: SimulationSystemWarningEvent = {
      simulationId,
      level,
      code,
      message,
      timestamp: new Date().toISOString(),
    };

    this.enqueue(
      simulationId,
      'simulation:system_warning',
      this.asPayload(event),
    );
    this.logger.warn(`system_warning [${level}] ${code}: ${message}`);
  }

  private enqueue(
    simulationId: string,
    event: string,
    payload: Record<string, unknown>,
    coalesce = false,
  ): void {
    const state = this.getState(simulationId);
    const dedupeKey = `${event}:${this.stableStringify(payload)}`;

    if (state.dedupeKeys.includes(dedupeKey)) {
      return;
    }

    state.dedupeKeys.push(dedupeKey);
    if (state.dedupeKeys.length > MAX_DEDUP_KEYS) {
      state.dedupeKeys.shift();
    }

    if (coalesce) {
      const existingIndex = state.queue.findIndex((item) => item.event === event);
      if (existingIndex >= 0) {
        state.queue[existingIndex] = { event, payload, dedupeKey };
      } else {
        state.queue.push({ event, payload, dedupeKey });
      }
    } else {
      state.queue.push({ event, payload, dedupeKey });
    }

    this.scheduleFlush(simulationId);
  }

  private scheduleFlush(simulationId: string): void {
    const state = this.getState(simulationId);
    if (state.flushTimer) {
      return;
    }

    state.flushTimer = setTimeout(() => {
      this.flush(simulationId);
    }, FLUSH_INTERVAL_MS);
  }

  private flush(simulationId: string): void {
    const state = this.getState(simulationId);

    if (state.flushTimer) {
      clearTimeout(state.flushTimer);
      state.flushTimer = null;
    }

    if (state.queue.length === 0) {
      return;
    }

    const envelopes: StreamEnvelope[] = [];

    while (state.queue.length > 0) {
      const item = state.queue.shift();
      if (!item) continue;

      state.sequence += 1;
      const envelope: StreamEnvelope = {
        simulationId,
        sequence: state.sequence,
        event: item.event,
        timestamp: new Date().toISOString(),
        payload: item.payload,
      };

      envelopes.push(envelope);
      this.gateway.server?.emit(item.event, envelope);
    }

    this.gateway.server?.emit('simulation:stream_batch', {
      simulationId,
      events: envelopes,
    });
  }

  private getState(simulationId: string): StreamState {
    const existing = this.states.get(simulationId);
    if (existing) {
      return existing;
    }

    const created: StreamState = {
      sequence: 0,
      queue: [],
      dedupeKeys: [],
      flushTimer: null,
    };

    this.states.set(simulationId, created);
    return created;
  }

  private stableStringify(value: unknown): string {
    return JSON.stringify(this.sort(value));
  }

  private sort(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((entry) => this.sort(entry));
    }

    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const sorted: Record<string, unknown> = {};
      for (const key of Object.keys(obj).sort()) {
        sorted[key] = this.sort(obj[key]);
      }
      return sorted;
    }

    return value;
  }

  private asPayload(payload: object): Record<string, unknown> {
    return payload as unknown as Record<string, unknown>;
  }
}
