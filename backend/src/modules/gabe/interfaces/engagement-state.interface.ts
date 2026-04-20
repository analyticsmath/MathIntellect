import {
  DEFAULT_SKILL_PROFILE,
  SkillProfile,
  normalizeSkillProfile,
} from './skill-profile.interface';

export interface LastGamificationEventState {
  xp_gain: number;
  level_progress: number;
  skill_update: SkillProfile;
  behavior_tag: string;
  timestamp: string;
}

export interface EngagementState {
  session_duration_ms_avg: number;
  simulation_repetition_cycles: number;
  drop_off_points: number;
  engagement_spikes: number;
  reward_frequency: number;
  cognitive_load_index: number;
  guided_mode: boolean;
  recent_parameter_hashes: string[];
  recent_performance_scores: number[];
  recent_xp_gains: number[];
  recent_engagement_scores: number[];
  last_event: LastGamificationEventState | null;
}

export const DEFAULT_ENGAGEMENT_STATE: EngagementState = {
  session_duration_ms_avg: 0,
  simulation_repetition_cycles: 0,
  drop_off_points: 0,
  engagement_spikes: 0,
  reward_frequency: 0.45,
  cognitive_load_index: 20,
  guided_mode: false,
  recent_parameter_hashes: [],
  recent_performance_scores: [],
  recent_xp_gains: [],
  recent_engagement_scores: [],
  last_event: null,
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function numberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => typeof entry === 'number' && Number.isFinite(entry))
    .slice(-20);
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => typeof entry === 'string' && entry.length > 0)
    .slice(-20);
}

export function normalizeEngagementState(
  state: Partial<EngagementState> | null | undefined,
): EngagementState {
  if (!state) {
    return { ...DEFAULT_ENGAGEMENT_STATE };
  }

  const rawLastEvent = state.last_event;
  const normalizedLastEvent: LastGamificationEventState | null =
    rawLastEvent && typeof rawLastEvent === 'object'
      ? {
          xp_gain:
            typeof rawLastEvent.xp_gain === 'number' &&
            Number.isFinite(rawLastEvent.xp_gain)
              ? Math.max(0, Math.round(rawLastEvent.xp_gain))
              : 0,
          level_progress:
            typeof rawLastEvent.level_progress === 'number' &&
            Number.isFinite(rawLastEvent.level_progress)
              ? clamp(rawLastEvent.level_progress, 0, 100)
              : 0,
          skill_update: normalizeSkillProfile(rawLastEvent.skill_update),
          behavior_tag:
            typeof rawLastEvent.behavior_tag === 'string'
              ? rawLastEvent.behavior_tag
              : DEFAULT_SKILL_PROFILE.behavior_pattern,
          timestamp:
            typeof rawLastEvent.timestamp === 'string'
              ? rawLastEvent.timestamp
              : new Date(0).toISOString(),
        }
      : null;

  return {
    session_duration_ms_avg:
      typeof state.session_duration_ms_avg === 'number' &&
      Number.isFinite(state.session_duration_ms_avg)
        ? Math.max(0, state.session_duration_ms_avg)
        : DEFAULT_ENGAGEMENT_STATE.session_duration_ms_avg,
    simulation_repetition_cycles:
      typeof state.simulation_repetition_cycles === 'number' &&
      Number.isFinite(state.simulation_repetition_cycles)
        ? Math.max(0, Math.round(state.simulation_repetition_cycles))
        : DEFAULT_ENGAGEMENT_STATE.simulation_repetition_cycles,
    drop_off_points:
      typeof state.drop_off_points === 'number' &&
      Number.isFinite(state.drop_off_points)
        ? Math.max(0, Math.round(state.drop_off_points))
        : DEFAULT_ENGAGEMENT_STATE.drop_off_points,
    engagement_spikes:
      typeof state.engagement_spikes === 'number' &&
      Number.isFinite(state.engagement_spikes)
        ? Math.max(0, Math.round(state.engagement_spikes))
        : DEFAULT_ENGAGEMENT_STATE.engagement_spikes,
    reward_frequency:
      typeof state.reward_frequency === 'number' &&
      Number.isFinite(state.reward_frequency)
        ? clamp(state.reward_frequency, 0.1, 1)
        : DEFAULT_ENGAGEMENT_STATE.reward_frequency,
    cognitive_load_index:
      typeof state.cognitive_load_index === 'number' &&
      Number.isFinite(state.cognitive_load_index)
        ? clamp(state.cognitive_load_index, 0, 100)
        : DEFAULT_ENGAGEMENT_STATE.cognitive_load_index,
    guided_mode:
      typeof state.guided_mode === 'boolean'
        ? state.guided_mode
        : DEFAULT_ENGAGEMENT_STATE.guided_mode,
    recent_parameter_hashes: stringArray(state.recent_parameter_hashes),
    recent_performance_scores: numberArray(state.recent_performance_scores),
    recent_xp_gains: numberArray(state.recent_xp_gains),
    recent_engagement_scores: numberArray(state.recent_engagement_scores),
    last_event: normalizedLastEvent,
  };
}
