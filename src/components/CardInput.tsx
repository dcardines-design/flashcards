'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface CardInputProps {
  onAddCard: (question: string, answer: string) => void;
}

export default function CardInput({ onAddCard }: CardInputProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onAddCard(question.trim(), answer.trim());
      setQuestion('');
      setAnswer('');
    }
  };

  const isValid = question.trim() && answer.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-zinc-400 mb-1.5"
        >
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          rows={3}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-shadow text-white placeholder-zinc-600"
        />
      </div>

      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-zinc-400 mb-1.5"
        >
          Answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the answer..."
          rows={3}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-shadow text-white placeholder-zinc-600"
        />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
          isValid
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        <Plus className="w-5 h-5" />
        Add Card
      </button>
    </form>
  );
}
