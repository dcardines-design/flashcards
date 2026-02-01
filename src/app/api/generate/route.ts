import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcardsFromTopic } from '@/lib/openai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic, count = 10, context, multipleChoice = false } = body;

  if (!topic?.trim()) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  const cardCount = Math.min(Math.max(parseInt(count) || 10, 1), 20);

  try {
    const cards = await generateFlashcardsFromTopic(
      topic.trim(),
      cardCount,
      context?.trim() || undefined,
      multipleChoice
    );

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'Could not generate flashcards for this topic' },
        { status: 400 }
      );
    }

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
