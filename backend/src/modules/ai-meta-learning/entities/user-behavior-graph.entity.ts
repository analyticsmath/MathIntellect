import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('user_behavior_graphs')
export class UserBehaviorGraph {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  // Legacy node map retained
  @Column({ name: 'node_weights', type: 'jsonb', default: '{}' })
  nodeWeights: Record<string, number>;

  // Legacy edge map retained
  @Column({ name: 'edge_transitions', type: 'jsonb', default: '{}' })
  edgeTransitions: Record<string, number>;

  // Phase 6 node dimensions
  @Column({ name: 'node_skill_level', type: 'float', default: 0 })
  nodeSkillLevel: number;

  @Column({ name: 'node_strategy_type', type: 'varchar', length: 64, default: 'balanced' })
  nodeStrategyType: string;

  @Column({ name: 'node_risk_profile', type: 'float', default: 50 })
  nodeRiskProfile: number;

  @Column({ name: 'node_engagement_score', type: 'float', default: 50 })
  nodeEngagementScore: number;

  // Phase 6 behavior-transition edges
  @Column({ name: 'behavior_transitions', type: 'jsonb', default: '{}' })
  behaviorTransitions: Record<string, number>;

  @Column({ name: 'drift_direction', type: 'varchar', length: 24, default: 'stable' })
  driftDirection: 'increasing' | 'decreasing' | 'stable';

  @Column({ name: 'recommended_next_strategy', type: 'text', nullable: true })
  recommendedNextStrategy: string | null;

  @Column({ name: 'behavior_summary', type: 'text', nullable: true })
  behaviorSummary: string | null;

  // Legacy trajectory fields retained
  @Column({ name: 'risk_trajectory', type: 'jsonb', default: '[]' })
  riskTrajectory: number[];

  @Column({ name: 'exploration_ratio', type: 'float', default: 0.5 })
  explorationRatio: number;

  @Column({ name: 'exploitation_ratio', type: 'float', default: 0.5 })
  exploitationRatio: number;

  @Column({ name: 'engine_preference_graph', type: 'jsonb', default: '{}' })
  enginePreferenceGraph: Record<string, number>;

  @Column({ name: 'ai_adaptation_curve', type: 'jsonb', default: '[]' })
  aiAdaptationCurve: number[];

  @Column({ name: 'intelligence_summary', type: 'text', nullable: true })
  intelligenceSummary: string | null;

  @Column({ name: 'total_simulations', type: 'int', default: 0 })
  totalSimulations: number;

  @Column({ name: 'last_simulation_type', type: 'varchar', length: 64, nullable: true })
  lastSimulationType: string | null;

  @Column({ name: 'last_behavior_type', type: 'varchar', length: 64, nullable: true })
  lastBehaviorType: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
