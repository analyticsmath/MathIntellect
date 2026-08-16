import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  AiExplainModal,
  AiIntelligencePanel,
} from '../components/analytics/AiIntelligencePanel';
import { SummaryPanel } from '../components/analytics/SummaryPanel';
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
import { StatusBadge } from '../components/ui/Badge';

type Tab = 'overview' | 'charts' | '3d';
const ChartsTabPanel = lazy(() => import('../components/charts/ChartsTabPanel'));
const ThreeDTabPanel = lazy(() => import('../components/charts/ThreeDTabPanel'));

export function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  return <AnalyticsPageContent key={id ?? 'analytics-root'} id={id} />;
}

function AnalyticsPageContent({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [chartsActivated, setChartsActivated] = useState(false);
  const [threeDActivated, setThreeDActivated] = useState(false);
  const [aiInsight, setAiInsight] = useState<AiInsightResponse | null>(null);
  const [aiDecision, setAiDecision] = useState<AiDecisionResponse | null>(null);
  const [aiGamificationEvent, setAiGamificationEvent] = useState<AiGamificationEvent | null>(null);
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
  const aiLoading = Boolean(id && summary && !aiInsight && !aiError && !summaryLoading && !summaryError && aiLoadedFor !== id);

  useEffect(() => {
    if (!id) return;
    window.localStorage.setItem('math-intellect.lastAnalyticsRoute', `/app/analytics/${id}`);
  }, [id]);

  useEffect(() => {
    if (!id || !summary || aiLoadedFor === id || summaryLoading || summaryError) {
      return;
    }
    let cancelled = false;

    aiService
      .getIntelligence(id)
      .then((response) => {
        if (!cancelled) {
          setAiInsight(response.insight);
          setAiDecision(response.decision);
          setAiGamificationEvent(response.gamification_event);
          setAiLoadedFor(id);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setAiError(err.message);
          setAiLoadedFor(id);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [aiLoadedFor, id, summary, summaryError, summaryLoading]);

  const loadAiIntelligence = useCallback(() => {
    if (!id) return;
    setAiError(null);
    setAiInsight(null);
    setAiDecision(null);
    setAiLoadedFor(null);
  }, [id]);

  const loadExplanation = useCallback(() => {
    if (!id) return;
    setExplainLoading(true);
    setExplainError(null);
    void aiService
      .explainSimulation(id)
      .then((response) => {
        setExplainData(response);
      })
      .catch((err: Error) => {
        setExplainError(err.message);
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

  const action = (
    <div className="flex items-center gap-3">
      <Link
        to="/app/simulations/new"
        className="mi-btn-secondary h-8 px-3 text-xs"
      >
        Configure Variant
      </Link>
      <button
        onClick={() => navigate('/app')}
        className="mi-btn-secondary h-8 px-3 text-xs"
      >
        Queue Overview
      </button>
    </div>
  );

  return (
    <MainLayout>
      <PageShell
        title={summary?.simulationName ?? 'Result Workbench'}
        subtitle={summary ? `ID: ${id} • Engine: ${summary.simulationType.toUpperCase()}` : undefined}
        action={action}
      >
        <div className="p-6 md:p-8 max-w-[1720px] mx-auto w-full space-y-6">
          {/* Running Notification if still processing */}
          {isRunning && (
            <div className="p-4 border border-mi-warning/50 bg-mi-warning/10 flex items-center justify-between text-xs font-mono">
              <span className="text-mi-ink font-semibold">
                SIMULATION IN PROGRESS (REALTIME STREAM)
              </span>
              <span>PROGRESS: {progress}%</span>
            </div>
          )}

          {/* Workbench Section Tabs */}
          <div className="flex items-center justify-between border-b border-mi-rule pb-2">
            <div className="flex items-center gap-1" role="tablist" aria-label="Workbench Sections">
              <button
                role="tab"
                aria-selected={tab === 'overview'}
                onClick={() => handleTabChange('overview')}
                className={`px-4 py-2 text-xs font-mono font-medium border transition-colors ${
                  tab === 'overview'
                    ? 'border-mi-ink bg-mi-paper text-mi-ink font-bold shadow-xs'
                    : 'border-transparent text-mi-text hover:text-mi-ink hover:bg-mi-surface-soft'
                }`}
              >
                1. Overview &amp; Moments
              </button>
              <button
                role="tab"
                aria-selected={tab === 'charts'}
                onClick={() => handleTabChange('charts')}
                className={`px-4 py-2 text-xs font-mono font-medium border transition-colors ${
                  tab === 'charts'
                    ? 'border-mi-ink bg-mi-paper text-mi-ink font-bold shadow-xs'
                    : 'border-transparent text-mi-text hover:text-mi-ink hover:bg-mi-surface-soft'
                }`}
              >
                2. Distributions &amp; Charts
              </button>
              <button
                role="tab"
                aria-selected={tab === '3d'}
                onClick={() => handleTabChange('3d')}
                className={`px-4 py-2 text-xs font-mono font-medium border transition-colors ${
                  tab === '3d'
                    ? 'border-mi-ink bg-mi-paper text-mi-ink font-bold shadow-xs'
                    : 'border-transparent text-mi-text hover:text-mi-ink hover:bg-mi-surface-soft'
                }`}
              >
                3. 3D Spatial Field
              </button>
            </div>

            {summary && (
              <div className="hidden sm:flex items-center gap-2">
                <StatusBadge status={summary.status} />
              </div>
            )}
          </div>

          {/* Tab 1: Overview */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {summaryLoading && <SkeletonAnalytics />}
              {summaryError && !summaryLoading && (
                <ErrorState message={summaryError} onRetry={() => window.location.reload()} />
              )}
              {!summaryLoading && summary && (
                <div className="border border-mi-rule bg-mi-paper p-6 space-y-6">
                  <SummaryPanel summary={summary} />
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

          {/* Tab 2: Charts */}
          {shouldLoadCharts && (
            <div style={{ display: tab === 'charts' ? 'block' : 'none' }}>
              <Suspense fallback={<Loader size="md" message="Rendering charts..." />}>
                <ChartsTabPanel charts={charts} loading={chartsLoading} error={chartsError} />
              </Suspense>
            </div>
          )}

          {/* Tab 3: 3D */}
          {shouldLoad3D && (
            <div style={{ display: tab === '3d' ? 'block' : 'none' }}>
              <Suspense fallback={<Loader size="md" message="Initializing 3D spatial field..." />}>
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

export default AnalyticsPage;
