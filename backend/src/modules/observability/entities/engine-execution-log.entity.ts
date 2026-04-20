import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('engine_execution_logs')
export class EngineExecutionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Index()
  @Column({ name: 'engine_type', length: 64 })
  engineType: string;

  @Column({ name: 'execution_time_ms', type: 'int' })
  executionTimeMs: number;

  @Column({ name: 'ai_response_time_ms', type: 'int', nullable: true })
  aiResponseTimeMs: number | null;

  @Column({ name: 'status', length: 32, default: 'completed' })
  status: string;

  @Column({ name: 'success', type: 'boolean', default: true })
  success: boolean;

  @Column({ name: 'fallback_used', type: 'boolean', default: false })
  fallbackUsed: boolean;

  @Column({ name: 'input_size_bytes', type: 'int', nullable: true })
  inputSizeBytes: number | null;

  @Column({ name: 'output_size_bytes', type: 'int', nullable: true })
  outputSizeBytes: number | null;

  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason: string | null;

  @Column({ name: 'memory_estimate_kb', type: 'int', nullable: true })
  memoryEstimateKb: number | null;

  @Column({ name: 'iteration_count', type: 'int', nullable: true })
  iterationCount: number | null;

  @Column({ name: 'safety_triggered', type: 'boolean', default: false })
  safetyTriggered: boolean;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
