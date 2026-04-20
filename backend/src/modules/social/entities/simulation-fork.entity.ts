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
import { SharedSimulation } from './shared-simulation.entity';
import { Simulation } from '../../simulations/entities/simulation.entity';

@Entity('simulation_forks')
export class SimulationFork {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @ManyToOne(() => SharedSimulation, (post) => post.forks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: SharedSimulation;

  @Index()
  @Column({ name: 'parent_simulation_id', type: 'uuid' })
  parentSimulationId: string;

  @ManyToOne(() => Simulation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_simulation_id' })
  parentSimulation: Simulation;

  @Index()
  @Column({ name: 'forked_simulation_id', type: 'uuid' })
  forkedSimulationId: string;

  @ManyToOne(() => Simulation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forked_simulation_id' })
  forkedSimulation: Simulation;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'fork_note', type: 'text', nullable: true })
  forkNote: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
