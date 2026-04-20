import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CoachRequestDto } from './dto/coach-request.dto';
import { AiCoachService } from './services/ai-coach.service';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller({ path: 'ai', version: '2' })
@UseGuards(JwtAuthGuard)
export class AiV2Controller {
  constructor(private readonly coachService: AiCoachService) {}

  @Post('coach')
  coach(@Req() req: AuthenticatedRequest, @Body() dto: CoachRequestDto) {
    return this.coachService.generateCoach(req.user.id, dto);
  }
}
