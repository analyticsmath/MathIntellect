import { Injectable } from '@nestjs/common';
import {
  ExplainResponse,
  ExplainStep,
} from '../interfaces/ai-response.interface';
import { InsightResponse, RiskLevel } from '../interfaces/insight.interface';
import { SimulationContext } from './simulation-context.service';
import {
  ConflictResult,
  GameTheoryResult,
  MarketResult,
  MonteCarloResult,
} from '../../simulations/interfaces/engine.interfaces';
import { SimulationType } from '../../simulations/entities/simulation.entity';

@Injectable()
export class InsightEngineService {
  isInsightResponse(payload: unknown): payload is InsightResponse {
    if (!this.isObject(payload)) return false;

    const value = payload as Partial<InsightResponse>;
    return (
      typeof value.summary === 'string' &&
      this.isStringArray(value.key_findings) &&
      this.isObject(value.risk_analysis) &&
      this.isRiskLevel((value.risk_analysis as { level?: unknown }).level) &&
      typeof (value.risk_analysis as { explanation?: unknown }).explanation ===
        'string' &&
      this.isStringArray(value.opportunity_analysis) &&
      typeof value.mathematical_interpretation === 'string' &&
      typeof value.confidence_score === 'number' &&
      value.confidence_score >= 0 &&
      value.confidence_score <= 100 &&
      typeof value.recommendation === 'string'
    );
  }

  normalizeInsight(insight: InsightResponse): InsightResponse {
    return {
      summary: insight.summary.trim(),
      key_findings: insight.key_findings
        .map((entry) => entry.trim())
        .filter(Boolean)
        .slice(0, 6),
      risk_analysis: {
        level: insight.risk_analysis.level,
        explanation: insight.risk_analysis.explanation.trim(),
      },
      opportunity_analysis: insight.opportunity_analysis
        .map((entry) => entry.trim())
        .filter(Boolean)
        .slice(0, 6),
      mathematical_interpretation: insight.mathematical_interpretation.trim(),
      confidence_score: this.clamp(Math.round(insight.confidence_score)),
      recommendation: insight.recommendation.trim(),
    };
  }

  buildFallbackInsight(context: SimulationContext): InsightResponse {
    const metrics = context.derived_metrics;
    const riskLevel = this.riskLevelFromScore(metrics.risk_score);
    const confidence = this.estimateConfidence(context);

    const { findings, opportunities, mathInterpretation } =
      this.typeSpecificInterpretation(context);

    const summary =
      `${this.typeLabel(context.simulation_type)} simulation indicates ${riskLevel} risk ` +
      `with expected value ${this.formatNumber(metrics.expected_value)} and ` +
      `stability score ${this.formatNumber(metrics.stability_score)}.`;

    const keyFindings = [
      `Expected value estimate: ${this.formatNumber(metrics.expected_value)}.`,
      `Risk score: ${this.formatNumber(metrics.risk_score)} / 100 (${riskLevel}).`,
      `Stability score: ${this.formatNumber(metrics.stability_score)} / 100.`,
      ...findings,
    ].slice(0, 5);

    const recommendation = this.recommendationFromRiskLevel(
      riskLevel,
      context.simulation_type,
    );

    return {
      summary,
      key_findings: keyFindings,
      risk_analysis: {
        level: riskLevel,
        explanation:
          `Risk classification is ${riskLevel} based on normalized score ${this.formatNumber(metrics.risk_score)} ` +
          `and variability metrics in the simulation output.`,
      },
      opportunity_analysis: opportunities,
      mathematical_interpretation: mathInterpretation,
      confidence_score: confidence,
      recommendation,
    };
  }

  isExplainResponse(payload: unknown): payload is ExplainResponse {
    if (!this.isObject(payload)) return false;

    const value = payload as Partial<ExplainResponse>;
    return (
      typeof value.summary === 'string' &&
      Array.isArray(value.steps) &&
      value.steps.length >= 1 &&
      value.steps.every((step) => this.isExplainStep(step)) &&
      typeof value.final_takeaway === 'string' &&
      typeof value.confidence_score === 'number' &&
      value.confidence_score >= 0 &&
      value.confidence_score <= 100
    );
  }

  normalizeExplain(explain: ExplainResponse): ExplainResponse {
    return {
      summary: explain.summary.trim(),
      steps: explain.steps
        .map((step) => ({
          step: step.step.trim(),
          formula: step.formula.trim(),
          interpretation: step.interpretation.trim(),
        }))
        .filter(
          (step) =>
            step.step.length > 0 &&
            step.formula.length > 0 &&
            step.interpretation.length > 0,
        )
        .slice(0, 10),
      final_takeaway: explain.final_takeaway.trim(),
      confidence_score: this.clamp(Math.round(explain.confidence_score)),
    };
  }

