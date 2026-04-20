import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { SimulationReplay } from './entities/simulation-replay.entity';

export const ENGINE_VERSION = '1.0.0';
export const PROMPT_VERSION_LOCK = 'v3.2-lock';

export interface SnapshotInput {
  simulationId: string;
  userId?: string;
  simulationType: string;
  engineType?: string;
  seed: number | string;
  inputParametersSnapshot: Record<string, unknown>;
  effectiveParameters?: Record<string, unknown>;
  userStateSnapshot?: Record<string, unknown>;
  deterministicMode?: boolean;
}

export interface SnapshotFinalizeInput {
  simulationId: string;
  executionSteps: Array<unknown>;
  finalOutput: Record<string, unknown>;
  promptVersion?: string;
}

@Injectable()
export class SimulationSnapshotService {
  private readonly logger = new Logger(SimulationSnapshotService.name);

  constructor(
    @InjectRepository(SimulationReplay)
    private readonly replayRepo: Repository<SimulationReplay>,
  ) {}

  hashParameters(params: Record<string, unknown>): string {
    return this.hashPayload(params).slice(0, 64);
  }

  hashPayload(payload: unknown): string {
    const stable = this.stableStringify(payload);
    return createHash('sha256').update(stable).digest('hex');
  }

  normalizeOutputForHash(payload: unknown): unknown {
    if (Array.isArray(payload)) {
      return payload.map((item) => this.normalizeOutputForHash(item));
    }

    if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;
      const normalized: Record<string, unknown> = {};

      for (const key of Object.keys(obj).sort()) {
        // Runtime-only fields are excluded from deterministic hash checks.
        if (
          key === 'executionTimeMs' ||
          key === 'timestamp' ||
          key === 'createdAt' ||
          key === 'updatedAt'
        ) {
          continue;
        }
        normalized[key] = this.normalizeOutputForHash(obj[key]);
      }

      return normalized;
    }

    return payload;
  }

  estimateSizeBytes(payload: unknown): number {
    return Buffer.byteLength(this.stableStringify(payload), 'utf8');
  }

  generateSeed(input: {
    simulationId?: string;
    userId?: string;
    simulationType?: string;
    parameters?: Record<string, unknown>;
  }): number {
    const seedSource = {
      simulationId: input.simulationId ?? 'unknown-sim',
      userId: input.userId ?? 'anonymous',
      simulationType: input.simulationType ?? 'custom',
      parameters: input.parameters ?? {},
    };

    const hash = this.hashPayload(seedSource);
    // Use first 8 hex chars -> uint32
    const seed = parseInt(hash.slice(0, 8), 16) >>> 0;
    return seed || 42;
  }

  buildDeterministicOptions(seed: number | string): {
    deterministic: true;
    seed: string;
  } {
    return {
      deterministic: true,
      seed: String(seed),
    };
  }

  async snapshot(input: SnapshotInput): Promise<SimulationReplay> {
    const parameterHash = this.hashParameters(input.inputParametersSnapshot);

    const values: Partial<SimulationReplay> = {
      simulationId: input.simulationId,
      userId: input.userId ?? null,
      simulationType: input.simulationType,
      engineType: input.engineType ?? input.simulationType,
      seed: String(input.seed),
      deterministicMode: input.deterministicMode ?? true,
      deterministicOptions: this.buildDeterministicOptions(input.seed),
      engineVersion: ENGINE_VERSION,
      promptVersion: PROMPT_VERSION_LOCK,
      parameterHash,
      inputParametersSnapshot: input.inputParametersSnapshot,
      effectiveParameters:
        input.effectiveParameters ?? input.inputParametersSnapshot,
      userStateSnapshot: input.userStateSnapshot ?? null,
    };

    try {
      const existing = await this.replayRepo.findOne({
        where: { simulationId: input.simulationId },
      });

      if (existing) {
        Object.assign(existing, values);
        return await this.replayRepo.save(existing);
      }

      return await this.replayRepo.save(this.replayRepo.create(values));
    } catch (err) {
      this.logger.warn(
        `Snapshot save failed for simulation ${input.simulationId}: ${(err as Error).message}`,
      );

      return this.replayRepo.create(values);
    }
  }

  async finalizeSnapshot(input: SnapshotFinalizeInput): Promise<void> {
    try {
      const existing = await this.replayRepo.findOne({
        where: { simulationId: input.simulationId },
      });

      if (!existing) {
        return;
      }

      const normalizedOutput = this.normalizeOutputForHash(input.finalOutput);
      const finalOutputHash = this.hashPayload(normalizedOutput);

      existing.executionSteps = input.executionSteps as Record<
        string,
        unknown
      >[];
      existing.replaySteps = input.executionSteps as Record<string, unknown>[];
      existing.finalOutputHash = finalOutputHash;
      existing.checksum = finalOutputHash.slice(0, 64);
      existing.originalOutput = input.finalOutput;
      existing.originalOutputSize = this.estimateSizeBytes(input.finalOutput);
      existing.promptVersion = input.promptVersion ?? PROMPT_VERSION_LOCK;

      await this.replayRepo.save(existing);
    } catch (err) {
      this.logger.warn(
        `Snapshot finalize failed for simulation ${input.simulationId}: ${(err as Error).message}`,
      );
    }
  }

  async findBySimulation(
    simulationId: string,
  ): Promise<SimulationReplay | null> {
    return this.replayRepo.findOne({ where: { simulationId } });
  }

  async findAll(limit = 50): Promise<SimulationReplay[]> {
    return this.replayRepo.find({ order: { createdAt: 'DESC' }, take: limit });
  }

  private stableStringify(value: unknown): string {
    return JSON.stringify(this.sort(value));
  }

  private sort(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((entry) => this.sort(entry));
    }

    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const sorted: Record<string, unknown> = {};
      for (const key of Object.keys(obj).sort()) {
        sorted[key] = this.sort(obj[key]);
      }
      return sorted;
    }

    return value;
  }
}
