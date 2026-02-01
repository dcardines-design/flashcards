import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const notConfigured = () =>
  NextResponse.json({ error: 'Database not configured' }, { status: 503 });

// POST create study session
export async function POST(request: NextRequest) {
  if (!supabase) return notConfigured();

  const body = await request.json();
  const { deck_id, score, cards_reviewed, streak, accuracy } = body;

  if (!deck_id || typeof score !== 'number' || typeof cards_reviewed !== 'number') {
    return NextResponse.json(
      { error: 'deck_id, score, and cards_reviewed are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      deck_id,
      score,
      cards_reviewed,
      streak: streak || 0,
      accuracy: accuracy || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// GET sessions for a deck
export async function GET(request: NextRequest) {
  if (!supabase) return notConfigured();

  const { searchParams } = new URL(request.url);
  const deckId = searchParams.get('deck_id');

  if (!deckId) {
    return NextResponse.json({ error: 'deck_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('deck_id', deckId)
    .order('completed_at', { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
