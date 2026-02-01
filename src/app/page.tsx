'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import DeckCard from '@/components/DeckCard';
import { Deck } from '@/lib/supabase';

export default function Home() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const res = await fetch('/api/decks');
      if (res.ok) {
        const data = await res.json();
        setDecks(data);
      }
    } catch (error) {
      console.error('Failed to fetch decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this deck and all its cards?')) return;

    try {
      const res = await fetch(`/api/decks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDecks(decks.filter((d) => d.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete deck:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Decks</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-lg font-medium text-white mb-2">
            No decks yet
          </h2>
          <p className="text-zinc-500 mb-6">
            Create your first deck to start studying
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Deck
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              id={deck.id}
              title={deck.title}
              description={deck.description}
              cardCount={deck.card_count || 0}
              progress={deck.progress || 0}
              onDelete={() => handleDelete(deck.id)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <Link
        href="/create"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
}
