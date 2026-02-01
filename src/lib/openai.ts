import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractedCard {
  question: string;
  answer: string;
  wrongAnswers?: string[];
}

export async function extractFlashcards(
  content: string,
  multipleChoice: boolean = false
): Promise<ExtractedCard[]> {
  const mcInstructions = multipleChoice
    ? `\n- For each card, also generate exactly 3 plausible but incorrect answers in a "wrongAnswers" array
- Wrong answers should be believable but clearly incorrect
- Wrong answers should be similar in length and style to the correct answer`
    : '';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a flashcard extraction assistant. Given text content, extract meaningful question-answer pairs that would make good flashcards for studying.

Rules:
- Extract 5-15 flashcards depending on content length
- Questions should be clear and specific
- Answers should be concise but complete
- Focus on key concepts, definitions, and important facts
- Avoid overly broad or trivial questions${mcInstructions}

Return a JSON object with a "cards" array containing objects with "question", "answer"${multipleChoice ? ', and "wrongAnswers"' : ''} fields.`,
      },
      {
        role: 'user',
        content: `Extract flashcards from this content:\n\n${content}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 3000,
  });

  const result = response.choices[0].message.content;
  if (!result) return [];

  try {
    const parsed = JSON.parse(result);
    const cards = parsed.cards || parsed.flashcards || parsed;
    if (Array.isArray(cards)) {
      return cards.filter(
        (card: ExtractedCard) =>
          card.question && card.answer && typeof card.question === 'string' && typeof card.answer === 'string'
      );
    }
    return [];
  } catch {
    return [];
  }
}

export async function generateFlashcardsFromTopic(
  topic: string,
  count: number = 10,
  additionalContext?: string,
  multipleChoice: boolean = false
): Promise<ExtractedCard[]> {
  const mcInstructions = multipleChoice
    ? `\n- For each card, also generate exactly 3 plausible but incorrect answers in a "wrongAnswers" array
- Wrong answers should be believable but clearly incorrect to someone who knows the material
- Wrong answers should be similar in length and style to the correct answer
- Make wrong answers tricky enough to test real understanding`
    : '';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert flashcard creator. Generate high-quality flashcards for studying any topic.

Rules:
- Create exactly ${count} flashcards
- Questions should test understanding, not just memorization
- Mix different question types: definitions, concepts, applications, comparisons
- Answers should be concise (1-3 sentences) but complete
- Include the most important information about the topic
- Progress from basic to more advanced concepts${mcInstructions}

Return a JSON object with a "cards" array containing objects with "question", "answer"${multipleChoice ? ', and "wrongAnswers"' : ''} fields.`,
      },
      {
        role: 'user',
        content: additionalContext
          ? `Create ${count} flashcards about: ${topic}\n\nAdditional context/notes:\n${additionalContext}`
          : `Create ${count} flashcards about: ${topic}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 4000,
  });

  const result = response.choices[0].message.content;
  if (!result) return [];

  try {
    const parsed = JSON.parse(result);
    const cards = parsed.cards || parsed.flashcards || parsed;
    if (Array.isArray(cards)) {
      return cards.filter(
        (card: ExtractedCard) =>
          card.question && card.answer && typeof card.question === 'string' && typeof card.answer === 'string'
      );
    }
    return [];
  } catch {
    return [];
  }
}