  buildFallbackExplain(context: SimulationContext): ExplainResponse {
    const metrics = context.derived_metrics;
    const steps = this.buildExplainSteps(context);

    return {
      summary:
        `Educational breakdown for ${this.typeLabel(context.simulation_type)} simulation ` +
        `with expected value ${this.formatNumber(metrics.expected_value)}.`,
      steps,
      final_takeaway:
        `Interpret outcomes by balancing expected return (${this.formatNumber(metrics.return_score)}), ` +
        `risk (${this.formatNumber(metrics.risk_score)}), and stability (${this.formatNumber(metrics.stability_score)}).`,
      confidence_score: this.estimateConfidence(context),
    };
  }

  private typeSpecificInterpretation(context: SimulationContext): {
    findings: string[];
    opportunities: string[];
    mathInterpretation: string;
  } {
    switch (context.simulation_type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM:
        return this.interpretMonteCarlo(context.raw_output as MonteCarloResult);
      case SimulationType.MARKET:
        return this.interpretMarket(context.raw_output as MarketResult);
      case SimulationType.GAME_THEORY:
        return this.interpretGameTheory(context.raw_output as GameTheoryResult);
      case SimulationType.CONFLICT:
        return this.interpretConflict(context.raw_output as ConflictResult);
      default:
        return {
          findings: [
            'Result type is unrecognized; generic statistical interpretation applied.',
          ],
          opportunities: [
            'Collect more runs and compare trend consistency before action.',
          ],
          mathInterpretation:
            'Interpretation is based on normalized risk, return, and stability metrics only.',
        };
    }
  }

  private interpretMonteCarlo(raw: MonteCarloResult) {
    const findings = [
      `Expected value E[X] = ${this.formatNumber(raw.expectedValue)} with variance ${this.formatNumber(raw.variance)}.`,
      `90% interval proxy from p5 to p95 is [${this.formatNumber(raw.percentile5)}, ${this.formatNumber(raw.percentile95)}].`,
    ];

    const opportunities = [
      'Use percentile bands for position sizing instead of relying on a single mean estimate.',
      'Re-run with stress assumptions to test sensitivity of downside percentile.',
    ];

    return {
      findings,
      opportunities,
      mathInterpretation:
        `Monte Carlo interpretation: E[X]=${this.formatNumber(raw.expectedValue)}, ` +
        `sigma=${this.formatNumber(raw.stdDev)}, Var(X)=${this.formatNumber(raw.variance)}.`,
    };
  }

  private interpretMarket(raw: MarketResult) {
    const findings = [
      `Expected terminal price is ${this.formatNumber(raw.expectedFinalPrice)} with VaR95 ${this.formatNumber(raw.valueAtRisk95)}.`,
      `Max drawdown ${(raw.maxDrawdown * 100).toFixed(2)}% and annualized volatility ${(raw.annualizedVolatility * 100).toFixed(2)}%.`,
    ];

    const opportunities = [
      'Apply staged entries if return score is favorable but drawdown remains elevated.',
      'Use volatility-triggered controls to reduce downside during high-risk regimes.',
    ];

    return {
      findings,
      opportunities,
      mathInterpretation:
        `Market model uses return-volatility trade-off with annualized return ${(raw.annualizedReturn * 100).toFixed(2)}% ` +
        `and volatility ${(raw.annualizedVolatility * 100).toFixed(2)}%.`,
    };
  }

  private interpretGameTheory(raw: GameTheoryResult) {
    const expectedPayoffs = Object.values(raw.expectedPayoffs);
    const meanPayoff =
      expectedPayoffs.length > 0
        ? expectedPayoffs.reduce((a, b) => a + b, 0) / expectedPayoffs.length
        : 0;

    const findings = [
      `Found ${raw.nashEquilibria.length} Nash equilibrium candidates.`,
      `Average expected payoff across players is ${this.formatNumber(meanPayoff)}.`,
    ];

    const opportunities = [
      'Prioritize strategies near Pareto-efficient equilibria when available.',
      'Reduce payoff asymmetry through incentive or rule adjustments before execution.',
    ];

    return {
      findings,
      opportunities,
      mathInterpretation:
        `Game-theoretic interpretation combines equilibrium count (${raw.nashEquilibria.length}) ` +
        `and expected payoff vector ${JSON.stringify(raw.expectedPayoffs)}.`,
    };
  }

  private interpretConflict(raw: ConflictResult) {
    const resourceValues = raw.agentResults.map(
      (agent) => agent.finalResources,
    );
    const meanResource =
      resourceValues.length > 0
        ? resourceValues.reduce((a, b) => a + b, 0) / resourceValues.length
        : 0;

    const findings = [
      `Cooperation rate is ${(raw.cooperationRate * 100).toFixed(2)}% across ${raw.rounds} rounds.`,
      `Average final resources per agent: ${this.formatNumber(meanResource)}.`,
    ];

    const opportunities = [
      'Tune interaction rules to raise cooperation while preserving competitive performance.',
      'Analyze top-performing agent strategies as candidate policy templates.',
    ];

    return {
      findings,
      opportunities,
      mathInterpretation:
        `Conflict dynamics evaluation uses cooperation ${(raw.cooperationRate * 100).toFixed(2)}% ` +
        `and final resource distribution over ${raw.agentResults.length} agents.`,
    };
  }

