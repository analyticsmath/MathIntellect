import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CommentDto {
  @IsUUID()
  postId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(800)
  content: string;
}
