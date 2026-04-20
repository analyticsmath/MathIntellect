// ─── Intelligence System ──────────────────────────────────────────────────────

export type IntelligenceTier =
  | 'Novice'
  | 'Apprentice'
  | 'Analyst'
  | 'Strategist'
  | 'Expert'
  | 'Master';

export interface IntelligenceRank {
  tier: IntelligenceTier;
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpProgress: number; // 0–100
  skillDrift: {
    skill_level: number;
    risk_tolerance: number;
    decision_speed: number;
    strategy_depth: number;
    consistency_score: number;
  };
}

export interface SkillTimelineEntry {
  simulationId: string;
  simulationName: string;
  simulationType: string;
  timestamp: string;
  xpGained: number;
  levelTitle: string;
  behaviorTag: string;
  unlocks: string[];
  skillDelta: number;
}

export interface BehaviorTrendPoint {
  label: string;
  decisionConsistency: number;
  riskAppetite: number;
  strategyDepth: number;
}

export interface UnlockNode {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  locked: boolean;
  category: 'skill' | 'mode' | 'feature' | 'achievement';
}

// ─── Mission Flow ─────────────────────────────────────────────────────────────

export type MissionPhase = 'idle' | 'pre-launch' | 'tunnel' | 'executing' | 'reveal';

export interface MissionPreview {
  xpImpact: number;
  difficultyRisk: 'low' | 'medium' | 'high';
  predictedGain: number;
  estimatedDuration: string;
}

// ─── Social Feed ──────────────────────────────────────────────────────────────

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRank?: number;
  userXp?: number;
  userLevel: number;
  userBehaviorTag: string;
  simulationId: string;
  simulationName: string;
  simulationType: string;
  resultScore: number;
  chartPreview: number[];
  recentSimulations?: string[];
  xpGained: number;
  aiSummary: string;
  topComment?: string;
  commentCount?: number;
  forkCount: number;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  thumbnailColor: string;
}

export interface FeedPage {
  posts: FeedPost[];
  total: number;
  hasMore: boolean;
}

// ─── AI Coach ────────────────────────────────────────────────────────────────

export interface CoachRecommendation {
  nextSimulation: {
    type: string;
    name: string;
    description: string;
  };
  reasoning: string;
  difficultyAdjustment: 'increase' | 'decrease' | 'maintain';
  growthDirection: string;
  estimatedXpGain: number;
}

// ─── Simulation Result (Phase 5 extended) ────────────────────────────────────

export interface SimulationResultPhase5 {
  xpGain: number;
  skillDelta: Record<string, number>;
  intelligenceRankChange: number;
  unlocks: string[];
  behaviorShift: string;
  nextRecommendedSimulation: CoachRecommendation['nextSimulation'] | null;
}
