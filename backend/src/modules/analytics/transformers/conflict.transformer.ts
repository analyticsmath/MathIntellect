import { Injectable } from '@nestjs/common';
import { ConflictResult } from '../../simulations/interfaces/engine.interfaces';
import {
  ChartsResponse,
  TimeSeriesChart,
  BarChart,
  PieChart,
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
export class ConflictTransformer {
  // ─── /charts ──────────────────────────────────────────────────────────────

  buildCharts(simulationId: string, r: ConflictResult): ChartsResponse {
    return {
      simulationId,
      simulationType: 'conflict',
      charts: {
        resource_evolution: this.resourceEvolution(r),
        agent_final_stats: this.agentFinalStats(r),
        action_distribution: this.actionDistribution(r),
        cooperation_trend: this.cooperationTrend(r),
      },
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /3d ──────────────────────────────────────────────────────────────────

  build3D(simulationId: string, r: ConflictResult): ThreeDResponse {
    // Surface: x=round, y=agent_index, z=cumulative resources
    const agentIds = r.agentResults.map((a) => a.agentId);
    const roundLabels = r.roundHistory.map((rh) => rh.round);

    const z: number[][] = agentIds.map((id) =>
      r.roundHistory.map((rh) => rh.resources[id] ?? 0),
    );

    const surface: SurfacePlot3D = {
      plotType: 'surface',
      x: roundLabels,
      y: r.agentResults.map((a) => a.name),
      z,
      xTitle: 'Round',
      yTitle: 'Agent',
      zTitle: 'Resources',
      colorscale: 'Plasma',
    };

    return {
      simulationId,
      simulationType: 'conflict',
      visualizations: { resource_surface: surface },
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /summary ─────────────────────────────────────────────────────────────

  buildSummary(
    simulationId: string,
    simName: string,
    simStatus: string,
    r: ConflictResult,
  ): SummaryResponse {
    const winner = r.agentResults.find((a) => a.agentId === r.winner);
    const resources = r.agentResults.map((a) => a.finalResources);
    const maxRes = Math.max(...resources);
    const minRes = Math.min(...resources);
    const gini = this.giniCoeff(resources);

    const keyMetrics: MetricCard[] = [
      { label: 'Winner', value: winner?.name ?? 'Tie', format: 'text' },
      { label: 'Rounds Simulated', value: r.rounds, format: 'number' },
      {
        label: 'Cooperation Rate',
        value: +(r.cooperationRate * 100).toFixed(1),
        unit: '%',
        format: 'percent',
      },
      {
        label: 'Resource Inequality (Gini)',
        value: +gini.toFixed(3),
        format: 'number',
      },
      {
        label: 'Avg Trust Score',
        value:
          r.trustScores && Object.keys(r.trustScores).length > 0
            ? +(
                Object.values(r.trustScores).reduce((sum, value) => sum + value, 0) /
                Object.values(r.trustScores).length
              ).toFixed(3)
            : 0,
        format: 'number',
      },
      { label: 'Max Resources', value: +maxRes.toFixed(2), format: 'number' },
      { label: 'Min Resources', value: +minRes.toFixed(2), format: 'number' },
      ...r.agentResults.map((a) => ({
        label: `${a.name} Win Rate`,
        value: +(a.winRate * 100).toFixed(1),
        unit: '%',
        format: 'percent' as const,
      })),
    ];

    const insights: Insight[] = [];

    if (r.cooperationRate > 0.7)
      insights.push({
        severity: 'success',
        title: 'High Cooperation',
        message: `${(r.cooperationRate * 100).toFixed(1)}% cooperation rate — system tends toward stable, mutually beneficial outcomes.`,
      });
    else if (r.cooperationRate < 0.3)
      insights.push({
        severity: 'danger',
        title: 'Highly Competitive Environment',
        message: `Only ${(r.cooperationRate * 100).toFixed(1)}% cooperation — defection dominates, leading to suboptimal collective outcomes.`,
      });
    else
      insights.push({
        severity: 'info',
        title: 'Mixed Cooperation',
        message: `${(r.cooperationRate * 100).toFixed(1)}% cooperation — balanced competitive dynamics.`,
      });

    if (gini > 0.4)
      insights.push({
        severity: 'warning',
        title: 'High Resource Inequality',
        message: `Gini coefficient = ${gini.toFixed(3)} — significant wealth concentration among top agents.`,
      });

    if (winner)
      insights.push({
        severity: 'info',
        title: `Dominant Agent: ${winner.name}`,
        message: `${winner.name} achieved highest resources (${winner.finalResources.toFixed(0)}) with a ${(winner.winRate * 100).toFixed(0)}% win rate.`,
      });

    const defectors = r.agentResults.filter((a) => a.winRate > 0.7);
    if (defectors.length > 0 && r.cooperationRate < 0.5)
      insights.push({
        severity: 'warning',
        title: 'Defection Advantage',
        message:
          'Aggressive strategies outperformed cooperative ones — system lacks enforcement mechanisms.',
      });

    if (r.betrayalProbabilities) {
      const maxBetrayal = Math.max(...Object.values(r.betrayalProbabilities));
      if (maxBetrayal > 0.35) {
        insights.push({
          severity: 'warning',
          title: 'Betrayal Pressure Detected',
          message: `Max betrayal probability reached ${(maxBetrayal * 100).toFixed(1)}% within alliance dynamics.`,
        });
      }
    }

    return {
      simulationId,
      simulationName: simName,
      simulationType: 'conflict',
      status: simStatus,
      executionTimeMs: r.executionTimeMs,
      keyMetrics,
      insights,
      highlights: [
        `Winner: ${winner?.name ?? 'Tie'}`,
        `Cooperation Rate: ${(r.cooperationRate * 100).toFixed(1)}%`,
        `Gini Coefficient: ${gini.toFixed(3)}`,
        ...(r.allianceMatrix && r.allianceMatrix.length > 0
          ? [`Alliances tracked: ${r.allianceMatrix.length}`]
          : []),
        `${r.rounds} rounds × ${r.agentResults.length} agents`,
      ],
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private resourceEvolution(r: ConflictResult): TimeSeriesChart {
    const labels = r.roundHistory.map((rh) => `Round ${rh.round}`);
    const series: Series[] = r.agentResults.map((agent) => ({
      name: agent.name,
      data: r.roundHistory.map(
        (rh) => +(rh.resources[agent.agentId] ?? 0).toFixed(2),
      ),
    }));
    return { type: 'time_series', labels, series };
  }

  private agentFinalStats(r: ConflictResult): BarChart {
    return {
      type: 'bar',
      labels: r.agentResults.map((a) => a.name),
      series: [
        {
          name: 'Final Resources',
          data: r.agentResults.map((a) => +a.finalResources.toFixed(2)),
        },
        {
          name: 'Total Gained',
          data: r.agentResults.map((a) => +a.totalGained.toFixed(2)),
        },
        {
          name: 'Total Lost',
          data: r.agentResults.map((a) => +a.totalLost.toFixed(2)),
        },
      ],
    };
  }

  private actionDistribution(r: ConflictResult): PieChart {
    const cooperate = Math.round(
      r.cooperationRate * r.rounds * r.agentResults.length,
    );
    const attack = r.rounds * r.agentResults.length - cooperate;
    return {
      type: 'pie',
      labels: ['Cooperate', 'Attack'],
      values: [cooperate, attack],
    };
  }

  private cooperationTrend(r: ConflictResult): TimeSeriesChart {
    const window = Math.max(1, Math.floor(r.rounds / 20));
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 0; i < r.roundHistory.length; i += window) {
      const slice = r.roundHistory.slice(i, i + window);
      const totalActions = slice.length * r.agentResults.length;
      const cooperateCount = slice.reduce((sum, rh) => {
        return (
          sum +
          Object.values(rh.actions).filter((a) => a === 'cooperate').length
        );
      }, 0);
      labels.push(`R${slice[0].round}`);
      values.push(+(cooperateCount / Math.max(totalActions, 1)).toFixed(4));
    }

    return {
      type: 'time_series',
      labels,
      series: [{ name: 'Cooperation Rate', data: values }],
    };
  }

  private giniCoeff(values: number[]): number {
    const n = values.length;
    if (n === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mean = sorted.reduce((s, v) => s + v, 0) / n;
    if (mean === 0) return 0;
    let sumDiffs = 0;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) sumDiffs += Math.abs(sorted[i] - sorted[j]);
    return sumDiffs / (2 * n * n * mean);
  }
}
