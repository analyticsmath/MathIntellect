import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimeSimulation } from '../hooks/useRealtimeSimulation';
import { useRunSimulation } from '../hooks/useSimulations';
import { useMissionFlow } from '../hooks/useMissionFlow';
import { SimulationForm } from '../components/simulation/SimulationForm';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import { MissionLaunchOverlay } from '../modules/mission/MissionLaunchOverlay';
import { SimulationCinematicFlow } from '../modules/mission/SimulationCinematicFlow';
import { ResultRevealSequence } from '../modules/mission/ResultRevealSequence';
import type { RunSimulationRequest, RunSimulationResponse } from '../types/api.types';
import type { MissionPreview } from '../types/phase5.types';

type JourneyStage = 1 | 2 | 3 | 4 | 5;
const STAGES: Array<{ id: JourneyStage; label: string }> = [
  { id: 1, label: 'Configuration' },
  { id: 2, label: 'Validation' },
  { id: 3, label: 'Preview Impact' },
  { id: 4, label: 'Execution' },
  { id: 5, label: 'Result Reveal' },
];

const JOURNEY_TONE: Record<JourneyStage, { border: string; surface: string; accent: string }> = {
  1: { border: 'rgba(110,231,255,0.3)', surface: 'linear-gradient(155deg, rgba(22,32,51,0.96), rgba(14,22,36,0.95))', accent: 'var(--brand-blue)' },
  2: { border: 'rgba(245,158,11,0.32)', surface: 'linear-gradient(155deg, rgba(22,32,51,0.96), rgba(14,22,36,0.95))', accent: 'var(--amber-warning)' },
  3: { border: 'rgba(34,211,238,0.35)', surface: 'linear-gradient(155deg, rgba(22,32,51,0.96), rgba(14,22,36,0.95))', accent: 'var(--signal-cyan)' },
  4: { border: 'rgba(139,92,246,0.32)', surface: 'linear-gradient(155deg, rgba(22,32,51,0.96), rgba(14,22,36,0.95))', accent: 'var(--quantum-violet)' },
  5: { border: 'rgba(16,185,129,0.34)', surface: 'linear-gradient(155deg, rgba(22,32,51,0.96), rgba(14,22,36,0.95))', accent: 'var(--emerald-success)' },
};

function JourneyRail({ activeStage }: { activeStage: JourneyStage }) {
  return (
    <section className="premium-card p-4 md:p-5 mb-5" data-tilt>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {STAGES.map((stage) => {
          const active = stage.id === activeStage;
          const done = stage.id < activeStage;
          const tone = JOURNEY_TONE[stage.id];
          return (
            <div
              key={stage.id}
              className="rounded-xl px-3 py-2.5 transition-all duration-300"
              style={{
                border: active ? `1px solid ${tone.border}` : '1px solid rgba(148,163,184,0.22)',
                background: active ? tone.surface : 'rgba(11,16,32,0.86)',
                opacity: done || active ? 1 : 0.62,
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: done || active ? tone.accent : 'var(--text-muted)' }}>
                Stage {stage.id}
              </p>
              <p className="mt-1 text-xs font-semibold">{stage.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SimulationPage() {
  const navigate = useNavigate();
  const { run, running, error } = useRunSimulation();
  const mission = useMissionFlow();
  const [pendingId, setPendingId] = useState<string | undefined>();
  const [completedRun, setCompletedRun] = useState<RunSimulationResponse | null>(null);
  const [syntheticProgress, setSyntheticProgress] = useState(6);
  const [formStage, setFormStage] = useState<1 | 2 | 3 | 4>(1);
  const [pendingPayload, setPendingPayload] = useState<RunSimulationRequest | null>(null);
  const [simName, setSimName] = useState('Simulation');
  const { progress, wsError } = useRealtimeSimulation(pendingId);
  const executingRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSyntheticProgress((prev) => Math.min(88, prev + Math.max(1, Math.round((92 - prev) / 10))));
    }, 420);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (running && mission.phase === 'executing') return;
    if (running && mission.phase !== 'executing') {
      mission.advanceToExecution();
    }
  }, [running, mission]);

  useEffect(() => {
    if (completedRun) {
      mission.advanceToReveal();
    }
  }, [completedRun, mission]);

  const handleFormSubmit = async (payload: RunSimulationRequest): Promise<void> => {
    setSimName(payload.name || 'Simulation');
    setPendingPayload(payload);

    const preview: MissionPreview = {
      xpImpact: Math.floor(80 + Math.random() * 160),
      difficultyRisk: payload.behaviorSignals?.strategyChanges
        ? (payload.behaviorSignals.strategyChanges > 3 ? 'high' : 'medium')
        : 'medium',
      predictedGain: parseFloat((1.5 + Math.random() * 3.5).toFixed(1)),
      estimatedDuration: '30–90s',
    };
    mission.setPreview(preview);
    mission.startLaunch();
  };

  const handleConfirmLaunch = async () => {
    if (!pendingPayload) return;
    mission.advanceToTunnel();
  };

  const handleTunnelComplete = async () => {
    if (!pendingPayload || executingRef.current) return;
    executingRef.current = true;
    mission.advanceToExecution();
    setSyntheticProgress(8);
    try {
      const result = await run(pendingPayload);
      if (result?.simulation?.id) {
        setPendingId(result.simulation.id);
        setCompletedRun(result);
      }
    } finally {
      executingRef.current = false;
    }
  };

  const handleRunAnother = () => {
    executingRef.current = false;
    setCompletedRun(null);
    setPendingId(undefined);
    setSyntheticProgress(6);
    setPendingPayload(null);
    mission.reset();
  };

  const progressValue = progress ?? syntheticProgress;
  const journeyStage: JourneyStage = completedRun ? 5 : running ? 4 : formStage;

  return (
    <MainLayout>
      {(mission.phase === 'pre-launch' || mission.phase === 'tunnel') && (
        <MissionLaunchOverlay
          phase={mission.phase}
          simulationName={simName}
          preview={mission.preview}
          onConfirmLaunch={handleConfirmLaunch}
          onTunnelComplete={handleTunnelComplete}
          onCancel={mission.reset}
        />
      )}

      <PageShell title="Mission Launch" subtitle="Configure parameters and deploy">
        <div className="px-3 md:px-6 pt-4 pb-8">
          <div className="premium-card p-5 md:p-6 max-w-4xl">
            <JourneyRail activeStage={journeyStage} />

            <SimulationCinematicFlow
              isExecuting={running}
              progress={progressValue}
              simulationName={simName}
            />

            {wsError && (
              <div
                className="mb-5 px-4 py-3 rounded-xl text-sm"
                style={{ border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.14)', color: '#fecaca' }}
              >
                Engine error: {wsError}
              </div>
            )}

            {completedRun && mission.phase === 'reveal' && (
              <ResultRevealSequence
                gabe={completedRun.gabe}
                simulationId={completedRun.simulation.id}
                onOpenAnalytics={() => navigate(`/app/analytics/${completedRun.simulation.id}`, { viewTransition: true })}
                onRunAnother={handleRunAnother}
              />
            )}

            {mission.phase === 'idle' && !running && !completedRun && (
              <SimulationForm
                onSubmit={handleFormSubmit}
                submitting={false}
                error={error}
                onStageChange={setFormStage}
              />
            )}
          </div>
        </div>
      </PageShell>
    </MainLayout>
  );
}
