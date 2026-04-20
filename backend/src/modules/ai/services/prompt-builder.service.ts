import { Injectable } from '@nestjs/common';
import { DecisionResponse } from '../interfaces/decision.interface';
import { ExplainResponse } from '../interfaces/ai-response.interface';
import { InsightResponse } from '../interfaces/insight.interface';
import { SimulationContext } from './simulation-context.service';

export interface PromptContract<T> {
  promptVersion: string;
  schemaName: string;
  schema: Record<string, unknown>;
  systemPrompt: string;
  userPrompt: string;
  validator: (payload: unknown) => payload is T;
}

export interface PromptPersonalization {
  explanationDepth?: 'concise' | 'balanced' | 'deep';
  behaviorStyle?: string;
  track?: string;
  rankLabel?: string;
  clusterLabel?: string;
  stagnationScore?: number;
  promptDirectives?: Record<string, unknown>;
}

@Injectable()
export class PromptBuilderService {
  static readonly PROMPT_VERSION = 'v3.2-lock';

  get promptVersion(): string {
    return PromptBuilderService.PROMPT_VERSION;
  }

  buildInsightPrompt(
    context: SimulationContext,
    validator: (payload: unknown) => payload is InsightResponse,
    personalization?: PromptPersonalization,
  ): PromptContract<InsightResponse> {
    const systemPrompt = [
      'You are a mathematical decision intelligence engine.',
      'Analyze only the provided JSON context.',
      'Do not hallucinate missing values.',
      'Output must be valid JSON and must match the schema exactly.',
      'No markdown, no comments, and no free text outside JSON.',
      this.personalizationSystemInstruction(personalization),
    ].join(' ');

    const userPrompt = this.formatUserPrompt({
      task: 'Generate an AI insight object for one simulation result.',
      prompt_version: this.promptVersion,
      constraints: [
        'Use deterministic phrasing and avoid speculative claims.',
        'Risk level must be one of: low, medium, high, critical.',
        'confidence_score must be 0-100.',
      ],
      simulation: context,
      personalization: this.personalizationPayload(personalization),
    });

    return {
      promptVersion: this.promptVersion,
      schemaName: 'simulation_insight_response',
      schema: this.insightSchema,
      systemPrompt,
      userPrompt,
      validator,
    };
  }

  buildDecisionPrompt(
    context: SimulationContext,
    insight: InsightResponse,
    userContext: Record<string, unknown> | undefined,
    validator: (payload: unknown) => payload is DecisionResponse,
    personalization?: PromptPersonalization,
  ): PromptContract<DecisionResponse> {
    const systemPrompt = [
      'You are a mathematical decision intelligence engine.',
      'Convert simulation evidence into pragmatic decisions.',
      'Never provide absolute financial guarantees or certainty language.',
      'Output must be valid JSON and exactly follow the provided schema.',
      'No markdown, no commentary, no extra keys.',
      this.personalizationSystemInstruction(personalization),
    ].join(' ');

    const userPrompt = this.formatUserPrompt({
      task: 'Generate a decision recommendation from simulation context and insight.',
      prompt_version: this.promptVersion,
      constraints: [
        'Always provide 2 or 3 alternatives.',
        'Each alternative must include explicit pros and cons.',
        'risk_tradeoff must mention downside and upside trade-offs.',
        'confidence must be between 0 and 100.',
      ],
      simulation: context,
      insight,
      user_context: userContext ?? {},
      personalization: this.personalizationPayload(personalization),
    });

    return {
      promptVersion: this.promptVersion,
      schemaName: 'decision_recommendation_response',
      schema: this.decisionSchema,
      systemPrompt,
      userPrompt,
      validator,
    };
  }

  buildExplainPrompt(
    context: SimulationContext,
    validator: (payload: unknown) => payload is ExplainResponse,
    personalization?: PromptPersonalization,
  ): PromptContract<ExplainResponse> {
    const systemPrompt = [
      'You are a mathematical interpretation tutor for simulation outputs.',
      'Explain the provided result in educational step-by-step form.',
      'Use only context data and avoid invented assumptions.',
      'Return JSON only, matching schema exactly.',
      this.personalizationSystemInstruction(personalization),
    ].join(' ');

    const userPrompt = this.formatUserPrompt({
      task: 'Provide an educational mathematical explanation for the simulation.',
      prompt_version: this.promptVersion,
      constraints: [
        'Provide at least 3 steps.',
        'Each step requires step, formula, interpretation fields.',
        'confidence_score must be between 0 and 100.',
      ],
      simulation: context,
      personalization: this.personalizationPayload(personalization),
    });

    return {
      promptVersion: this.promptVersion,
      schemaName: 'simulation_explain_response',
      schema: this.explainSchema,
      systemPrompt,
      userPrompt,
      validator,
    };
  }

