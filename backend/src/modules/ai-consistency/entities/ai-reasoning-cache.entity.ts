import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ai_reasoning_cache')
export class AiReasoningCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'cache_key', type: 'varchar', length: 256 })
  cacheKey: string;

  @Index()
  @Column({ name: 'input_hash', type: 'varchar', length: 128 })
  inputHash: string;

  @Column({ name: 'simulation_id', type: 'uuid', nullable: true })
  simulationId: string | null;

  @Column({ name: 'prompt_version', type: 'varchar', length: 32 })
  promptVersion: string;

  @Column({ name: 'engine_type', type: 'varchar', length: 64 })
  engineType: string;

  @Column({ name: 'response_payload', type: 'jsonb' })
  responsePayload: Record<string, unknown>;

  @Column({ name: 'reasoning_steps', type: 'jsonb', nullable: true })
  reasoningSteps: string[] | null;

  @Column({ name: 'token_usage', type: 'jsonb', nullable: true })
  tokenUsage: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  } | null;

  @Column({ name: 'source', type: 'varchar', length: 48, default: 'openai' })
  source: 'cache' | 'openai' | 'deterministic_fallback' | 'static_safe_template';

  @Column({ name: 'latency_ms', type: 'int', nullable: true })
  latencyMs: number | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
