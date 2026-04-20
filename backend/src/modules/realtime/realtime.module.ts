import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { SimulationStreamService } from './simulation-stream.service';

@Module({
  providers: [RealtimeGateway, RealtimeService, SimulationStreamService],
  exports: [RealtimeService, SimulationStreamService],
})
export class RealtimeModule {}
