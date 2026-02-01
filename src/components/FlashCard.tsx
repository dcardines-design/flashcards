'use client';

import { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Check, X } from 'lucide-react';

interface FlashCardProps {
  question: string;
  answer: string;
  wrongAnswers?: string[];
  onCorrect?: () => void;
  onWrong?: () => void;
  showActions?: boolean;
}

export default function FlashCard({
  question,
  answer,
  wrongAnswers,
  onCorrect,
  onWrong,
  showActions = true,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isMultipleChoice = wrongAnswers && wrongAnswers.length > 0;

  // Shuffle answers only once when component mounts or question changes
  const shuffledAnswers = useMemo(() => {
    if (!isMultipleChoice) return [];
    const allAnswers = [answer, ...wrongAnswers];
    return allAnswers.sort(() => Math.random() - 0.5);
  }, [answer, wrongAnswers, isMultipleChoice]);

  // Reset state when question changes
  useEffect(() => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [question]);

  const handleFlip = () => {
    if (!isMultipleChoice) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleSelectAnswer = (selected: string) => {
    if (showResult) return;
    setSelectedAnswer(selected);
    setShowResult(true);

    // Auto-proceed after showing result
    setTimeout(() => {
      if (selected === answer) {
        onCorrect?.();
      } else {
        onWrong?.();
      }
    }, 1500);
  };

  const handleCorrect = () => {
    onCorrect?.();
    setIsFlipped(false);
  };

  const handleWrong = () => {
    onWrong?.();
    setIsFlipped(false);
  };

  // Multiple choice mode
  if (isMultipleChoice) {
    return (
      <div className="w-full max-w-md mx-auto">
        {/* Question card */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-4">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">
            Question
          </div>
          <p className="text-lg text-white leading-relaxed">
            {question}
          </p>
        </div>

        {/* Answer options */}
        <div className="space-y-2">
          {shuffledAnswers.map((option, i) => {
            const isCorrect = option === answer;
            const isSelected = option === selectedAnswer;

            let bgColor = 'bg-zinc-900 border-zinc-800 hover:border-zinc-700';
            let textColor = 'text-white';

            if (showResult) {
              if (isCorrect) {
                bgColor = 'bg-green-500/20 border-green-500/50';
                textColor = 'text-green-400';
              } else if (isSelected && !isCorrect) {
                bgColor = 'bg-red-500/20 border-red-500/50';
                textColor = 'text-red-400';
              } else {
                bgColor = 'bg-zinc-900/50 border-zinc-800';
                textColor = 'text-zinc-500';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border text-left transition-all ${bgColor} ${
                  showResult ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    showResult && isCorrect
                      ? 'border-green-500 bg-green-500'
                      : showResult && isSelected && !isCorrect
                      ? 'border-red-500 bg-red-500'
                      : 'border-zinc-600'
                  }`}>
                    {showResult && isCorrect && <Check className="w-4 h-4 text-white" />}
                    {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm ${textColor}`}>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${
            selectedAnswer === answer
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {selectedAnswer === answer ? 'Correct!' : `Wrong! The answer was: ${answer}`}
          </div>
        )}
      </div>
    );
  }

  // Regular flip card mode
  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front (Question) */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="h-full bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
                Question
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg text-white text-center leading-relaxed">
                  {question}
                </p>
              </div>
              <div className="text-center text-sm text-zinc-600 flex items-center justify-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Tap to reveal answer
              </div>
            </div>
          </div>

          {/* Back (Answer) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 flex flex-col">
              <div className="text-xs font-medium text-white/70 uppercase tracking-wide mb-2">
                Answer
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg text-white text-center leading-relaxed">
                  {answer}
                </p>
              </div>
              <div className="text-center text-sm text-white/50 flex items-center justify-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Tap to see question
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {showActions && isFlipped && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWrong();
            }}
            className="flex-1 py-3 px-6 bg-red-500/10 text-red-400 rounded-xl font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            Still Learning
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCorrect();
            }}
            className="flex-1 py-3 px-6 bg-green-500/10 text-green-400 rounded-xl font-medium hover:bg-green-500/20 transition-colors border border-green-500/20"
          >
            Got It!
          </button>
        </div>
      )}
    </div>
  );
}
