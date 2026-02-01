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
      sessions:study_sessions(score, accuracy),
      shared_responses:shared_responses(participant_name, score, accuracy, time_seconds)
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

    // Find best performer from shared responses
    const responses = deck.shared_responses || [];
    let bestPerformer = null;
    let bestTime = null;

    if (responses.length > 0) {
      // Best score performer
      const bestScoreResponse = responses.reduce((best: { score: number; participant_name: string } | null, r: { score: number; participant_name: string }) =>
        !best || r.score > best.score ? r : best
      , null);

      if (bestScoreResponse) {
        bestPerformer = {
          name: bestScoreResponse.participant_name,
          score: bestScoreResponse.score,
        };
      }

      // Best time (fastest with time > 0)
      const responsesWithTime = responses.filter((r: { time_seconds: number }) => r.time_seconds > 0);
      if (responsesWithTime.length > 0) {
        const fastestResponse = responsesWithTime.reduce((best: { time_seconds: number; participant_name: string } | null, r: { time_seconds: number; participant_name: string }) =>
          !best || r.time_seconds < best.time_seconds ? r : best
        , null);

        if (fastestResponse) {
          bestTime = {
            name: fastestResponse.participant_name,
            seconds: fastestResponse.time_seconds,
          };
        }
      }
    }

    return {
      ...deck,
      card_count: cardCount,
      progress: Math.round(bestAccuracy),
      best_performer: bestPerformer,
      best_time: bestTime,
      flashcards: undefined,
      sessions: undefined,
      shared_responses: undefined,
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
