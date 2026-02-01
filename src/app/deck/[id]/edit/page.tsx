'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Send,
} from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  wrong_answers: string[] | null;
}

interface DeckData {
  id: string;
  title: string;
  description: string | null;
  flashcards: Flashcard[];
}

export default function EditDeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [newCards, setNewCards] = useState<{ question: string; answer: string; wrong_answers: string[] }[]>([]);

  // AI Chat state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [cardCount, setCardCount] = useState(5);
  const [multipleChoice, setMultipleChoice] = useState(false);

  useEffect(() => {
    fetchDeck();
  }, [id]);

  const fetchDeck = async () => {
    try {
      const res = await fetch(`/api/decks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDeck(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setCards(data.flashcards || []);
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);

    try {
      // Update deck info
      await fetch(`/api/decks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
        }),
      });

      // Update existing cards
      for (const card of cards) {
        await fetch('/api/flashcards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: card.id,
            question: card.question,
            answer: card.answer,
            wrong_answers: card.wrong_answers,
          }),
        });
      }

      // Add new cards
      for (const card of newCards) {
        if (card.question.trim() && card.answer.trim()) {
          await fetch('/api/flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deck_id: id,
              question: card.question.trim(),
              answer: card.answer.trim(),
              wrong_answers: card.wrong_answers.filter(w => w.trim()) || null,
            }),
          });
        }
      }

      router.push(`/deck/${id}`);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('Delete this card?')) return;

    try {
      await fetch(`/api/flashcards?id=${cardId}`, { method: 'DELETE' });
      setCards(cards.filter(c => c.id !== cardId));
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const addNewCard = () => {
    setNewCards([...newCards, { question: '', answer: '', wrong_answers: ['', '', ''] }]);
  };

  const updateNewCard = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...newCards];
    updated[index] = { ...updated[index], [field]: value };
    setNewCards(updated);
  };

  const removeNewCard = (index: number) => {
    setNewCards(newCards.filter((_, i) => i !== index));
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || aiGenerating) return;
    setAiGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt.trim(),
          count: cardCount,
          multipleChoice,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          const generatedCards = data.cards.map((card: { question: string; answer: string; wrongAnswers?: string[] }) => ({
            question: card.question,
            answer: card.answer,
            wrong_answers: card.wrongAnswers || ['', '', ''],
          }));
          setNewCards([...newCards, ...generatedCards]);
          setAiPrompt('');
        }
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 mb-4">Deck not found</p>
        <Link href="/" className="text-emerald-400 font-medium hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/deck/${id}`}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <h1 className="text-xl font-bold text-white">Edit Deck</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>
      </div>

      {/* Deck Info */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Deck title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            placeholder="Deck description"
          />
        </div>
      </div>

      {/* AI Generate Section */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">AI Generate</h2>
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-400">Cards:</label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              {[3, 5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={multipleChoice}
              onChange={(e) => setMultipleChoice(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
            />
            <span className="text-sm text-zinc-400">Multiple Choice</span>
          </label>
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="Describe what cards to generate..."
            className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={handleAiGenerate}
            disabled={!aiPrompt.trim() || aiGenerating}
            className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {aiGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-600 mt-2">
          e.g. "Add more questions about photosynthesis" or "Generate harder questions"
        </p>
      </div>

      {/* Existing Cards */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-3">
          Cards ({cards.length})
        </h2>
        <div className="space-y-3">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="text-zinc-600 mt-3">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={card.question}
                      onChange={(e) => updateCard(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      Answer
                    </label>
                    <input
                      type="text"
                      value={card.answer}
                      onChange={(e) => updateCard(index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Cards */}
      {newCards.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">
            New Cards ({newCards.length})
          </h2>
          <div className="space-y-3">
            {newCards.map((card, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-xl border border-emerald-500/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="text-zinc-600 mt-3">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={card.question}
                        onChange={(e) => updateNewCard(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Enter question"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">
                        Answer
                      </label>
                      <input
                        type="text"
                        value={card.answer}
                        onChange={(e) => updateNewCard(index, 'answer', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Enter answer"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeNewCard(index)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Card Button */}
      <button
        onClick={addNewCard}
        className="w-full py-3 px-4 border-2 border-dashed border-zinc-700 text-zinc-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Card
      </button>
    </div>
  );
}
