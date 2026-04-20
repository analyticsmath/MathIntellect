import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { SimulationType } from '../entities/simulation.entity';
import { UpdateBehaviorDto } from '../../gabe/dto/update-behavior.dto';
import { Type } from 'class-transformer';

export class RunSimulationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(SimulationType)
  type: SimulationType;

  @IsObject()
  parameters: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBehaviorDto)
  behaviorSignals?: UpdateBehaviorDto;

  @IsOptional()
  @IsUUID()
  createdById?: string;
}
