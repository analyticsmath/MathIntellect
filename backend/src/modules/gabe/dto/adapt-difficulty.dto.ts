import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SimulationType } from '../../simulations/entities/simulation.entity';
import { UpdateBehaviorDto } from './update-behavior.dto';

export class AdaptDifficultyDto {
  @IsEnum(SimulationType)
  simulationType: SimulationType;

  @IsObject()
  parameters: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  skillProfile?: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBehaviorDto)
  behaviorSignals?: UpdateBehaviorDto;

  @IsOptional()
  @IsObject()
  behaviorAnalysis?: Record<string, unknown>;
}
