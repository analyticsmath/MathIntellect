import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ── GET /analytics/simulation/:id — raw metric events ─────────────────────
  @Get('simulation/:id')
  getRawEvents(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getBySimulation(id);
  }

  // ── GET /analytics/:id/charts — chart-ready transformed data ──────────────
  @Get(':id/charts')
  getCharts(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getCharts(id);
  }

  // ── GET /analytics/:id/3d — Plotly-compatible 3D visualization data ───────
  @Get(':id/3d')
  get3D(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.get3D(id);
  }

  // ── GET /analytics/:id/summary — key metrics + insights + highlights ───────
  @Get(':id/summary')
  getSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getSummary(id);
  }
}
