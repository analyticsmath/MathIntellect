import client from './api.client';
import type { IntelligenceRank, SkillTimelineEntry, UnlockNode } from '../types/phase5.types';
import type { Profile } from '../types/api.types';

const TIER_THRESHOLDS: Array<{ min: number; tier: IntelligenceRank['tier'] }> = [
  { min: 0, tier: 'Novice' },
  { min: 3, tier: 'Apprentice' },
  { min: 6, tier: 'Analyst' },
  { min: 11, tier: 'Strategist' },
  { min: 19, tier: 'Expert' },
  { min: 29, tier: 'Master' },
];

const DEFAULT_UNLOCKS: UnlockNode[] = [
  { id: 'monte_carlo', name: 'Monte Carlo Engine', description: 'Probabilistic sampling across outcome space', locked: false, category: 'feature', unlockedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'game_theory', name: 'Game Theory Engine', description: 'Nash equilibrium & strategic payoff analysis', locked: false, category: 'feature', unlockedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'market', name: 'Market Simulator', description: 'Price impact and liquidity modeling', locked: false, category: 'feature' },
  { id: 'conflict', name: 'Conflict Resolver', description: 'Multi-party strategic conflict resolution', locked: false, category: 'feature' },
  { id: 'expert_mode', name: 'Expert Mode', description: 'Advanced parameter controls and raw outputs', locked: true, category: 'mode' },
  { id: 'ai_coach_v2', name: 'AI Coach Pro', description: 'Deep adaptive growth recommendations', locked: true, category: 'skill' },
  { id: 'social_fork', name: 'Simulation Fork', description: 'Fork and remix community simulations', locked: true, category: 'feature' },
  { id: 'streak_master', name: 'Streak Master', description: 'Maintain a 7-day simulation streak', locked: true, category: 'achievement' },
];

export const intelligenceService = {
  deriveRank(profile: Profile | null): IntelligenceRank {
    const skill = profile?.intelligenceProfileJson;
    const xp = profile?.xp ?? 0;
    const level = profile?.level ?? 1;

    const tier = [...TIER_THRESHOLDS].reverse().find(t => level >= t.min)?.tier ?? 'Novice';

    const xpPerLevel = 500;
    const xpForCurrentLevel = (level - 1) * xpPerLevel;
    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpProgress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpPerLevel) * 100));

    return {
      tier,
      level,
      xp,
      xpToNextLevel: level * xpPerLevel,
      xpProgress,
      skillDrift: {
        skill_level: skill?.skill_level ?? 0,
        risk_tolerance: skill?.risk_tolerance ?? 0,
        decision_speed: skill?.decision_speed ?? 0,
        strategy_depth: skill?.strategy_depth ?? 0,
        consistency_score: skill?.consistency_score ?? 0,
      },
    };
  },

  async getTimeline(): Promise<SkillTimelineEntry[]> {
    return client
      .get<SkillTimelineEntry[]>('/intelligence/timeline')
      .then(r => r.data)
      .catch(() => []);
  },

  async getUnlocks(profile: Profile | null): Promise<UnlockNode[]> {
    try {
      return await client.get<UnlockNode[]>('/intelligence/unlocks').then(r => r.data);
    } catch {
      const level = profile?.level ?? 1;
      return DEFAULT_UNLOCKS.map(node => ({
        ...node,
        locked: node.id === 'expert_mode' ? level < 6
          : node.id === 'ai_coach_v2' ? level < 10
          : node.id === 'social_fork' ? level < 8
          : node.id === 'streak_master' ? (profile?.streakDays ?? 0) < 7
          : node.locked,
      }));
    }
  },
};
