import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgression } from './entities/user-progression.entity';
import { SkillTreeNode } from './entities/skill-tree-node.entity';
import { ProgressionService } from './progression.service';
import { ProgressionController } from './progression.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserProgression, SkillTreeNode])],
  providers: [ProgressionService],
  controllers: [ProgressionController],
  exports: [ProgressionService],
})
export class ProgressionModule {}
