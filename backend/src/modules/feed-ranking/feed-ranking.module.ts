import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedRankingSnapshot } from './entities/feed-ranking-snapshot.entity';
import { FeedRankingService } from './feed-ranking.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedRankingSnapshot])],
  providers: [FeedRankingService],
  exports: [FeedRankingService],
})
export class FeedRankingModule {}
