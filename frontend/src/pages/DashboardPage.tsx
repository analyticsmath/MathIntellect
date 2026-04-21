import { useEffect, useLayoutEffect, Suspense, lazy, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useSimulations } from '../hooks/useSimulations';
import { useIntelligence } from '../hooks/useIntelligence';
import { useProfile } from '../hooks/useProfile';
import { SimulationCard } from '../components/simulation/SimulationCard';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonSimulationCard } from '../components/ui/Skeleton';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import { realtimeService } from '../services/realtime.service';
import { IntelligenceRankCard } from '../modules/intelligence/IntelligenceRankCard';
import { NextSimulationSuggestion } from '../modules/ai/NextSimulationSuggestion';

const AICoachPanel = lazy(() =>
  import('../modules/ai/AICoachPanel').then((m) => ({ default: m.AICoachPanel })),
);
const BehaviorTrendGraph = lazy(() =>
  import('../modules/intelligence/BehaviorTrendGraph').then((m) => ({ default: m.BehaviorTrendGraph })),
);

const BADGES = [
  { title: 'Risk Master', copy: 'Top 5% tail-risk control in market simulations.' },
  { title: 'Equilibrium Hunter', copy: 'Consistent game-theory stability improvements.' },
  { title: 'Signal Architect', copy: 'High-confidence insight publication streak.' },
  { title: 'Conflict Resolver', copy: 'Agent pressure de-escalation with minimal loss.' },
] as const;

function useCountUp(target: number, duration = 760) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) {
        start = ts;
      }
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [duration, target]);

  return value;
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  const numeric = Number(value);
  const animated = useCountUp(Number.isFinite(numeric) ? numeric : 0);

  return (
    <article className="premium-card p-4 md:p-5" style={{ borderColor: `${accent}52` }} data-tilt>
      <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="mt-2 text-[2rem] leading-none font-semibold tabular-nums" style={{ color: accent }}>
        {Number.isFinite(numeric) ? animated : value}
      </p>
    </article>
  );
}

function MissionProgress({ label, progress, target, accent }: { label: string; progress: number; target: number; accent: string }) {
  const pct = Math.round((Math.min(target, progress) / Math.max(1, target)) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="font-semibold" style={{ color: accent }}>{Math.min(progress, target)}/{target}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.22)' }}>
        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: accent }} />
      </div>
    </div>
  );
}

function XPToast({ message }: { message: string }) {
  return (
    <div
      className="fixed right-4 top-20 z-[90] rounded-xl px-4 py-3 text-sm"
      style={{
        border: '1px solid rgba(16,185,129,0.42)',
        background: 'rgba(16,185,129,0.14)',
        color: '#86efac',
        boxShadow: '0 10px 28px rgba(2,6,23,0.5)',
      }}
    >
      {message}
    </div>
  );
}

