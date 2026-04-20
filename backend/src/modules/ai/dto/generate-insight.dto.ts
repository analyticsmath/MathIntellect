import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class GenerateInsightDto {
  @IsUUID('4')
  simulationId: string;

  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean;
}
