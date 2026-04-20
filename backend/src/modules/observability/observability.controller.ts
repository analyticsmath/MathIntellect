import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ObservabilityService } from './observability.service';

@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  // Required endpoint: GET /api/v1/metrics/system-health
  @Get('system-health')
  async getSystemHealth(@Query('window') window?: string) {
    const hours = window ? parseInt(window, 10) : 24;
    return this.observabilityService.getSystemHealth(
      Number.isNaN(hours) ? 24 : hours,
    );
  }
}
