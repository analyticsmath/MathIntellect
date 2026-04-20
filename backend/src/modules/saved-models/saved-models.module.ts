import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedModel } from './entities/saved-model.entity';
import { SavedModelsController } from './saved-models.controller';
import { SavedModelsService } from './saved-models.service';

@Module({
  imports: [TypeOrmModule.forFeature([SavedModel])],
  controllers: [SavedModelsController],
  providers: [SavedModelsService],
  exports: [SavedModelsService],
})
export class SavedModelsModule {}
