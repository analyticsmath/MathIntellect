import { ChartRenderer } from './ChartRenderer';
import { ChartErrorBoundary } from '../ui/ChartErrorBoundary';
import { Card } from '../ui/Card';
import { ErrorState } from '../ui/ErrorState';
import { Loader } from '../ui/Loader';
import type { ChartsResponse } from '../../types/api.types';
import { chartTheme } from './chartTheme';

function TabEmpty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg"
        style={{ border: '1px solid rgba(255, 255, 255, 0.14)', background: 'rgba(17, 24, 39, 0.88)' }}
      >
        --
      </div>
      <p className="text-sm font-medium">{`No ${label} available`}</p>
      <p className="text-xs max-w-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        This simulation output does not include {label.toLowerCase()}.
      </p>
    </div>
  );
}

interface ChartsTabPanelProps {
  charts: ChartsResponse | null;
  loading: boolean;
  error: string | null;
}

export default function ChartsTabPanel({ charts, loading, error }: ChartsTabPanelProps) {
  if (loading) {
    return <Loader size="md" message="Loading charts..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!charts) {
    return <Loader size="md" message="Preparing chart engine..." />;
  }

  if (Object.keys(charts.charts).length === 0) {
    return <TabEmpty label="Charts" />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-6">
      {Object.entries(charts.charts).map(([key, chart], index) => (
        <Card key={key} hoverable staggerIndex={index % 6} glow="cyan" className="p-0">
          <div className="p-6 md:p-7">
            <p className="text-[11px] font-semibold mb-5 capitalize tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
              {key.replace(/_/g, ' ')}
            </p>
            <ChartErrorBoundary chartName={key.replace(/_/g, ' ')}>
              <div className="relative rounded-2xl overflow-hidden p-3 md:p-4" style={{ background: chartTheme.plotly.plot_bgcolor }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: chartTheme.surface.chartBaseGradient }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: chartTheme.surface.chartGlassOverlay }} />
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    border: `1px solid ${chartTheme.surface.chartBorder}`,
                    boxShadow: chartTheme.surface.chartInnerGlow,
                  }}
                />
                <div className="relative z-10">
                  <ChartRenderer chart={chart} />
                </div>
              </div>
            </ChartErrorBoundary>
          </div>
        </Card>
      ))}
    </div>
  );
}
