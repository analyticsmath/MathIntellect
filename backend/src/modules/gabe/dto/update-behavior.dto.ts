import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateBehaviorDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  parameterAdjustmentCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  parameterAdjustmentMs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  rerunCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  explorationRatio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  decisionHesitationMs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  strategyChanges?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  interactionLagMs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sessionDurationMs?: number;
}
