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
import { CompareSimulationsDto } from './dto/compare-simulations.dto';
import { DecisionRequestDto } from './dto/decision-request.dto';
import { AiOrchestratorService } from './services/ai-orchestrator.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiOrchestrator: AiOrchestratorService) {}

  @Get('insight/:simulationId')
  getInsight(@Param('simulationId', ParseUUIDPipe) simulationId: string) {
    return this.aiOrchestrator.generateInsight(simulationId);
  }

  @Get('intelligence/:simulationId')
  getIntelligence(@Param('simulationId', ParseUUIDPipe) simulationId: string) {
    return this.aiOrchestrator.generateIntelligence(simulationId);
  }

  @Post('decision')
  getDecision(@Body() dto: DecisionRequestDto) {
    return this.aiOrchestrator.generateDecision(dto);
  }

  @Post('compare')
  compareSimulations(@Body() dto: CompareSimulationsDto) {
    return this.aiOrchestrator.compareSimulations(dto.simulationIds);
  }

  @Get('explain/:simulationId')
  explain(@Param('simulationId', ParseUUIDPipe) simulationId: string) {
    return this.aiOrchestrator.explainSimulation(simulationId);
  }
}
