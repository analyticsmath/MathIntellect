export function formatNumber(val: number, decimals = 4): string {
  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (Math.abs(val) >= 1_000)    return `${(val / 1_000).toFixed(2)}K`;
  return val.toFixed(decimals);
}

export function formatPercent(val: number, decimals = 1): string {
  return `${val.toFixed(decimals)}%`;
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatMetricValue(
  val: number | string,
  format: string,
  unit?: string,
): string {
  if (typeof val === 'string') return val;
  switch (format) {
    case 'percent':  return `${val.toFixed(1)}${unit ?? '%'}`;
    case 'currency': return formatCurrency(val);
    case 'number':   return `${formatNumber(val)}${unit ? ` ${unit}` : ''}`;
    default:         return String(val);
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function humanizeType(type: string): string {
  const map: Record<string, string> = {
    monte_carlo: 'Monte Carlo',
    game_theory: 'Game Theory',
    market:      'Market (GBM)',
    conflict:    'Multi-Agent Conflict',
    custom:      'Custom',
  };
  return map[type] ?? type;
}
