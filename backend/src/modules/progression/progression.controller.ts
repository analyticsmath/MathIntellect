import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { ProgressionService } from './progression.service';
import { SelectTrackDto } from './dto/select-track.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('progression')
@UseGuards(JwtAuthGuard)
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get('me')
  async getMyProgression(@Req() req: AuthenticatedRequest) {
    const state = await this.progressionService.getOrCreate(req.user.id);
    const promptAdaptation = await this.progressionService.getPromptAdaptation(
      req.user.id,
    );

    return {
      state,
      prompt_adaptation: promptAdaptation,
    };
  }

  @Post('select-track')
  selectTrack(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SelectTrackDto,
  ) {
    return this.progressionService.selectTrack(req.user.id, dto.track);
  }
}