  private formatUserPrompt(payload: Record<string, unknown>): string {
    return this.stableStringify(payload);
  }

  private personalizationSystemInstruction(
    personalization?: PromptPersonalization,
  ): string {
    if (!personalization) {
      return '';
    }

    const depth = personalization.explanationDepth ?? 'balanced';
    const style = personalization.behaviorStyle ?? 'neutral';
    const rank = personalization.rankLabel ?? 'Analyst';
    const cluster = personalization.clusterLabel ?? 'balanced';
    const stagnation = Number.isFinite(personalization.stagnationScore)
      ? personalization.stagnationScore
      : 0;

    return (
      `Personalization: explanation_depth=${depth}; behavior_style=${style}; ` +
      `rank=${rank}; cluster=${cluster}; stagnation_score=${stagnation}. ` +
      'Keep outputs mathematically rigorous while matching this adaptation profile.'
    );
  }

  private personalizationPayload(
    personalization?: PromptPersonalization,
  ): Record<string, unknown> | null {
    if (!personalization) {
      return null;
    }

    return {
      explanation_depth: personalization.explanationDepth ?? 'balanced',
      behavior_style: personalization.behaviorStyle ?? 'neutral',
      track: personalization.track ?? 'strategist',
      rank_label: personalization.rankLabel ?? 'Analyst',
      cluster_label: personalization.clusterLabel ?? 'balanced',
      stagnation_score: personalization.stagnationScore ?? 0,
      prompt_directives: personalization.promptDirectives ?? {},
    };
  }

  private stableStringify(value: unknown): string {
    return JSON.stringify(this.sortKeys(value), null, 2);
  }

  private sortKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sortKeys(item));
    }

    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const sorted: Record<string, unknown> = {};
      for (const key of Object.keys(obj).sort()) {
        sorted[key] = this.sortKeys(obj[key]);
      }
      return sorted;
    }

    return value;
  }

  private readonly insightSchema: Record<string, unknown> = {
    type: 'object',
    additionalProperties: false,
    required: [
      'summary',
      'key_findings',
      'risk_analysis',
      'opportunity_analysis',
      'mathematical_interpretation',
      'confidence_score',
      'recommendation',
    ],
    properties: {
      summary: { type: 'string' },
      key_findings: {
        type: 'array',
        minItems: 2,
        items: { type: 'string' },
      },
      risk_analysis: {
        type: 'object',
        additionalProperties: false,
        required: ['level', 'explanation'],
        properties: {
          level: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
          },
          explanation: { type: 'string' },
        },
      },
      opportunity_analysis: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
      },
      mathematical_interpretation: { type: 'string' },
      confidence_score: {
        type: 'number',
        minimum: 0,
        maximum: 100,
      },
      recommendation: { type: 'string' },
    },
  };

  private readonly decisionSchema: Record<string, unknown> = {
    type: 'object',
    additionalProperties: false,
    required: [
      'decision',
      'reasoning',
      'risk_tradeoff',
      'alternatives',
      'confidence',
    ],
    properties: {
      decision: { type: 'string' },
      reasoning: {
        type: 'array',
        minItems: 3,
        items: { type: 'string' },
      },
      risk_tradeoff: { type: 'string' },
      alternatives: {
        type: 'array',
        minItems: 2,
        maxItems: 3,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['option', 'pros', 'cons'],
          properties: {
            option: { type: 'string' },
            pros: {
              type: 'array',
              minItems: 1,
              items: { type: 'string' },
            },
            cons: {
              type: 'array',
              minItems: 1,
              items: { type: 'string' },
            },
          },
        },
      },
      confidence: {
        type: 'number',
        minimum: 0,
        maximum: 100,
      },
    },
  };

  private readonly explainSchema: Record<string, unknown> = {
    type: 'object',
    additionalProperties: false,
    required: ['summary', 'steps', 'final_takeaway', 'confidence_score'],
    properties: {
      summary: { type: 'string' },
      steps: {
        type: 'array',
        minItems: 3,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['step', 'formula', 'interpretation'],
          properties: {
            step: { type: 'string' },
            formula: { type: 'string' },
            interpretation: { type: 'string' },
          },
        },
      },
      final_takeaway: { type: 'string' },
      confidence_score: {
        type: 'number',
        minimum: 0,
        maximum: 100,
      },
    },
  };
}
