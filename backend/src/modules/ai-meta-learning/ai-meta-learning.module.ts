import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiBehaviorProfile } from './entities/ai-behavior-profile.entity';
import { UserBehaviorGraph } from './entities/user-behavior-graph.entity';
import { AiMetaLearningService } from './ai-meta-learning.service';
import { AiBehaviorGraphService } from './ai-behavior-graph.service';

@Module({
  imports: [TypeOrmModule.forFeature([AiBehaviorProfile, UserBehaviorGraph])],
  providers: [AiMetaLearningService, AiBehaviorGraphService],
  exports: [AiMetaLearningService, AiBehaviorGraphService],
})
export class AiMetaLearningModule {}
