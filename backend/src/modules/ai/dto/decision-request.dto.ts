import { IsBoolean, IsObject, IsOptional, IsUUID } from 'class-validator';

export class DecisionRequestDto {
  @IsUUID('4')
  simulationId: string;

  @IsOptional()
  @IsObject()
  userContext?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean;
}
