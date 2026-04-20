import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactElement,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AiExplainModal,
  AiIntelligencePanel,
} from '../components/analytics/AiIntelligencePanel';
import { SummaryPanel } from '../components/analytics/SummaryPanel';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Loader } from '../components/ui/Loader';
import { SkeletonAnalytics } from '../components/ui/Skeleton';
import { useAnalytics } from '../hooks/useAnalytics';
import { useRealtimeSimulation } from '../hooks/useRealtimeSimulation';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import { aiService } from '../services/ai.service';
import type {
  AiDecisionResponse,
  AiExplainResponse,
  AiGamificationEvent,
  AiInsightResponse,
} from '../types/api.types';
import { formatMetricValue } from '../utils/formatters';

const TABS = ['overview', 'charts', '3d'] as const;
type Tab = typeof TABS[number];
const ChartsTabPanel = lazy(() => import('../components/charts/ChartsTabPanel'));
const ThreeDTabPanel = lazy(() => import('../components/charts/ThreeDTabPanel'));

const TAB_CONFIG: Record<Tab, { label: string; icon: ReactElement }> = {
  overview: {
    label: 'Overview',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8.5 0A1.5 1.5 0 0111 1h3a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0114 7h-3a1.5 1.5 0 01-1.5-1.5v-3zm-8.5 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8.5 0A1.5 1.5 0 0111 9h3a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0114 15h-3a1.5 1.5 0 01-1.5-1.5v-3z"/></svg>,
  },
  charts: {
    label: 'Charts',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M1 11a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1v-3zm5-4a1 1 0 011-1h2a1 1 0 011 1v7a1 1 0 01-1 1H7a1 1 0 01-1-1V7zm5-5a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V2z"/></svg>,
  },
  '3d': {
    label: '3D',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M8.186 1.113a.5.5 0 00-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6z"/></svg>,
  },
};

function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const activeIndex = TABS.findIndex((tab) => tab === active);
  return (
    <div
      className="relative flex items-center gap-1 p-1 rounded-xl"
      style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17, 24, 39, 0.8)' }}
    >
      <div
        aria-hidden
        className="absolute bottom-1 h-[2px] rounded-full transition-transform duration-300"
        style={{
          left: 8,
          width: `calc(${100 / TABS.length}% - 16px)`,
          transform: `translateX(${activeIndex * 100}%)`,
          background: 'linear-gradient(132deg, var(--brand-blue), var(--signal-cyan), var(--quantum-violet))',
          boxShadow: '0 0 16px rgba(59,130,246,0.5)',
        }}
      />
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
            style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            {TAB_CONFIG[tab].icon}
            {TAB_CONFIG[tab].label}
          </button>
        );
      })}
    </div>
  );
}

