import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SharedSimulation } from './shared-simulation.entity';

@Entity('simulation_likes')
@Unique(['postId', 'userId'])
export class SimulationLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @ManyToOne(() => SharedSimulation, (post) => post.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: SharedSimulation;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
