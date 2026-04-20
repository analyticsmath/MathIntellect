import { Injectable } from '@nestjs/common';
import { MonteCarloResult } from '../../simulations/interfaces/engine.interfaces';
import {
  ChartsResponse,
  HistogramChart,
  CdfChart,
  BoxPlotChart,
} from '../view-models/chart-data.viewmodel';
import {
  ThreeDResponse,
  Scatter3D,
} from '../view-models/visualization-3d.viewmodel';
import {
  SummaryResponse,
  MetricCard,
  Insight,
} from '../view-models/summary.viewmodel';

@Injectable()
export class MonteCarloTransformer {
  // ─── /charts ──────────────────────────────────────────────────────────────

  buildCharts(simulationId: string, r: MonteCarloResult): ChartsResponse {
    const samples = r.samples.length > 0 ? r.samples : this.syntheticSamples(r);

    return {
      simulationId,
      simulationType: 'monte_carlo',
      charts: {
        histogram: this.histogram(r),
        cdf: this.cdf(samples),
        boxplot: this.boxplot(r, samples),
      },
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /3d ──────────────────────────────────────────────────────────────────

  build3D(simulationId: string, r: MonteCarloResult): ThreeDResponse {
    const samples = r.samples.length > 0 ? r.samples : this.syntheticSamples(r);
    const maxPts = 2000;
    const step = Math.max(1, Math.floor(samples.length / maxPts));
    const subset = samples.filter((_, i) => i % step === 0);

    // 3D scatter: x=iteration index, y=sample value, z=running mean
    const runningMean: number[] = [];
    let acc = 0;
    for (let i = 0; i < subset.length; i++) {
      acc += subset[i];
      runningMean.push(acc / (i + 1));
    }

    const scatter: Scatter3D = {
      plotType: 'scatter3d',
      x: subset.map((_, i) => i * step),
      y: subset,
      z: runningMean,
      xTitle: 'Iteration',
      yTitle: 'Sampled Value',
      zTitle: 'Running Mean',
      mode: 'markers',
      colorValues: subset,
    };

    return {
      simulationId,
      simulationType: 'monte_carlo',
      visualizations: { convergence_scatter: scatter },
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /summary ─────────────────────────────────────────────────────────────

  buildSummary(
    simulationId: string,
    simName: string,
    simStatus: string,
    r: MonteCarloResult,
  ): SummaryResponse {
    const cv = r.stdDev / Math.abs(r.expectedValue || 1);

    const keyMetrics: MetricCard[] = [
      {
        label: 'Expected Value',
        value: +r.expectedValue.toFixed(6),
        format: 'number',
      },
      { label: 'Std Deviation', value: +r.stdDev.toFixed(6), format: 'number' },
      { label: 'Variance', value: +r.variance.toFixed(6), format: 'number' },
      {
        label: '5th Percentile',
        value: +r.percentile5.toFixed(6),
        format: 'number',
      },
      {
        label: '95th Percentile',
        value: +r.percentile95.toFixed(6),
        format: 'number',
      },
      {
        label: 'Min / Max',
        value: `${r.min.toFixed(4)} / ${r.max.toFixed(4)}`,
        format: 'text',
      },
      { label: 'Iterations', value: r.iterations, format: 'number' },
      {
        label: 'Coeff. of Variation',
        value: +(cv * 100).toFixed(2),
        unit: '%',
        format: 'percent',
      },
    ];

    const insights: Insight[] = [];

    if (cv > 1)
      insights.push({
        severity: 'danger',
        title: 'Extreme Volatility',
        message: `CV = ${(cv * 100).toFixed(0)}%: distribution spread greatly exceeds its mean.`,
      });
    else if (cv > 0.5)
      insights.push({
        severity: 'warning',
        title: 'High Variance',
        message: `Coefficient of variation is ${(cv * 100).toFixed(0)}% — substantial uncertainty.`,
      });

    if (r.percentile5 < 0)
      insights.push({
        severity: 'warning',
        title: 'Downside Risk',
        message: `5th percentile is ${r.percentile5.toFixed(4)} — 5% chance of negative outcome.`,
      });

    if (r.expectedValue > 0 && r.percentile5 > 0)
      insights.push({
        severity: 'success',
        title: 'Positive Expectation',
        message: 'All percentile bands are positive — low probability of loss.',
      });

    const skew = this.estimateSkew(r);
    if (Math.abs(skew) > 0.5)
      insights.push({
        severity: 'info',
        title: skew > 0 ? 'Right-Skewed' : 'Left-Skewed',
        message: `Distribution is ${skew > 0 ? 'right' : 'left'}-skewed (skew ≈ ${skew.toFixed(2)}).`,
      });

    return {
      simulationId,
      simulationName: simName,
      simulationType: 'monte_carlo',
      status: simStatus,
      executionTimeMs: r.executionTimeMs,
      keyMetrics,
      insights,
      highlights: [
        ...(r.confidenceStory?.slice(0, 1) ?? []),
        `E[X] = ${r.expectedValue.toFixed(4)}`,
        `σ = ${r.stdDev.toFixed(4)}`,
        `90% CI: [${r.percentile5.toFixed(4)}, ${r.percentile95.toFixed(4)}]`,
        `${r.iterations.toLocaleString()} iterations`,
      ],
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private histogram(r: MonteCarloResult): HistogramChart {
    const labels = r.histogram.map(
      (b) => `${b.min.toFixed(3)}–${b.max.toFixed(3)}`,
    );
    const binWidth = r.histogram[0]
      ? r.histogram[0].max - r.histogram[0].min
      : 1;
    return {
      type: 'histogram',
      labels,
      counts: r.histogram.map((b) => b.count),
      frequencies: r.histogram.map((b) => b.frequency),
      density: r.histogram.map((b) =>
        binWidth > 0 ? b.frequency / binWidth : 0,
      ),
      binWidth,
      total: r.iterations,
    };
  }

  private cdf(samples: number[]): CdfChart {
    const sorted = [...samples].sort((a, b) => a - b);
    const n = sorted.length;
    const step = Math.max(1, Math.floor(n / 200));
    const x: number[] = [];
    const y: number[] = [];
    for (let i = 0; i < n; i += step) {
      x.push(+sorted[i].toFixed(6));
      y.push(+((i + 1) / n).toFixed(6));
    }
    if (x[x.length - 1] !== sorted[n - 1]) {
      x.push(+sorted[n - 1].toFixed(6));
      y.push(1);
    }
    return { type: 'cdf', x, y };
  }

  private boxplot(r: MonteCarloResult, samples: number[]): BoxPlotChart {
    const sorted = [...samples].sort((a, b) => a - b);
    return {
      type: 'boxplot',
      labels: ['Distribution'],
      min: [r.min],
      q1: [+this.pct(sorted, 25).toFixed(6)],
      median: [r.median],
      q3: [+this.pct(sorted, 75).toFixed(6)],
      max: [r.max],
    };
  }

  private pct(sorted: number[], p: number): number {
    const idx = (p / 100) * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  }

  private estimateSkew(r: MonteCarloResult): number {
    if (r.stdDev === 0) return 0;
    return (3 * (r.expectedValue - r.median)) / r.stdDev;
  }

  /** Reconstruct approximate samples from histogram when raw samples not stored */
  private syntheticSamples(r: MonteCarloResult): number[] {
    const out: number[] = [];
    for (const bin of r.histogram) {
      const mid = (bin.min + bin.max) / 2;
      for (let i = 0; i < bin.count; i++) out.push(mid);
    }
    return out;
  }
}
