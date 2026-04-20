import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  Simulation,
  SimulationType,
} from '../../simulations/entities/simulation.entity';
import { SimulationLike } from './simulation-like.entity';
import { SimulationComment } from './simulation-comment.entity';
import { SimulationFork } from './simulation-fork.entity';

@Entity('social_feed_posts')
export class SharedSimulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @ManyToOne(() => Simulation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'simulation_id' })
  simulation: Simulation;

  @Index()
  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ length: 180 })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ name: 'ai_insight_summary', type: 'text' })
  aiInsightSummary: string;

  @Column({ name: 'simulation_type', type: 'enum', enum: SimulationType })
  simulationType: SimulationType;

  @Column({ name: 'performance_score', type: 'float', default: 0 })
  performanceScore: number;

  @Column({ name: 'preview_json', type: 'jsonb', nullable: true })
  previewJson: Record<string, unknown> | null;

  @Column({ name: 'snapshot_3d_ref', type: 'text', nullable: true })
  snapshot3dRef: string | null;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'likes_count', type: 'int', default: 0 })
  likesCount: number;

  @Column({ name: 'comments_count', type: 'int', default: 0 })
  commentsCount: number;

  @Column({ name: 'forks_count', type: 'int', default: 0 })
  forksCount: number;

  @OneToMany(() => SimulationLike, (like) => like.post)
  likes: SimulationLike[];

  @OneToMany(() => SimulationComment, (comment) => comment.post)
  comments: SimulationComment[];

  @OneToMany(() => SimulationFork, (fork) => fork.post)
  forks: SimulationFork[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
