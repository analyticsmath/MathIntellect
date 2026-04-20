import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationReplay } from './entities/simulation-replay.entity';
import { SimulationSnapshotService } from './simulation-snapshot.service';
import { SimulationReplayEngine } from './simulation-replay.engine';
import { ReplayController } from './replay.controller';
import { ReplayV1Controller } from './replay-v1.controller';
import { MonteCarloEngine } from '../simulations/engine/monte-carlo.engine';
import { GameTheoryEngine } from '../simulations/engine/game-theory.engine';
import { MarketEngine } from '../simulations/engine/market.engine';
import { ConflictEngine } from '../simulations/engine/conflict.engine';

@Module({
  imports: [TypeOrmModule.forFeature([SimulationReplay])],
  controllers: [ReplayController, ReplayV1Controller],
  providers: [
    SimulationSnapshotService,
    SimulationReplayEngine,
    MonteCarloEngine,
    GameTheoryEngine,
    MarketEngine,
    ConflictEngine,
  ],
  exports: [SimulationSnapshotService, SimulationReplayEngine],
})
export class DeterminismModule {}
