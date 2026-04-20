import { SimulationType } from '../simulations/entities/simulation.entity';

export enum ProgressionTrack {
  STRATEGIST = 'strategist',
  MARKET_ANALYST = 'market_analyst',
  GAME_THEORY_SPECIALIST = 'game_theory_specialist',
  CHAOS_CONFLICT_ANALYST = 'chaos_conflict_analyst',
}

export interface RankBand {
  min: number;
  max: number;
  label: string;
}

export const INTELLIGENCE_RANK_BANDS: RankBand[] = [
  { min: 1, max: 10, label: 'Analyst' },
  { min: 11, max: 25, label: 'Strategist' },
  { min: 26, max: 50, label: 'Systems Thinker' },
  { min: 51, max: 75, label: 'Theoretical Architect' },
  { min: 76, max: 100, label: 'Intelligence Modeler' },
];

export const TRACK_SIMULATION_MAP: Record<ProgressionTrack, SimulationType> = {
  [ProgressionTrack.STRATEGIST]: SimulationType.MONTE_CARLO,
  [ProgressionTrack.MARKET_ANALYST]: SimulationType.MARKET,
  [ProgressionTrack.GAME_THEORY_SPECIALIST]: SimulationType.GAME_THEORY,
  [ProgressionTrack.CHAOS_CONFLICT_ANALYST]: SimulationType.CONFLICT,
};
