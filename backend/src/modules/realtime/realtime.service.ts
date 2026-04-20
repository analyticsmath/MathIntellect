import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import type {
  SimulationStartedEvent,
  SimulationProgressEvent,
  SimulationCompletedEvent,
  SimulationErrorEvent,
} from './realtime.types';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private readonly gateway: RealtimeGateway) {}

  emitStarted(data: SimulationStartedEvent): void {
    this.gateway.server?.emit('simulation:started', data);
    this.logger.debug(`simulation:started → ${data.simulationId}`);
  }

  emitProgress(data: SimulationProgressEvent): void {
    this.gateway.server?.emit('simulation:progress', data);
  }

  emitCompleted(data: SimulationCompletedEvent): void {
    this.gateway.server?.emit('simulation:completed', data);
    this.logger.debug(
      `simulation:completed → ${data.simulationId} (${data.executionTimeMs}ms)`,
    );
  }

  emitError(data: SimulationErrorEvent): void {
    this.gateway.server?.emit('simulation:error', data);
    this.logger.debug(`simulation:error → ${data.simulationId}: ${data.error}`);
  }
}
