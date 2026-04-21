import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Simulation } from '../../simulations/entities/simulation.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Achievement } from '../../foundation/entities/achievement.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { SavedModel } from '../../saved-models/entities/saved-model.entity';
import { ActivityLog } from '../../foundation/entities/activity-log.entity';
import { UserSettings } from '../../foundation/entities/user-settings.entity';
import { Follower } from '../../foundation/entities/follower.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Production schema uses `username`; map it to the `name` property expected by app code.
  @Column({ name: 'username', length: 100 })
  name: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Simulation, (simulation) => simulation.createdBy)
  simulations: Simulation[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Achievement, (achievement) => achievement.user)
  achievements: Achievement[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => SavedModel, (savedModel) => savedModel.user)
  savedModels: SavedModel[];

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];

  @OneToOne(() => UserSettings, (settings) => settings.user)
  settings: UserSettings;

  @OneToMany(() => Follower, (follower) => follower.following)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.follower)
  following: Follower[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
}
