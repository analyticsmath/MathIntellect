import { SimulationType } from '../../simulations/entities/simulation.entity';
import { InsightEngineService } from './insight-engine.service';
import { SimulationContext } from './simulation-context.service';

describe('InsightEngineService', () => {
  const service = new InsightEngineService();

  const context: SimulationContext = {
    simulation_id: 'sim-1',
    created_by_id: null,
    simulation_name: 'Monte Carlo Test',
    simulation_type: SimulationType.MONTE_CARLO,
    simulation_status: 'completed',
    parameters: {},
    execution_time_ms: 25,
    derived_metrics: {
      expected_value: 12,
      variance: 4,
      risk_score: 44,
      return_score: 72,
      stability_score: 81,
    },
    raw_output: {
      type: 'monte_carlo',
      iterations: 5_000,
      samples: [11, 12, 13],
      expectedValue: 12,
      variance: 4,
      stdDev: 2,
      min: 9,
      max: 16,
      median: 12,
      percentile95: 15,
      percentile5: 10,
      histogram: [
        {
          min: 9,
          max: 11,
          count: 2,
          frequency: 0.4,
        },
      ],
      executionTimeMs: 25,
    },
  };

  it('builds deterministic fallback insight matching strict schema', () => {
    const output = service.buildFallbackInsight(context);

    expect(service.isInsightResponse(output)).toBe(true);
    expect(output.key_findings.length).toBeGreaterThanOrEqual(2);
    expect(output.opportunity_analysis.length).toBeGreaterThanOrEqual(1);
    expect(output.confidence_score).toBeGreaterThanOrEqual(0);
    expect(output.confidence_score).toBeLessThanOrEqual(100);
  });

  it('builds deterministic fallback explanation with step-by-step math flow', () => {
    const output = service.buildFallbackExplain(context);

    expect(service.isExplainResponse(output)).toBe(true);
    expect(output.steps.length).toBeGreaterThanOrEqual(3);
    expect(output.steps.every((step) => step.formula.length > 0)).toBe(true);
  });
});
