import { useState, useEffect, useCallback, useRef } from 'react';
import { simulationsService } from '../services/simulations.service';
import type { Simulation, RunSimulationRequest, RunSimulationResponse } from '../types/api.types';

export function useSimulations() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulationsService.list();
      setSimulations(data);
    } catch (e) {
      const message = (e as Error).message;
      if (/internal server error/i.test(message)) {
        setSimulations([]);
        setError(null);
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { simulations, loading, error, refetch: fetch };
}

export function useRunSimulation() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunSimulationResponse | null>(null);
  const inFlightRef = useRef(false);

  const run = useCallback(async (payload: RunSimulationRequest) => {
    if (inFlightRef.current) {
      throw new Error('A simulation is already running');
    }

    inFlightRef.current = true;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const data = await simulationsService.run(payload);
      setResult(data);
      return data;
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      inFlightRef.current = false;
      setRunning(false);
    }
  }, []);

  return { run, running, error, result };
}
