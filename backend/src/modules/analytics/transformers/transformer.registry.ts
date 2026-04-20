import { Injectable, NotFoundException } from '@nestjs/common';
import { SimulationType } from '../../simulations/entities/simulation.entity';
import {
  SimulationEngineResult,
  MonteCarloResult,
  MarketResult,
  GameTheoryResult,
  ConflictResult,
} from '../../simulations/interfaces/engine.interfaces';
import { MonteCarloTransformer } from './monte-carlo.transformer';
import { MarketTransformer } from './market.transformer';
import { GameTheoryTransformer } from './game-theory.transformer';
import { ConflictTransformer } from './conflict.transformer';
import { ChartsResponse } from '../view-models/chart-data.viewmodel';
import { ThreeDResponse } from '../view-models/visualization-3d.viewmodel';
import { SummaryResponse } from '../view-models/summary.viewmodel';

interface SimulationMeta {
  id: string;
  name: string;
  status: string;
  type: SimulationType;
}

@Injectable()
export class TransformerRegistry {
  constructor(
    private readonly mc: MonteCarloTransformer,
    private readonly market: MarketTransformer,
    private readonly gt: GameTheoryTransformer,
    private readonly conflict: ConflictTransformer,
  ) {}

  charts(meta: SimulationMeta, raw: SimulationEngineResult): ChartsResponse {
    switch (meta.type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return this.mc.buildCharts(meta.id, raw as MonteCarloResult);
      case SimulationType.MARKET:
        return this.market.buildCharts(meta.id, raw as MarketResult);
      case SimulationType.GAME_THEORY:
        return this.gt.buildCharts(meta.id, raw as GameTheoryResult);
      case SimulationType.CONFLICT:
        return this.conflict.buildCharts(meta.id, raw as ConflictResult);
      default:
        throw new NotFoundException(`No transformer for type: ${meta.type}`);
    }
  }

  threeD(meta: SimulationMeta, raw: SimulationEngineResult): ThreeDResponse {
    switch (meta.type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return this.mc.build3D(meta.id, raw as MonteCarloResult);
      case SimulationType.MARKET:
        return this.market.build3D(meta.id, raw as MarketResult);
      case SimulationType.GAME_THEORY:
        return this.gt.build3D(meta.id, raw as GameTheoryResult);
      case SimulationType.CONFLICT:
        return this.conflict.build3D(meta.id, raw as ConflictResult);
      default:
        throw new NotFoundException(`No 3D transformer for type: ${meta.type}`);
    }
  }

  summary(meta: SimulationMeta, raw: SimulationEngineResult): SummaryResponse {
    switch (meta.type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return this.mc.buildSummary(
          meta.id,
          meta.name,
          meta.status,
          raw as MonteCarloResult,
        );
      case SimulationType.MARKET:
        return this.market.buildSummary(
          meta.id,
          meta.name,
          meta.status,
          raw as MarketResult,
        );
      case SimulationType.GAME_THEORY:
        return this.gt.buildSummary(
          meta.id,
          meta.name,
          meta.status,
          raw as GameTheoryResult,
        );
      case SimulationType.CONFLICT:
        return this.conflict.buildSummary(
          meta.id,
          meta.name,
          meta.status,
          raw as ConflictResult,
        );
      default:
        throw new NotFoundException(
          `No summary transformer for type: ${meta.type}`,
        );
    }
  }
}
