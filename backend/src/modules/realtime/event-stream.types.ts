// Phase 6 realtime stream contracts

export interface StreamEnvelope<T = Record<string, unknown>> {
  simulationId: string;
  sequence: number;
  event: string;
  timestamp: string;
  payload: T;
}

export interface SimulationQueuedEvent {
  simulationId: string;
  engineType: string;
  status: 'queued';
  timestamp: string;
}

export interface SimulationExecutionStartEvent {
  simulationId: string;
  engineType: string;
  status: 'execution_start';
  deterministic: boolean;
  seed: string;
  timestamp: string;
}

export interface SimulationEngineStepEvent {
  simulationId: string;
  engineType: string;
  progress: number;
  partial?: Record<string, unknown>;
  timestamp: string;
}

export interface SimulationAiThinkingEvent {
  simulationId: string;
  thought: string;
  timestamp: string;
}

export interface SimulationFinalizingEvent {
  simulationId: string;
  engineType: string;
  status: 'finalizing';
  timestamp: string;
}

// Legacy phase-5 events retained
export interface SimulationStageUpdateEvent {
  simulationId: string;
  stage: 'initializing' | 'sampling' | 'computing' | 'rendering' | 'finalizing';
  stageIndex: number;
  totalStages: number;
  label: string;
  timestamp: string;
}

export interface SimulationMetricStreamEvent {
  simulationId: string;
  metrics: {
    mean?: number;
    variance?: number;
    stdDev?: number;
    sampleCount?: number;
    convergence?: number;
  };
  timestamp: string;
}

export interface SimulationAiThoughtEvent {
  simulationId: string;
  thought: string;
  phase: 'pre-analysis' | 'mid-run' | 'post-result';
  timestamp: string;
}

export interface SimulationEngineProgressEvent {
  simulationId: string;
  engineType: string;
  iterationsDone: number;
  totalIterations: number;
  currentBatchMs: number;
  timestamp: string;
}

export interface SimulationSystemWarningEvent {
  simulationId: string;
  level: 'info' | 'warn' | 'critical';
  code: string;
  message: string;
  timestamp: string;
}
