import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DEFAULT_ENGAGEMENT_STATE } from '../gabe/interfaces/engagement-state.interface';
import { DEFAULT_SKILL_PROFILE } from '../gabe/interfaces/skill-profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async getMe(userId: string): Promise<Profile> {
    const existing = await this.profileRepo.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const created = this.profileRepo.create({
      userId,
      displayName: user.name,
      timezone: 'UTC',
      xp: 0,
      level: 1,
      streakDays: 0,
      avatarUrl: null,
      bio: null,
      intelligenceProfileJson: { ...DEFAULT_SKILL_PROFILE },
      engagementStateJson: { ...DEFAULT_ENGAGEMENT_STATE },
      lastBehaviorTag: DEFAULT_SKILL_PROFILE.behavior_pattern,
    });

    return this.profileRepo.save(created);
  }

  async updateMe(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getMe(userId);

    if (dto.avatarUrl !== undefined) {
      profile.avatarUrl = dto.avatarUrl || null;
    }
    if (dto.displayName !== undefined) {
      profile.displayName = dto.displayName || null;
    }
    if (dto.bio !== undefined) {
      profile.bio = dto.bio || null;
    }
    if (dto.timezone !== undefined) {
      profile.timezone = dto.timezone || null;
    }

    if (!profile.intelligenceProfileJson) {
      profile.intelligenceProfileJson = { ...DEFAULT_SKILL_PROFILE };
    }

    if (!profile.engagementStateJson) {
      profile.engagementStateJson = { ...DEFAULT_ENGAGEMENT_STATE };
    }

    return this.profileRepo.save(profile);
  }
}