function ProgressBanner({ progress }: { progress: number }) {
  const label = progress < 25
    ? 'Initializing model...'
    : progress < 50
      ? 'Sampling probability space...'
      : progress < 75
        ? 'Computing equilibrium states...'
        : 'Rendering analytics layer...';

  return (
    <div
      className="mb-6 p-4 rounded-2xl flex flex-col gap-2.5"
      style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17, 24, 39, 0.8)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand-blue)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Simulation running...</span>
        </div>
        <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded-md" style={{ background: 'rgba(59,130,246,0.16)', color: 'var(--text-primary)' }}>
          {progress}%
        </span>
      </div>
      <div className="w-full rounded-full h-1 overflow-hidden" style={{ background: 'rgba(148, 163, 184, 0.24)' }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(2, progress)}%`, background: 'linear-gradient(90deg, var(--brand-blue), var(--signal-cyan), var(--quantum-violet))' }}
        />
      </div>
      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

export function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  return <AnalyticsPageContent key={id ?? 'analytics-root'} id={id} />;
}

function AnalyticsPageContent({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [chartsActivated, setChartsActivated] = useState(false);
  const [threeDActivated, setThreeDActivated] = useState(false);
  const [chartsRevealToken, setChartsRevealToken] = useState('');
  const [aiInsight, setAiInsight] = useState<AiInsightResponse | null>(null);
  const [aiDecision, setAiDecision] = useState<AiDecisionResponse | null>(null);
  const [aiGamificationEvent, setAiGamificationEvent] = useState<AiGamificationEvent | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoadedFor, setAiLoadedFor] = useState<string | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainData, setExplainData] = useState<AiExplainResponse | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  const handleTabChange = (nextTab: Tab) => {
    setTab(nextTab);
    if (nextTab === 'charts') {
      setChartsActivated(true);
    } else if (nextTab === '3d') {
      setThreeDActivated(true);
    }
  };

  const shouldLoadCharts = tab === 'charts' || chartsActivated;
  const shouldLoad3D = tab === '3d' || threeDActivated;
  const { summary, charts, threeD, summaryError, chartsError, threeDError, loading } = useAnalytics(id, {
    loadCharts: shouldLoadCharts,
    load3D: shouldLoad3D,
  });
  const { progress, completed } = useRealtimeSimulation(id);
  const isRunning = progress !== null && progress < 100 && !completed;
  const summaryLoading = loading && !summary && !summaryError;

  useEffect(() => {
    if (!id) {
      return;
    }
    window.localStorage.setItem('math-intellect.lastAnalyticsRoute', `/app/analytics/${id}`);
  }, [id]);

  const loadAiIntelligence = useCallback(() => {
    if (!id) {
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAiLoadedFor(id);

    void aiService
      .getIntelligence(id)
      .then((response) => {
        setAiInsight(response.insight);
        setAiDecision(response.decision);
        setAiGamificationEvent(response.gamification_event);
      })
      .catch((error: Error) => {
        setAiError(error.message);
      })
      .finally(() => {
        setAiLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id || !summary || aiLoadedFor === id || summaryLoading || summaryError) {
      return;
    }

    const timer = window.setTimeout(() => {
      loadAiIntelligence();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [
    aiLoadedFor,
    id,
    loadAiIntelligence,
    summary,
    summaryError,
    summaryLoading,
  ]);

  const loadExplanation = useCallback(() => {
    if (!id) {
      return;
    }

    setExplainLoading(true);
    setExplainError(null);
    void aiService
      .explainSimulation(id)
      .then((response) => {
        setExplainData(response);
      })
      .catch((error: Error) => {
        setExplainError(error.message);
      })
      .finally(() => {
        setExplainLoading(false);
      });
  }, [id]);

  const handleExplainOpen = useCallback(() => {
    setExplainOpen(true);
    if (!explainData && !explainLoading) {
      loadExplanation();
    }
  }, [explainData, explainLoading, loadExplanation]);

  const chartsLoading = shouldLoadCharts && loading && !charts && !chartsError;
  const threeDLoading = shouldLoad3D && loading && !threeD && !threeDError;
  const chartsRevealKey = charts ? `${id ?? 'unknown'}:${charts.cachedAt}` : '';
  const chartsRevealReady = !chartsRevealKey || chartsRevealToken === chartsRevealKey;

  useEffect(() => {
    if (!chartsRevealKey || chartsLoading || chartsError || chartsRevealToken === chartsRevealKey) {
      return;
    }
    const timer = window.setTimeout(() => {
      setChartsRevealToken(chartsRevealKey);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [chartsError, chartsLoading, chartsRevealKey, chartsRevealToken]);

  const action = (
    <div className="flex items-center gap-2.5">
      {(summary || charts || threeD) && (
        <TabBar active={tab} onChange={handleTabChange} />
      )}
      <button
        onClick={() => navigate('/app', { viewTransition: true })}
        className="secondary-cta text-xs"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        Back
      </button>
    </div>
  );

  return (
    <MainLayout>
      <PageShell
        title={summary?.simulationName ?? 'Analytics'}
        subtitle={summary ? `${summary.simulationType.replace(/_/g, ' ')} / ${summary.status}` : undefined}
        action={action}
      >
        <div className="px-3 md:px-6 pt-5 pb-10 space-y-1">
          {isRunning && <ProgressBanner progress={progress ?? 0} />}

          {tab === 'overview' && (
            <div className="pt-1">
              {summaryLoading && <SkeletonAnalytics />}
              {summaryError && !summaryLoading && (
                <ErrorState message={summaryError} onRetry={() => window.location.reload()} />
              )}
              {!summaryLoading && summary && (
                <div className="space-y-4">
                  <Card>
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--text-muted)' }}>
                      Simulation Summary
                    </p>
                    <SummaryPanel summary={summary} />
                  </Card>

                  <AiIntelligencePanel
                    loading={aiLoading}
                    error={aiError}
                    insight={aiInsight}
                    decision={aiDecision}
                    gamificationEvent={aiGamificationEvent}
                    onRetry={loadAiIntelligence}
                    onExplain={handleExplainOpen}
                  />
                </div>
              )}
            </div>
          )}

          {shouldLoadCharts && (
            <div style={{ display: tab === 'charts' ? 'block' : 'none' }}>
              {summary && charts && !chartsLoading && !chartsError && !chartsRevealReady && (
                <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {summary.keyMetrics.slice(0, 4).map((metric, index) => (
                    <div
                      key={`${metric.label}-${index}`}
                      className="surface-glass rounded-xl px-3 py-2 animate-fade-up"
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
                        {metric.label}
                      </p>
                      <p className="text-lg font-semibold mt-1">
                        {formatMetricValue(metric.value, metric.format, metric.unit)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div
                style={{
                  opacity: chartsRevealReady || chartsLoading || Boolean(chartsError) ? 1 : 0,
                  transform: chartsRevealReady || chartsLoading || Boolean(chartsError) ? 'translateY(0px)' : 'translateY(6px)',
                  transition: 'opacity 260ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <Suspense fallback={<Loader size="md" message="Loading chart module..." />}>
                  <ChartsTabPanel charts={charts} loading={chartsLoading} error={chartsError} />
                </Suspense>
              </div>
            </div>
          )}

          {shouldLoad3D && (
            <div style={{ display: tab === '3d' ? 'block' : 'none' }}>
              <Suspense fallback={<Loader size="md" message="Loading 3D module..." />}>
                <ThreeDTabPanel threeD={threeD} loading={threeDLoading} error={threeDError} />
              </Suspense>
            </div>
          )}
        </div>
      </PageShell>
      <AiExplainModal
        open={explainOpen}
        loading={explainLoading}
        error={explainError}
        explanation={explainData}
        onRetry={loadExplanation}
        onClose={() => setExplainOpen(false)}
      />
    </MainLayout>
  );
}
