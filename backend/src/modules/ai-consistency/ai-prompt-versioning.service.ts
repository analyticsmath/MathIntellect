import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

export const PROMPT_VERSION_LOCK = 'v3.2-lock';

@Injectable()
export class AiPromptVersioningService {
  getCurrentVersion(): string {
    return PROMPT_VERSION_LOCK;
  }

  getRegistry(): Array<{ version: string; releasedAt: string; lock: true }> {
    return [
      {
        version: PROMPT_VERSION_LOCK,
        releasedAt: '2026-04-20',
        lock: true,
      },
    ];
  }

  // Phase 6 lock: only this exact version is accepted.
  isCacheCompatible(cachedVersion: string): boolean {
    return cachedVersion === PROMPT_VERSION_LOCK;
  }

  buildInputHash(
    simulationInput: Record<string, unknown>,
    engineType: string,
    version = PROMPT_VERSION_LOCK,
  ): string {
    const payload = {
      engine_type: engineType,
      prompt_version: version,
      simulation_input: simulationInput,
    };

    const stable = JSON.stringify(this.sort(payload));
    return createHash('sha256').update(stable).digest('hex');
  }

  buildCacheKey(
    simulationInput: Record<string, unknown>,
    engineType: string,
    version = PROMPT_VERSION_LOCK,
  ): string {
    return this.buildInputHash(simulationInput, engineType, version);
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
