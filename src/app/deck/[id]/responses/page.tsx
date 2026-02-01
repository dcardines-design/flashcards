'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Flame,
  Target,
  Loader2,
  Users,
  Clock,
} from 'lucide-react';

interface SharedResponse {
  id: string;
  participant_name: string;
  score: number;
  cards_reviewed: number;
  correct_count: number;
  wrong_count: number;
  best_streak: number;
  accuracy: number;
  completed_at: string;
}

interface DeckData {
  id: string;
  title: string;
}

export default function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [responses, setResponses] = useState<SharedResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [deckRes, responsesRes] = await Promise.all([
        fetch(`/api/decks/${id}`),
        fetch(`/api/shared-responses?deck_id=${id}`),
      ]);

      if (deckRes.ok) {
        const deckData = await deckRes.json();
        setDeck(deckData);
      }

      if (responsesRes.ok) {
        const responsesData = await responsesRes.json();
        setResponses(responsesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 mb-4">Deck not found</p>
        <Link href="/" className="text-indigo-400 font-medium hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/deck/${id}`}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{deck.title}</h1>
          <p className="text-sm text-zinc-500">Shared Responses</p>
        </div>
      </div>

      {/* Stats summary */}
      {responses.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <Users className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{responses.length}</p>
            <p className="text-xs text-zinc-500">Participants</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {Math.max(...responses.map((r) => r.score))}
            </p>
            <p className="text-xs text-zinc-500">Best Score</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {Math.round(
                responses.reduce((sum, r) => sum + (r.accuracy || 0), 0) /
                  responses.length
              )}
              %
            </p>
            <p className="text-xs text-zinc-500">Avg Accuracy</p>
          </div>
        </div>
      )}

      {/* Responses list */}
      {responses.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
          <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 mb-2">No responses yet</p>
          <p className="text-sm text-zinc-600">
            Share your deck link to collect responses
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {responses.map((response, index) => (
            <div
              key={response.id}
              className="bg-zinc-900 rounded-xl p-4 border border-zinc-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {response.participant_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {response.participant_name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(response.completed_at)}
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                    Latest
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-zinc-800 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                    <Trophy className="w-3 h-3" />
                  </div>
                  <p className="font-bold text-white text-sm">{response.score}</p>
                  <p className="text-xs text-zinc-500">Points</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                    <Flame className="w-3 h-3" />
                  </div>
                  <p className="font-bold text-white text-sm">{response.best_streak}</p>
                  <p className="text-xs text-zinc-500">Streak</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <Target className="w-3 h-3" />
                  </div>
                  <p className="font-bold text-white text-sm">{response.accuracy}%</p>
                  <p className="text-xs text-zinc-500">Accuracy</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-2">
                  <p className="font-bold text-white text-sm mt-2">
                    {response.correct_count}/{response.cards_reviewed}
                  </p>
                  <p className="text-xs text-zinc-500">Correct</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
