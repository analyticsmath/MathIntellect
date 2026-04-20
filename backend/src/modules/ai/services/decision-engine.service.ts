import { Injectable } from '@nestjs/common';
import {
  DecisionAlternative,
  DecisionResponse,
} from '../interfaces/decision.interface';
import { InsightResponse } from '../interfaces/insight.interface';
import { SimulationContext } from './simulation-context.service';

@Injectable()
export class DecisionEngineService {
  isDecisionResponse(payload: unknown): payload is DecisionResponse {
    if (!this.isObject(payload)) return false;

    const value = payload as Partial<DecisionResponse>;
    return (
      typeof value.decision === 'string' &&
      this.isStringArray(value.reasoning) &&
      typeof value.risk_tradeoff === 'string' &&
      Array.isArray(value.alternatives) &&
      value.alternatives.length >= 2 &&
      value.alternatives.length <= 3 &&
      value.alternatives.every((option) => this.isAlternative(option)) &&
      typeof value.confidence === 'number' &&
      value.confidence >= 0 &&
      value.confidence <= 100
    );
  }

  normalizeDecision(response: DecisionResponse): DecisionResponse {
    const normalizedAlternatives = response.alternatives
      .map((option) => ({
        option: option.option.trim(),
        pros: option.pros.map((item) => item.trim()).filter(Boolean),
        cons: option.cons.map((item) => item.trim()).filter(Boolean),
      }))
      .filter(
        (option) =>
          option.option.length > 0 &&
          option.pros.length > 0 &&
          option.cons.length > 0,
      )
      .slice(0, 3);

    return {
      decision: response.decision.trim(),
      reasoning: response.reasoning
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8),
      risk_tradeoff: response.risk_tradeoff.trim(),
      alternatives: normalizedAlternatives,
      confidence: this.clamp(Math.round(response.confidence)),
    };
  }

  buildFallbackDecision(
    context: SimulationContext,
    insight: InsightResponse,
    userContext?: Record<string, unknown>,
  ): DecisionResponse {
    const riskLevel = insight.risk_analysis.level;
    const metrics = context.derived_metrics;

    const decision = this.primaryDecision(riskLevel, context.simulation_type);

    const reasoning = [
      `Expected value is ${this.format(metrics.expected_value)}, which anchors baseline upside potential.`,
      `Risk level is ${riskLevel} with score ${this.format(metrics.risk_score)} / 100 based on simulation dispersion and downside metrics.`,
      `Stability score is ${this.format(metrics.stability_score)} / 100, which affects repeatability confidence.`,
      `Recommendation favors controlled execution instead of deterministic outcome claims.`,
    ];

    const riskTradeoff =
      `Upside exists when return conditions remain favorable, but downside can materialize if risk drivers intensify. ` +
      `Use trigger-based adjustments instead of fixed commitments.`;

    const alternatives = this.buildAlternatives(riskLevel, userContext);

    const confidence = this.clamp(
      Math.round(
        insight.confidence_score * 0.6 +
          metrics.stability_score * 0.4 -
          Math.max(0, metrics.risk_score - 80) * 0.25,
      ),
      20,
      95,
    );

    return {
      decision,
      reasoning,
      risk_tradeoff: riskTradeoff,
      alternatives,
      confidence,
    };
  }

  private primaryDecision(
    riskLevel: InsightResponse['risk_analysis']['level'],
    simulationType: string,
  ): string {
    if (riskLevel === 'critical') {
      return `Pause high-exposure actions for ${simulationType.replace(/_/g, ' ')} and rerun under stricter constraints before execution.`;
    }
    if (riskLevel === 'high') {
      return `Proceed with a defensive staged plan for ${simulationType.replace(/_/g, ' ')}, with explicit risk limits and checkpoints.`;
    }
    if (riskLevel === 'medium') {
      return `Use a balanced plan: moderate exposure, monitor key indicators, and adjust when risk signals shift.`;
    }
    return `Use a measured execution plan while preserving periodic validation in case conditions drift.`;
  }

  private buildAlternatives(
    riskLevel: InsightResponse['risk_analysis']['level'],
    userContext?: Record<string, unknown>,
  ): DecisionAlternative[] {
    const contextNote =
      userContext && Object.keys(userContext).length > 0
        ? 'Aligns with provided user context constraints.'
        : 'Applies a neutral baseline with no user-specific constraints.';

    const conservative: DecisionAlternative = {
      option: 'Conservative scenario',
      pros: [
        'Lowest downside exposure under adverse outcomes.',
        'Clear stop conditions and easier governance.',
      ],
      cons: [
        'May leave upside on the table if conditions improve quickly.',
        contextNote,
      ],
    };

    const balanced: DecisionAlternative = {
      option: 'Balanced scenario',
      pros: [
        'Combines upside participation with risk controls.',
        'Adaptable to changing signals through periodic recalibration.',
      ],
      cons: [
        'Requires active monitoring and adjustment discipline.',
        'Moderate downside remains if risk shifts abruptly.',
      ],
    };

    const opportunistic: DecisionAlternative = {
      option: 'Opportunistic scenario',
      pros: [
        'Highest upside capture when favorable conditions persist.',
        'Faster response to positive momentum signals.',
      ],
      cons: [
        'Greatest exposure to volatility and drawdown.',
        'Needs strict contingency rules to avoid tail-risk losses.',
      ],
    };

    if (riskLevel === 'critical') {
      return [conservative, balanced];
    }

    if (riskLevel === 'high') {
      return [conservative, balanced, opportunistic];
    }

    if (riskLevel === 'medium') {
      return [balanced, conservative, opportunistic];
    }

    return [opportunistic, balanced, conservative];
  }

  private isAlternative(payload: unknown): payload is DecisionAlternative {
    if (!this.isObject(payload)) return false;

    const option = payload as Partial<DecisionAlternative>;
    return (
      typeof option.option === 'string' &&
      this.isStringArray(option.pros) &&
      option.pros.length > 0 &&
      this.isStringArray(option.cons) &&
      option.cons.length > 0
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

  private format(value: number): string {
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value) >= 100) return value.toFixed(2);
    return value.toFixed(3);
  }

  private clamp(value: number, min = 0, max = 100): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
