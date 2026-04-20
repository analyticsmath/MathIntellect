import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProgressionTrack } from '../progression.types';

@Entity('user_progression')
export class UserProgression {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'current_track',
    type: 'enum',
    enum: ProgressionTrack,
    default: ProgressionTrack.STRATEGIST,
  })
  currentTrack: ProgressionTrack;

  @Column({
    name: 'track_experience_json',
    type: 'jsonb',
    nullable: false,
    default: {},
  })
  trackExperienceJson: Record<string, number>;

  @Column({ name: 'skill_points', type: 'int', default: 0 })
  skillPoints: number;

  @Column({ name: 'intelligence_rank', type: 'int', default: 1 })
  intelligenceRank: number;

  @Column({ name: 'intelligence_rank_label', length: 80, default: 'Analyst' })
  intelligenceRankLabel: string;

  @Column({
    name: 'unlocked_engines_json',
    type: 'jsonb',
    nullable: false,
    default: [],
  })
  unlockedEnginesJson: string[];

  @Column({
    name: 'unlocked_features_json',
    type: 'jsonb',
    nullable: false,
    default: [],
  })
  unlockedFeaturesJson: string[];

  @Column({ name: 'behavior_style', length: 64, default: 'balanced' })
  behaviorStyle: string;

  @Column({ name: 'explanation_depth', type: 'int', default: 1 })
  explanationDepth: number;

  @Column({ name: 'visualization_richness', type: 'int', default: 1 })
  visualizationRichness: number;

  @Column({ name: 'complexity_scale', type: 'float', default: 1 })
  complexityScale: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
