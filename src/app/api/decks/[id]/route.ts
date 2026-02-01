import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const notConfigured = () =>
  NextResponse.json({ error: 'Database not configured' }, { status: 503 });

// GET single deck with all flashcards
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) return notConfigured();

  const { id } = await params;

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('*')
    .eq('id', id)
    .single();

  if (deckError) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
  }

  const { data: flashcards, error: cardsError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', id)
    .order('created_at', { ascending: true });

  if (cardsError) {
    return NextResponse.json({ error: cardsError.message }, { status: 500 });
  }

  // Get best session stats
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('score, accuracy, streak')
    .eq('deck_id', id)
    .order('score', { ascending: false })
    .limit(1);

  const bestSession = sessions?.[0] || null;

  return NextResponse.json({
    ...deck,
    flashcards,
    best_score: bestSession?.score || 0,
    best_accuracy: bestSession?.accuracy || 0,
    best_streak: bestSession?.streak || 0,
  });
}
