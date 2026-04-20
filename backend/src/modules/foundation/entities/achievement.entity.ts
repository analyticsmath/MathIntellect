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

@Entity('achievements')
@Index(['userId', 'key'], { unique: true })
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.achievements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 120 })
  key: string;

  @Column({
    name: 'unlocked_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  unlockedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
