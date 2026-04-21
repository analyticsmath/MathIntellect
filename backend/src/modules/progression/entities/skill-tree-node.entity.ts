import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProgressionTrack } from '../progression.types';

@Entity('skill_tree_nodes')
export class SkillTreeNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 120 })
  key: string;

  @Column({
    type: 'varchar',
    length: 60,
    default: ProgressionTrack.STRATEGIST,
  })
  track: ProgressionTrack;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'unlock_level', type: 'int', default: 1 })
  unlockLevel: number;

  @Column({
    name: 'engine_unlock',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  engineUnlock: string | null;

  @Column({ name: 'ai_style_modifier_json', type: 'jsonb', nullable: true })
  aiStyleModifierJson: Record<string, unknown> | null;

  @Column({ name: 'ui_complexity_modifier', type: 'float', default: 0 })
  uiComplexityModifier: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
