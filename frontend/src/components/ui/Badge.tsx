import type { InsightSeverity } from '../../types/api.types';

const SEVERITY_STYLES: Record<InsightSeverity, { text: string; bg: string; border: string; dot: string }> = {
  info: { text: '#7DD3FC', bg: 'rgba(2, 132, 199, 0.16)', border: 'rgba(2, 132, 199, 0.36)', dot: '#22D3EE' },
  success: { text: '#6EE7B7', bg: 'rgba(22, 163, 74, 0.16)', border: 'rgba(22, 163, 74, 0.34)', dot: '#10B981' },
  warning: { text: '#FCD34D', bg: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.36)', dot: '#F59E0B' },
  danger: { text: '#FDA4AF', bg: 'rgba(239, 68, 68, 0.18)', border: 'rgba(239, 68, 68, 0.36)', dot: '#F43F5E' },
};

const SEVERITY_LABEL: Record<InsightSeverity, string> = {
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
};

interface BadgeProps {
  severity: InsightSeverity;
  label?: string;
}

export function Badge({ severity, label }: BadgeProps) {
  const style = SEVERITY_STYLES[severity];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: style.dot }} />
      {label ?? SEVERITY_LABEL[severity]}
    </span>
  );
}

const STATUS_CONFIG: Record<string, { text: string; bg: string; border: string; dotColor: string; pulse: boolean }> = {
  completed: { text: '#6EE7B7', bg: 'rgba(22, 163, 74, 0.16)', border: 'rgba(22, 163, 74, 0.34)', dotColor: '#10B981', pulse: false },
  running: { text: '#FCD34D', bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.38)', dotColor: '#F59E0B', pulse: true },
  pending: { text: '#93C5FD', bg: 'rgba(37, 99, 235, 0.16)', border: 'rgba(37, 99, 235, 0.36)', dotColor: '#3B82F6', pulse: true },
  failed: { text: '#FDA4AF', bg: 'rgba(239, 68, 68, 0.18)', border: 'rgba(239, 68, 68, 0.38)', dotColor: '#F43F5E', pulse: false },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    text: '#334155',
    bg: 'rgba(148, 163, 184, 0.16)',
    border: 'rgba(148, 163, 184, 0.3)',
    dotColor: '#64748B',
    pulse: false,
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.pulse ? 'animate-pulse' : ''}`} style={{ background: cfg.dotColor }} />
      <span className="capitalize">{status}</span>
    </span>
  );
}
