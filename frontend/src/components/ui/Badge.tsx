import type { InsightSeverity } from '../../types/api.types';

const SEVERITY_CONFIG: Record<InsightSeverity, { text: string; bg: string; border: string }> = {
  info: { text: '#2457E6', bg: '#EFF4FE', border: '#D0E0FD' },
  success: { text: '#23755B', bg: '#EBF6F2', border: '#C5E7DC' },
  warning: { text: '#9D6814', bg: '#FEF8EC', border: '#FCE6BA' },
  danger: { text: '#B64049', bg: '#FDF1F2', border: '#FAC8CC' },
};

export function Badge({ severity, label }: { severity: InsightSeverity; label?: string }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-mono border font-medium uppercase"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
    >
      {label ?? severity}
    </span>
  );
}

const STATUS_CONFIG: Record<string, { text: string; bg: string; border: string }> = {
  completed: { text: '#23755B', bg: '#EBF6F2', border: '#C5E7DC' },
  running: { text: '#9D6814', bg: '#FEF8EC', border: '#FCE6BA' },
  pending: { text: '#505753', bg: '#ECEFEE', border: '#D8DDDA' },
  failed: { text: '#B64049', bg: '#FDF1F2', border: '#FAC8CC' },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    text: '#505753',
    bg: '#ECEFEE',
    border: '#D8DDDA',
  };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-mono border font-medium uppercase"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
    >
      {status}
    </span>
  );
}
