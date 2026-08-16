import { ChartRenderer } from './ChartRenderer';
import { ChartErrorBoundary } from '../ui/ChartErrorBoundary';
import { ErrorState } from '../ui/ErrorState';
import { Loader } from '../ui/Loader';
import type { ChartsResponse } from '../../types/api.types';

function TabEmpty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center border border-mi-rule bg-mi-paper p-8">
      <p className="text-sm font-medium text-mi-ink">{`No ${label} available`}</p>
      <p className="text-xs max-w-xs text-mi-muted">
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
    return <Loader size="md" message="Rendering analytical charts..." />;
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {Object.entries(charts.charts).map(([key, chart]) => (
        <div key={key} className="border border-mi-rule bg-mi-paper p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-mi-rule pb-2">
            <h4 className="text-xs font-mono font-semibold uppercase text-mi-ink">
              {key.replace(/_/g, ' ')}
            </h4>
            <span className="text-[10px] font-mono text-mi-muted uppercase">
              {chart.type}
            </span>
          </div>
          <ChartErrorBoundary chartName={key.replace(/_/g, ' ')}>
            <div className="p-2 bg-mi-paper overflow-hidden">
              <ChartRenderer chart={chart} />
            </div>
          </ChartErrorBoundary>
        </div>
      ))}
    </div>
  );
}
