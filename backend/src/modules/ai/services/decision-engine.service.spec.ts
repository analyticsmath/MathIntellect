import { SimulationType } from '../../simulations/entities/simulation.entity';
import { DecisionEngineService } from './decision-engine.service';
import { SimulationContext } from './simulation-context.service';
import { InsightResponse } from '../interfaces/insight.interface';

describe('DecisionEngineService', () => {
  const service = new DecisionEngineService();

  const context: SimulationContext = {
    simulation_id: 'sim-2',
    created_by_id: null,
    simulation_name: 'Market Test',
    simulation_type: SimulationType.MARKET,
    simulation_status: 'completed',
    parameters: {},
    execution_time_ms: 18,
    derived_metrics: {
      expected_value: 114.2,
      variance: 25,
      risk_score: 66,
      return_score: 58,
      stability_score: 61,
      drawdown: 22,
      volatility: 19,
    },
    raw_output: {
      type: 'market',
      paths: [[100, 110, 112]],
      finalPrices: [112],
      expectedFinalPrice: 112,
      valueAtRisk95: 91,
      maxDrawdown: 0.22,
      annualizedReturn: 0.11,
      annualizedVolatility: 0.19,
      priceStats: {
        mean: 112,
        stdDev: 5,
        min: 103,
        max: 118,
        median: 112,
      },
      executionTimeMs: 18,
    },
  };

  const insight: InsightResponse = {
    summary: 'High-volatility market path with moderate expected upside.',
    key_findings: ['Expected value positive', 'Risk elevated'],
    risk_analysis: {
      level: 'high',
      explanation: 'Risk score above threshold due to drawdown and volatility.',
    },
    opportunity_analysis: ['Stage entries around volatility clusters'],
    mathematical_interpretation: 'Risk-return balance is moderate.',
    confidence_score: 72,
    recommendation: 'Use staged exposure with stop controls.',
  };

  it('fallback decision always returns 2-3 alternatives and explicit tradeoff', () => {
    const output = service.buildFallbackDecision(context, insight);

    expect(service.isDecisionResponse(output)).toBe(true);
    expect(output.alternatives.length).toBeGreaterThanOrEqual(2);
    expect(output.alternatives.length).toBeLessThanOrEqual(3);
    expect(output.risk_tradeoff.toLowerCase()).toContain('downside');
  });
});
