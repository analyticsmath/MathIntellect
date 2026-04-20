import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CoachRequestDto {
  @IsOptional()
  @IsUUID()
  simulationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  goal?: string;

  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean;
}
