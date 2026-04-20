import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('simulation_replays')
export class SimulationReplay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'simulation_id', type: 'uuid' })
  simulationId: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  // Legacy field kept for compatibility
  @Column({ name: 'simulation_type', type: 'varchar', length: 64 })
  simulationType: string;

  // Phase 6 canonical engine identity
  @Index()
  @Column({ name: 'engine_type', type: 'varchar', length: 64, nullable: true })
  engineType: string | null;

  @Column({ name: 'seed', type: 'bigint' })
  seed: string;

  @Column({ name: 'deterministic_mode', type: 'boolean', default: true })
  deterministicMode: boolean;

  @Column({ name: 'deterministic_options', type: 'jsonb', nullable: true })
  deterministicOptions: Record<string, unknown> | null;

  @Column({ name: 'engine_version', type: 'varchar', length: 32, default: '1.0.0' })
  engineVersion: string;

  @Column({ name: 'prompt_version', type: 'varchar', length: 32, default: 'v3.2-lock' })
  promptVersion: string;

  @Column({ name: 'parameter_hash', type: 'varchar', length: 128 })
  parameterHash: string;

  // Phase 6 required snapshot
  @Column({ name: 'input_parameters_snapshot', type: 'jsonb', default: '{}' })
  inputParametersSnapshot: Record<string, unknown>;

  // Legacy field retained
  @Column({ name: 'effective_parameters', type: 'jsonb', default: '{}' })
  effectiveParameters: Record<string, unknown>;

  @Column({ name: 'user_state_snapshot', type: 'jsonb', nullable: true })
  userStateSnapshot: Record<string, unknown> | null;

  // Phase 6 canonical execution trace
  @Column({ name: 'execution_steps', type: 'jsonb', nullable: true })
  executionSteps: Record<string, unknown>[] | null;

  // Legacy field retained
  @Column({ name: 'replay_steps', type: 'jsonb', nullable: true })
  replaySteps: Record<string, unknown>[] | null;

  // Phase 6 final output hash
  @Column({ name: 'final_output_hash', type: 'varchar', length: 128, nullable: true })
  finalOutputHash: string | null;

  // Legacy field retained
  @Column({ name: 'checksum', type: 'varchar', length: 64, nullable: true })
  checksum: string | null;

  @Column({ name: 'original_output', type: 'jsonb', nullable: true })
  originalOutput: Record<string, unknown> | null;

  @Column({ name: 'original_output_size', type: 'int', nullable: true })
  originalOutputSize: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
