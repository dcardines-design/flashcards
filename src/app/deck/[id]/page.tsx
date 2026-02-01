'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Flame,
  Target,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import FlashCard from '@/components/FlashCard';
import { Flashcard } from '@/lib/supabase';

interface DeckData {
  id: string;
  title: string;
  description: string | null;
  flashcards: Flashcard[];
  best_score: number;
  best_accuracy: number;
  best_streak: number;
}

export default function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied!');
  };

  useEffect(() => {
    fetchDeck();
  }, [id]);

  const fetchDeck = async () => {
    try {
      const res = await fetch(`/api/decks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDeck(data);
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleCorrect = async () => {
    const card = deck?.flashcards[currentIndex];
    if (!card) return;

    await fetch('/api/flashcards', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: card.id, correct: true }),
    });

    const newStreak = streak + 1;
    const streakBonus = newStreak >= 3 ? 5 : 0;
    const points = 10 + streakBonus;

    setScore(score + points);
    setStreak(newStreak);
    setMaxStreak(Math.max(maxStreak, newStreak));
    setCorrect(correct + 1);

    nextCard();
  };

  const handleWrong = async () => {
    const card = deck?.flashcards[currentIndex];
    if (!card) return;

    await fetch('/api/flashcards', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: card.id, correct: false }),
    });

    setStreak(0);
    setWrong(wrong + 1);

    nextCard();
  };

  const nextCard = () => {
    if (deck && currentIndex >= deck.flashcards.length - 1) {
      setIsComplete(true);
      saveSession();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const saveSession = async () => {
    if (!deck || sessionSaved) return;

    const total = correct + wrong + 1;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deck_id: deck.id,
        score,
        cards_reviewed: total,
        streak: maxStreak,
        accuracy,
      }),
    });

    setSessionSaved(true);
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrect(0);
    setWrong(0);
    setIsComplete(false);
    setSessionSaved(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!deck || deck.flashcards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 mb-4">No cards in this deck</p>
        <Link
          href="/"
          className="text-emerald-400 font-medium hover:underline"
        >
          Go back
        </Link>
      </div>
    );
  }

  const totalCards = deck.flashcards.length;
  const progress = ((currentIndex + 1) / totalCards) * 100;
  const accuracy =
    correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  // Complete screen
  if (isComplete) {
    const finalAccuracy =
      correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    const isNewBest = score > deck.best_score;

    return (
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <h1 className="text-xl font-bold text-white">{deck.title}</h1>
        </div>

        {/* Complete Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white text-center mb-6">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
          <p className="text-white/80">
            You reviewed all {totalCards} cards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">{score}</p>
            <p className="text-xs text-zinc-500">Points</p>
            {isNewBest && (
              <span className="text-xs text-green-400 font-medium">
                New Best!
              </span>
            )}
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">{maxStreak}</p>
            <p className="text-xs text-zinc-500">Best Streak</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <Target className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">{finalAccuracy}%</p>
            <p className="text-xs text-zinc-500">Accuracy</p>
          </div>
        </div>

        {/* Results breakdown */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-400">Correct</span>
            <span className="font-medium text-green-400">{correct}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Still Learning</span>
            <span className="font-medium text-orange-400">{wrong}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={restartSession}
            className="w-full py-3.5 px-4 bg-emerald-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Study Again
          </button>
          <button
            onClick={copyShareLink}
            className="w-full py-3.5 px-4 bg-zinc-800 text-zinc-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share Deck
          </button>
          <Link
            href={`/deck/${id}/responses`}
            className="block w-full py-3.5 px-4 bg-zinc-800 text-zinc-300 rounded-xl font-medium text-center hover:bg-zinc-700 transition-colors"
          >
            View Shared Responses
          </Link>
          <Link
            href="/"
            className="block w-full py-3.5 px-4 bg-zinc-800/50 text-zinc-400 rounded-xl font-medium text-center hover:bg-zinc-700/50 transition-colors"
          >
            Back to Decks
          </Link>
        </div>
      </div>
    );
  }

  // Study view
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/"
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white line-clamp-1">
            {deck.title}
          </h1>
        </div>
        <button
          onClick={copyShareLink}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          title="Share deck"
        >
          <Share2 className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card counter and stats */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <span className="text-zinc-500">
          {currentIndex + 1} / {totalCards}
        </span>
        <div className="flex items-center gap-4">
          {streak >= 3 && (
            <div className="flex items-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" />
              <span className="font-medium">{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-emerald-400">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">{score}</span>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <FlashCard
        question={deck.flashcards[currentIndex].question}
        answer={deck.flashcards[currentIndex].answer}
        wrongAnswers={deck.flashcards[currentIndex].wrong_answers || undefined}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
      />

      {/* Mini stats */}
      <div className="flex justify-center gap-6 mt-8 text-sm text-zinc-500">
        <span>
          <span className="text-green-400 font-medium">{correct}</span> correct
        </span>
        <span>
          <span className="text-orange-400 font-medium">{wrong}</span> learning
        </span>
        {accuracy > 0 && (
          <span>
            <span className="text-emerald-400 font-medium">{accuracy}%</span>{' '}
            accuracy
          </span>
        )}
      </div>
    </div>
  );
}
