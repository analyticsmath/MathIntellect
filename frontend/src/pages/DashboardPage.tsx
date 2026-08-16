import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimulations } from '../hooks/useSimulations';
import { useProfile } from '../hooks/useProfile';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonSimulationCard } from '../components/ui/Skeleton';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import { StatusBadge } from '../components/ui/Badge';
import { formatDate } from '../utils/formatters';
import { realtimeService } from '../services/realtime.service';

export function DashboardPage() {
  const navigate = useNavigate();
  const { simulations, loading, error, refetch } = useSimulations();
  const { profile } = useProfile();

  const mostRecent = simulations[0];
  const total = simulations.length;
  const completed = simulations.filter((s) => s.status === 'completed').length;
  const running = simulations.filter((s) => s.status === 'running').length;
  const failed = simulations.filter((s) => s.status === 'failed').length;

  useEffect(() => {
    realtimeService.connect();
    const offStarted = realtimeService.onAnyStarted(() => refetch());
    const offCompleted = realtimeService.onAnyCompleted(() => refetch());
    return () => {
      offStarted();
      offCompleted();
    };
  }, [refetch]);

  const action = (
    <button
      onClick={() => navigate('/app/simulations/new')}
      className="mi-btn-primary h-9 px-4 text-xs"
    >
      + New Simulation
    </button>
  );

  return (
    <MainLayout>
      <PageShell
        title="Simulation Dashboard"
        subtitle="Mathematical models &amp; real-time execution"
        action={action}
      >
        <div className="p-6 md:p-8 max-w-[1720px] mx-auto w-full space-y-8">
          {/* Section 1: Resume Active Work (Dominant Recent Model) */}
          {mostRecent && (
            <section className="border border-mi-rule bg-mi-paper p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mi-rule pb-4">
                <div>
                  <div className="text-[11px] font-mono text-mi-muted uppercase">
                    MOST RECENT SIMULATION
                  </div>
                  <h2 className="text-xl md:text-2xl font-medium text-mi-ink mt-1">
                    {mostRecent.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-3 text-xs font-mono text-mi-text">
                    <span>ENGINE: {mostRecent.type.toUpperCase()}</span>
                    <span>•</span>
                    <span>CREATED: {formatDate(mostRecent.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={mostRecent.status} />
                  {mostRecent.status === 'completed' && (
                    <Link
                      to={`/app/analytics/${mostRecent.id}`}
                      className="mi-btn-primary h-10 px-5 text-xs"
                    >
                      Inspect Result Workbench →
                    </Link>
                  )}
                  {mostRecent.status === 'running' && (
                    <Link
                      to={`/app/simulations/new`}
                      className="mi-btn-secondary h-10 px-4 text-xs"
                    >
                      View Live Run
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-mi-surface-soft border border-mi-rule">
                  <div className="text-mi-muted">MODEL ID</div>
                  <div className="text-mi-ink font-semibold mt-0.5">{mostRecent.id.slice(0, 10)}...</div>
                </div>
                <div className="p-3 bg-mi-surface-soft border border-mi-rule">
                  <div className="text-mi-muted">SOLVER ENGINE</div>
                  <div className="text-mi-ink font-semibold mt-0.5">{mostRecent.type}</div>
                </div>
                <div className="p-3 bg-mi-surface-soft border border-mi-rule">
                  <div className="text-mi-muted">STATUS</div>
                  <div className="text-mi-ink font-semibold mt-0.5 uppercase">{mostRecent.status}</div>
                </div>
                <div className="p-3 bg-mi-surface-soft border border-mi-rule">
                  <div className="text-mi-muted">PARAMETERS</div>
                  <div className="text-mi-ink font-semibold mt-0.5">
                    {mostRecent.parameters ? Object.keys(mostRecent.parameters).length : 0} configured
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Summary Metrics */}
          {!loading && (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-mi-rule bg-mi-paper p-4">
                <div className="text-xs font-mono text-mi-muted uppercase">Total Runs</div>
                <div className="text-2xl font-bold font-mono text-mi-ink mt-2">{total}</div>
              </div>
              <div className="border border-mi-rule bg-mi-paper p-4">
                <div className="text-xs font-mono text-mi-muted uppercase">Completed</div>
                <div className="text-2xl font-bold font-mono text-mi-success mt-2">{completed}</div>
              </div>
              <div className="border border-mi-rule bg-mi-paper p-4">
                <div className="text-xs font-mono text-mi-muted uppercase">Running</div>
                <div className="text-2xl font-bold font-mono text-mi-warning mt-2">{running}</div>
              </div>
              <div className="border border-mi-rule bg-mi-paper p-4">
                <div className="text-xs font-mono text-mi-muted uppercase">Halted / Failed</div>
                <div className="text-2xl font-bold font-mono text-mi-danger mt-2">{failed}</div>
              </div>
            </section>
          )}

          {/* Loading & Error States */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonSimulationCard key={i} />
              ))}
            </div>
          )}

          {error && !loading && (
            <ErrorState message={error} onRetry={refetch} />
          )}

          {/* Empty State */}
          {!loading && !error && total === 0 && (
            <section className="border border-mi-rule bg-mi-paper p-12 text-center space-y-4">
              <div className="text-xs font-mono text-mi-muted uppercase">WORKSPACE EMPTY</div>
              <h2 className="text-2xl font-medium text-mi-ink">
                No simulations created yet.
              </h2>
              <p className="text-sm text-mi-text max-w-md mx-auto leading-relaxed">
                Choose an engine family in the Model Builder to set parameters and run your first deterministic simulation.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/app/simulations/new')}
                  className="mi-btn-primary h-11 px-6 text-sm"
                >
                  Start a Simulation
                </button>
              </div>
            </section>
          )}

          {/* Section 3: Recent Models & Simulations Table */}
          {!loading && !error && total > 0 && (
            <section className="border border-mi-rule bg-mi-paper p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-mi-rule pb-3">
                <h3 className="text-sm font-semibold text-mi-ink">
                  Simulation Queue &amp; History
                </h3>
                <span className="text-xs font-mono text-mi-muted">{total} runs recorded</span>
              </div>

              <div className="overflow-x-auto">
                <table className="mi-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>ENGINE</th>
                      <th>STATUS</th>
                      <th>CREATED</th>
                      <th className="text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulations.map((sim) => (
                      <tr key={sim.id} className="hover:bg-mi-surface-soft/50">
                        <td className="font-medium text-mi-ink">
                          {sim.name}
                        </td>
                        <td className="font-mono text-xs text-mi-text uppercase">
                          {sim.type}
                        </td>
                        <td>
                          <StatusBadge status={sim.status} />
                        </td>
                        <td className="font-mono text-xs text-mi-muted">
                          {formatDate(sim.createdAt)}
                        </td>
                        <td className="text-right">
                          {sim.status === 'completed' ? (
                            <Link
                              to={`/app/analytics/${sim.id}`}
                              className="text-xs font-mono text-mi-ink font-semibold hover:text-mi-change"
                            >
                              Inspect →
                            </Link>
                          ) : (
                            <span className="text-xs font-mono text-mi-muted">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Section 4: Analytical Progression Summary (Calm, Secondary) */}
          {profile && (
            <section className="border border-mi-rule bg-mi-paper p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono text-mi-muted uppercase">ANALYST PROGRESSION</div>
                <div className="text-sm text-mi-text mt-0.5">
                  Account: <strong className="text-mi-ink font-semibold">{profile.displayName || 'Analyst'}</strong> • Level {profile.level ?? 1} • {profile.xp ?? 0} Total Verification Units
                </div>
              </div>
              <Link to="/app/profile" className="mi-btn-secondary h-8 px-3 text-xs">
                View Full Profile
              </Link>
            </section>
          )}
        </div>
      </PageShell>
    </MainLayout>
  );
}

export default DashboardPage;
