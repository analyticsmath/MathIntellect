import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ReplayRunDto {
  @IsUUID()
  simulationId: string;

  @IsOptional()
  @IsString()
  seed?: string;
}
