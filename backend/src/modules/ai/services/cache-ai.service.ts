import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class CacheAiService {
  private static readonly DEFAULT_TTL_MS = 24 * 60 * 60 * 1_000;
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs = CacheAiService.DEFAULT_TTL_MS): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  buildSimulationKey(
    kind: 'insight' | 'decision' | 'explain',
    simulationId: string,
    promptVersion: string,
  ): string {
    return `${kind}:${simulationId}:${promptVersion}`;
  }

  buildCoachKey(
    userId: string,
    simulationScope: string,
    promptVersion: string,
  ): string {
    return `coach:${userId}:${simulationScope}:${promptVersion}`;
  }

  buildComparisonKey(simulationIds: string[], promptVersion: string): string {
    const stableIds = [...simulationIds].sort().join('|');
    return `compare:${promptVersion}:${stableIds}`;
  }
}
