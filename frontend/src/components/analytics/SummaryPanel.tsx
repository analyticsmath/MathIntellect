import { formatMs, humanizeType } from '../../utils/formatters';
import type { InsightSeverity, SummaryResponse } from '../../types/api.types';
import { Badge } from '../ui/Badge';
import { MetricCard } from '../ui/MetricCard';

const SEVERITY_STYLE: Record<InsightSeverity, { bg: string; border: string; accent: string }> = {
  info: { bg: 'rgba(2, 132, 199, 0.16)', border: 'rgba(2, 132, 199, 0.34)', accent: '#22D3EE' },
  success: { bg: 'rgba(22, 163, 74, 0.16)', border: 'rgba(22, 163, 74, 0.34)', accent: '#10B981' },
  warning: { bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.36)', accent: '#F59E0B' },
  danger: { bg: 'rgba(239, 68, 68, 0.18)', border: 'rgba(239, 68, 68, 0.36)', accent: '#F43F5E' },
};

export function SummaryPanel({ summary }: { summary: SummaryResponse }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-[11px] px-3 py-1.5 rounded-full font-semibold uppercase tracking-[0.14em]"
          style={{
            border: '1px solid rgba(34,211,238,0.34)',
            background: 'rgba(34,211,238,0.16)',
            color: 'var(--signal-cyan)',
          }}
        >
          {humanizeType(summary.simulationType)}
        </span>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
          style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17, 24, 39, 0.8)' }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Completed in</span>
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatMs(summary.executionTimeMs)}</span>
        </div>
      </div>

      {summary.highlights.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
            Highlights
          </p>
          <div className="flex flex-wrap gap-2.5">
            {summary.highlights.map((highlight, index) => (
              <span
                key={index}
                className="text-xs font-mono px-3 py-2 rounded-lg"
                style={{
                  border: '1px solid var(--glass-stroke)',
                  background: 'rgba(17, 24, 39, 0.8)',
                  color: 'var(--text-secondary)',
                }}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text-muted)' }}>
          Key Metrics
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {summary.keyMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {summary.insights.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text-muted)' }}>
            Insights
          </p>
          <div className="flex flex-col gap-3">
            {summary.insights.map((insight, index) => {
              const style = SEVERITY_STYLE[insight.severity];
              return (
                <div
                  key={index}
                  className="flex gap-4 p-5 rounded-2xl relative overflow-hidden"
                  style={{ border: `1px solid ${style.border}`, background: style.bg }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ background: style.accent }}
                  />
                  <div className="shrink-0 mt-0.5 pl-2">
                    <Badge severity={insight.severity} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-tight">{insight.title}</p>
                    <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
