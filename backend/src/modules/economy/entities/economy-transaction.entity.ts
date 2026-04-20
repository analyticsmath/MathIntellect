import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Simulation } from '../../simulations/entities/simulation.entity';

export enum EconomyTransactionType {
  SIMULATION_REWARD = 'simulation_reward',
  SKILL_POINT_ALLOCATION = 'skill_point_allocation',
  DECAY_PENALTY = 'decay_penalty',
}

@Entity('economy_transactions')
export class EconomyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid', nullable: true })
  simulationId: string | null;

  @ManyToOne(() => Simulation, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'simulation_id' })
  simulation: Simulation | null;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: EconomyTransactionType,
    default: EconomyTransactionType.SIMULATION_REWARD,
  })
  transactionType: EconomyTransactionType;

  @Column({ name: 'base_xp', type: 'int', default: 0 })
  baseXp: number;

  @Column({ name: 'multiplier', type: 'float', default: 1 })
  multiplier: number;

  @Column({ name: 'novelty_bonus', type: 'float', default: 0 })
  noveltyBonus: number;

  @Column({ name: 'high_risk_bonus', type: 'float', default: 0 })
  highRiskBonus: number;

  @Column({ name: 'decay_penalty', type: 'float', default: 0 })
  decayPenalty: number;

  @Column({ name: 'final_xp', type: 'int', default: 0 })
  finalXp: number;

  @Column({ name: 'metadata_json', type: 'jsonb', nullable: true })
  metadataJson: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
