import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ReplayRunDto } from './dto/replay-run.dto';
import { SimulationReplayEngine } from './simulation-replay.engine';

@Controller('replay')
@UseGuards(JwtAuthGuard)
export class ReplayV1Controller {
  constructor(private readonly replayEngine: SimulationReplayEngine) {}

  // Required Phase 6 endpoint: GET /api/v1/replay/:simulationId
  @Get(':simulationId')
  async getReplay(@Param('simulationId', ParseUUIDPipe) simulationId: string) {
    return this.replayEngine.replay(simulationId);
  }

  // Required Phase 6 endpoint: POST /api/v1/replay/run
  @Post('run')
  async runReplay(@Body() dto: ReplayRunDto) {
    return this.replayEngine.replayRun(dto);
  }
}
