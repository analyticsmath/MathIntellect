import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Simulation,
  SimulationStatus,
  SimulationType,
} from '../simulations/entities/simulation.entity';
import { Result } from '../results/entities/result.entity';
import { SharedSimulation } from './entities/shared-simulation.entity';
import { SimulationLike } from './entities/simulation-like.entity';
import { SimulationComment } from './entities/simulation-comment.entity';
import { SimulationFork } from './entities/simulation-fork.entity';
import { ShareSimulationDto } from './dto/share-simulation.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { CommentDto } from './dto/comment.dto';
import { ForkSimulationDto } from './dto/fork-simulation.dto';
import {
  FeedRankingService,
  RankedFeedItem,
} from '../feed-ranking/feed-ranking.service';

interface FeedCursor {
  createdAt: Date;
  id: string;
}

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SharedSimulation)
    private readonly sharedRepo: Repository<SharedSimulation>,
    @InjectRepository(SimulationLike)
    private readonly likeRepo: Repository<SimulationLike>,
    @InjectRepository(SimulationComment)
    private readonly commentRepo: Repository<SimulationComment>,
    @InjectRepository(SimulationFork)
    private readonly forkRepo: Repository<SimulationFork>,
    @InjectRepository(Simulation)
    private readonly simulationsRepo: Repository<Simulation>,
    @InjectRepository(Result)
    private readonly resultsRepo: Repository<Result>,
    private readonly feedRankingService: FeedRankingService,
  ) {}

  async shareSimulation(userId: string, dto: ShareSimulationDto) {
    try {
      const simulation = await this.simulationsRepo.findOne({
        where: { id: dto.simulationId },
        relations: ['createdBy'],
      });

      if (!simulation) {
        throw new NotFoundException(`Simulation ${dto.simulationId} not found`);
      }

      if (simulation.createdBy?.id && simulation.createdBy.id !== userId) {
        throw new ForbiddenException(
          'Only the owner can share this simulation',
        );
      }

      const latestResult = await this.resultsRepo.findOne({
        where: { simulationId: simulation.id },
        order: { createdAt: 'DESC' },
      });

      const performanceScore = this.estimatePerformanceScore(
        simulation.type,
        latestResult?.outcomeData ?? null,
      );

      const aiInsightSummary = this.buildInsightSummary(
        simulation.type,
        performanceScore,
        latestResult?.outcomeData ?? null,
      );

      const preview = this.buildPreview(
        simulation,
        latestResult?.outcomeData ?? null,
      );

      const post = this.sharedRepo.create({
        simulationId: simulation.id,
        authorId: userId,
        title: dto.title ?? `${simulation.name} Intelligence Artifact`,
        summary: dto.summary ?? simulation.description ?? null,
        aiInsightSummary,
        simulationType: simulation.type,
        performanceScore,
        previewJson: preview,
        snapshot3dRef: `/api/v1/analytics/${simulation.id}/3d`,
        isPublic: dto.isPublic ?? true,
      });

      return await this.sharedRepo.save(post);
    } catch (error) {
      if (this.isMissingSocialSchema(error)) {
        return {
          id: 'social-disabled',
          simulationId: dto.simulationId,
          authorId: userId,
          title: dto.title ?? 'Shared simulation',
          summary: dto.summary ?? null,
          isPublic: dto.isPublic ?? true,
          status: 'social_schema_missing',
        };
      }
      throw error;
    }
  }

  async getFeed(query: FeedQueryDto, userId?: string) {
    try {
      const limit = this.clampInt(query.limit ?? 12, 1, 50);
      const page = this.clampInt(query.page ?? 1, 1, 10_000);
      const cursor = this.parseCursor(query.cursor);
      const debug = query.debug === true;

      const allPublicPosts = await this.sharedRepo.find({
        where: { isPublic: true },
        relations: ['simulation', 'author'],
        order: { createdAt: 'DESC', id: 'DESC' },
        take: 500,
      });

      const ranked = this.feedRankingService.rankPosts(allPublicPosts, {
        debug,
      });

      if (userId) {
        await this.feedRankingService.snapshotRankingsForUser(
          userId,
          ranked.slice(0, Math.min(120, ranked.length)),
        );
      }

      const startIndex = cursor
        ? this.indexAfterCursor(ranked, cursor)
        : (page - 1) * limit;
      const sliced = ranked.slice(startIndex, startIndex + limit);
      const hasMore = startIndex + limit < ranked.length;
      const nextCursor =
        hasMore && sliced.length > 0
          ? this.buildCursor(
              sliced[sliced.length - 1].post.createdAt,
              sliced[sliced.length - 1].post.id,
            )
          : null;

      return {
        ranked: true,
        items: sliced.map((item) => this.toRankedApiItem(item, debug)),
        posts: sliced.map((item) => this.toLegacyFeedPost(item)),
        total: ranked.length,
        hasMore,
        page,
        pageInfo: {
          hasMore,
          nextCursor,
        },
      };
    } catch (error) {
      if (this.isMissingSocialSchema(error)) {
        return {
          ranked: true,
          items: [],
          posts: [],
          total: 0,
          hasMore: false,
          page: this.clampInt(query.page ?? 1, 1, 10_000),
          pageInfo: {
            hasMore: false,
            nextCursor: null,
          },
        };
      }
      throw error;
    }
  }

  async toggleLike(userId: string, postId: string) {
    try {
      const post = await this.sharedRepo.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException(`Social post ${postId} not found`);
      }

      const existing = await this.likeRepo.findOne({
        where: { postId, userId },
      });

      if (existing) {
        await this.likeRepo.remove(existing);
        await this.sharedRepo.decrement({ id: postId }, 'likesCount', 1);
      } else {
        await this.likeRepo.save(this.likeRepo.create({ postId, userId }));
        await this.sharedRepo.increment({ id: postId }, 'likesCount', 1);
      }

      const refreshed = await this.sharedRepo.findOne({
        where: { id: postId },
      });

      return {
        liked: !existing,
        likesCount: Math.max(0, refreshed?.likesCount ?? 0),
      };
    } catch (error) {
      if (this.isMissingSocialSchema(error)) {
        return {
          liked: false,
          likesCount: 0,
        };
      }
      throw error;
    }
  }

  async addComment(userId: string, dto: CommentDto) {
    try {
      const post = await this.sharedRepo.findOne({ where: { id: dto.postId } });
      if (!post) {
        throw new NotFoundException(`Social post ${dto.postId} not found`);
      }

      const comment = this.commentRepo.create({
        postId: dto.postId,
        userId,
        content: dto.content,
      });

      const saved = await this.commentRepo.save(comment);
      await this.sharedRepo.increment({ id: dto.postId }, 'commentsCount', 1);

      return saved;
    } catch (error) {
      if (this.isMissingSocialSchema(error)) {
        return {
          id: 'comment-disabled',
          postId: dto.postId,
          userId,
          content: dto.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      throw error;
    }
  }

  async forkSimulation(userId: string, postId: string, dto: ForkSimulationDto) {
    try {
      const post = await this.sharedRepo.findOne({
        where: { id: postId },
        relations: ['simulation'],
      });

      if (!post) {
        throw new NotFoundException(`Social post ${postId} not found`);
      }

      const parentSimulation = post.simulation;
      if (!parentSimulation) {
        throw new NotFoundException('Parent simulation is missing');
      }

      const forkedSimulation = await this.simulationsRepo.save(
        this.simulationsRepo.create({
          name: `Fork: ${parentSimulation.name}`,
          description:
            dto.note ??
            `Forked from shared simulation ${post.id} at ${new Date().toISOString()}`,
          type: parentSimulation.type,
          status: SimulationStatus.PENDING,
          parameters: {
            ...(parentSimulation.parameters ?? {}),
            socialForkMeta: {
              parentSimulationId: parentSimulation.id,
              postId,
            },
          },
          createdBy: { id: userId },
        }),
      );

      const forkRecord = await this.forkRepo.save(
        this.forkRepo.create({
          postId,
          parentSimulationId: parentSimulation.id,
          forkedSimulationId: forkedSimulation.id,
          userId,
          forkNote: dto.note ?? null,
        }),
      );

      await this.sharedRepo.increment({ id: postId }, 'forksCount', 1);

      return {
        fork: forkRecord,
        simulation: forkedSimulation,
        simulationId: forkedSimulation.id,
      };
    } catch (error) {
      if (this.isMissingSocialSchema(error)) {
        return {
          fork: null,
          simulation: null,
          simulationId: postId,
        };
      }
      throw error;
    }
  }

  private estimatePerformanceScore(
    type: SimulationType,
    payload: Record<string, unknown> | null,
  ): number {
    if (!payload) return 0;

    switch (type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM: {
        const expected = this.number(payload.expectedValue, 0);
        const std = Math.sqrt(Math.max(0, this.number(payload.variance, 0)));
        return this.clamp(52 + expected * 0.8 - std * 0.3, 0, 100);
      }
      case SimulationType.MARKET: {
        const annualizedReturn = this.number(payload.annualizedReturn, 0);
        const drawdown = this.number(payload.maxDrawdown, 0) * 100;
        return this.clamp(50 + annualizedReturn * 120 - drawdown * 0.4, 0, 100);
      }
      case SimulationType.GAME_THEORY: {
        const expectedPayoffs = Object.values(
          (payload.expectedPayoffs as Record<string, unknown>) ?? {},
        )
          .map((value) => this.number(value, 0))
          .filter((value) => Number.isFinite(value));
        const meanPayoff =
          expectedPayoffs.length > 0
            ? expectedPayoffs.reduce((sum, value) => sum + value, 0) /
              expectedPayoffs.length
            : 0;
        const equilibria = Array.isArray(payload.nashEquilibria)
          ? payload.nashEquilibria.length
          : 0;
        return this.clamp(48 + meanPayoff * 12 + equilibria * 6, 0, 100);
      }
      case SimulationType.CONFLICT: {
        const cooperation = this.number(payload.cooperationRate, 0) * 100;
        const rounds = this.number(payload.rounds, 0);
        return this.clamp(
          35 + cooperation * 0.55 + Math.min(20, rounds / 20),
          0,
          100,
        );
      }
      default:
        return 50;
    }
  }

  private buildInsightSummary(
    type: SimulationType,
    performanceScore: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _payload: Record<string, unknown> | null,
  ): string {
    const scoreTag =
      performanceScore >= 72
        ? 'high-performing'
        : performanceScore >= 52
          ? 'balanced'
          : 'volatile';

    switch (type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return `Monte Carlo artifact indicates ${scoreTag} outcome quality with confidence interval pressure tracked across scenario branches.`;
      case SimulationType.MARKET:
        return `Market artifact indicates ${scoreTag} regime behavior with drawdown-aware scoring and sentiment proxy alignment.`;
      case SimulationType.GAME_THEORY:
        return `Game-theory artifact indicates ${scoreTag} strategic stability with coalition and reputation effects highlighted.`;
      case SimulationType.CONFLICT:
        return `Conflict artifact indicates ${scoreTag} multi-agent dynamics with trust drift and betrayal pressure signals.`;
      default:
        return `Shared simulation artifact indicates ${scoreTag} system behavior.`;
    }
  }

  private buildPreview(
    simulation: Simulation,
    payload: Record<string, unknown> | null,
  ): Record<string, unknown> {
    return {
      simulationId: simulation.id,
      name: simulation.name,
      type: simulation.type,
      status: simulation.status,
      createdAt: simulation.createdAt,
      snapshot: this.previewKpis(simulation.type, payload),
    };
  }

  private previewKpis(
    type: SimulationType,
    payload: Record<string, unknown> | null,
  ): Record<string, unknown> {
    if (!payload) {
      return {};
    }

    switch (type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return {
          expectedValue: this.number(payload.expectedValue, 0),
          variance: this.number(payload.variance, 0),
          p95: this.number(payload.percentile95, 0),
          p5: this.number(payload.percentile5, 0),
        };
      case SimulationType.MARKET:
        return {
          expectedFinalPrice: this.number(payload.expectedFinalPrice, 0),
          var95: this.number(payload.valueAtRisk95, 0),
          maxDrawdown: this.number(payload.maxDrawdown, 0),
        };
      case SimulationType.GAME_THEORY:
        return {
          equilibria: Array.isArray(payload.nashEquilibria)
            ? payload.nashEquilibria.length
            : 0,
          expectedPayoffs: payload.expectedPayoffs ?? {},
        };
      case SimulationType.CONFLICT:
        return {
          rounds: this.number(payload.rounds, 0),
          cooperationRate: this.number(payload.cooperationRate, 0),
          winner: payload.winner ?? null,
        };
      default:
        return {};
    }
  }

  private indexAfterCursor(
    ranked: RankedFeedItem[],
    cursor: FeedCursor,
  ): number {
    const index = ranked.findIndex(
      (item) =>
        item.post.id === cursor.id &&
        item.post.createdAt.getTime() === cursor.createdAt.getTime(),
    );

    if (index < 0) {
      return 0;
    }

    return index + 1;
  }

  private toRankedApiItem(item: RankedFeedItem, debug: boolean) {
    return {
      id: item.post.id,
      title: item.post.title,
      summary: item.post.summary,
      aiInsightSummary: item.post.aiInsightSummary,
      performanceScore: Number(item.post.performanceScore.toFixed(3)),
      simulationType: item.post.simulationType,
      simulationId: item.post.simulationId,
      preview: item.post.previewJson,
      snapshot3d: {
        lazy: true,
        href: item.post.snapshot3dRef,
      },
      engagement: {
        likes: item.post.likesCount,
        comments: item.post.commentsCount,
        forks: item.post.forksCount,
      },
      author: {
        id: item.post.author?.id,
        name: item.post.author?.name,
      },
      rankScore: item.score,
      ...(debug && item.debug ? { scoreMetadata: item.debug } : {}),
      createdAt: item.post.createdAt,
    };
  }

  private toLegacyFeedPost(item: RankedFeedItem) {
    return {
      id: item.post.id,
      userId: item.post.authorId,
      userName: item.post.author?.name ?? 'Anonymous',
      userLevel: 1,
      userBehaviorTag: 'Strategist',
      simulationId: item.post.simulationId,
      simulationName: item.post.title,
      simulationType: item.post.simulationType,
      xpGained: Math.round(this.clamp(item.post.performanceScore, 0, 100)),
      aiSummary: item.post.aiInsightSummary,
      forkCount: item.post.forksCount,
      likeCount: item.post.likesCount,
      liked: false,
      createdAt: item.post.createdAt.toISOString(),
      thumbnailColor: this.feedColor(item.post.simulationType),
      rankScore: item.score,
    };
  }

  private feedColor(type: SimulationType): string {
    switch (type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return '#8ef3e4';
      case SimulationType.GAME_THEORY:
        return '#b4d9ff';
      case SimulationType.MARKET:
        return '#ffd49e';
      case SimulationType.CONFLICT:
        return '#ff9db2';
      default:
        return '#b4d9ff';
    }
  }

  private parseCursor(raw: string | undefined): FeedCursor | null {
    if (!raw) return null;

    const [createdAt, id] = raw.split('|');
    const date = new Date(createdAt);

    if (!createdAt || !id || Number.isNaN(date.getTime())) {
      return null;
    }

    return {
      createdAt: date,
      id,
    };
  }

  private buildCursor(createdAt: Date, id: string): string {
    return `${createdAt.toISOString()}|${id}`;
  }

  private number(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : fallback;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  private clampInt(value: number, min: number, max: number): number {
    return Math.round(this.clamp(value, min, max));
  }

  private isMissingSocialSchema(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    return (
      error.message.includes('relation "social_feed_posts" does not exist') ||
      error.message.includes('relation "simulation_likes" does not exist') ||
      error.message.includes('relation "simulation_comments" does not exist') ||
      error.message.includes('relation "simulation_forks" does not exist')
    );
  }
}
