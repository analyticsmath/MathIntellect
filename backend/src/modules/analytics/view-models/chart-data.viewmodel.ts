// ─── Primitive chart series ───────────────────────────────────────────────────

export interface Series {
  name: string;
  data: number[];
  color?: string;
}

// ─── Histogram ────────────────────────────────────────────────────────────────

export interface HistogramChart {
  type: 'histogram';
  labels: string[]; // bin range labels e.g. "0.05 – 0.10"
  counts: number[];
  frequencies: number[]; // counts / total
  density: number[]; // frequency / binWidth
  binWidth: number;
  total: number;
}

// ─── CDF ──────────────────────────────────────────────────────────────────────

export interface CdfChart {
  type: 'cdf';
  x: number[]; // sorted sample values
  y: number[]; // cumulative probability 0→1
}

// ─── Box plot ─────────────────────────────────────────────────────────────────

export interface BoxPlotChart {
  type: 'boxplot';
  labels: string[];
  min: number[];
  q1: number[];
  median: number[];
  q3: number[];
  max: number[];
}

// ─── Time series ──────────────────────────────────────────────────────────────

export interface TimeSeriesChart {
  type: 'time_series';
  labels: string[]; // e.g. "Day 0", "Day 1" …
  series: Series[];
}

// ─── Heatmap / payoff matrix ──────────────────────────────────────────────────

export interface HeatmapChart {
  type: 'heatmap';
  xLabels: string[]; // Player 2 strategies
  yLabels: string[]; // Player 1 strategies
  z: number[][]; // [row][col] payoff values
  player: string; // whose payoff is shown
  equilibriumCells: Array<{ row: number; col: number }>;
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

export interface BarChart {
  type: 'bar';
  labels: string[];
  series: Series[];
}

// ─── Pie chart ────────────────────────────────────────────────────────────────

export interface PieChart {
  type: 'pie';
  labels: string[];
  values: number[];
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type ChartData =
  | HistogramChart
  | CdfChart
  | BoxPlotChart
  | TimeSeriesChart
  | HeatmapChart
  | BarChart
  | PieChart;

// ─── Full /charts response ────────────────────────────────────────────────────

export interface ChartsResponse {
  simulationId: string;
  simulationType: string;
  charts: Record<string, ChartData>;
  cachedAt: string;
}
