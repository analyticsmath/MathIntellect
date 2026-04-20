/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef, useCallback } from 'react';
import { realtimeService } from '../services/realtime.service';
import { simulationsService } from '../services/simulations.service';
import type { SimulationStatus } from '../types/api.types';

export interface RealtimeSimulationState {
  /** 0–100, or null if not yet started */
  progress: number | null;
  /** live status from WS events */
  status: SimulationStatus | null;
  /** true once simulation:completed received */
  completed: boolean;
  /** error message if simulation:error received */
  wsError: string | null;
  /** whether the WS connection is active */
  connected: boolean;
}

/**
 * Listens to WebSocket events for a running simulation.
 * Falls back to polling GET /simulations/:id every 3 s if WS is not connected.
 */
export function useRealtimeSimulation(
  simulationId: string | undefined,
): RealtimeSimulationState {
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<SimulationStatus | null>(null);
  const [completed, setCompleted] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!simulationId) return;

    // Check WS connectivity on mount
    setConnected(realtimeService.isConnected());

    // Subscribe via WebSocket
    const unsubscribe = realtimeService.subscribeToSimulation(simulationId, {
      onProgress: (e) => {
        setProgress(e.progress);
        setStatus('running');
        setConnected(true);
        stopPolling(); // WS is working — cancel any polling
      },
      onCompleted: () => {
        setProgress(100);
        setStatus('completed');
        setCompleted(true);
        stopPolling();
      },
      onError: (e) => {
        setWsError(e.error);
        setStatus('failed');
        stopPolling();
      },
    });

    // Fallback polling: if WS hasn't fired any events within 2 s, start polling
    const wsTimeoutId = setTimeout(() => {
      if (!realtimeService.isConnected()) {
        pollingRef.current = setInterval(async () => {
          try {
            const sim = await simulationsService.getById(simulationId);
            setStatus(sim.status);
            if (sim.status === 'completed') {
              setProgress(100);
              setCompleted(true);
              stopPolling();
            } else if (sim.status === 'failed') {
              setStatus('failed');
              stopPolling();
            }
          } catch {
            // ignore polling errors
          }
        }, 3_000);
      }
    }, 2_000);

    return () => {
      unsubscribe();
      clearTimeout(wsTimeoutId);
      stopPolling();
    };
  }, [simulationId, stopPolling]);

  return { progress, status, completed, wsError, connected };
}
