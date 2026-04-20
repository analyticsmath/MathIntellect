import { Injectable } from '@nestjs/common';
import { SkillProfile } from '../interfaces/skill-profile.interface';

interface LevelMilestone {
  level: number;
  title: string;
  unlocks: string[];
}

export interface ProgressionResult {
  xpBefore: number;
  xpAfter: number;
  levelBefore: number;
  levelAfter: number;
  levelDelta: number;
  levelTitle: string;
  levelProgress: number;
  unlockedFeatures: string[];
  nextMilestoneLevel: number | null;
  nextMilestoneTitle: string | null;
}

const MILESTONES: LevelMilestone[] = [
  {
    level: 1,
    title: 'Beginner Analyst',
    unlocks: ['Core simulation workspace', 'Basic interpretation mode'],
  },
  {
    level: 10,
    title: 'Strategy Explorer',
    unlocks: ['Adaptive scenario branches', 'Guided strategic hints'],
  },
  {
    level: 25,
    title: 'Risk Analyst',
    unlocks: ['Risk decomposition panels', 'Advanced downside diagnostics'],
  },
  {
    level: 50,
    title: 'Simulation Expert',
    unlocks: [
      'Expert-level complexity orchestration',
      'Sensitivity analysis dashboards',
    ],
  },
  {
    level: 75,
    title: 'System Thinker',
    unlocks: ['Multi-agent ecosystem modes', 'Deep policy and feedback loops'],
  },
  {
    level: 100,
    title: 'Mathematical Strategist',
    unlocks: ['Hidden analytical modes', 'Full depth AI explanation pipeline'],
  },
];

@Injectable()
export class ProgressionEngineService {
  compute(
    currentXp: number,
    currentLevel: number,
    skillProfile: SkillProfile,
    xpGain: number,
  ): ProgressionResult {
    const xpBefore = Math.max(0, Math.round(currentXp));
    const xpAfter = Math.max(0, Math.round(currentXp + xpGain));
    const levelBefore = this.clampLevel(currentLevel);
    const levelAfter = Math.max(
      levelBefore,
      this.calculateLevel(xpAfter, skillProfile),
    );

    const title = this.getMilestoneForLevel(levelAfter).title;
    const unlockedFeatures = this.resolveUnlockedFeatures(levelAfter);
    const { progress, nextLevel, nextTitle } = this.levelProgress(levelAfter);

    return {
      xpBefore,
      xpAfter,
      levelBefore,
      levelAfter,
      levelDelta: levelAfter - levelBefore,
      levelTitle: title,
      levelProgress: progress,
      unlockedFeatures,
      nextMilestoneLevel: nextLevel,
      nextMilestoneTitle: nextTitle,
    };
  }

  getLevelTitle(level: number): string {
    return this.getMilestoneForLevel(level).title;
  }

  calculateLevel(xp: number, skillProfile: SkillProfile): number {
    const boundedXp = Math.max(0, xp);
    const xpSignal = 1 + Math.pow(boundedXp / 75, 0.58);
    const skillAssist = Math.max(0, skillProfile.skill_level - 20) / 65;
    const consistencyAssist =
      Math.max(0, skillProfile.consistency_score - 40) / 120;

    return this.clampLevel(
      Math.round(xpSignal + skillAssist + consistencyAssist),
    );
  }

  private levelProgress(level: number): {
    progress: number;
    nextLevel: number | null;
    nextTitle: string | null;
  } {
    const ordered = [...MILESTONES].sort((a, b) => a.level - b.level);
    const currentIndex = ordered.findLastIndex(
      (milestone) => milestone.level <= level,
    );

    if (currentIndex < 0 || currentIndex === ordered.length - 1) {
      return {
        progress: 100,
        nextLevel: null,
        nextTitle: null,
      };
    }

    const current = ordered[currentIndex];
    const next = ordered[currentIndex + 1];

    const progress =
      ((level - current.level) / Math.max(1, next.level - current.level)) * 100;

    return {
      progress: Number(this.clamp(progress, 0, 100).toFixed(2)),
      nextLevel: next.level,
      nextTitle: next.title,
    };
  }

  private resolveUnlockedFeatures(level: number): string[] {
    const unlocked = MILESTONES.filter(
      (milestone) => milestone.level <= level,
    ).flatMap((milestone) => milestone.unlocks);

    return [...new Set(unlocked)];
  }

  private getMilestoneForLevel(level: number): LevelMilestone {
    const bounded = this.clampLevel(level);

    return (
      [...MILESTONES]
        .sort((a, b) => a.level - b.level)
        .filter((milestone) => milestone.level <= bounded)
        .at(-1) ?? MILESTONES[0]
    );
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  private clampLevel(level: number): number {
    return Math.round(this.clamp(level, 1, 100));
  }
}
