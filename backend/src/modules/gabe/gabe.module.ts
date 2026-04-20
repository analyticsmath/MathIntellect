import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { AdaptiveDifficultyService } from './services/adaptive-difficulty.service';
import { BehaviorAnalyzerService } from './services/behavior-analyzer.service';
import { EngagementEngineService } from './services/engagement-engine.service';
import { ProgressionEngineService } from './services/progression-engine.service';
import { SimulationAdapterService } from './services/simulation-adapter.service';
import { SkillModelService } from './services/skill-model.service';
import { UserIntelligenceProfileService } from './services/user-intelligence-profile.service';
import { XpIntelligenceService } from './services/xp-intelligence.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  providers: [
    UserIntelligenceProfileService,
    SkillModelService,
    AdaptiveDifficultyService,
    BehaviorAnalyzerService,
    XpIntelligenceService,
    EngagementEngineService,
    ProgressionEngineService,
    SimulationAdapterService,
  ],
  exports: [
    UserIntelligenceProfileService,
    SkillModelService,
    AdaptiveDifficultyService,
    BehaviorAnalyzerService,
    XpIntelligenceService,
    EngagementEngineService,
    ProgressionEngineService,
    SimulationAdapterService,
  ],
})
export class GabeModule {}
