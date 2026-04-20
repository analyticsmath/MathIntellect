import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiReasoningCache } from './entities/ai-reasoning-cache.entity';
import { AiConsistencyLockService } from './ai-consistency-lock.service';
import { AiPromptVersioningService } from './ai-prompt-versioning.service';

@Module({
  imports: [TypeOrmModule.forFeature([AiReasoningCache])],
  providers: [AiConsistencyLockService, AiPromptVersioningService],
  exports: [AiConsistencyLockService, AiPromptVersioningService],
})
export class AiConsistencyModule {}
