import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SimulationReplayEngine } from './simulation-replay.engine';
import { SimulationSnapshotService } from './simulation-snapshot.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

// Backward-compatible replay routes retained under /simulations/*.
@Controller('simulations')
@UseGuards(JwtAuthGuard)
export class ReplayController {
  constructor(
    private readonly replayEngine: SimulationReplayEngine,
    private readonly snapshotService: SimulationSnapshotService,
  ) {}

  /** GET /simulations/:id/replay — compatibility route */
  @Get(':id/replay')
  async getReplay(@Param('id', ParseUUIDPipe) id: string) {
    return this.replayEngine.replay(id);
  }

  /** GET /simulations/:id/snapshot — raw deterministic snapshot metadata */
  @Get(':id/snapshot')
  async getSnapshot(@Param('id', ParseUUIDPipe) id: string) {
    const snapshot = await this.snapshotService.findBySimulation(id);
    if (!snapshot) {
      return {
        available: false,
        message:
          'No snapshot found. Only simulations run after Phase 6 deployment are snapshotted.',
      };
    }

    return {
      available: true,
      simulationId: snapshot.simulationId,
      simulationType: snapshot.simulationType,
      engineType: snapshot.engineType ?? snapshot.simulationType,
      seed: String(snapshot.seed),
      deterministic: snapshot.deterministicMode,
      promptVersion: snapshot.promptVersion,
      parameterHash: snapshot.parameterHash,
      finalOutputHash: snapshot.finalOutputHash ?? snapshot.checksum,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    };
  }
}
