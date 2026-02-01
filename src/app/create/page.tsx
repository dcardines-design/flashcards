'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader2, X, Check, Send, Bot, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import CardInput from '@/components/CardInput';
import FileUploader from '@/components/FileUploader';

interface Card {
  question: string;
  answer: string;
  wrongAnswers?: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  cards?: Card[];
}

type TabType = 'type' | 'upload' | 'ai';

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedCards, setExtractedCards] = useState<Card[]>([]);

  // AI Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I can help you create flashcards. Tell me a topic you want to study, or paste any notes/information and I'll generate questions for you.",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [multipleChoice, setMultipleChoice] = useState(false);

  const handleAddCard = (question: string, answer: string) => {
    setCards([...cards, { question, answer }]);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleFileContent = async (content: string, fileName: string) => {
    if (!title) {
      const name = fileName.split('.').slice(0, -1).join('.');
      setTitle(name);
    }

    setIsExtracting(true);
    setExtractedCards([]);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, multipleChoice }),
      });

      if (res.ok) {
        const { cards: extracted } = await res.json();
        setExtractedCards(extracted);
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to extract flashcards');
      }
    } catch {
      alert('Failed to extract flashcards');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddExtractedCards = () => {
    setCards([...cards, ...extractedCards]);
    setExtractedCards([]);
  };

  const handleAIGenerate = async () => {
    if (!inputText.trim() || isGenerating) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsGenerating(true);

    try {
      const isLongContent = userMessage.length > 500 || userMessage.includes('\n');

      let res;
      if (isLongContent) {
        res = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: userMessage, multipleChoice }),
        });
      } else {
        res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: userMessage, count: cardCount, multipleChoice }),
        });
      }

      if (res.ok) {
        const { cards: generatedCards } = await res.json();

        if (!title && !isLongContent) {
          setTitle(userMessage.slice(0, 50));
        }

        const mcNote = multipleChoice ? ' with multiple choice options' : '';
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `I created ${generatedCards.length} flashcards${mcNote}${!isLongContent ? ` about "${userMessage}"` : ' from your notes'}. Review them below and click "Add All" to include them in your deck.`,
            cards: generatedCards,
          },
        ]);
      } else {
        const { error } = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: error || 'Sorry, I couldn\'t generate flashcards. Please try again with a different topic or more context.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAICards = (aiCards: Card[]) => {
    setCards([...cards, ...aiCards]);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.cards === aiCards ? { ...msg, cards: undefined } : msg
      )
    );
  };

  const handleSave = async () => {
    if (!title.trim() || cards.length === 0) {
      alert('Please add a title and at least one card');
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          cards,
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to create deck');
      }
    } catch {
      alert('Failed to create deck');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </Link>
        <h1 className="text-xl font-bold text-white">Create Deck</h1>
      </div>

      {/* Title & Description */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Deck title"
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-lg font-medium text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Bot className="w-4 h-4" />
          AI Generate
        </button>
        <button
          onClick={() => setActiveTab('type')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'type'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Manual
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ai' ? (
        <div className="space-y-4">
          {/* Settings row */}
          <div className="flex items-center gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Cards:</span>
              <input
                type="number"
                min={1}
                max={30}
                value={cardCount}
                onChange={(e) => setCardCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 10)))}
                className="w-14 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="h-4 w-px bg-zinc-700" />

            {/* Multiple choice toggle */}
            <button
              onClick={() => setMultipleChoice(!multipleChoice)}
              className="flex items-center gap-2 text-sm"
            >
              {multipleChoice ? (
                <ToggleRight className="w-6 h-6 text-indigo-500" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-zinc-600" />
              )}
              <span className={multipleChoice ? 'text-indigo-400' : 'text-zinc-500'}>
                Multiple Choice
              </span>
            </button>
          </div>

          {/* Chat messages */}
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                  {/* Show generated cards */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">
                          {msg.cards.length} cards
                          {msg.cards[0]?.wrongAnswers ? ' (multiple choice)' : ''}
                        </span>
                        <button
                          onClick={() => handleAddAICards(msg.cards!)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Add All
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {msg.cards.map((card, j) => (
                          <div key={j} className="bg-zinc-900/50 rounded-lg p-2 text-xs">
                            <p className="text-zinc-300 font-medium">Q: {card.question}</p>
                            <p className="text-green-400 mt-0.5">A: {card.answer}</p>
                            {card.wrongAnswers && card.wrongAnswers.length > 0 && (
                              <div className="mt-1 text-zinc-500">
                                {card.wrongAnswers.map((wrong, k) => (
                                  <p key={k} className="text-red-400/70">✗ {wrong}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span className="text-sm text-zinc-400">
                    Generating {multipleChoice ? 'multiple choice ' : ''}flashcards...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAIGenerate();
                }
              }}
              placeholder="Enter a topic (e.g., 'World War 2') or paste your notes..."
              rows={2}
              className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleAIGenerate}
              disabled={!inputText.trim() || isGenerating}
              className={`px-4 rounded-xl transition-colors ${
                inputText.trim() && !isGenerating
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : activeTab === 'type' ? (
        <CardInput onAddCard={handleAddCard} />
      ) : (
        <div className="space-y-4">
          {/* Multiple choice toggle for upload */}
          <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              onClick={() => setMultipleChoice(!multipleChoice)}
              className="flex items-center gap-2 text-sm"
            >
              {multipleChoice ? (
                <ToggleRight className="w-6 h-6 text-indigo-500" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-zinc-600" />
              )}
              <span className={multipleChoice ? 'text-indigo-400' : 'text-zinc-500'}>
                Generate Multiple Choice Options
              </span>
            </button>
          </div>

          <FileUploader
            onFileContent={handleFileContent}
            isProcessing={isExtracting}
          />

          {isExtracting && (
            <div className="flex items-center justify-center gap-2 py-8 text-indigo-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">
                Extracting {multipleChoice ? 'multiple choice ' : ''}flashcards...
              </span>
            </div>
          )}

          {extractedCards.length > 0 && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-indigo-400">
                  {extractedCards.length} cards extracted
                  {extractedCards[0]?.wrongAnswers ? ' (multiple choice)' : ''}
                </span>
                <button
                  onClick={handleAddExtractedCards}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Add All
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {extractedCards.map((card, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900 rounded-lg p-3 text-sm border border-zinc-800"
                  >
                    <p className="font-medium text-white mb-1">Q: {card.question}</p>
                    <p className="text-green-400">A: {card.answer}</p>
                    {card.wrongAnswers && card.wrongAnswers.length > 0 && (
                      <div className="mt-1">
                        {card.wrongAnswers.map((wrong, k) => (
                          <p key={k} className="text-red-400/70 text-xs">✗ {wrong}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Added Cards */}
      {cards.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-zinc-500 mb-3">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'} added
          </h3>
          <div className="space-y-2">
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {card.question}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {card.answer}
                  </p>
                  {card.wrongAnswers && (
                    <p className="text-xs text-zinc-600 mt-0.5">
                      + {card.wrongAnswers.length} wrong options
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveCard(i)}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            disabled={!title.trim() || cards.length === 0 || isSaving}
            className={`w-full py-3.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
              title.trim() && cards.length > 0 && !isSaving
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              `Save Deck (${cards.length} cards)`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
