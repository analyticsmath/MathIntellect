import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateSavedModelDto } from './dto/create-saved-model.dto';
import { SavedModelsService } from './saved-models.service';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('models')
@UseGuards(JwtAuthGuard)
export class SavedModelsController {
  constructor(private readonly savedModelsService: SavedModelsService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.savedModelsService.listForUser(req.user.id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateSavedModelDto) {
    return this.savedModelsService.createForUser(req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.savedModelsService.removeForUser(req.user.id, id);
  }
}
