// ─── Common types shared across all engines ───────────────────────────────────

export interface EngineRunOptions {
  seed?: number; // Optional seed for reproducible results
}

/**
 * Called by engines periodically during execution to report progress.
 * @param progress - integer 0–100
 * @param partial  - optional partial result data for progressive UI updates
 */
export type ProgressCallback = (
  progress: number,
  partial?: Record<string, unknown>,
) => void;

export interface CompressionMeta {
  compressed: boolean;
  strategy: string;
  originalSize: number;
  retainedSize: number;
}

// ─── Monte Carlo ───────────────────────────────────────────────────────────────

export interface MonteCarloParams {
  iterations: number; // Number of simulation runs (e.g. 10000)
  variables: VariableDefinition[];
  outputExpression: string; // e.g. "x + y * z" evaluated per iteration
  correlationMatrix?: number[][]; // Optional correlation matrix for normal variables
  tailRiskAmplifier?: number; // > 1 amplifies rare tail shocks
  scenarioBranchDepth?: number; // Branching depth for scenario tree synthesis
  riskCurveWindows?: number; // Number of risk-evolution points
  seed?: number;
}

export interface VariableDefinition {
  name: string;
  distribution: 'normal' | 'uniform' | 'exponential' | 'bernoulli';
  params: Record<string, number>; // e.g. { mean: 0, std: 1 } for normal
}

export interface MonteCarloResult {
  type: 'monte_carlo';
  iterations: number;
  samples: number[]; // All sampled output values
  expectedValue: number;
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  median: number;
  percentile95: number;
  percentile5: number;
  histogram: HistogramBin[];
  scenarioBranches?: ScenarioBranchNode[];
  riskEvolutionCurve?: RiskEvolutionPoint[];
  confidenceStory?: string[];
  compression?: CompressionMeta;
  executionTimeMs: number;
}

export interface HistogramBin {
  min: number;
  max: number;
  count: number;
  frequency: number; // count / total
}

export interface ScenarioBranchNode {
  id: string;
  depth: number;
  label: string;
  probability: number;
  mean: number;
  range: [number, number];
}

export interface RiskEvolutionPoint {
  step: number;
  expectedValue: number;
  riskScore: number;
  lowerBand: number;
  upperBand: number;
}

// ─── Game Theory ───────────────────────────────────────────────────────────────

export interface GameTheoryParams {
  players: string[]; // e.g. ['Player A', 'Player B']
  strategies: Record<string, string[]>; // player → their strategy list
  payoffMatrix: PayoffEntry[];
  dynamicStrategyEvolution?: boolean;
  dynamicEvolutionRounds?: number;
  coalitionFormationEnabled?: boolean;
  repeatedLearningRounds?: number;
  reputationDecay?: number;
}

export interface PayoffEntry {
  strategies: Record<string, string>; // player → chosen strategy
  payoffs: Record<string, number>; // player → resulting payoff
}

export interface GameTheoryResult {
  type: 'game_theory';
  players: string[];
  dominantStrategies: Record<string, string | null>;
  nashEquilibria: NashEquilibrium[];
  expectedPayoffs: Record<string, number>;
  payoffMatrix: PayoffEntry[];
  strategyEvolution?: Record<string, number[]>;
  coalitionFormations?: CoalitionFormation[];
  repeatedGameLearning?: RepeatedGameLearning;
  reputationScores?: Record<string, number>;
  compression?: CompressionMeta;
  executionTimeMs: number;
}

export interface NashEquilibrium {
  strategies: Record<string, string>; // player → strategy at equilibrium
  payoffs: Record<string, number>;
  isPareto: boolean;
}

export interface CoalitionFormation {
  coalition: string[];
  coalitionScore: number;
  cohesion: number;
}

export interface RepeatedGameLearning {
  rounds: number;
  convergenceScore: number;
  trajectory: Record<string, number[]>;
}

// ─── Market ───────────────────────────────────────────────────────────────────

export interface MarketParams {
  initialPrice: number; // Starting asset price
  volatility: number; // Annual volatility (σ), e.g. 0.2 = 20%
  drift: number; // Annual expected return (μ), e.g. 0.05 = 5%
  timeHorizonDays: number; // Simulation length in trading days
  paths: number; // Number of price paths to simulate
  assets?: Array<{
    id: string;
    initialPrice: number;
    volatility: number;
    drift: number;
    weight: number;
  }>;
  portfolioCorrelationMatrix?: number[][];
  regimeSwitching?: boolean;
  regimeTransitionMatrix?: number[][];
  regimeVolatilityMultipliers?: number[];
  volatilityClustering?: boolean;
  garchAlpha?: number;
  garchBeta?: number;
  shockEventProbability?: number;
  shockMagnitude?: number;
  shockEvents?: Array<{
    day: number;
    magnitude: number;
    label?: string;
  }>;
  sentimentModeling?: boolean;
  seed?: number;
}

export interface MarketResult {
  type: 'market';
  paths: number[][]; // [path][day] price values
  finalPrices: number[];
  assetFinalPrices?: Record<string, number[]>;
  expectedFinalPrice: number;
  valueAtRisk95: number; // 5th percentile of final prices
  maxDrawdown: number; // Worst peak-to-trough drop across all paths
  annualizedReturn: number;
  annualizedVolatility: number;
  detectedRegimes?: Array<{
    day: number;
    state: 'bull' | 'bear' | 'neutral';
    signal: number;
  }>;
  shockEventsApplied?: Array<{
    path: number;
    day: number;
    magnitude: number;
    label: string;
  }>;
  sentimentProxy?: {
    score: number;
    label: 'bullish' | 'neutral' | 'bearish';
    reasoning: string;
  };
  compression?: CompressionMeta;
  priceStats: {
    mean: number;
    stdDev: number;
    min: number;
    max: number;
    median: number;
  };
  executionTimeMs: number;
}

// ─── Conflict ─────────────────────────────────────────────────────────────────

export interface ConflictParams {
  agents: AgentDefinition[];
  rounds: number; // Number of interaction rounds
  coalitions?: string[][];
  alliances?: string[][];
  betrayalSensitivity?: number;
  seed?: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  resources: number;
  strategy:
    | 'aggressive'
    | 'cooperative'
    | 'tit_for_tat'
    | 'random'
    | 'defector';
  adaptationRate?: number; // 0–1, how quickly agent updates strategy
}

export interface ConflictResult {
  type: 'conflict';
  rounds: number;
  agentResults: AgentOutcome[];
  roundHistory: RoundRecord[];
  winner: string | null; // agent id, or null if tie
  cooperationRate: number; // fraction of cooperative actions across all rounds
  coalitionMetrics?: Array<{
    coalition: string[];
    averageResources: number;
    cohesionScore: number;
  }>;
  allianceMatrix?: Array<{
    alliance: string[];
    trust: number;
  }>;
  betrayalProbabilities?: Record<string, number>;
  trustScores?: Record<string, number>;
  compression?: CompressionMeta;
  executionTimeMs: number;
}

export interface AgentOutcome {
  agentId: string;
  name: string;
  finalResources: number;
  totalGained: number;
  totalLost: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface RoundRecord {
  round: number;
  actions: Record<string, string>; // agentId → action taken
  payoffs: Record<string, number>; // agentId → payoff this round
  resources: Record<string, number>; // agentId → cumulative resources
}

// ─── Union types ───────────────────────────────────────────────────────────────

export type SimulationParams =
  | MonteCarloParams
  | GameTheoryParams
  | MarketParams
  | ConflictParams;

export type SimulationEngineResult =
  | MonteCarloResult
  | GameTheoryResult
  | MarketResult
  | ConflictResult;
