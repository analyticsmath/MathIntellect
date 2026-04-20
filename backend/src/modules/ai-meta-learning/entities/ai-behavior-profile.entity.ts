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

@Entity('ai_behavior_profiles')
export class AiBehaviorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'cluster_label', length: 80, default: 'balanced_explorer' })
  clusterLabel: string;

  @Column({ name: 'explanation_style', length: 40, default: 'balanced' })
  explanationStyle: string;

  @Column({ name: 'simulation_preference_json', type: 'jsonb', default: {} })
  simulationPreferenceJson: Record<string, number>;

  @Column({ name: 'consistency_drift', type: 'float', default: 0 })
  consistencyDrift: number;

  @Column({ name: 'stagnation_score', type: 'float', default: 0 })
  stagnationScore: number;

  @Column({ name: 'personality_drift', type: 'float', default: 0 })
  personalityDrift: number;

  @Column({ name: 'adaptive_prompt_tuning_json', type: 'jsonb', default: {} })
  adaptivePromptTuningJson: Record<string, unknown>;

  @Column({ name: 'recent_simulation_hashes_json', type: 'jsonb', default: [] })
  recentSimulationHashesJson: string[];

  @Column({ name: 'recommendation_memory_json', type: 'jsonb', nullable: true })
  recommendationMemoryJson: Record<string, unknown> | null;

  @Column({ name: 'last_coach_at', type: 'timestamp', nullable: true })
  lastCoachAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
