import { Injectable } from '@nestjs/common';
import { GameTheoryResult } from '../../simulations/interfaces/engine.interfaces';
import {
  ChartsResponse,
  HeatmapChart,
  BarChart,
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
export class GameTheoryTransformer {
  // ─── /charts ──────────────────────────────────────────────────────────────

  buildCharts(simulationId: string, r: GameTheoryResult): ChartsResponse {
    const charts: Record<string, HeatmapChart | BarChart> = {};

    // One heatmap per player (for 2-player games, gives both perspectives)
    for (const player of r.players) {
      charts[`payoff_heatmap_${player.toLowerCase().replace(/\s/g, '_')}`] =
        this.payoffHeatmap(r, player);
    }

    // Expected payoff comparison bar chart
    charts['expected_payoffs'] = this.expectedPayoffBar(r);

    return {
      simulationId,
      simulationType: 'game_theory',
      charts,
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /3d ──────────────────────────────────────────────────────────────────

  build3D(simulationId: string, r: GameTheoryResult): ThreeDResponse {
    // For 2-player: surface where x=P1 strategies, y=P2 strategies, z=P1 payoff
    const [p1, p2] = r.players;
    if (!p1 || !p2) {
      return {
        simulationId,
        simulationType: 'game_theory',
        visualizations: {},
        cachedAt: new Date().toISOString(),
      };
    }

    const xLabels = r.payoffMatrix
      .map((e) => e.strategies[p2])
      .filter((v, i, a) => a.indexOf(v) === i);
    const yLabels = r.payoffMatrix
      .map((e) => e.strategies[p1])
      .filter((v, i, a) => a.indexOf(v) === i);

    // z[row=p1_strategy][col=p2_strategy] = p1 payoff
    const z: number[][] = yLabels.map((p1s) =>
      xLabels.map((p2s) => {
        const entry = r.payoffMatrix.find(
          (e) => e.strategies[p1] === p1s && e.strategies[p2] === p2s,
        );
        return entry?.payoffs[p1] ?? 0;
      }),
    );

    const surface: SurfacePlot3D = {
      plotType: 'surface',
      x: xLabels,
      y: yLabels,
      z,
      xTitle: `${p2} Strategy`,
      yTitle: `${p1} Strategy`,
      zTitle: `${p1} Payoff`,
      colorscale: 'RdYlGn',
    };

    return {
      simulationId,
      simulationType: 'game_theory',
      visualizations: { payoff_surface: surface },
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── /summary ─────────────────────────────────────────────────────────────

  buildSummary(
    simulationId: string,
    simName: string,
    simStatus: string,
    r: GameTheoryResult,
  ): SummaryResponse {
    const keyMetrics: MetricCard[] = r.players.flatMap((p) => [
      {
        label: `${p} — Expected Payoff`,
        value: +r.expectedPayoffs[p].toFixed(4),
        format: 'number' as const,
      },
      {
        label: `${p} — Dominant Strategy`,
        value: r.dominantStrategies[p] ?? 'None',
        format: 'text' as const,
      },
    ]);
    keyMetrics.push({
      label: 'Nash Equilibria Found',
      value: r.nashEquilibria.length,
      format: 'number',
    });
    if (r.reputationScores) {
      const avgRep =
        Object.values(r.reputationScores).reduce(
          (sum, value) => sum + value,
          0,
        ) / Math.max(1, Object.keys(r.reputationScores).length);
      keyMetrics.push({
        label: 'Avg Reputation',
        value: +avgRep.toFixed(2),
        format: 'number',
      });
    }
    if (r.coalitionFormations) {
      keyMetrics.push({
        label: 'Coalition Candidates',
        value: r.coalitionFormations.length,
        format: 'number',
      });
    }

    const insights: Insight[] = [];

    if (r.nashEquilibria.length === 0)
      insights.push({
        severity: 'warning',
        title: 'No Pure-Strategy Nash Equilibrium',
        message:
          'No stable outcome in pure strategies — mixed strategy equilibrium may exist.',
      });

    for (const ne of r.nashEquilibria) {
      if (!ne.isPareto)
        insights.push({
          severity: 'warning',
          title: 'Social Dilemma Detected',
          message: `Nash equilibrium at ${JSON.stringify(ne.strategies)} is not Pareto-optimal — collective outcome is inefficient.`,
        });
      else
        insights.push({
          severity: 'success',
          title: 'Pareto-Optimal Equilibrium',
          message: `Nash equilibrium at ${JSON.stringify(ne.strategies)} is also Pareto-optimal.`,
        });
    }

    const domCount = Object.values(r.dominantStrategies).filter(Boolean).length;
    if (domCount === r.players.length)
      insights.push({
        severity: 'info',
        title: 'All Players Have Dominant Strategies',
        message:
          'The game has a dominant-strategy equilibrium — outcome is highly predictable.',
      });

    const payoffValues = Object.values(r.expectedPayoffs);
    const payoffSpread = Math.max(...payoffValues) - Math.min(...payoffValues);
    if (payoffSpread > 3)
      insights.push({
        severity: 'info',
        title: 'High Payoff Asymmetry',
        message: `Spread of ${payoffSpread.toFixed(2)} between highest and lowest expected payoff — significant power imbalance.`,
      });

    return {
      simulationId,
      simulationName: simName,
      simulationType: 'game_theory',
      status: simStatus,
      executionTimeMs: r.executionTimeMs,
      keyMetrics,
      insights,
      highlights: [
        `${r.nashEquilibria.length} Nash equilibrium/equilibria found`,
        ...(r.coalitionFormations && r.coalitionFormations.length > 0
          ? [
              `Top coalition: ${r.coalitionFormations[0].coalition.join(' + ')} (score ${r.coalitionFormations[0].coalitionScore.toFixed(2)})`,
            ]
          : []),
        ...r.players.map(
          (p) =>
            `${p}: dominant = ${r.dominantStrategies[p] ?? 'none'}, E[payoff] = ${r.expectedPayoffs[p].toFixed(2)}`,
        ),
      ],
      cachedAt: new Date().toISOString(),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private payoffHeatmap(r: GameTheoryResult, viewPlayer: string): HeatmapChart {
    const [p1, p2] = r.players;
    if (!p1 || !p2)
      return {
        type: 'heatmap',
        xLabels: [],
        yLabels: [],
        z: [],
        player: viewPlayer,
        equilibriumCells: [],
      };

    const xLabels = [...new Set(r.payoffMatrix.map((e) => e.strategies[p2]))];
    const yLabels = [...new Set(r.payoffMatrix.map((e) => e.strategies[p1]))];

    const z: number[][] = yLabels.map((p1s) =>
      xLabels.map((p2s) => {
        const entry = r.payoffMatrix.find(
          (e) => e.strategies[p1] === p1s && e.strategies[p2] === p2s,
        );
        return entry?.payoffs[viewPlayer] ?? 0;
      }),
    );

    // Mark Nash equilibrium cells
    const equilibriumCells = r.nashEquilibria.map((ne) => ({
      row: yLabels.indexOf(ne.strategies[p1]),
      col: xLabels.indexOf(ne.strategies[p2]),
    }));

    return {
      type: 'heatmap',
      xLabels,
      yLabels,
      z,
      player: viewPlayer,
      equilibriumCells,
    };
  }

  private expectedPayoffBar(r: GameTheoryResult): BarChart {
    return {
      type: 'bar',
      labels: r.players,
      series: [
        {
          name: 'Expected Payoff',
          data: r.players.map((p) => +r.expectedPayoffs[p].toFixed(4)),
        },
      ],
    };
  }
}
