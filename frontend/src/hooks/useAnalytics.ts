/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from 'react';
import { analyticsService } from '../services/analytics.service';
import type { ChartsResponse, ThreeDResponse, SummaryResponse } from '../types/api.types';

interface AnalyticsState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAnalyticsOptions {
  loadCharts?: boolean;
  load3D?: boolean;
}

export function useAnalytics(simulationId: string | undefined, options: UseAnalyticsOptions = {}) {
  const { loadCharts = false, load3D = false } = options;
  const [summary, setSummary] = useState<AnalyticsState<SummaryResponse>>({
    data: null, loading: false, error: null,
  });
  const [charts, setCharts] = useState<AnalyticsState<ChartsResponse>>({
    data: null, loading: false, error: null,
  });
  const [threeD, setThreeD] = useState<AnalyticsState<ThreeDResponse>>({
    data: null, loading: false, error: null,
  });

  const requestedChartsFor = useRef<string | null>(null);
  const requested3DFor = useRef<string | null>(null);

  // Combined loading — true only while at least one active request is in flight
  const loading = summary.loading || charts.loading || threeD.loading;

  useEffect(() => {
    if (!simulationId) {
      setSummary({ data: null, loading: false, error: null });
      setCharts({ data: null, loading: false, error: null });
      setThreeD({ data: null, loading: false, error: null });
      requestedChartsFor.current = null;
      requested3DFor.current = null;
      return;
    }

    requestedChartsFor.current = null;
    requested3DFor.current = null;
    setSummary({ data: null, loading: true, error: null });
    setCharts({ data: null, loading: false, error: null });
    setThreeD({ data: null, loading: false, error: null });

    let cancelled = false;
    analyticsService.getSummary(simulationId)
      .then((d) => {
        if (!cancelled) {
          setSummary({ data: d, loading: false, error: null });
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setSummary({ data: null, loading: false, error: e.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [simulationId]);

  useEffect(() => {
    if (!simulationId || !loadCharts || requestedChartsFor.current === simulationId) {
      return;
    }
    requestedChartsFor.current = simulationId;
    setCharts((prev) => ({ data: prev.data, loading: true, error: null }));
    let cancelled = false;
    analyticsService.getCharts(simulationId)
      .then((d) => {
        if (!cancelled) {
          setCharts({ data: d, loading: false, error: null });
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setCharts({ data: null, loading: false, error: e.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [simulationId, loadCharts]);

  useEffect(() => {
    if (!simulationId || !load3D || requested3DFor.current === simulationId) {
      return;
    }
    requested3DFor.current = simulationId;
    setThreeD((prev) => ({ data: prev.data, loading: true, error: null }));
    let cancelled = false;
    analyticsService.get3D(simulationId)
      .then((d) => {
        if (!cancelled) {
          setThreeD({ data: d, loading: false, error: null });
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setThreeD({ data: null, loading: false, error: e.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [simulationId, load3D]);

  return {
    summary:  summary.data,
    charts:   charts.data,
    threeD:   threeD.data,
    chartsError:  charts.error,
    threeDError:  threeD.error,
    summaryError: summary.error,
    loading,
    // Legacy combined error — truthy if summary fails (affects Overview tab)
    error: summary.error,
  };
}
