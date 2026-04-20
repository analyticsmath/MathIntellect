import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';

export interface CreateResultDto {
  simulationId: string;
  outcomeData: Record<string, unknown>;
  executionTime?: number;
}

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private readonly resultsRepo: Repository<Result>,
  ) {}

  async create(dto: CreateResultDto): Promise<Result> {
    const result = this.resultsRepo.create(dto);
    return this.resultsRepo.save(result);
  }

  async findBySimulation(simulationId: string): Promise<Result[]> {
    return this.resultsRepo.find({
      where: { simulationId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Result> {
    const result = await this.resultsRepo.findOne({ where: { id } });
    if (!result) throw new NotFoundException(`Result ${id} not found`);
    return result;
  }
}