function LevelUpModal({ open, level, onClose }: { open: boolean; level: number; onClose: () => void }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/46 grid place-items-center px-4" onClick={onClose}>
      <div
        className="premium-card w-full max-w-md p-6"
        onClick={(event) => event.stopPropagation()}
        style={{ borderColor: 'rgba(139,92,246,0.58)', boxShadow: '0 24px 62px rgba(139,92,246,0.34)' }}
      >
        <p className="section-kicker">Level Up</p>
        <div className="mt-4 flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-full grid place-items-center"
            style={{
              border: '2px solid rgba(34,211,238,0.62)',
              boxShadow: '0 0 0 10px rgba(34,211,238,0.14), 0 0 40px rgba(59,130,246,0.34)',
            }}
          >
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{level}</span>
          </div>
        </div>
        <h2 className="mt-4 text-2xl text-center">Strategic Level Unlocked</h2>
        <p className="mt-3 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
          New AI recommendation depth and mission challenges are now available.
        </p>
        <button type="button" className="primary-cta mt-6 w-full" onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { simulations, loading, error, refetch } = useSimulations();
  const { rank, loading: intelLoading } = useIntelligence();
  const { profile } = useProfile();

  const [levelUpPreview, setLevelUpPreview] = useState(false);
  const [dismissedAutoLevel, setDismissedAutoLevel] = useState<number | null>(null);
  const [xpToast, setXpToast] = useState<string | null>(null);

  const lastSim = simulations.find((simulation) => simulation.status === 'completed');

  useEffect(() => {
    realtimeService.connect();
    const offStarted = realtimeService.onAnyStarted(() => refetch());
    const offCompleted = realtimeService.onAnyCompleted(() => refetch());
    return () => {
      offStarted();
      offCompleted();
    };
  }, [refetch]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-dash-intro]', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' });
      gsap.from('[data-dash-stat]', {
        y: 18,
        opacity: 0,
        duration: 0.52,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.14,
      });
    });
    return () => ctx.revert();
  }, []);

  const total = simulations.length;
  const completed = simulations.filter((simulation) => simulation.status === 'completed').length;
  const running = simulations.filter((simulation) => simulation.status === 'running').length;
  const failed = simulations.filter((simulation) => simulation.status === 'failed').length;

  const missionState = useMemo(() => {
    return {
      runMarket: simulations.filter((s) => s.type === 'market').length,
      beatRisk: completed >= 2 ? 1 : 0,
      publishInsight: profile?.streakDays && profile.streakDays > 0 ? 1 : 0,
    };
  }, [completed, profile?.streakDays, simulations]);

  const action = (
    <button
      onClick={() => navigate('/app/simulations/new', { viewTransition: true })}
      className="primary-cta"
      style={{ paddingTop: 10, paddingBottom: 10, viewTransitionName: 'launch-cta' }}
    >
      Launch Simulation
    </button>
  );

  const triggerXpToast = () => {
    setXpToast('+120 XP Strategic Win');
    window.setTimeout(() => setXpToast(null), 1800);
  };

  const autoLevelUpTarget = rank && rank.xpProgress >= 98 ? rank.level + 1 : null;
  const shouldShowAutoLevelUp = autoLevelUpTarget !== null && dismissedAutoLevel !== autoLevelUpTarget;
  const showLevelUp = levelUpPreview || shouldShowAutoLevelUp;

  const handleCloseLevelUp = () => {
    if (autoLevelUpTarget !== null) {
      setDismissedAutoLevel(autoLevelUpTarget);
    }
    setLevelUpPreview(false);
  };

  return (
    <MainLayout>
      <LevelUpModal open={showLevelUp} level={(rank?.level ?? 1) + 1} onClose={handleCloseLevelUp} />
      {xpToast && <XPToast message={xpToast} />}

      <PageShell title="Intelligence Cockpit" subtitle="Where Math Meets Intelligence" action={action}>
        <div className="px-3 md:px-6 pt-5 pb-10 space-y-6 md:space-y-7">
          <section className="premium-card p-5 md:p-6 relative overflow-hidden" data-dash-intro data-tilt>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <p className="section-kicker">Mission Command</p>
                <h2 className="mt-3" style={{ fontSize: 'clamp(1.8rem,3.2vw,2.5rem)', lineHeight: 1.12 }}>
                  Premium control over simulation velocity and strategic precision.
                </h2>
                <p className="mt-3 text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                  Track progress, clear daily missions, and move your intelligence rank with every completed run.
                </p>
              </div>

              <div className="relative rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--glass-stroke)', background: 'rgba(11,16,32,0.78)' }}>
                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Current Streak</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>{profile?.streakDays ?? 0} days</p>
                <button type="button" className="secondary-cta mt-3 text-xs" onClick={triggerXpToast}>
                  Claim XP
                </button>
              </div>
            </div>
          </section>

          {!intelLoading && rank && (
            <section data-dash-intro>
              <IntelligenceRankCard rank={rank} />
            </section>
          )}

          {lastSim && (
            <section data-dash-intro>
              <NextSimulationSuggestion lastSimulationId={lastSim.id} />
            </section>
          )}

          {!loading && (
            <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
              <div data-dash-stat><StatCard label="Total Runs" value={String(total)} accent="var(--brand-blue)" /></div>
              <div data-dash-stat><StatCard label="Completed" value={String(completed)} accent="var(--emerald-success)" /></div>
              <div data-dash-stat><StatCard label="Running" value={String(running)} accent="var(--amber-warning)" /></div>
              <div data-dash-stat><StatCard label="Failed" value={String(failed)} accent="var(--rose-alert)" /></div>
            </section>
          )}

          <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-4">
            <article className="premium-card p-5 md:p-6" data-tilt>
              <p className="section-kicker">Daily Missions</p>
              <div className="mt-4 space-y-4">
                <MissionProgress label="Run 2 Market Sims" progress={missionState.runMarket} target={2} accent="var(--brand-blue)" />
                <MissionProgress label="Beat Risk Score" progress={missionState.beatRisk} target={1} accent="var(--signal-cyan)" />
                <MissionProgress label="Publish 1 Insight" progress={missionState.publishInsight} target={1} accent="var(--quantum-violet)" />
              </div>
            </article>

            <article className="premium-card p-5 md:p-6" data-tilt>
              <p className="section-kicker">Badge Vault</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BADGES.map((badge, index) => {
                  const unlocked = (profile?.level ?? 1) >= index + 3;
                  return (
                    <div
                      key={badge.title}
                      className="rounded-xl px-3 py-2"
                      style={{
                        border: unlocked ? '1px solid rgba(59,130,246,0.44)' : '1px solid var(--glass-stroke)',
                        background: unlocked ? 'rgba(59,130,246,0.14)' : 'rgba(11,16,32,0.74)',
                      }}
                    >
                      <p className="text-xs font-semibold" style={{ color: unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{badge.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{badge.copy}</p>
                    </div>
                  );
                })}
              </div>
              <button type="button" className="secondary-cta mt-4 text-xs" onClick={() => setLevelUpPreview(true)}>
                Preview Level-Up Modal
              </button>
            </article>
          </section>

          {!loading && total >= 2 && (
            <Suspense fallback={<div className="premium-card h-48 animate-pulse" />}>
              <BehaviorTrendGraph />
            </Suspense>
          )}

          {loading && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonSimulationCard key={i} />)}
            </section>
          )}

          {error && !loading && <ErrorState message={error} onRetry={refetch} />}

          {!loading && !error && total === 0 && (
            <section className="premium-card p-8 md:p-10 text-center" data-tilt>
              <h2 className="text-2xl font-semibold">No simulations yet. Launch your first mission.</h2>
              <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Command center is ready. Run your first simulation to unlock insights, badges, and progression.
              </p>
              <button
                onClick={() => navigate('/app/simulations/new', { viewTransition: true })}
                className="primary-cta mt-6"
              >
                Launch First Mission
              </button>
            </section>
          )}

          {!loading && !error && total > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                  Simulation Queue
                </h3>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{total} total</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {simulations.map((simulation, index) => (
                  <SimulationCard key={simulation.id} sim={simulation} index={index} />
                ))}
              </div>
            </section>
          )}

          <Suspense fallback={null}>
            <AICoachPanel lastSimulationId={lastSim?.id} pinnable />
          </Suspense>
        </div>
      </PageShell>
    </MainLayout>
  );
}
