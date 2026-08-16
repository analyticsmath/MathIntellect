import { formatMs, humanizeType } from '../../utils/formatters';
import type { SummaryResponse } from '../../types/api.types';
import { Badge } from '../ui/Badge';
import { MetricCard } from '../ui/MetricCard';

export function SummaryPanel({ summary }: { summary: SummaryResponse }) {
  return (
    <div className="space-y-8">
      {/* Top Meta Line */}
      <div className="flex items-center gap-3 flex-wrap border-b border-mi-rule pb-4">
        <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 border border-mi-ink bg-mi-surface-soft text-mi-ink">
          {humanizeType(summary.simulationType)}
        </span>
        <div className="text-xs font-mono text-mi-muted flex items-center gap-1.5">
          <span>Execution time:</span>
          <strong className="text-mi-ink">{formatMs(summary.executionTimeMs)}</strong>
        </div>
      </div>

      {/* Section 1: Key Metrics */}
      <div>
        <div className="text-xs font-mono text-mi-muted uppercase mb-3">
          1. Key Mathematical Moments
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {summary.keyMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Section 2: Highlights */}
      {summary.highlights.length > 0 && (
        <div className="border-t border-mi-rule pt-6">
          <div className="text-xs font-mono text-mi-muted uppercase mb-3">
            2. Statistical Highlights
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.highlights.map((highlight, index) => (
              <div
                key={index}
                className="text-xs font-mono p-3 bg-mi-surface-soft border border-mi-rule text-mi-text"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Invariant Insights */}
      {summary.insights.length > 0 && (
        <div className="border-t border-mi-rule pt-6">
          <div className="text-xs font-mono text-mi-muted uppercase mb-3">
            3. Invariant Insights &amp; Findings
          </div>
          <div className="space-y-3">
            {summary.insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 border border-mi-rule bg-mi-paper space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Badge severity={insight.severity} />
                  <span className="text-xs font-semibold text-mi-ink">{insight.title}</span>
                </div>
                <p className="text-xs text-mi-text leading-relaxed">
                  {insight.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
