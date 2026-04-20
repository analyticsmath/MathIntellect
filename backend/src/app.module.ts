import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SimulationsModule } from './modules/simulations/simulations.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { StrategiesModule } from './modules/strategies/strategies.module';
import { ResultsModule } from './modules/results/results.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { ProfileModule } from './modules/profile/profile.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SavedModelsModule } from './modules/saved-models/saved-models.module';
import { FoundationModule } from './modules/foundation/foundation.module';
import { AiModule } from './modules/ai/ai.module';
import { GabeModule } from './modules/gabe/gabe.module';
import { EconomyModule } from './modules/economy/economy.module';
import { ProgressionModule } from './modules/progression/progression.module';
import { SocialModule } from './modules/social/social.module';
import { AiMetaLearningModule } from './modules/ai-meta-learning/ai-meta-learning.module';
import { DeterminismModule } from './modules/determinism/determinism.module';
import { AiConsistencyModule } from './modules/ai-consistency/ai-consistency.module';
import { EngineSafetyModule } from './modules/engine-safety/engine-safety.module';
import { FeedRankingModule } from './modules/feed-ranking/feed-ranking.module';
import { ObservabilityModule } from './modules/observability/observability.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration — load once, globally available
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    // Database — TypeORM configured from env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),

    // Domain modules
    AuthModule,
    UsersModule,
    SimulationsModule,
    AnalyticsModule,
    StrategiesModule,
    ResultsModule,
    RealtimeModule,
    ProfileModule,
    NotificationsModule,
    SavedModelsModule,
    FoundationModule,
    AiModule,
    GabeModule,
    EconomyModule,
    ProgressionModule,
    SocialModule,
    AiMetaLearningModule,
    DeterminismModule,
    AiConsistencyModule,
    EngineSafetyModule,
    FeedRankingModule,
    ObservabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
