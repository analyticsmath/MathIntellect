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
  UseGuards,
} from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('strategies')
@UseGuards(JwtAuthGuard)
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  // POST /strategies
  @Post()
  create(@Body() dto: CreateStrategyDto) {
    return this.strategiesService.create(dto);
  }

  // GET /strategies/simulation/:id
  @Get('simulation/:id')
  findBySimulation(@Param('id', ParseUUIDPipe) id: string) {
    return this.strategiesService.findBySimulation(id);
  }

  // GET /strategies/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.strategiesService.findById(id);
  }

  // DELETE /strategies/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.strategiesService.remove(id);
  }
}
