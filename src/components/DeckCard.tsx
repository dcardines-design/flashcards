'use client';

import Link from 'next/link';
import { BookOpen, TrendingUp, Trophy, Clock, Pencil, Users } from 'lucide-react';

interface DeckCardProps {
  id: string;
  title: string;
  description?: string | null;
  cardCount: number;
  progress?: number;
  bestPerformer?: { name: string; score: number } | null;
  bestTime?: { name: string; seconds: number } | null;
}

export default function DeckCard({
  id,
  title,
  description,
  cardCount,
  progress = 0,
  bestPerformer,
  bestTime,
}: DeckCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="group relative w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-5 hover:border-zinc-700 transition-colors">
      <Link href={`/deck/${id}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {progress > 0 && (
            <div className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              {progress}%
            </div>
          )}
        </div>

        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-1">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-500">
            {cardCount} {cardCount === 1 ? 'card' : 'cards'}
          </span>

          {/* Progress bar */}
          <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Best performers */}
        {(bestPerformer || bestTime) && (
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            {bestPerformer && (
              <div className="flex items-center gap-2 text-xs">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-zinc-500">Best:</span>
                <span className="text-zinc-300 font-medium">{bestPerformer.name}</span>
                <span className="text-amber-400 ml-auto">{bestPerformer.score} pts</span>
              </div>
            )}
            {bestTime && (
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-zinc-500">Fastest:</span>
                <span className="text-zinc-300 font-medium">{bestTime.name}</span>
                <span className="text-emerald-400 ml-auto">{formatTime(bestTime.seconds)}</span>
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-800">
        <Link
          href={`/deck/${id}/edit`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-2.5 px-4 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Link>
        <Link
          href={`/deck/${id}/responses`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-2.5 px-4 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Responses
        </Link>
      </div>

    </div>
  );
}
