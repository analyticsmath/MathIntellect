import { Injectable } from '@nestjs/common';
import { SkillProfile } from '../interfaces/skill-profile.interface';
import { SimulationType } from '../../simulations/entities/simulation.entity';
import { BehaviorAnalysisOutput } from './behavior-analyzer.service';
import { EngagementDirectives } from './engagement-engine.service';
import { SimulationModeLabel } from './adaptive-difficulty.service';

export interface SimulationAdaptationResult {
  adaptive_ui_badge: string;
  mode_label: SimulationModeLabel;
  explanation_depth: 'concise' | 'balanced' | 'deep';
  chart_complexity: 'low' | 'standard' | 'advanced';
  visible_panels: string[];
  hidden_panels: string[];
  highlighted_metrics: string[];
  ai_coach_hint: string;
}

@Injectable()
export class SimulationAdapterService {
  build(config: {
    simulationType: SimulationType;
    modeLabel: SimulationModeLabel;
    skillProfile: SkillProfile;
    behavior: BehaviorAnalysisOutput;
    engagement: EngagementDirectives;
    difficultyScore: number;
  }): SimulationAdaptationResult {
    const explanationDepth: SimulationAdaptationResult['explanation_depth'] =
      config.skillProfile.skill_level >= 78
        ? 'deep'
        : config.engagement.guided_mode
          ? 'concise'
          : 'balanced';

    const chartComplexity: SimulationAdaptationResult['chart_complexity'] =
      config.skillProfile.skill_level >= 75
        ? 'advanced'
        : config.skillProfile.skill_level <= 35
          ? 'low'
          : 'standard';

    const lowSkill = config.skillProfile.skill_level <= 35;
    const highSkill = config.skillProfile.skill_level >= 78;

    const visiblePanels = highSkill
      ? [
          'summary',
          'variance_decomposition',
          'sensitivity_analysis',
          'risk_surface',
          'scenario_comparator',
        ]
      : lowSkill
        ? ['summary', 'key_insights', 'recommended_actions']
        : ['summary', 'insights', 'charts', 'scenario_comparator'];

    const hiddenPanels = highSkill
      ? []
      : lowSkill
        ? ['variance_decomposition', 'tail_risk', '3d_surface']
        : ['tail_risk'];

    const highlightedMetrics = highSkill
      ? [
          'expected_value',
          'variance',
          'sensitivity',
          'tail_risk',
          'stability_score',
        ]
      : lowSkill
        ? ['expected_value', 'risk_score']
        : ['expected_value', 'risk_score', 'stability_score'];

    return {
      adaptive_ui_badge:
        config.modeLabel === 'Expert Mode'
          ? 'You are playing at Expert Level'
          : config.modeLabel === 'Beginner Mode'
            ? 'Adaptive coach set to learning mode'
            : 'You are playing at Adaptive Level',
      mode_label: config.modeLabel,
      explanation_depth: explanationDepth,
      chart_complexity: chartComplexity,
      visible_panels: visiblePanels,
      hidden_panels: hiddenPanels,
      highlighted_metrics: highlightedMetrics,
      ai_coach_hint: this.buildHint(config),
    };
  }

  private buildHint(config: {
    simulationType: SimulationType;
    modeLabel: SimulationModeLabel;
    behavior: BehaviorAnalysisOutput;
    engagement: EngagementDirectives;
    difficultyScore: number;
  }): string {
    if (config.engagement.guided_mode) {
      switch (config.simulationType) {
        case SimulationType.MONTE_CARLO:
        case SimulationType.CUSTOM:
          return 'Try one parameter change at a time, then compare expected value and variance before rerunning.';
        case SimulationType.MARKET:
          return 'Start with a shorter horizon and adjust volatility gradually to see risk impact clearly.';
        case SimulationType.GAME_THEORY:
          return 'Focus on one player strategy tweak first, then inspect equilibrium changes.';
        case SimulationType.CONFLICT:
          return 'Reduce agent count temporarily and observe cooperation rate before expanding complexity.';
        default:
          return 'Use guided mode: isolate one variable change per run for clearer insight.';
      }
    }

    if (config.modeLabel === 'Expert Mode') {
      switch (config.simulationType) {
        case SimulationType.MONTE_CARLO:
        case SimulationType.CUSTOM:
          return 'Try increasing volatility parameter for deeper insight into tail behavior and sensitivity shifts.';
        case SimulationType.MARKET:
          return 'Stress-test regime transitions by perturbing volatility clustering parameters.';
        case SimulationType.GAME_THEORY:
          return 'Introduce one adaptive agent and compare equilibrium stability across evolution rounds.';
        case SimulationType.CONFLICT:
          return 'Test coalition reshuffles to measure nonlinear changes in ecosystem stability.';
        default:
          return 'Push one complexity axis further and validate sensitivity response.';
      }
    }

    if (config.behavior.exploration_ratio < 0.32) {
      return 'You are repeating similar setups; explore a new parameter range to unlock bonus intelligence XP.';
    }

    return 'Try a moderate parameter shift and compare with your previous run to maximize learning velocity.';
  }
}
