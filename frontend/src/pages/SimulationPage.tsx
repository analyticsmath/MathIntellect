import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRunSimulation } from '../hooks/useSimulations';
import { useRealtimeSimulation } from '../hooks/useRealtimeSimulation';
import { SimulationForm } from '../components/simulation/SimulationForm';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import type { RunSimulationRequest, RunSimulationResponse } from '../types/api.types';

export function SimulationPage() {
  const { run, running, error } = useRunSimulation();
  const [pendingId, setPendingId] = useState<string | undefined>();
  const [completedRun, setCompletedRun] = useState<RunSimulationResponse | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const { progress, wsError } = useRealtimeSimulation(pendingId);

  // Honest elapsed time counter during execution
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => {
      window.clearInterval(timer);
      setElapsedSeconds(0);
    };
  }, [running]);

  const handleFormSubmit = async (payload: RunSimulationRequest): Promise<void> => {
    setElapsedSeconds(0);
    setCompletedRun(null);
    try {
      const result = await run(payload);
      if (result?.simulation?.id) {
        setPendingId(result.simulation.id);
        setCompletedRun(result);
      }
    } catch {
      // Error handled by useRunSimulation hook
    }
  };

  const handleRunAnother = () => {
    setCompletedRun(null);
    setPendingId(undefined);
    setElapsedSeconds(0);
  };

  return (
    <MainLayout>
      <PageShell
        title="Model Builder"
        subtitle="Specify parameters and execute deterministic simulations"
      >
        <div className="p-6 md:p-8 max-w-[1720px] mx-auto w-full space-y-6">
          {/* Realtime WebSocket Notification if any */}
          {wsError && (
            <div role="alert" className="p-3 bg-mi-danger/10 border border-mi-danger text-xs font-mono text-mi-danger">
              Realtime stream error: {wsError}
            </div>
          )}

          {/* Running State View (Truthful Progress & Elapsed Time) */}
          {running && (
            <div className="border border-mi-rule bg-mi-paper p-8 text-center space-y-4">
              <div className="text-xs font-mono text-mi-change font-bold uppercase">
                STATE: M4 (CALCULATION DISPATCHED)
              </div>
              <h2 className="text-2xl font-medium text-mi-ink">
                Running numerical simulation...
              </h2>
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-full bg-mi-surface-soft h-2 border border-mi-rule overflow-hidden">
                  <div
                    className="bg-mi-ink h-full transition-all duration-300"
                    style={{ width: `${progress ? Math.min(100, Math.max(10, progress)) : 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-mi-muted">
                  <span>{progress !== null ? `PROGRESS: ${progress}%` : 'COMPUTING REALIZATIONS'}</span>
                  <span>ELAPSED: {elapsedSeconds}s</span>
                </div>
              </div>
            </div>
          )}

          {/* Completed Run Notification */}
          {completedRun && !running && (
            <div className="border border-mi-success/40 bg-mi-success/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-mi-success uppercase font-semibold">
                  SIMULATION COMPLETED (M5)
                </div>
                <h3 className="text-lg font-semibold text-mi-ink mt-0.5">
                  {completedRun.simulation.name}
                </h3>
                <p className="text-xs font-mono text-mi-muted mt-1">
                  ID: {completedRun.simulation.id} • All mathematical moments and traces resolved.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunAnother}
                  className="mi-btn-secondary h-10 px-4 text-xs"
                >
                  Configure Another
                </button>
                <Link
                  to={`/app/analytics/${completedRun.simulation.id}`}
                  className="mi-btn-primary h-10 px-5 text-xs"
                >
                  Open Result Workbench →
                </Link>
              </div>
            </div>
          )}

          {/* Primary Model Builder Workspace */}
          {!running && (
            <SimulationForm
              onSubmit={handleFormSubmit}
              submitting={running}
              error={error}
            />
          )}
        </div>
      </PageShell>
    </MainLayout>
  );
}

export default SimulationPage;
