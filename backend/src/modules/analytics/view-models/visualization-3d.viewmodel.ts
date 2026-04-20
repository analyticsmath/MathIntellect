// All 3D view-models are shaped to be directly consumable by Plotly.js

// ─── Surface plot (Plotly `surface` trace) ────────────────────────────────────

export interface SurfacePlot3D {
  plotType: 'surface';
  x: number[] | string[]; // column axis
  y: number[] | string[]; // row axis
  z: number[][]; // [row][col] z-values
  xTitle: string;
  yTitle: string;
  zTitle: string;
  colorscale?: string; // Plotly colorscale name e.g. 'Viridis'
}

// ─── Scatter3D plot (Plotly `scatter3d` trace) ────────────────────────────────

export interface Scatter3D {
  plotType: 'scatter3d';
  x: number[];
  y: number[];
  z: number[];
  labels?: string[]; // hover text per point
  xTitle: string;
  yTitle: string;
  zTitle: string;
  mode: 'markers' | 'lines' | 'lines+markers';
  colorValues?: number[]; // optional per-point color scale
}

// ─── Multi-trace 3D (several paths/agents on same canvas) ────────────────────

export interface MultiTrace3D {
  plotType: 'multi_scatter3d';
  traces: Array<{
    name: string;
    x: number[];
    y: number[];
    z: number[];
  }>;
  xTitle: string;
  yTitle: string;
  zTitle: string;
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type Visualization3D = SurfacePlot3D | Scatter3D | MultiTrace3D;

// ─── Full /3d response ────────────────────────────────────────────────────────

export interface ThreeDResponse {
  simulationId: string;
  simulationType: string;
  visualizations: Record<string, Visualization3D>;
  cachedAt: string;
}
