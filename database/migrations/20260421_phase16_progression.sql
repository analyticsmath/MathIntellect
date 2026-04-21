-- Phase 16 progression persistence migration
-- Date: 2026-04-21

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user_progression (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_track VARCHAR(60) NOT NULL DEFAULT 'strategist',
  track_experience_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  skill_points INT NOT NULL DEFAULT 0,
  intelligence_rank INT NOT NULL DEFAULT 1,
  intelligence_rank_label VARCHAR(80) NOT NULL DEFAULT 'Analyst',
  unlocked_engines_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlocked_features_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  behavior_style VARCHAR(64) NOT NULL DEFAULT 'systems_planning',
  explanation_depth INT NOT NULL DEFAULT 1,
  visualization_richness INT NOT NULL DEFAULT 1,
  complexity_scale DOUBLE PRECISION NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_tree_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(120) NOT NULL UNIQUE,
  track VARCHAR(60) NOT NULL DEFAULT 'strategist',
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  unlock_level INT NOT NULL DEFAULT 1,
  engine_unlock VARCHAR(80),
  ai_style_modifier_json JSONB,
  ui_complexity_modifier DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progression_user_id
  ON user_progression(user_id);

CREATE INDEX IF NOT EXISTS idx_skill_tree_nodes_track_unlock_level
  ON skill_tree_nodes(track, unlock_level);
