import { formatMetricValue } from '../../utils/formatters';
import type { MetricCard as MetricCardType } from '../../types/api.types';

export function MetricCard({ label, value, unit, format }: MetricCardType) {
  return (
    <div className="bg-mi-paper border border-mi-rule p-4 flex flex-col justify-between">
      <span className="text-xs font-mono text-mi-muted uppercase">
        {label}
      </span>
      <span className="text-2xl font-bold font-mono text-mi-ink mt-2">
        {formatMetricValue(value, format, unit)}
      </span>
    </div>
  );
}
