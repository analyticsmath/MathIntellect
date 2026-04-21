import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Strategy } from '../../strategies/entities/strategy.entity';
import { Result } from '../../results/entities/result.entity';
import { AnalyticsEvent } from '../../analytics/entities/analytics-event.entity';

export enum SimulationType {
  CONFLICT = 'conflict',
  MARKET = 'market',
  MONTE_CARLO = 'monte_carlo',
  GAME_THEORY = 'game_theory',
  CUSTOM = 'custom',
}

export enum SimulationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('simulations')
export class Simulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    default: SimulationType.CUSTOM,
  })
  type: SimulationType;

  @Column({ name: 'config', type: 'jsonb', nullable: true })
  parameters: Record<string, unknown>;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    default: SimulationStatus.PENDING,
  })
  status: SimulationStatus;

  // FK column — owned by @JoinColumn, no separate @Column decorator
  @Index()
  @ManyToOne(() => User, (user) => user.simulations, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Strategy, (strategy) => strategy.simulation)
  strategies: Strategy[];

  @OneToMany(() => Result, (result) => result.simulation)
  results: Result[];

  @OneToMany(() => AnalyticsEvent, (event) => event.simulation)
  analyticsEvents: AnalyticsEvent[];
}