  private buildExplainSteps(context: SimulationContext): ExplainStep[] {
    const metrics = context.derived_metrics;

    return [
      {
        step: 'Identify the core expected outcome',
        formula: 'Expected Value = mean(simulated outcomes)',
        interpretation: `The model estimates expected value at ${this.formatNumber(metrics.expected_value)} based on the generated outcomes.`,
      },
      {
        step: 'Quantify uncertainty and downside',
        formula: 'Risk Score in [0,100] from variability and downside metrics',
        interpretation: `Current normalized risk score is ${this.formatNumber(metrics.risk_score)}, indicating ${this.riskLevelFromScore(metrics.risk_score)} risk pressure.`,
      },
      {
        step: 'Assess consistency of outcomes',
        formula:
          'Stability Score in [0,100] from dispersion and regime behavior',
        interpretation: `Stability score is ${this.formatNumber(metrics.stability_score)}, used to determine confidence in repeated runs.`,
      },
      {
        step: 'Combine risk-return-stability for decision quality',
        formula: 'Decision Signal = 0.4*Risk + 0.4*Return + 0.2*Stability',
        interpretation: `This weighted composition balances protection against downside with potential upside and consistency.`,
      },
    ];
  }

  private estimateConfidence(context: SimulationContext): number {
    const coverage = this.dataCoverageScore(context);
    const stability = context.derived_metrics.stability_score;
    const riskPenalty =
      Math.max(0, context.derived_metrics.risk_score - 70) * 0.2;

    return this.clamp(
      Math.round(0.55 * stability + 0.45 * coverage - riskPenalty),
      25,
      96,
    );
  }

  private dataCoverageScore(context: SimulationContext): number {
    const raw = context.raw_output;

    switch (context.simulation_type) {
      case SimulationType.MONTE_CARLO:
      case SimulationType.CUSTOM: {
        const iterations = (raw as MonteCarloResult).iterations ?? 0;
        return this.clamp((iterations / 10_000) * 100, 20, 100);
      }
      case SimulationType.MARKET: {
        const paths = (raw as MarketResult).paths?.length ?? 0;
        return this.clamp((paths / 1_000) * 100, 20, 100);
      }
      case SimulationType.GAME_THEORY: {
        const matrixSize = (raw as GameTheoryResult).payoffMatrix?.length ?? 0;
        return this.clamp((matrixSize / 20) * 100, 20, 100);
      }
      case SimulationType.CONFLICT: {
        const conflict = raw as ConflictResult;
        const density =
          (conflict.rounds ?? 0) * (conflict.agentResults?.length ?? 0);
        return this.clamp((density / 500) * 100, 20, 100);
      }
      default:
        return 50;
    }
  }

  private recommendationFromRiskLevel(
    riskLevel: RiskLevel,
    simulationType: SimulationType,
  ): string {
    switch (riskLevel) {
      case 'critical':
        return `Use a defensive stance for ${this.typeLabel(simulationType)} outcomes: tighten constraints, reduce exposure, and re-run with stress scenarios before committing.`;
      case 'high':
        return `Proceed cautiously with guardrails for ${this.typeLabel(simulationType)} outcomes, using phased execution and explicit downside limits.`;
      case 'medium':
        return `Adopt a balanced strategy: keep upside participation while enforcing monitoring triggers and periodic recalibration.`;
      case 'low':
      default:
        return `Conditions support measured execution, but continue periodic validation to catch regime shifts early.`;
    }
  }

  private riskLevelFromScore(score: number): RiskLevel {
    if (score < 30) return 'low';
    if (score < 55) return 'medium';
    if (score < 75) return 'high';
    return 'critical';
  }

  private formatNumber(value: number): string {
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value) >= 1_000) return value.toFixed(2);
    if (Math.abs(value) >= 10) return value.toFixed(3);
    return value.toFixed(4);
  }

  private typeLabel(type: SimulationType): string {
    return type.replace(/_/g, ' ');
  }

  private isExplainStep(payload: unknown): payload is ExplainStep {
    if (!this.isObject(payload)) return false;
    const step = payload as Partial<ExplainStep>;
    return (
      typeof step.step === 'string' &&
      typeof step.formula === 'string' &&
      typeof step.interpretation === 'string'
    );
  }

  private isRiskLevel(value: unknown): value is RiskLevel {
    return (
      value === 'low' ||
      value === 'medium' ||
      value === 'high' ||
      value === 'critical'
    );
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isStringArray(value: unknown): value is string[] {
    return (
      Array.isArray(value) && value.every((entry) => typeof entry === 'string')
    );
  }

  private clamp(value: number, min = 0, max = 100): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
