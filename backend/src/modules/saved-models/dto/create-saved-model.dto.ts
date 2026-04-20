import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class CreateSavedModelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  engineType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title: string;

  @IsObject()
  configJson: Record<string, unknown>;
}
