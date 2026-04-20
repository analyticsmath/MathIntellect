import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EconomyTransaction,
  EconomyTransactionType,
} from './entities/economy-transaction.entity';

export interface EconomyRewardInput {
  baseXp: number;
  noveltyScore: number;
  riskScore: number;
  accuracyScore: number;
  improvementScore: number;
  repetitionRatio: number;
  difficultyScore: number;
}

export interface EconomyRewardOutput {
  adjustedXpGain: number;
  multiplier: number;
  noveltyBonus: number;
  highRiskBonus: number;
  decayPenalty: number;
  skillDelta: number;
}

@Injectable()
export class EconomyService {
  constructor(
    @InjectRepository(EconomyTransaction)
    private readonly transactionRepo: Repository<EconomyTransaction>,
  ) {}

  computeReward(input: EconomyRewardInput): EconomyRewardOutput {
    const baseXp = Math.max(0, Math.round(input.baseXp));

    const noveltyBonus = this.clamp(
      (input.noveltyScore - 50) / 240,
      -0.12,
      0.28,
    );
    const highRiskBonus =
      input.riskScore >= 70
        ? this.clamp((input.riskScore - 68) / 210, 0, 0.22)
        : 0;
    const smartDecisionBonus = this.clamp(
      (input.accuracyScore - 45) / 220 + (input.improvementScore - 50) / 260,
      -0.18,
      0.35,
    );

    const repeatDecay = this.clamp(input.repetitionRatio * 0.58, 0, 0.55);
    const decayPenalty = this.clamp(
      repeatDecay + Math.max(0, (35 - input.difficultyScore) / 220),
      0,
      0.68,
    );

    const multiplier = this.clamp(
      1 + noveltyBonus + highRiskBonus + smartDecisionBonus - decayPenalty,
      0.45,
      2.8,
    );

    const adjustedXpGain = Math.max(1, Math.round(baseXp * multiplier));

    const skillDelta = this.clamp(
      adjustedXpGain / 26 + (input.difficultyScore - 50) / 34,
      -5,
      18,
    );

    return {
      adjustedXpGain,
      multiplier: Number(multiplier.toFixed(4)),
      noveltyBonus: Number(noveltyBonus.toFixed(4)),
      highRiskBonus: Number(highRiskBonus.toFixed(4)),
      decayPenalty: Number(decayPenalty.toFixed(4)),
      skillDelta: Number(skillDelta.toFixed(3)),
    };
  }

  computeComplexityMultiplier(level: number, xp: number): number {
    const levelSignal = this.clamp(level, 1, 100) / 125;
    const xpSignal = Math.log10(Math.max(10, xp + 10)) / 7;

    return Number(
      this.clamp(0.88 + levelSignal + xpSignal, 0.85, 1.95).toFixed(4),
    );
  }

  async recordTransaction(input: {
    userId: string;
    simulationId?: string;
    transactionType?: EconomyTransactionType;
    baseXp: number;
    reward: EconomyRewardOutput;
    metadata?: Record<string, unknown>;
  }): Promise<EconomyTransaction> {
    const transaction = this.transactionRepo.create({
      userId: input.userId,
      simulationId: input.simulationId ?? null,
      transactionType:
        input.transactionType ?? EconomyTransactionType.SIMULATION_REWARD,
      baseXp: Math.max(0, Math.round(input.baseXp)),
      multiplier: input.reward.multiplier,
      noveltyBonus: input.reward.noveltyBonus,
      highRiskBonus: input.reward.highRiskBonus,
      decayPenalty: input.reward.decayPenalty,
      finalXp: input.reward.adjustedXpGain,
      metadataJson: input.metadata ?? null,
    });

    return this.transactionRepo.save(transaction);
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
