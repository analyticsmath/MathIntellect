import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateStrategyDto {
  @IsUUID()
  simulationId: string;

  @IsString()
  @IsNotEmpty()
  playerName: string;

  @IsObject()
  strategyData: Record<string, unknown>;

  @IsOptional()
  isActive?: boolean;
}
