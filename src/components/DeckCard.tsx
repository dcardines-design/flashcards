'use client';

import Link from 'next/link';
import { BookOpen, TrendingUp, Trash2 } from 'lucide-react';

interface DeckCardProps {
  id: string;
  title: string;
  description?: string | null;
  cardCount: number;
  progress?: number;
  onDelete?: () => void;
}

export default function DeckCard({
  id,
  title,
  description,
  cardCount,
  progress = 0,
  onDelete,
}: DeckCardProps) {
  return (
    <div className="group relative w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-5 hover:border-zinc-700 transition-colors">
      <Link href={`/deck/${id}`} className="block">
        <div className="flex items-start justify-between mb-3">
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

        <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between">
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
      </Link>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 p-2 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
        </button>
      )}
    </div>
  );
}
