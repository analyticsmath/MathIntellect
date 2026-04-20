import { io, Socket } from 'socket.io-client';

export interface SimulationStartedEvent {
  simulationId: string;
  type: string;
  name: string;
  timestamp: string;
}

export interface SimulationProgressEvent {
  simulationId: string;
  progress: number;
  message: string;
  partial?: Record<string, unknown>;
}

export interface SimulationCompletedEvent {
  simulationId: string;
  executionTimeMs: number;
  timestamp: string;
}

export interface SimulationErrorEvent {
  simulationId: string;
  error: string;
  timestamp: string;
}

export interface StreamEnvelope<T = Record<string, unknown>> {
  simulationId: string;
  sequence: number;
  event: string;
  timestamp: string;
  payload: T;
}

export interface StreamBatchEvent {
  simulationId: string;
  events: StreamEnvelope[];
}

export type RealtimeEventMap = {
  'simulation:started': SimulationStartedEvent;
  'simulation:progress': SimulationProgressEvent;
  'simulation:completed': SimulationCompletedEvent;
  'simulation:error': SimulationErrorEvent;
  'simulation:stream_batch': StreamBatchEvent;
};

const WS_URL =
  (import.meta.env.VITE_WS_URL as string | undefined) ??
  'http://localhost:5000';

class RealtimeService {
  private socket: Socket | null = null;
  private connectionAttempts = 0;
  private readonly lastSequenceBySimulation = new Map<string, number>();

  connect(): Socket {
    if (this.socket?.connected) return this.socket;

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 8_000,
      timeout: 10_000,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      this.connectionAttempts = 0;
      console.debug('[WS] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.debug('[WS] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err: Error) => {
      this.connectionAttempts++;
      if (this.connectionAttempts === 1) {
        console.warn(
          '[WS] Connection failed, using HTTP polling fallback:',
          err.message,
        );
      }
    });

    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  subscribeToSimulation(
    simulationId: string,
    handlers: {
      onProgress?: (e: SimulationProgressEvent) => void;
      onCompleted?: (e: SimulationCompletedEvent) => void;
      onError?: (e: SimulationErrorEvent) => void;
    },
  ): () => void {
    const socket = this.connect();

    const onProgress = (e: SimulationProgressEvent) => {
      if (e.simulationId === simulationId) handlers.onProgress?.(e);
    };

    const onEngineStep = (
      envelope: StreamEnvelope<
        SimulationProgressEvent & { engineType?: string; status?: string }
      >,
    ) => {
      if (envelope.simulationId !== simulationId) return;
      if (!this.shouldAcceptEnvelope(envelope)) return;

      const payload = envelope.payload;
      if (typeof payload.progress !== 'number') return;

      handlers.onProgress?.({
        simulationId: envelope.simulationId,
        progress: payload.progress,
        message: `${payload.progress}% complete`,
        partial: payload.partial,
      });
    };

    const onBatch = (batch: StreamBatchEvent) => {
      if (batch.simulationId !== simulationId) return;
      for (const envelope of batch.events ?? []) {
        if (!this.shouldAcceptEnvelope(envelope)) continue;

        if (envelope.event === 'simulation:engine_step') {
          const payload = envelope.payload as {
            progress?: number;
            partial?: Record<string, unknown>;
          };
          if (typeof payload.progress === 'number') {
            handlers.onProgress?.({
              simulationId: envelope.simulationId,
              progress: payload.progress,
              message: `${payload.progress}% complete`,
              partial: payload.partial,
            });
          }
        }
      }
    };

    const onCompleted = (e: SimulationCompletedEvent) => {
      if (e.simulationId === simulationId) handlers.onCompleted?.(e);
    };

    const onError = (e: SimulationErrorEvent) => {
      if (e.simulationId === simulationId) handlers.onError?.(e);
    };

    socket.on('simulation:progress', onProgress);
    socket.on('simulation:engine_step', onEngineStep);
    socket.on('simulation:stream_batch', onBatch);
    socket.on('simulation:completed', onCompleted);
    socket.on('simulation:error', onError);

    return () => {
      socket.off('simulation:progress', onProgress);
      socket.off('simulation:engine_step', onEngineStep);
      socket.off('simulation:stream_batch', onBatch);
      socket.off('simulation:completed', onCompleted);
      socket.off('simulation:error', onError);
    };
  }

  onAnyStarted(handler: (e: SimulationStartedEvent) => void): () => void {
    const socket = this.connect();
    socket.on('simulation:started', handler);
    return () => socket.off('simulation:started', handler);
  }

  onAnyCompleted(handler: (e: SimulationCompletedEvent) => void): () => void {
    const socket = this.connect();
    socket.on('simulation:completed', handler);
    return () => socket.off('simulation:completed', handler);
  }

  private shouldAcceptEnvelope(envelope: StreamEnvelope<unknown>): boolean {
    const previous = this.lastSequenceBySimulation.get(envelope.simulationId) ?? 0;
    if (envelope.sequence <= previous) {
      return false;
    }

    this.lastSequenceBySimulation.set(envelope.simulationId, envelope.sequence);
    return true;
  }
}

export const realtimeService = new RealtimeService();
