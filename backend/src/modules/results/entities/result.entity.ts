import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Simulation } from '../../simulations/entities/simulation.entity';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @ManyToOne(() => Simulation, (simulation) => simulation.results, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'simulation_id' })
  simulation: Simulation;

  @Column({ name: 'data', type: 'jsonb' })
  outcomeData: Record<string, unknown>;

  @Column({ name: 'metrics', type: 'jsonb', nullable: true })
  metrics: Record<string, unknown> | null;

  @Column({ name: 'execution_time', type: 'float', nullable: true })
  executionTime: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
