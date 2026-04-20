import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('results')
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  // GET /results/simulation/:id
  @Get('simulation/:id')
  findBySimulation(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultsService.findBySimulation(id);
  }

  // GET /results/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultsService.findById(id);
  }
}
