"use client";

import { useState, useCallback, useMemo } from "react";
import { QuizQuestion, LearningLevel } from "@/lib/types";
import { quizQuestions } from "@/data/quizzes";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface QuizPanelProps {
  level: LearningLevel;
  onClose: () => void;
}

export default function QuizPanel({ level, onClose }: QuizPanelProps) {
  const filteredQuestions = useMemo(() => {
    if (level === "advanced") return quizQuestions;
    if (level === "school") return quizQuestions.filter(q => q.difficulty !== "advanced");
    return quizQuestions.filter(q => q.difficulty === "beginner");
  }, [level]);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState(() => {
    const arr = [...filteredQuestions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const question = shuffledQuestions[currentIndex];
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (answer === question.correctAnswer ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [question]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= shuffledQuestions.length) {
      setFinished(true);
      return;
    }
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, shuffledQuestions.length]);

  const restart = useCallback(() => {
    const arr = [...filteredQuestions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledQuestions(arr);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setFinished(false);
  }, [filteredQuestions]);

  if (!question) return null;

  // Intro screen
  if (!started) {
    return (
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Quiz</h3>
        <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-5">
          Test your chemistry knowledge with multiple choice questions.
        </p>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
          {filteredQuestions.length} questions at your level. Answer at your own pace — no timer.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="w-full py-2.5 rounded-lg bg-gray-800 dark:bg-white/15 text-white font-medium hover:bg-gray-900 dark:hover:bg-white/20 transition text-sm"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  // Results screen
  if (finished) {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
          {accuracy >= 80 ? "Excellent!" : accuracy >= 50 ? "Good effort!" : "Keep practicing!"}
        </h3>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-5">Quiz complete</p>

        <div className="grid grid-cols-3 gap-0 mb-5">
          <div className="text-center py-2">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{score.correct}</div>
            <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Correct</div>
          </div>
          <div className="text-center py-2 border-x border-gray-100 dark:border-white/10">
            <div className={`text-2xl font-bold ${accuracy >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{accuracy}%</div>
            <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Accuracy</div>
          </div>
          <div className="text-center py-2">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{score.total}</div>
            <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total</div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={restart}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gray-800 dark:bg-white/15 text-white font-medium hover:bg-gray-900 dark:hover:bg-white/20 transition text-sm"
          >
            <RotateCcw size={13} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Quiz</h3>
        <span className="text-[11px] text-gray-400 dark:text-gray-500">{currentIndex + 1}/{shuffledQuestions.length}</span>
      </div>

      {/* Question */}
      <div className="mb-4">
        <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {question.type.replace("_", " ")}
        </span>
        <p className="text-[14px] font-medium text-gray-800 dark:text-gray-100 mt-1 leading-relaxed">{question.prompt}</p>
      </div>

      {/* Options */}
      <div className="space-y-1.5 mb-4">
        {question.options?.map((option) => {
          let style = "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5";
          if (showResult) {
            if (option === question.correctAnswer) {
              style = "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold";
            } else if (option === selectedAnswer && !isCorrect) {
              style = "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300";
            } else {
              style = "text-gray-300 dark:text-gray-600";
            }
          }

          return (
            <button
              key={option}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] transition-all ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Result + next */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className={`text-[12px] mb-3 leading-relaxed ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}>
              {question.explanation}
            </p>
            <button
              onClick={nextQuestion}
              className="w-full py-2.5 rounded-lg bg-gray-800 dark:bg-white/15 text-white text-sm font-medium hover:bg-gray-900 dark:hover:bg-white/20 transition"
            >
              {currentIndex + 1 >= shuffledQuestions.length ? "See Results" : "Next Question"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
