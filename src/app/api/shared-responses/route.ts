import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    deck_id,
    participant_name,
    score,
    cards_reviewed,
    correct_count,
    wrong_count,
    best_streak,
    accuracy,
  } = body;

  if (!deck_id || !participant_name?.trim()) {
    return NextResponse.json(
      { error: 'Deck ID and participant name are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('shared_responses')
    .insert({
      deck_id,
      participant_name: participant_name.trim(),
      score: score || 0,
      cards_reviewed: cards_reviewed || 0,
      correct_count: correct_count || 0,
      wrong_count: wrong_count || 0,
      best_streak: best_streak || 0,
      accuracy: accuracy || 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving shared response:', error);
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const deckId = searchParams.get('deck_id');

  if (!deckId) {
    return NextResponse.json({ error: 'Deck ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('shared_responses')
    .select('*')
    .eq('deck_id', deckId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching shared responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }

  return NextResponse.json(data);
}
