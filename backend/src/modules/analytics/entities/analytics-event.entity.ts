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

export enum MetricType {
  MEAN = 'mean',
  VARIANCE = 'variance',
  STD_DEV = 'std_dev',
  MIN = 'min',
  MAX = 'max',
  MEDIAN = 'median',
  PERCENTILE = 'percentile',
  CUSTOM = 'custom',
}

@Entity('analytics_events')
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @ManyToOne(() => Simulation, (simulation) => simulation.analyticsEvents, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'simulation_id' })
  simulation: Simulation;

  @Index()
  @Column({ name: 'metric_type', type: 'enum', enum: MetricType })
  metricType: MetricType;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
