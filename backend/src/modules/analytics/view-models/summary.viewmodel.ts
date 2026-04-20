// ─── Insight ──────────────────────────────────────────────────────────────────

export type InsightSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface Insight {
  severity: InsightSeverity;
  title: string;
  message: string;
  metric?: string;
  value?: number | string;
}

// ─── Key metric card ──────────────────────────────────────────────────────────

export interface MetricCard {
  label: string;
  value: number | string;
  unit?: string;
  delta?: number; // vs baseline or previous run
  format: 'number' | 'percent' | 'currency' | 'text';
}

// ─── Summary response ─────────────────────────────────────────────────────────

export interface SummaryResponse {
  simulationId: string;
  simulationName: string;
  simulationType: string;
  status: string;
  executionTimeMs: number;
  keyMetrics: MetricCard[];
  insights: Insight[];
  highlights: string[]; // one-liner bullets for dashboard widget
  cachedAt: string;
}
