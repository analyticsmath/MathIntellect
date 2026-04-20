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
import type { EngagementState } from '../../gabe/interfaces/engagement-state.interface';
import type { SkillProfile } from '../../gabe/interfaces/skill-profile.interface';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  displayName: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'int', default: 0 })
  xp: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ name: 'streak_days', type: 'int', default: 0 })
  streakDays: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  timezone: string | null;

  @Column({
    name: 'intelligence_profile_json',
    type: 'jsonb',
    nullable: true,
  })
  intelligenceProfileJson: SkillProfile | null;

  @Column({
    name: 'engagement_state_json',
    type: 'jsonb',
    nullable: true,
  })
  engagementStateJson: EngagementState | null;

  @Column({
    name: 'last_behavior_tag',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  lastBehaviorTag: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
