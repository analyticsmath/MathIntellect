import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { AiReasoningCache } from './entities/ai-reasoning-cache.entity';
import {
  AiPromptVersioningService,
  PROMPT_VERSION_LOCK,
} from './ai-prompt-versioning.service';

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

type CacheSource =
  | 'cache'
  | 'openai'
  | 'deterministic_fallback'
  | 'static_safe_template';

export interface AiConsistencyRecord {
  cacheKey: string;
  inputHash: string;
  promptVersion: string;
  engineType: string;
  simulationId: string | null;
  responsePayload: Record<string, unknown>;
  reasoningSteps: string[];
  tokenUsage: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  } | null;
  source: CacheSource;
  timestamp: string;
  latencyMs: number | null;
}

export interface AiCacheStats {
  lookups: number;
  hits: number;
  misses: number;
  hitRate: number;
}

const DETERMINISTIC_FALLBACKS: Record<string, AiConsistencyRecord['responsePayload']> = {
  monte_carlo: {
    insight:
      'Deterministic fallback: variance sensitivity detected. Treat tails as first-class constraints.',
    recommendation:
      'Run controlled stress scenarios and validate p5/p95 stability before escalation.',
    confidence_score: 62,
  },
  game_theory: {
    insight:
      'Deterministic fallback: strategic equilibrium uncertainty remains elevated.',
    recommendation:
      'Compare cooperative and defensive profiles across repeated rounds.',
    confidence_score: 61,
  },
  market: {
    insight:
      'Deterministic fallback: drawdown-risk balance needs tighter controls under volatility drift.',
    recommendation:
      'Lower leverage and re-test with regime shocks before committing capital.',
    confidence_score: 60,
  },
  conflict: {
    insight:
      'Deterministic fallback: alliance stability is sensitive to betrayal thresholds.',
    recommendation:
      'Tune trust decay and repeat with narrower perturbations.',
    confidence_score: 59,
  },
};

@Injectable()
export class AiConsistencyLockService {
  private readonly logger = new Logger(AiConsistencyLockService.name);

  private readonly memoryCache = new Map<
    string,
    { payload: AiConsistencyRecord; expiresAt: number }
  >();

  private lookups = 0;
  private hits = 0;

  constructor(
    @InjectRepository(AiReasoningCache)
    private readonly cacheRepo: Repository<AiReasoningCache>,
    private readonly promptVersioning: AiPromptVersioningService,
  ) {}

  async get(
    simulationInput: Record<string, unknown>,
    engineType: string,
  ): Promise<AiConsistencyRecord | null> {
    this.lookups += 1;

    const cacheKey = this.promptVersioning.buildCacheKey(
      simulationInput,
      engineType,
      PROMPT_VERSION_LOCK,
    );

    const mem = this.memoryCache.get(cacheKey);
    if (mem && mem.expiresAt > Date.now()) {
      this.hits += 1;
      return {
        ...mem.payload,
        source: 'cache',
      };
    }

    try {
      const entry = await this.cacheRepo.findOne({ where: { cacheKey } });
      if (!entry) {
        return null;
      }

      if (entry.expiresAt < new Date()) {
        void this.cacheRepo.delete({ cacheKey });
        return null;
      }

      if (!this.promptVersioning.isCacheCompatible(entry.promptVersion)) {
        this.logger.warn(
          `Cache entry ${cacheKey} uses incompatible prompt version ${entry.promptVersion}, evicting`,
        );
        void this.cacheRepo.delete({ cacheKey });
        return null;
      }

      const payload: AiConsistencyRecord = {
        cacheKey,
        inputHash: entry.inputHash,
        simulationId: entry.simulationId,
        promptVersion: entry.promptVersion,
        engineType: entry.engineType,
        responsePayload: entry.responsePayload,
        reasoningSteps: entry.reasoningSteps ?? [],
        tokenUsage: entry.tokenUsage,
        source: 'cache',
        timestamp: entry.createdAt.toISOString(),
        latencyMs: entry.latencyMs,
      };

      this.memoryCache.set(cacheKey, {
        payload,
        expiresAt: entry.expiresAt.getTime(),
      });
      this.hits += 1;

      return payload;
    } catch (err) {
      this.logger.warn(`Cache read failed for ${cacheKey}: ${(err as Error).message}`);
      return null;
    }
  }

