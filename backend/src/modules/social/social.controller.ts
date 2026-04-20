import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SocialService } from './social.service';
import { ShareSimulationDto } from './dto/share-simulation.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { LikeDto } from './dto/like.dto';
import { CommentDto } from './dto/comment.dto';
import { ForkSimulationDto } from './dto/fork-simulation.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('share-simulation')
  shareSimulation(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ShareSimulationDto,
  ) {
    return this.socialService.shareSimulation(req.user.id, dto);
  }

  @Get('feed')
  getFeed(@Req() req: AuthenticatedRequest, @Query() query: FeedQueryDto) {
    return this.socialService.getFeed(query, req.user.id);
  }

  @Post('like')
  like(@Req() req: AuthenticatedRequest, @Body() dto: LikeDto) {
    return this.socialService.toggleLike(req.user.id, dto.postId);
  }

  // Compatibility alias for frontend services
  @Post('posts/:id/like')
  likeById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.socialService.toggleLike(req.user.id, id);
  }

  @Post('comment')
  comment(@Req() req: AuthenticatedRequest, @Body() dto: CommentDto) {
    return this.socialService.addComment(req.user.id, dto);
  }

  @Post('fork/:id')
  fork(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: ForkSimulationDto,
  ) {
    return this.socialService.forkSimulation(req.user.id, id, dto);
  }

  // Compatibility alias for frontend services
  @Post('posts/:id/fork')
  forkById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.socialService.forkSimulation(req.user.id, id, {});
  }
}
