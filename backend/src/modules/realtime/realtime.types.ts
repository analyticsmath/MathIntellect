// ─── WebSocket Event Payload Types ────────────────────────────────────────────

export interface SimulationStartedEvent {
  simulationId: string;
  type: string;
  name: string;
  timestamp: string;
}

export interface SimulationProgressEvent {
  simulationId: string;
  /** 0 – 100 */
  progress: number;
  message: string;
  /** Optional partial results for progressive rendering */
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
