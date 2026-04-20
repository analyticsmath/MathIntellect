import { useState, useCallback } from 'react';
import type { MissionPhase, MissionPreview } from '../types/phase5.types';

interface UseMissionFlowReturn {
  phase: MissionPhase;
  preview: MissionPreview | null;
  setPreview: (preview: MissionPreview) => void;
  startLaunch: () => void;
  advanceToTunnel: () => void;
  advanceToExecution: () => void;
  advanceToReveal: () => void;
  reset: () => void;
}

export function useMissionFlow(): UseMissionFlowReturn {
  const [phase, setPhase] = useState<MissionPhase>('idle');
  const [preview, setPreview] = useState<MissionPreview | null>(null);

  const startLaunch = useCallback(() => setPhase('pre-launch'), []);
  const advanceToTunnel = useCallback(() => setPhase('tunnel'), []);
  const advanceToExecution = useCallback(() => setPhase('executing'), []);
  const advanceToReveal = useCallback(() => setPhase('reveal'), []);
  const reset = useCallback(() => {
    setPhase('idle');
    setPreview(null);
  }, []);

  return { phase, preview, setPreview, startLaunch, advanceToTunnel, advanceToExecution, advanceToReveal, reset };
}
