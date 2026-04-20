import client from './api.client';
import type { FeedPost, FeedPage } from '../types/phase5.types';

const TYPE_COLORS: Record<string, string> = {
  monte_carlo: '#3B82F6',
  game_theory: '#22D3EE',
  market: '#8B5CF6',
  conflict: '#F43F5E',
  custom: '#10B981',
};

interface RankedFeedResponse {
  posts?: FeedPost[];
  hasMore?: boolean;
  total?: number;
  items?: Array<{ id: string }>;
  pageInfo?: {
    hasMore?: boolean;
  };
}

const SEEDED_HANDLES = [
  'QuantPilot',
  'NashMind',
  'AlphaGrid',
  'RiskNova',
  'StrategyFlow',
  'HawkTheory',
  'SigmaPulse',
  'DeltaKernel',
  'PrismTactics',
  'VectorDoctrine',
  'OmegaLedger',
  'SignalForge',
  'TitanHeuristic',
  'EquilibriumX',
  'ProbabilistAI',
  'GammaDoctrine',
  'MatrixHarbor',
  'ForesightLab',
  'CoalitionOps',
  'MonteCaptain',
] as const;

const SEEDED_BEHAVIORS = [
  'Focused Strategist',
  'Risk Taker',
  'Optimizer',
  'Balanced',
  'Explorer',
] as const;

const SEEDED_USER_RECENTS = [
  ['Tail Hedge Mesh', 'Volatility Cascade'],
  ['Equilibrium Delta Run', 'Coalition Pressure Test'],
  ['Liquidity Shock Model', 'Adaptive Payoff Grid'],
  ['Regime Drift Analyzer', 'Risk Corridor Sweep'],
  ['Adversarial Response Path', 'Syndicate Drift Map'],
] as const;

const SEEDED_USERS = SEEDED_HANDLES.map((name, index) => ({
  id: `user-${name.toLowerCase()}`,
  name,
  rank: index + 1,
  xp: 19800 - index * 430,
  level: Math.max(12, 28 - Math.floor(index * 0.6)),
  behavior: SEEDED_BEHAVIORS[index % SEEDED_BEHAVIORS.length],
  recent: SEEDED_USER_RECENTS[index % SEEDED_USER_RECENTS.length],
}));

const SEEDED_SIMS = [
  'Tail-Risk Insurance Sweep',
  'Coalition Escalation Ladder',
  'Liquidity Shock Containment',
  'Nash Recovery Protocol',
  'Volatility Channel Delta',
  'Adversarial Signal Replay',
  'Strategic Response Matrix',
  'Market Cascade Intercept',
  'Counterparty Drift Audit',
  'Conflict De-escalation Mesh',
  'Macro Hedge Pulse',
  'Payoff Stability Pass',
  'Drawdown Shield Route',
  'Mean Reversion Orbit',
  'Resilience Corridor Beta',
  'Coalition Truce Matrix',
] as const;

const SEEDED_SUMMARIES = [
  'AI detected a confidence break below 0.82 and recommended hedge rebalancing.',
  'Stable equilibrium formed after three counterfactual rounds with lower downside variance.',
  'Volatility cluster moved to lane C. Coach suggested defensive allocation before rerun.',
  'Resource competition flattened after adaptive strategy adjustments in round 7.',
  'Tail-risk exposure dropped 14% after payoff matrix pivot to balanced mode.',
] as const;

const SEEDED_COMMENTS = [
  'Great fork candidate for stress testing commodities.',
  'Tried this with adversarial inputs, confidence stayed above 90%.',
  'Can you share the payoff constraints for round 4?',
  'This strategy reduced drawdown faster than my baseline run.',
  'AI coach hint was accurate, rerun gave cleaner convergence.',
] as const;

function seededAvatar(name: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
}

function buildChartPreview(index: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const wave = Math.sin((i + index) * 0.42) * 12;
    const drift = i * 3.8;
    return Math.round(42 + wave + drift);
  });
}

function mockPost(i: number): FeedPost {
  const types = ['monte_carlo', 'game_theory', 'market', 'conflict'] as const;
  const user = SEEDED_USERS[i % SEEDED_USERS.length];
  const type = types[i % types.length];

  return {
    id: `seeded-post-${i}`,
    userId: user.id,
    userName: user.name,
    userAvatar: seededAvatar(user.name),
    userRank: user.rank,
    userXp: user.xp,
    userLevel: user.level,
    userBehaviorTag: user.behavior,
    simulationId: `seeded-sim-${i}`,
    simulationName: SEEDED_SIMS[i % SEEDED_SIMS.length],
    simulationType: type,
    resultScore: 72 + ((i * 7) % 27),
    chartPreview: buildChartPreview(i),
    recentSimulations: [...user.recent],
    xpGained: 90 + ((i * 37) % 160),
    aiSummary: SEEDED_SUMMARIES[i % SEEDED_SUMMARIES.length],
    topComment: SEEDED_COMMENTS[i % SEEDED_COMMENTS.length],
    commentCount: 10 + ((i * 9) % 80),
    forkCount: 8 + ((i * 11) % 36),
    likeCount: 150 + ((i * 17) % 420),
    liked: i % 4 === 0,
    createdAt: new Date(Date.now() - i * 46 * 60_000).toISOString(),
    thumbnailColor: TYPE_COLORS[type] ?? '#3B82F6',
  };
}

const SEEDED_FEED: FeedPost[] = Array.from({ length: 30 }, (_, i) => mockPost(i));

function normalizeFeedResponse(payload: RankedFeedResponse): FeedPage {
  const posts = Array.isArray(payload.posts) ? payload.posts : [];
  const hasMore =
    typeof payload.hasMore === 'boolean'
      ? payload.hasMore
      : Boolean(payload.pageInfo?.hasMore);

  return {
    posts,
    total:
      typeof payload.total === 'number'
        ? payload.total
        : posts.length,
    hasMore,
  };
}

export const socialService = {
  async getFeed(page = 1, limit = 8): Promise<FeedPage> {
    try {
      const payload = await client
        .get<RankedFeedResponse>(`/social/feed?page=${page}&limit=${limit}`)
        .then((r) => r.data);

      const normalized = normalizeFeedResponse(payload);
      if (normalized.posts.length === 0 && (payload.items?.length ?? 0) > 0) {
        throw new Error('Feed payload missing legacy posts array');
      }

      return normalized;
    } catch {
      const start = (page - 1) * limit;
      const posts = SEEDED_FEED.slice(start, start + limit);
      return {
        posts,
        total: SEEDED_FEED.length,
        hasMore: start + limit < SEEDED_FEED.length,
      };
    }
  },

  getLivePost(seed = Date.now()): FeedPost {
    return mockPost(seed % SEEDED_FEED.length);
  },

  async likePost(postId: string): Promise<void> {
    return client
      .post(`/social/posts/${postId}/like`)
      .then(() => undefined)
      .catch(() => undefined);
  },

  async forkSimulation(postId: string): Promise<{ simulationId: string }> {
    return client
      .post<{ simulationId: string }>(`/social/posts/${postId}/fork`)
      .then((r) => r.data)
      .catch(() => ({ simulationId: postId }));
  },
};
