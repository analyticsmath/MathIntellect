import { useState, useEffect, useRef } from 'react';
import { aiCoachService } from '../services/ai-coach.service';
import type { CoachRecommendation } from '../types/phase5.types';

interface UseAICoachReturn {
  recommendation: CoachRecommendation | null;
  loading: boolean;
  refresh: (lastSimulationId?: string) => void;
}

const CACHE_TTL = 45_000;

export function useAICoach(lastSimulationId?: string): UseAICoachReturn {
  const [recommendation, setRecommendation] = useState<CoachRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<{ data: CoachRecommendation; ts: number } | null>(null);

  const refresh = (simId?: string) => {
    if (cacheRef.current && Date.now() - cacheRef.current.ts < CACHE_TTL) {
      setRecommendation(cacheRef.current.data);
      return;
    }
    setLoading(true);
    aiCoachService.getRecommendation(simId ?? lastSimulationId).then(rec => {
      cacheRef.current = { data: rec, ts: Date.now() };
      setRecommendation(rec);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh(lastSimulationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSimulationId]);

  return { recommendation, loading, refresh };
}
