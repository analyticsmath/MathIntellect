import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Simulation } from './entities/simulation.entity';
import { SimulationsService } from './simulations.service';
import { SimulationsController } from './simulations.controller';
import { SimulationEngineService } from './engine/simulation-engine.service';
import { MonteCarloEngine } from './engine/monte-carlo.engine';
import { GameTheoryEngine } from './engine/game-theory.engine';
import { MarketEngine } from './engine/market.engine';
import { ConflictEngine } from './engine/conflict.engine';
import { ResultsModule } from '../results/results.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { GabeModule } from '../gabe/gabe.module';
import { EconomyModule } from '../economy/economy.module';
import { ProgressionModule } from '../progression/progression.module';
import { AiMetaLearningModule } from '../ai-meta-learning/ai-meta-learning.module';
import { DeterminismModule } from '../determinism/determinism.module';
import { EngineSafetyModule } from '../engine-safety/engine-safety.module';
import { ObservabilityModule } from '../observability/observability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Simulation]),
    ResultsModule,
    AnalyticsModule,
    RealtimeModule,
    GabeModule,
    EconomyModule,
    ProgressionModule,
    AiMetaLearningModule,
    DeterminismModule,
    EngineSafetyModule,
    ObservabilityModule,
  ],
  controllers: [SimulationsController],
  providers: [
    SimulationsService,
    SimulationEngineService,
    MonteCarloEngine,
    GameTheoryEngine,
    MarketEngine,
    ConflictEngine,
  ],
  exports: [SimulationsService],
})
export class SimulationsModule {}
