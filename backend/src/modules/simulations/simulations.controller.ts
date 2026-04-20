import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { RunSimulationDto } from './dto/run-simulation.dto';
import { ResultsService } from '../results/results.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('simulations')
@UseGuards(JwtAuthGuard)
export class SimulationsController {
  constructor(
    private readonly simulationsService: SimulationsService,
    private readonly resultsService: ResultsService,
  ) {}

  // ── POST /simulations — create (no execution) ──────────────────────────────
  @Post()
  create(@Body() dto: CreateSimulationDto, @Req() req: AuthenticatedRequest) {
    return this.simulationsService.create({
      ...dto,
      createdById: req.user.id,
    });
  }

  // ── POST /simulations/run — create + execute immediately ──────────────────
  @Post('run')
  runSimulation(
    @Body() dto: RunSimulationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.simulationsService.run({
      ...dto,
      createdById: req.user.id,
    });
  }

  // ── GET /simulations — list all ───────────────────────────────────────────
  @Get()
  findAll() {
    return this.simulationsService.findAll();
  }

  // ── GET /simulations/:id — get simulation with strategies + results ────────
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.simulationsService.findById(id);
  }

  // ── GET /simulations/:id/results — computed results for a simulation ───────
  @Get(':id/results')
  getResults(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultsService.findBySimulation(id);
  }

  // ── DELETE /simulations/:id ────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.simulationsService.remove(id);
  }
}
