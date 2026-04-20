import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('feed_ranking_snapshots')
export class FeedRankingSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'post_id', type: 'uuid', nullable: true })
  postId: string | null;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'rank_score', type: 'float', default: 0 })
  rankScore: number;

  @Column({ name: 'xp_value', type: 'float', default: 0 })
  xpValue: number;

  @Column({ name: 'simulation_complexity', type: 'float', default: 0 })
  simulationComplexity: number;

  @Column({ name: 'novelty_factor', type: 'float', default: 0 })
  noveltyFactor: number;

  @Column({ name: 'engagement', type: 'float', default: 0 })
  engagement: number;

  // Legacy component fields retained
  @Column({ name: 'xp_component', type: 'float', default: 0 })
  xpComponent: number;

  @Column({ name: 'complexity_component', type: 'float', default: 0 })
  complexityComponent: number;

  @Column({ name: 'novelty_component', type: 'float', default: 0 })
  noveltyComponent: number;

  @Column({ name: 'engagement_component', type: 'float', default: 0 })
  engagementComponent: number;

  @Column({ name: 'recency_component', type: 'float', default: 0 })
  recencyComponent: number;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'computed_at', type: 'timestamptz' })
  computedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