  async set(input: {
    simulationId?: string | null;
    simulationInput: Record<string, unknown>;
    engineType: string;
    responsePayload: Record<string, unknown>;
    reasoningSteps?: string[];
    tokenUsage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
    source?: Exclude<CacheSource, 'cache'>;
    latencyMs?: number;
  }): Promise<AiConsistencyRecord> {
    const source = input.source ?? 'openai';
    const promptVersion = PROMPT_VERSION_LOCK;
    const inputHash = this.promptVersioning.buildInputHash(
      input.simulationInput,
      input.engineType,
      promptVersion,
    );
    const cacheKey = inputHash;
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS);
    const record: AiConsistencyRecord = {
      cacheKey,
      inputHash,
      simulationId: input.simulationId ?? null,
      promptVersion,
      engineType: input.engineType,
      responsePayload: input.responsePayload,
      reasoningSteps: input.reasoningSteps ?? [],
      tokenUsage: input.tokenUsage ?? null,
      source,
      timestamp: new Date().toISOString(),
      latencyMs: input.latencyMs ?? null,
    };

    this.memoryCache.set(cacheKey, {
      payload: record,
      expiresAt: expiresAt.getTime(),
    });

    try {
      const existing = await this.cacheRepo.findOne({ where: { cacheKey } });
      if (existing) {
        existing.inputHash = inputHash;
        existing.simulationId = input.simulationId ?? null;
        existing.promptVersion = promptVersion;
        existing.engineType = input.engineType;
        existing.responsePayload = input.responsePayload;
        existing.reasoningSteps = input.reasoningSteps ?? null;
        existing.tokenUsage = input.tokenUsage ?? null;
        existing.source = source;
        existing.latencyMs = input.latencyMs ?? null;
        existing.expiresAt = expiresAt;
        await this.cacheRepo.save(existing);
      } else {
        await this.cacheRepo.save(
          this.cacheRepo.create({
            cacheKey,
            inputHash,
            simulationId: input.simulationId ?? null,
            promptVersion,
            engineType: input.engineType,
            responsePayload: input.responsePayload,
            reasoningSteps: input.reasoningSteps ?? null,
            tokenUsage: input.tokenUsage ?? null,
            source,
            latencyMs: input.latencyMs ?? null,
            expiresAt,
          }),
        );
      }
    } catch (err) {
      this.logger.warn(`Cache write failed for ${cacheKey}: ${(err as Error).message}`);
    }

    return record;
  }

  getDeterministicFallback(engineType: string): AiConsistencyRecord {
    const responsePayload = DETERMINISTIC_FALLBACKS[engineType] ?? {
      insight:
        'Deterministic fallback: analysis completed with conservative assumptions.',
      recommendation: 'Use narrower parameters and replay for verification.',
      confidence_score: 55,
    };

    return {
      cacheKey: 'deterministic-fallback',
      inputHash: 'deterministic-fallback',
      simulationId: null,
      promptVersion: PROMPT_VERSION_LOCK,
      engineType,
      responsePayload,
      reasoningSteps: [
        'OpenAI response unavailable or invalid.',
        'Deterministic fallback engine selected to preserve consistency.',
      ],
      tokenUsage: null,
      source: 'deterministic_fallback',
      timestamp: new Date().toISOString(),
      latencyMs: null,
    };
  }

  getStaticSafeTemplate(engineType: string): AiConsistencyRecord {
    return {
      cacheKey: 'static-safe-template',
      inputHash: 'static-safe-template',
      simulationId: null,
      promptVersion: PROMPT_VERSION_LOCK,
      engineType,
      responsePayload: {
        summary:
          'Static safe template engaged. Core metrics are within bounded ranges, but deeper AI reasoning is temporarily unavailable.',
        recommendation:
          'Proceed with incremental validation and replay before making irreversible decisions.',
        confidence_score: 50,
      },
      reasoningSteps: [
        'Deterministic fallback unavailable or failed validation.',
        'Static safe template returned to guarantee a stable response contract.',
      ],
      tokenUsage: null,
      source: 'static_safe_template',
      timestamp: new Date().toISOString(),
      latencyMs: null,
    };
  }

  getStats(): AiCacheStats {
    const misses = Math.max(0, this.lookups - this.hits);
    return {
      lookups: this.lookups,
      hits: this.hits,
      misses,
      hitRate: this.lookups > 0 ? this.hits / this.lookups : 0,
    };
  }

  async purgeExpired(): Promise<number> {
    try {
      const result = await this.cacheRepo.delete({ expiresAt: LessThan(new Date()) });
      return result.affected ?? 0;
    } catch {
      return 0;
    }
  }
}
