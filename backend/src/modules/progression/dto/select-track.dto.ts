import { IsEnum } from 'class-validator';
import { ProgressionTrack } from '../progression.types';

export class SelectTrackDto {
  @IsEnum(ProgressionTrack)
  track: ProgressionTrack;
}
