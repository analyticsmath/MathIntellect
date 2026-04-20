import { Injectable } from '@nestjs/common';
import { MarketResult } from '../../simulations/interfaces/engine.interfaces';
import {
  ChartsResponse,
  TimeSeriesChart,
  HistogramChart,
  Series,
} from '../view-models/chart-data.viewmodel';
import {
  ThreeDResponse,
  SurfacePlot3D,
} from '../view-models/visualization-3d.viewmodel';
import {
  SummaryResponse,
  MetricCard,
  Insight,
} from '../view-models/summary.viewmodel';

@Injectable()
export class MarketTransformer {
  // ─── /charts ──────────────────────────────────────────────────────────────

  buildCharts(simulationId: string, r: MarketResult): ChartsResponse {
    return {
      simulationId,
      simulationType: 'market',
      charts: {
        price_paths: this.pricePaths(r),
        final_distribution: this.finalDistribution(r),
        volatility_bands: this.volatilityBands(r),
        moving_averages: this.movingAverages(r),
      },
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /3d ──────────────────────────────────────────────────────────────────

  build3D(simulationId: string, r: MarketResult): ThreeDResponse {
    // Surface: x=day, y=path_index (up to 50 paths), z=price
    const pathsToShow = r.paths.slice(0, 50);
    const days = pathsToShow[0]?.length ?? 0;

    const surface: SurfacePlot3D = {
      plotType: 'surface',
      x: Array.from({ length: days }, (_, i) => i),
      y: Array.from({ length: pathsToShow.length }, (_, i) => i),
      z: pathsToShow.map((path) => path.map((p) => +p.toFixed(2))),
      xTitle: 'Trading Day',
      yTitle: 'Simulation Path',
      zTitle: 'Asset Price ($)',
      colorscale: 'Viridis',
    };

    return {
      simulationId,
      simulationType: 'market',
      visualizations: { price_surface: surface },
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /summary ─────────────────────────────────────────────────────────────

  buildSummary(
    simulationId: string,
    simName: string,
    simStatus: string,
    r: MarketResult,
  ): SummaryResponse {
    const ps = r.priceStats;

    const keyMetrics: MetricCard[] = [
      {
        label: 'Expected Final Price',
        value: +r.expectedFinalPrice.toFixed(2),
        unit: '$',
        format: 'currency',
      },
      {
        label: 'Value at Risk (95%)',
        value: +r.valueAtRisk95.toFixed(2),
        unit: '$',
        format: 'currency',
      },
      {
        label: 'Max Drawdown',
        value: +(r.maxDrawdown * 100).toFixed(2),
        unit: '%',
        format: 'percent',
      },
      {
        label: 'Annualised Return',
        value: +(r.annualizedReturn * 100).toFixed(2),
        unit: '%',
        format: 'percent',
      },
      {
        label: 'Annualised Volatility',
        value: +(r.annualizedVolatility * 100).toFixed(2),
        unit: '%',
        format: 'percent',
      },
      {
        label: 'Price StdDev',
        value: +ps.stdDev.toFixed(2),
        unit: '$',
        format: 'currency',
      },
      {
        label: 'Min Final Price',
        value: +ps.min.toFixed(2),
        unit: '$',
        format: 'currency',
      },
      {
        label: 'Max Final Price',
        value: +ps.max.toFixed(2),
        unit: '$',
        format: 'currency',
      },
    ];

    const insights: Insight[] = [];

    if (r.maxDrawdown > 0.5)
      insights.push({
        severity: 'danger',
        title: 'Severe Market Instability',
        message: `Max drawdown of ${(r.maxDrawdown * 100).toFixed(1)}% detected across simulation paths.`,
      });
    else if (r.maxDrawdown > 0.25)
      insights.push({
        severity: 'warning',
        title: 'Significant Drawdown',
        message: `Max drawdown reached ${(r.maxDrawdown * 100).toFixed(1)}% — consider risk controls.`,
      });

    if (r.annualizedVolatility > 0.5)
      insights.push({
        severity: 'warning',
        title: 'High Volatility Regime',
        message: `Annualised volatility at ${(r.annualizedVolatility * 100).toFixed(1)}% — high uncertainty.`,
      });

    if (r.valueAtRisk95 < r.expectedFinalPrice * 0.5)
      insights.push({
        severity: 'danger',
        title: 'Fat-Tail Risk',
        message: `VaR(95%) is less than 50% of expected price — extreme downside possible.`,
      });

    if (r.annualizedReturn > 0.2)
      insights.push({
        severity: 'success',
        title: 'Strong Expected Return',
        message: `Annualised return of ${(r.annualizedReturn * 100).toFixed(1)}% — positive drift dominates.`,
      });

    if (r.sentimentProxy) {
      insights.push({
        severity:
          r.sentimentProxy.label === 'bullish'
            ? 'success'
            : r.sentimentProxy.label === 'bearish'
              ? 'danger'
              : 'info',
        title: `Sentiment Proxy: ${r.sentimentProxy.label}`,
        message: r.sentimentProxy.reasoning,
      });
    }

    return {
      simulationId,
      simulationName: simName,
      simulationType: 'market',
      status: simStatus,
      executionTimeMs: r.executionTimeMs,
      keyMetrics,
      insights,
      highlights: [
        `E[S_T] = $${r.expectedFinalPrice.toFixed(2)}`,
        `VaR₉₅ = $${r.valueAtRisk95.toFixed(2)}`,
        `Max Drawdown = ${(r.maxDrawdown * 100).toFixed(1)}%`,
        ...(r.detectedRegimes && r.detectedRegimes.length > 0
          ? [
              `Regimes detected across ${r.detectedRegimes.length} days`,
            ]
          : []),
        `${r.finalPrices.length} simulated paths`,
      ],
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private pricePaths(r: MarketResult): TimeSeriesChart {
    const days = r.paths[0]?.length ?? r.finalPrices.length;
    const labels = Array.from({ length: days }, (_, i) => `Day ${i}`);

    const series: Series[] = [];

    // Up to 10 individual paths
    const pathsToShow = r.paths.slice(0, 10);
    pathsToShow.forEach((path, i) =>
      series.push({
        name: `Path ${i + 1}`,
        data: path.map((v) => +v.toFixed(2)),
      }),
    );

    // Mean path across all final prices (reconstruct approx as straight line)
    if (r.paths.length > 0) {
      const meanByDay: number[] = Array.from({ length: days }, (_, d) => {
        const vals = r.paths.map((p) => p[d] ?? 0);
        return +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2);
      });
      series.push({ name: 'Mean Path', data: meanByDay, color: '#f59e0b' });
    }

    return { type: 'time_series', labels, series };
  }

  private finalDistribution(r: MarketResult): HistogramChart {
    const sorted = [...r.finalPrices].sort((a, b) => a - b);
    const bins = 20;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const width = (max - min) / bins || 1;

    const labels: string[] = [];
    const counts: number[] = [];

    for (let i = 0; i < bins; i++) {
      const lo = min + i * width;
      const hi = lo + width;
      labels.push(`$${lo.toFixed(0)}–$${hi.toFixed(0)}`);
      counts.push(
        sorted.filter((v) => v >= lo && (i < bins - 1 ? v < hi : v <= hi))
          .length,
      );
    }

    const total = r.finalPrices.length;
    return {
      type: 'histogram',
      labels,
      counts,
      frequencies: counts.map((c) => +(c / total).toFixed(4)),
      density: counts.map((c) => +(c / total / width).toFixed(6)),
      binWidth: width,
      total,
    };
  }

  private volatilityBands(r: MarketResult): TimeSeriesChart {
    if (r.paths.length === 0) {
      return { type: 'time_series', labels: [], series: [] };
    }
    const days = r.paths[0].length;
    const labels = Array.from({ length: days }, (_, i) => `Day ${i}`);

    const meanByDay: number[] = [];
    const stdByDay: number[] = [];

    for (let d = 0; d < days; d++) {
      const vals = r.paths.map((p) => p[d]);
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      const variance =
        vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
      meanByDay.push(+mean.toFixed(2));
      stdByDay.push(+Math.sqrt(variance).toFixed(2));
    }

    return {
      type: 'time_series',
      labels,
      series: [
        { name: 'Mean', data: meanByDay },
        {
          name: '+1σ',
          data: meanByDay.map((m, i) => +(m + stdByDay[i]).toFixed(2)),
        },
        {
          name: '−1σ',
          data: meanByDay.map((m, i) => +(m - stdByDay[i]).toFixed(2)),
        },
        {
          name: '+2σ',
          data: meanByDay.map((m, i) => +(m + 2 * stdByDay[i]).toFixed(2)),
        },
        {
          name: '−2σ',
          data: meanByDay.map((m, i) => +(m - 2 * stdByDay[i]).toFixed(2)),
        },
      ],
    };
  }

  private movingAverages(r: MarketResult): TimeSeriesChart {
    if (r.paths.length === 0) {
      return { type: 'time_series', labels: [], series: [] };
    }
    const days = r.paths[0].length;
    const labels = Array.from({ length: days }, (_, i) => `Day ${i}`);
    const meanPath: number[] = Array.from({ length: days }, (_, d) => {
      const vals = r.paths.map((p) => p[d]);
      return vals.reduce((s, v) => s + v, 0) / vals.length;
    });

    return {
      type: 'time_series',
      labels,
      series: [
        { name: 'Price', data: meanPath.map((v) => +v.toFixed(2)) },
        { name: 'SMA-5', data: this.sma(meanPath, 5) },
        { name: 'SMA-20', data: this.sma(meanPath, 20) },
        { name: 'EMA-10', data: this.ema(meanPath, 10) },
      ],
    };
  }

  private sma(data: number[], window: number): number[] {
    return data.map((_, i) => {
      if (i < window - 1) return 0;
      const slice = data.slice(i - window + 1, i + 1);
      return +(slice.reduce((s, v) => s + v, 0) / window).toFixed(2);
    });
  }

  private ema(data: number[], span: number): number[] {
    const k = 2 / (span + 1);
    const result: number[] = [+data[0].toFixed(2)];
    for (let i = 1; i < data.length; i++) {
      result.push(+(data[i] * k + result[i - 1] * (1 - k)).toFixed(2));
    }
    return result;
  }
}
