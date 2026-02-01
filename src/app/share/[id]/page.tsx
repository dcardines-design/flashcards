'use client';

import { useEffect, useState, use } from 'react';
import {
  Trophy,
  Flame,
  Target,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Share2,
  BookOpen,
  Clock,
} from 'lucide-react';
import FlashCard from '@/components/FlashCard';

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

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [responseSaved, setResponseSaved] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    fetchDeck();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchDeck = async () => {
    try {
      const res = await fetch(`/api/decks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDeck(data);
      } else {
        setError('Deck not found');
      }
    } catch {
      setError('Failed to load deck');
    } finally {
      setLoading(false);
    }
  };

  const handleCorrect = () => {
    const newStreak = streak + 1;
    const streakBonus = newStreak >= 3 ? 5 : 0;
    const points = 10 + streakBonus;
    const newScore = score + points;
    const newCorrect = correct + 1;
    const newMaxStreak = Math.max(maxStreak, newStreak);

    setScore(newScore);
    setStreak(newStreak);
    setMaxStreak(newMaxStreak);
    setCorrect(newCorrect);

    nextCard(true, newScore, newCorrect, wrong, newMaxStreak);
  };

  const handleWrong = () => {
    const newWrong = wrong + 1;
    setStreak(0);
    setWrong(newWrong);
    nextCard(false, score, correct, newWrong, maxStreak);
  };

  const nextCard = (
    wasCorrect: boolean,
    finalScore: number,
    finalCorrect: number,
    finalWrong: number,
    finalMaxStreak: number
  ) => {
    if (shuffledCards.length > 0 && currentIndex >= shuffledCards.length - 1) {
      setIsComplete(true);
      saveResponse(finalScore, finalCorrect, finalWrong, finalMaxStreak);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const saveResponse = async (
    finalScore: number,
    finalCorrect: number,
    finalWrong: number,
    finalMaxStreak: number
  ) => {
    if (!deck || responseSaved || !participantName) return;

    const total = finalCorrect + finalWrong;
    const finalAccuracy = total > 0 ? Math.round((finalCorrect / total) * 100) : 0;

    await fetch('/api/shared-responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deck_id: deck.id,
        participant_name: participantName,
        score: finalScore,
        cards_reviewed: total,
        correct_count: finalCorrect,
        wrong_count: finalWrong,
        best_streak: finalMaxStreak,
        accuracy: finalAccuracy,
      }),
    });

    setResponseSaved(true);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStart = () => {
    if (!participantName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    if (deck) {
      setShuffledCards(shuffleArray(deck.flashcards));
    }
    setStarted(true);
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrect(0);
    setWrong(0);
    setIsComplete(false);
    setResponseSaved(false);
    setElapsedTime(0);
    if (deck) {
      setShuffledCards(shuffleArray(deck.flashcards));
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 mb-4">{error || 'Deck not found'}</p>
      </div>
    );
  }

  if (deck.flashcards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">No cards in this deck</p>
      </div>
    );
  }

  const totalCards = deck.flashcards.length;
  const progress = ((currentIndex + 1) / totalCards) * 100;
  const accuracy =
    correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  // Start screen
  if (!started) {
    return (
      <div className="max-w-md mx-auto">
        {/* Deck info */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{deck.title}</h1>
          {deck.description && (
            <p className="text-white/80 text-sm mb-2">{deck.description}</p>
          )}
          <p className="text-white/60 text-sm">
            {totalCards} {totalCards === 1 ? 'card' : 'cards'}
          </p>
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Enter your name to start
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => {
              setParticipantName(e.target.value);
              setNameError(false);
            }}
            placeholder="Your name"
            className={`w-full px-4 py-3 bg-zinc-900 border ${
              nameError ? 'border-red-500' : 'border-zinc-700'
            } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors`}
          />
          {nameError && (
            <p className="text-red-400 text-sm mt-1">Please enter your name</p>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors mb-4"
        >
          Start Studying
        </button>

        {/* Share button */}
        <button
          onClick={copyShareLink}
          className="w-full py-3 px-4 bg-zinc-800 text-zinc-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Copy Share Link
        </button>
      </div>
    );
  }

  // Complete screen
  if (isComplete) {
    const finalAccuracy =
      correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    return (
      <div>
        {/* Complete Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center mb-6">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">Great job, {participantName}!</h2>
          <p className="text-white/80">
            You reviewed all {totalCards} cards in {formatTime(elapsedTime)}
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
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-6">
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
            className="w-full py-3.5 px-4 bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Study Again
          </button>
          <button
            onClick={copyShareLink}
            className="w-full py-3.5 px-4 bg-zinc-800 text-zinc-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share This Deck
          </button>
        </div>
      </div>
    );
  }

  // Study view
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-white line-clamp-1">
          {deck.title}
        </h1>
        <button
          onClick={copyShareLink}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Share2 className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
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
          <div className="flex items-center gap-1 text-indigo-400">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">{score}</span>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <FlashCard
        question={shuffledCards[currentIndex]?.question || ''}
        answer={shuffledCards[currentIndex]?.answer || ''}
        wrongAnswers={shuffledCards[currentIndex]?.wrong_answers || undefined}
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
            <span className="text-indigo-400 font-medium">{accuracy}%</span>{' '}
            accuracy
          </span>
        )}
      </div>

      {/* Timer */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-400 font-mono">{formatTime(elapsedTime)}</span>
        </div>
      </div>
    </div>
  );
}
