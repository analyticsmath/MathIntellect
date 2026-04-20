import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedRankingSnapshot } from './entities/feed-ranking-snapshot.entity';
import { SharedSimulation } from '../social/entities/shared-simulation.entity';

const COMPLEXITY_SCORE: Record<string, number> = {
  conflict: 90,
  game_theory: 80,
  market: 70,
  monte_carlo: 60,
  custom: 55,
};

export interface RankingDebug {
  engagement: number;
  xp_value: number;
  simulation_complexity: number;
  novelty_factor: number;
}

export interface RankedFeedItem {
  post: SharedSimulation;
  score: number;
  debug?: RankingDebug;
}

@Injectable()
export class FeedRankingService {
  private readonly logger = new Logger(FeedRankingService.name);

  constructor(
    @InjectRepository(FeedRankingSnapshot)
    private readonly snapshotRepo: Repository<FeedRankingSnapshot>,
  ) {}

  rankPosts(
    posts: SharedSimulation[],
    options?: { debug?: boolean },
  ): RankedFeedItem[] {
    const byAuthorType = new Map<string, number>();

    for (const post of posts) {
      const key = `${post.authorId}:${post.simulationType}`;
      byAuthorType.set(key, (byAuthorType.get(key) ?? 0) + 1);
    }

    const ranked = posts.map((post) => {
      const engagement = this.clamp(
        post.likesCount * 3 + post.commentsCount * 4 + post.forksCount * 5,
        0,
        100,
      );

      // xp_value proxy: use bounded performance score as deterministic value.
      const xpValue = this.clamp(post.performanceScore ?? 0, 0, 100);
      const simulationComplexity =
        COMPLEXITY_SCORE[post.simulationType ?? 'custom'] ?? 50;

      const authorTypeKey = `${post.authorId}:${post.simulationType}`;
      const repeatPenalty =
        Math.max(0, (byAuthorType.get(authorTypeKey) ?? 1) - 1) * 8;
      const ageHours = Math.max(
        0,
        (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60),
      );
      const agePenalty = Math.min(45, ageHours * 0.55);
      const noveltyFactor = this.clamp(
        100 - repeatPenalty - agePenalty,
        0,
        100,
      );

      const score =
        engagement * 0.35 +
        xpValue * 0.25 +
        simulationComplexity * 0.2 +
        noveltyFactor * 0.2;

      const debug: RankingDebug = {
        engagement: Number(engagement.toFixed(4)),
        xp_value: Number(xpValue.toFixed(4)),
        simulation_complexity: Number(simulationComplexity.toFixed(4)),
        novelty_factor: Number(noveltyFactor.toFixed(4)),
      };

      return {
        post,
        score: Number(score.toFixed(6)),
        ...(options?.debug ? { debug } : {}),
      };
    });

    ranked.sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const createdAtDelta =
        right.post.createdAt.getTime() - left.post.createdAt.getTime();
      if (createdAtDelta !== 0) {
        return createdAtDelta;
      }

      return right.post.id.localeCompare(left.post.id);
    });

    return ranked;
  }

  async snapshotRankingsForUser(
    userId: string,
    rankedItems: RankedFeedItem[],
  ): Promise<void> {
    try {
      const snapshotRows = rankedItems.map((item) => {
        const debug = item.debug ?? {
          engagement: 0,
          xp_value: 0,
          simulation_complexity: 0,
          novelty_factor: 0,
        };

        return this.snapshotRepo.create({
          postId: item.post.id,
          simulationId: item.post.simulationId,
          userId,
          rankScore: item.score,
          xpValue: debug.xp_value,
          simulationComplexity: debug.simulation_complexity,
          noveltyFactor: debug.novelty_factor,
          engagement: debug.engagement,
          xpComponent: debug.xp_value,
          complexityComponent: debug.simulation_complexity,
          noveltyComponent: debug.novelty_factor,
          engagementComponent: debug.engagement,
          recencyComponent: 0,
          isFeatured: item.score >= 75,
          computedAt: new Date(),
        });
      });

      if (snapshotRows.length > 0) {
        await this.snapshotRepo.save(snapshotRows);
      }
    } catch (err) {
      this.logger.warn(
        `Feed ranking snapshot write failed for user ${userId}: ${(err as Error).message}`,
      );
    }
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
