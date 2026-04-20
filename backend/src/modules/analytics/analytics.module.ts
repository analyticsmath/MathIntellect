import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { Result } from '../results/entities/result.entity';
import { Simulation } from '../simulations/entities/simulation.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TransformerRegistry } from './transformers/transformer.registry';
import { MonteCarloTransformer } from './transformers/monte-carlo.transformer';
import { MarketTransformer } from './transformers/market.transformer';
import { GameTheoryTransformer } from './transformers/game-theory.transformer';
import { ConflictTransformer } from './transformers/conflict.transformer';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEvent, Result, Simulation])],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    TransformerRegistry,
    MonteCarloTransformer,
    MarketTransformer,
    GameTheoryTransformer,
    ConflictTransformer,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
