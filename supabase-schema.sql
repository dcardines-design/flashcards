-- Flashcards App Database Schema
-- Run this in your Supabase SQL Editor

-- Decks table
CREATE TABLE IF NOT EXISTS decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  wrong_answers JSONB,
  times_correct INT DEFAULT 0,
  times_wrong INT DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study sessions for scoring
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  score INT DEFAULT 0,
  cards_reviewed INT DEFAULT 0,
  streak INT DEFAULT 0,
  accuracy DECIMAL(5,2),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared responses table (for tracking who answered shared decks)
CREATE TABLE IF NOT EXISTS shared_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  score INT DEFAULT 0,
  cards_reviewed INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  accuracy DECIMAL(5,2),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_id ON flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_deck_id ON study_sessions(deck_id);
CREATE INDEX IF NOT EXISTS idx_shared_responses_deck_id ON shared_responses(deck_id);

-- Migration: Add wrong_answers column if it doesn't exist
-- Run this if you already have the tables:
-- ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS wrong_answers JSONB;

-- Migration: Add shared_responses table
-- Run this if you already have the other tables:
-- CREATE TABLE IF NOT EXISTS shared_responses (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
--   participant_name TEXT NOT NULL,
--   score INT DEFAULT 0,
--   cards_reviewed INT DEFAULT 0,
--   correct_count INT DEFAULT 0,
--   wrong_count INT DEFAULT 0,
--   best_streak INT DEFAULT 0,
--   accuracy DECIMAL(5,2),
--   completed_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- CREATE INDEX IF NOT EXISTS idx_shared_responses_deck_id ON shared_responses(deck_id);
