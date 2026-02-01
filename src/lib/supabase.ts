import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if valid credentials are provided
let supabase: SupabaseClient | null = null;

// Check for valid URL (must start with http:// or https://)
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

if (isValidUrl && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Types
export interface Deck {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  card_count?: number;
  progress?: number;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  question: string;
  answer: string;
  wrong_answers: string[] | null;
  times_correct: number;
  times_wrong: number;
  last_reviewed: string | null;
  created_at: string;
}

export interface StudySession {
  id: string;
  deck_id: string;
  score: number;
  cards_reviewed: number;
  streak: number;
  accuracy: number;
  completed_at: string;
}
