import { IsEnum, IsNumber, IsObject, IsOptional } from 'class-validator';
import { SimulationType } from '../../simulations/entities/simulation.entity';

export class SkillEvalDto {
  @IsEnum(SimulationType)
  simulationType: SimulationType;

  @IsNumber()
  executionTimeMs: number;

  @IsNumber()
  difficultyScore: number;

  @IsNumber()
  noveltyScore: number;

  @IsNumber()
  improvementScore: number;

  @IsNumber()
  riskScore: number;

  @IsNumber()
  accuracyScore: number;

  @IsObject()
  behavior: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  outcomeMetrics?: Record<string, number>;
}
