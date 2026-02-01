import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const notConfigured = () =>
  NextResponse.json({ error: 'Database not configured' }, { status: 503 });

// GET all decks with card counts
export async function GET() {
  if (!supabase) return notConfigured();

  const { data: decks, error } = await supabase
    .from('decks')
    .select(`
      *,
      flashcards:flashcards(count),
      sessions:study_sessions(score, accuracy)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Calculate card count and progress for each deck
  const decksWithStats = decks.map((deck) => {
    const cardCount = deck.flashcards?.[0]?.count || 0;
    const sessions = deck.sessions || [];
    const bestAccuracy = sessions.length > 0
      ? Math.max(...sessions.map((s: { accuracy: number }) => s.accuracy || 0))
      : 0;

    return {
      ...deck,
      card_count: cardCount,
      progress: Math.round(bestAccuracy),
      flashcards: undefined,
      sessions: undefined,
    };
  });

  return NextResponse.json(decksWithStats);
}

// POST create new deck
export async function POST(request: NextRequest) {
  if (!supabase) return notConfigured();

  const body = await request.json();
  const { title, description, cards } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  // Create deck
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .insert({ title: title.trim(), description: description?.trim() || null })
    .select()
    .single();

  if (deckError) {
    return NextResponse.json({ error: deckError.message }, { status: 500 });
  }

  // Create flashcards if provided
  if (cards && Array.isArray(cards) && cards.length > 0) {
    const flashcards = cards.map((card: { question: string; answer: string; wrongAnswers?: string[] }) => ({
      deck_id: deck.id,
      question: card.question,
      answer: card.answer,
      wrong_answers: card.wrongAnswers || null,
    }));

    const { error: cardsError } = await supabase
      .from('flashcards')
      .insert(flashcards);

    if (cardsError) {
      // Rollback deck creation
      await supabase.from('decks').delete().eq('id', deck.id);
      return NextResponse.json({ error: cardsError.message }, { status: 500 });
    }
  }

  return NextResponse.json(deck, { status: 201 });
}

// DELETE deck
export async function DELETE(request: NextRequest) {
  if (!supabase) return notConfigured();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Deck ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('decks')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
