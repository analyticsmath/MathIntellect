import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineExecutionLog } from './entities/engine-execution-log.entity';
import { ObservabilityService } from './observability.service';
import { ObservabilityController } from './observability.controller';
import { AiConsistencyModule } from '../ai-consistency/ai-consistency.module';

@Module({
  imports: [TypeOrmModule.forFeature([EngineExecutionLog]), AiConsistencyModule],
  providers: [ObservabilityService],
  controllers: [ObservabilityController],
  exports: [ObservabilityService],
})
export class ObservabilityModule {}
