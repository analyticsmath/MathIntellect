import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Version(VERSION_NEUTRAL)
  health(): Record<string, unknown> {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
    };
  }
}
