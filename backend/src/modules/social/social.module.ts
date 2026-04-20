import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { SharedSimulation } from './entities/shared-simulation.entity';
import { SimulationLike } from './entities/simulation-like.entity';
import { SimulationComment } from './entities/simulation-comment.entity';
import { SimulationFork } from './entities/simulation-fork.entity';
import { Simulation } from '../simulations/entities/simulation.entity';
import { Result } from '../results/entities/result.entity';
import { FeedRankingModule } from '../feed-ranking/feed-ranking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SharedSimulation,
      SimulationLike,
      SimulationComment,
      SimulationFork,
      Simulation,
      Result,
    ]),
    FeedRankingModule,
  ],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
