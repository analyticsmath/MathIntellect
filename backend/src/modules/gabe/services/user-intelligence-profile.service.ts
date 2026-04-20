import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { User } from '../../users/entities/user.entity';
import {
  EngagementState,
  LastGamificationEventState,
  normalizeEngagementState,
} from '../interfaces/engagement-state.interface';
import {
  SkillProfile,
  normalizeSkillProfile,
} from '../interfaces/skill-profile.interface';

export interface UserIntelligenceState {
  profile: Profile;
  skillProfile: SkillProfile;
  engagementState: EngagementState;
}

export interface PersistIntelligenceUpdateInput {
  userId: string;
  skillProfile: SkillProfile;
  engagementState: EngagementState;
  xpAfter: number;
  levelAfter: number;
  behaviorTag: string;
}

@Injectable()
export class UserIntelligenceProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async getState(userId: string): Promise<UserIntelligenceState> {
    const profile = await this.getOrCreateProfile(userId);

    const skillProfile = normalizeSkillProfile(profile.intelligenceProfileJson);
    const engagementState = normalizeEngagementState(
      profile.engagementStateJson,
    );

    return {
      profile,
      skillProfile,
      engagementState,
    };
  }

  async persistSimulationUpdate(
    input: PersistIntelligenceUpdateInput,
  ): Promise<Profile> {
    const profile = await this.getOrCreateProfile(input.userId);

    profile.xp = Math.max(0, Math.round(input.xpAfter));
    profile.level = Math.max(1, Math.min(100, Math.round(input.levelAfter)));
    profile.intelligenceProfileJson = normalizeSkillProfile(input.skillProfile);
    profile.engagementStateJson = normalizeEngagementState(
      input.engagementState,
    );
    profile.lastBehaviorTag = input.behaviorTag;

    return this.profileRepo.save(profile);
  }

  async updateStateOnly(
    userId: string,
    skillProfile: SkillProfile,
    engagementState: EngagementState,
    behaviorTag?: string,
  ): Promise<Profile> {
    const profile = await this.getOrCreateProfile(userId);

    profile.intelligenceProfileJson = normalizeSkillProfile(skillProfile);
    profile.engagementStateJson = normalizeEngagementState(engagementState);

    if (behaviorTag) {
      profile.lastBehaviorTag = behaviorTag;
    }

    return this.profileRepo.save(profile);
  }

  async getLatestGamificationEvent(
    userId: string,
  ): Promise<LastGamificationEventState | null> {
    const profile = await this.getOrCreateProfile(userId);
    const engagementState = normalizeEngagementState(
      profile.engagementStateJson,
    );
    return engagementState.last_event;
  }

  private async getOrCreateProfile(userId: string): Promise<Profile> {
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
      intelligenceProfileJson: null,
      engagementStateJson: null,
      lastBehaviorTag: null,
    });

    return this.profileRepo.save(created);
  }
}
