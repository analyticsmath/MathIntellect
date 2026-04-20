import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Simulation } from '../../simulations/entities/simulation.entity';

@Entity('strategies')
export class Strategy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @ManyToOne(() => Simulation, (simulation) => simulation.strategies, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'simulation_id' })
  simulation: Simulation;

  @Column({ name: 'player_name', length: 100 })
  playerName: string;

  @Column({ name: 'strategy_data', type: 'jsonb' })
  strategyData: Record<string, unknown>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
