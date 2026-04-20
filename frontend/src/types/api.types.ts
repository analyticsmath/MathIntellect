// ─── Simulation ───────────────────────────────────────────────────────────────

export type SimulationType =
  | 'monte_carlo'
  | 'game_theory'
  | 'market'
  | 'conflict'
  | 'custom';

export type SimulationStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Simulation {
  id: string;
  name: string;
  description?: string;
  type: SimulationType;
  status: SimulationStatus;
  parameters?: Record<string, unknown>;
  createdBy?: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface RunSimulationRequest {
  name: string;
  description?: string;
  type: SimulationType;
  parameters: Record<string, unknown>;
  behaviorSignals?: {
    parameterAdjustmentCount?: number;
    parameterAdjustmentMs?: number;
    rerunCount?: number;
    explorationRatio?: number;
    decisionHesitationMs?: number;
    strategyChanges?: number;
    interactionLagMs?: number;
    sessionDurationMs?: number;
  };
}

export interface RunSimulationResponse {
  simulation: Simulation;
  result: Record<string, unknown>;
  metrics: {
    mean: number;
    variance: number;
    stdDev: number;
    min: number;
    max: number;
    median: number;
    count: number;
  };
  gabe: GabeRunSummary;
}

export interface SkillProfileSnapshot {
  skill_level: number;
  risk_tolerance: number;
  decision_speed: number;
  strategy_depth: number;
  consistency_score: number;
  learning_curve: 'rising' | 'stable' | 'declining';
  behavior_pattern: 'explorer' | 'optimizer' | 'risk_taker' | 'balanced';
}

export interface SimulationAdaptation {
  adaptive_ui_badge: string;
  mode_label: 'Beginner Mode' | 'Adaptive Mode' | 'Expert Mode';
  explanation_depth: 'concise' | 'balanced' | 'deep';
  chart_complexity: 'low' | 'standard' | 'advanced';
  visible_panels: string[];
  hidden_panels: string[];
  highlighted_metrics: string[];
  ai_coach_hint: string;
}

export interface GabeRunSummary {
  behavior: {
    behavior_type: 'explorer' | 'optimizer' | 'random_tester' | 'focused_strategist';
    behavior_tag: string;
    engagement_score: number;
    learning_velocity: number;
    exploration_ratio: number;
    repetition_pressure: number;
    hesitation_index: number;
    strategy_change_intensity: number;
    session_duration_ms: number;
    parameter_adjustment_count: number;
  };
  adaptive_difficulty: {
    difficulty_score: number;
    mode_label: 'Beginner Mode' | 'Adaptive Mode' | 'Expert Mode';
    rationale: string[];
    complexity_features: string[];
  };
  xp_intelligence: {
    xp_gain: number;
    novelty_score: number;
    improvement_score: number;
    repetition_ratio: number;
    low_effort_score: number;
    components: {
      difficultyComponent: number;
      noveltyComponent: number;
      riskComponent: number;
      accuracyComponent: number;
      improvementMultiplier: number;
      repetitionPenalty: number;
      lowEffortDecay: number;
    };
  };
  progression: {
    level: number;
    level_title: string;
    level_progress: number;
    level_delta: number;
    xp: number;
    unlocked_features: string[];
  };
  engagement: {
    reward_frequency_multiplier: number;
    increase_reward_frequency: boolean;
    reduce_cognitive_overload: boolean;
    guided_mode: boolean;
    drop_off_risk: number;
    engagement_score: number;
    learning_velocity: number;
  };
  skill_profile: SkillProfileSnapshot;
  simulation_adaptation: SimulationAdaptation;
}

// ─── Saved Models (Templates) ────────────────────────────────────────────────

export interface SavedModel {
  id: string;
  userId: string;
  engineType: SimulationType;
  title: string;
  configJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedModelRequest {
  engineType: SimulationType;
  title: string;
  configJson: Record<string, unknown>;
}

// ─── Profile / Notifications ─────────────────────────────────────────────────

export interface Profile {
  id: string;
  userId: string;
  avatarUrl: string | null;
  displayName: string | null;
  bio: string | null;
  xp: number;
  level: number;
  streakDays: number;
  timezone: string | null;
  intelligenceProfileJson: SkillProfileSnapshot | null;
  engagementStateJson: {
    session_duration_ms_avg: number;
    simulation_repetition_cycles: number;
    drop_off_points: number;
    engagement_spikes: number;
    reward_frequency: number;
    cognitive_load_index: number;
    guided_mode: boolean;
    recent_parameter_hashes: string[];
    recent_performance_scores: number[];
    recent_xp_gains: number[];
    recent_engagement_scores: number[];
    last_event: AiGamificationEvent | null;
  } | null;
  lastBehaviorTag: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  avatarUrl?: string;
  displayName?: string;
  bio?: string;
  timezone?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

// ─── Charts ───────────────────────────────────────────────────────────────────

export interface Series {
  name: string;
  data: number[];
  color?: string;
}

export interface HistogramChartData {
  type: 'histogram';
  labels: string[];
  counts: number[];
  frequencies: number[];
  density: number[];
  binWidth: number;
  total: number;
}

export interface CdfChartData {
  type: 'cdf';
  x: number[];
  y: number[];
}

export interface BoxPlotChartData {
  type: 'boxplot';
  labels: string[];
  min: number[];
  q1: number[];
  median: number[];
  q3: number[];
  max: number[];
}

export interface TimeSeriesChartData {
  type: 'time_series';
  labels: string[];
  series: Series[];
}

export interface HeatmapChartData {
  type: 'heatmap';
  xLabels: string[];
  yLabels: string[];
  z: number[][];
  player: string;
  equilibriumCells: Array<{ row: number; col: number }>;
}

export interface BarChartData {
  type: 'bar';
  labels: string[];
  series: Series[];
}

export interface PieChartData {
  type: 'pie';
  labels: string[];
  values: number[];
}

export type ChartData =
  | HistogramChartData
  | CdfChartData
  | BoxPlotChartData
  | TimeSeriesChartData
  | HeatmapChartData
  | BarChartData
  | PieChartData;

export interface ChartsResponse {
  simulationId: string;
  simulationType: string;
  charts: Record<string, ChartData>;
  cachedAt: string;
}

// ─── 3D ───────────────────────────────────────────────────────────────────────

export interface SurfacePlot3D {
  plotType: 'surface';
  x: number[] | string[];
  y: number[] | string[];
  z: number[][];
  xTitle: string;
  yTitle: string;
  zTitle: string;
  colorscale?: string;
}

export interface Scatter3D {
  plotType: 'scatter3d';
  x: number[];
  y: number[];
  z: number[];
  xTitle: string;
  yTitle: string;
  zTitle: string;
  mode: 'markers' | 'lines' | 'lines+markers';
  colorValues?: number[];
}

export interface MultiTrace3D {
  plotType: 'multi_scatter3d';
  traces: Array<{
    name: string;
    x: number[];
    y: number[];
    z: number[];
  }>;
  xTitle: string;
  yTitle: string;
  zTitle: string;
}

export type Visualization3D = SurfacePlot3D | Scatter3D | MultiTrace3D;

export interface ThreeDResponse {
  simulationId: string;
  simulationType: string;
  visualizations: Record<string, Visualization3D>;
  cachedAt: string;
}

// ─── Analytics Summary ────────────────────────────────────────────────────────

export type InsightSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface Insight {
  severity: InsightSeverity;
  title: string;
  message: string;
  metric?: string;
  value?: number | string;
}

export interface MetricCard {
  label: string;
  value: number | string;
  unit?: string;
  format: 'number' | 'percent' | 'currency' | 'text';
}

export interface SummaryResponse {
  simulationId: string;
  simulationName: string;
  simulationType: string;
  status: string;
  executionTimeMs: number;
  keyMetrics: MetricCard[];
  insights: Insight[];
  highlights: string[];
  cachedAt: string;
}

// ─── AI Intelligence Layer ───────────────────────────────────────────────────

export type AiRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AiInsightResponse {
  summary: string;
  key_findings: string[];
  risk_analysis: {
    level: AiRiskLevel;
    explanation: string;
  };
  opportunity_analysis: string[];
  mathematical_interpretation: string;
  confidence_score: number;
  recommendation: string;
}

export interface AiDecisionAlternative {
  option: string;
  pros: string[];
  cons: string[];
}

export interface AiDecisionResponse {
  decision: string;
  reasoning: string[];
  risk_tradeoff: string;
  alternatives: AiDecisionAlternative[];
  confidence: number;
}

export interface AiDecisionRequest {
  simulationId: string;
  userContext?: Record<string, unknown>;
  forceRefresh?: boolean;
}

export interface AiExplainStep {
  step: string;
  formula: string;
  interpretation: string;
}

export interface AiExplainResponse {
  summary: string;
  steps: AiExplainStep[];
  final_takeaway: string;
  confidence_score: number;
}

export interface AiCompareRequest {
  simulationIds: string[];
}

export interface AiCompareItem {
  simulation_id: string;
  summary: string;
  risk: string;
  expected_value: string;
  ranking_score: number;
}

export interface AiCompareResponse {
  comparisons: AiCompareItem[];
  best_option: string;
  reasoning: string;
}

export interface AiGamificationEvent {
  xp_gain: number;
  level_progress: number;
  skill_update: SkillProfileSnapshot;
  behavior_tag: string;
}

export interface AiIntelligenceResponse {
  insight: AiInsightResponse;
  decision: AiDecisionResponse;
  gamification_event: AiGamificationEvent;
}

// ─── API wrapper ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
