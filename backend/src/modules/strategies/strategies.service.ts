import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy } from './entities/strategy.entity';
import { CreateStrategyDto } from './dto/create-strategy.dto';

@Injectable()
export class StrategiesService {
  constructor(
    @InjectRepository(Strategy)
    private readonly strategiesRepo: Repository<Strategy>,
  ) {}

  async create(dto: CreateStrategyDto): Promise<Strategy> {
    const strategy = this.strategiesRepo.create(dto);
    return this.strategiesRepo.save(strategy);
  }

  async findBySimulation(simulationId: string): Promise<Strategy[]> {
    return this.strategiesRepo.find({
      where: { simulationId },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<Strategy> {
    const strategy = await this.strategiesRepo.findOne({ where: { id } });
    if (!strategy) throw new NotFoundException(`Strategy ${id} not found`);
    return strategy;
  }

  async remove(id: string): Promise<void> {
    const strategy = await this.findById(id);
    await this.strategiesRepo.remove(strategy);
  }
}
