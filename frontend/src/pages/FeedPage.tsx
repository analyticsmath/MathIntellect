import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import { IntelligenceFeed } from '../modules/social/IntelligenceFeed';
import { AICoachPanel } from '../modules/ai/AICoachPanel';

const SEEDED_USER_NAMES = [
  'QuantPilot',
  'NashMind',
  'AlphaGrid',
  'RiskNova',
  'StrategyFlow',
  'HawkTheory',
  'SigmaPulse',
  'DeltaKernel',
  'PrismTactics',
  'VectorDoctrine',
];

export function FeedPage() {
  const navigate = useNavigate();

  const action = (
    <button
      type="button"
      className="primary-cta text-sm"
      style={{ paddingTop: 10, paddingBottom: 10 }}
      onClick={() => navigate('/app/simulations/new', { viewTransition: true })}
    >
      Run & Share
    </button>
  );

  return (
    <MainLayout>
      <PageShell
        title="Intelligence Feed"
        subtitle="Live simulation ecosystem with ranked contributors"
        action={action}
      >
        <div className="px-3 md:px-6 pt-5 pb-10">
          <div
            className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)] gap-7 items-start"
          >
            <div className="min-w-0">
              <IntelligenceFeed />
            </div>

            <div
              className="space-y-4"
              style={{
                position: 'relative',
              }}
            >
              <div className="xl:sticky xl:top-24 space-y-4">
                <AICoachPanel pinnable={false} />

                <div className="premium-card p-5 space-y-3" data-tilt>
                  <p className="section-kicker">Community Pulse</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Active Simulators', value: '3,184', color: 'var(--brand-blue)' },
                      { label: 'Missions Today', value: '18,420', color: 'var(--signal-cyan)' },
                      { label: 'XP Generated', value: '4.8M', color: 'var(--quantum-violet)' },
                      { label: 'Forks This Week', value: '1,204', color: 'var(--emerald-success)' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                        <span className="text-xs font-semibold tabular-nums" style={{ color: stat.color }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="premium-card p-5 space-y-3" data-tilt>
                  <p className="section-kicker">Top 10 Simulators</p>
                  <div className="space-y-2.5">
                    {SEEDED_USER_NAMES.map((name, index) => (
                      <div key={name} className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-primary)' }}>{name}</span>
                        <span className="font-semibold" style={{ color: index % 3 === 0 ? 'var(--brand-blue)' : index % 3 === 1 ? 'var(--signal-cyan)' : 'var(--quantum-violet)' }}>
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </MainLayout>
  );
}
