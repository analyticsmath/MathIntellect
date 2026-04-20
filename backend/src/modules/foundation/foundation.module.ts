import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { UserSettings } from './entities/user-settings.entity';
import { Follower } from './entities/follower.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      ActivityLog,
      UserSettings,
      Follower,
    ]),
  ],
})
export class FoundationModule {}
