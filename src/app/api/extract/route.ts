import { NextRequest, NextResponse } from 'next/server';
import { extractFlashcards } from '@/lib/openai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, multipleChoice = false } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  try {
    const cards = await extractFlashcards(content, multipleChoice);

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'Could not extract any flashcards from the content' },
        { status: 400 }
      );
    }

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('Extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract flashcards' },
      { status: 500 }
    );
  }
}
