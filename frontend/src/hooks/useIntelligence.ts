import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { intelligenceService } from '../services/intelligence.service';
import type { IntelligenceRank, SkillTimelineEntry, UnlockNode } from '../types/phase5.types';

interface UseIntelligenceReturn {
  rank: IntelligenceRank | null;
  timeline: SkillTimelineEntry[];
  unlocks: UnlockNode[];
  loading: boolean;
}

export function useIntelligence(): UseIntelligenceReturn {
  const { profile, loading: profileLoading } = useProfile();
  const [timeline, setTimeline] = useState<SkillTimelineEntry[]>([]);
  const [unlocks, setUnlocks] = useState<UnlockNode[]>([]);
  const [loading, setLoading] = useState(true);

  const rank = profile ? intelligenceService.deriveRank(profile) : null;

  useEffect(() => {
    if (profileLoading) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setLoading(true);
      }
    });
    Promise.all([
      intelligenceService.getTimeline(),
      intelligenceService.getUnlocks(profile ?? null),
    ])
      .then(([tl, ul]) => {
        if (!cancelled) {
          setTimeline(tl);
          setUnlocks(ul);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profileLoading, profile]);

  return { rank, timeline, unlocks, loading: profileLoading || loading };
}
