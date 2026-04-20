import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class ShareSimulationDto {
  @IsUUID()
  simulationId: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1_000)
  summary?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
