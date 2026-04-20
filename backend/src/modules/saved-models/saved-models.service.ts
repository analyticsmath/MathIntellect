import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSavedModelDto } from './dto/create-saved-model.dto';
import { SavedModel } from './entities/saved-model.entity';

@Injectable()
export class SavedModelsService {
  constructor(
    @InjectRepository(SavedModel)
    private readonly savedModelsRepo: Repository<SavedModel>,
  ) {}

  async listForUser(userId: string): Promise<SavedModel[]> {
    return this.savedModelsRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      take: 100,
    });
  }

  async createForUser(
    userId: string,
    dto: CreateSavedModelDto,
  ): Promise<SavedModel> {
    const item = this.savedModelsRepo.create({
      userId,
      engineType: dto.engineType,
      title: dto.title,
      configJson: dto.configJson,
    });

    return this.savedModelsRepo.save(item);
  }

  async removeForUser(userId: string, id: string): Promise<void> {
    const item = await this.savedModelsRepo.findOne({ where: { id, userId } });
    if (!item) {
      throw new NotFoundException('Saved model not found');
    }

    await this.savedModelsRepo.remove(item);
  }
}
