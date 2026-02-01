import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const notConfigured = () =>
  NextResponse.json({ error: 'Database not configured' }, { status: 503 });

// POST add flashcard to deck
export async function POST(request: NextRequest) {
  if (!supabase) return notConfigured();

  const body = await request.json();
  const { deck_id, question, answer, wrong_answers } = body;

  if (!deck_id || !question?.trim() || !answer?.trim()) {
    return NextResponse.json(
      { error: 'deck_id, question, and answer are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('flashcards')
    .insert({
      deck_id,
      question: question.trim(),
      answer: answer.trim(),
      wrong_answers: wrong_answers || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT update flashcard content
export async function PUT(request: NextRequest) {
  if (!supabase) return notConfigured();

  const body = await request.json();
  const { id, question, answer, wrong_answers } = body;

  if (!id) {
    return NextResponse.json({ error: 'Flashcard ID is required' }, { status: 400 });
  }

  const updateData: { question?: string; answer?: string; wrong_answers?: string[] | null } = {};
  if (question !== undefined) updateData.question = question.trim();
  if (answer !== undefined) updateData.answer = answer.trim();
  if (wrong_answers !== undefined) updateData.wrong_answers = wrong_answers;

  const { data, error } = await supabase
    .from('flashcards')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH update flashcard stats
export async function PATCH(request: NextRequest) {
  if (!supabase) return notConfigured();

  const body = await request.json();
  const { id, correct } = body;

  if (!id || typeof correct !== 'boolean') {
    return NextResponse.json(
      { error: 'id and correct (boolean) are required' },
      { status: 400 }
    );
  }

  // Get current stats
  const { data: card, error: fetchError } = await supabase
    .from('flashcards')
    .select('times_correct, times_wrong')
    .eq('id', id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
  }

  // Update stats
  const { error: updateError } = await supabase
    .from('flashcards')
    .update({
      times_correct: correct ? card.times_correct + 1 : card.times_correct,
      times_wrong: correct ? card.times_wrong : card.times_wrong + 1,
      last_reviewed: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE flashcard
export async function DELETE(request: NextRequest) {
  if (!supabase) return notConfigured();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Flashcard ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
