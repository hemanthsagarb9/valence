"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { elements } from "@/data/elements";
import { Element, LearningLevel } from "@/lib/types";
import { RotateCcw } from "lucide-react";

const funFacts = [
  "Francium is the rarest naturally occurring element — only ~30g exists on Earth at any time.",
  "Helium was discovered on the Sun before it was found on Earth.",
  "Gold is so malleable that 1 ounce can be stretched into a wire 50 miles long.",
  "Your body contains enough carbon to make about 9,000 pencils.",
  "Bromine and Mercury are the only elements that are liquid at room temperature.",
  "Fluorine is so reactive it can even corrode platinum.",
  "Osmium is the densest naturally occurring element — twice as dense as lead.",
  "Hydrogen makes up about 75% of all matter in the universe.",
  "Gallium melts in your hand — its melting point is just 29.76°C.",
  "Bismuth crystals form beautiful rainbow-colored staircase structures.",
];

export type HuntPhase = "menu" | "playing" | "gameover";

// ── Right panel: Menu ──
export function ElementHuntMenu({
  level,
  onStart,
}: {
  level: LearningLevel;
  onStart: () => void;
}) {
  return (
    <div className="p-5">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Element Hunt</h3>
      <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-5">Test how well you know the periodic table.</p>

      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
        An element name appears — find it on the periodic table as fast as you can. 15 elements, 6 seconds each.
      </p>

      <button
        onClick={onStart}
        className="w-full py-2.5 rounded-lg bg-gray-800 dark:bg-white/15 text-white font-medium hover:bg-gray-900 dark:hover:bg-white/20 transition text-sm"
      >
        Start
      </button>
    </div>
  );
}

// ── Right panel: HUD for Find It ──
export function FindItHUD({
  targetName,
  timeLeft,
  score,
  total,
  streak,
  progress,
  feedback,
  onEnd,
}: {
  targetName: string;
  timeLeft: number;
  score: number;
  total: number;
  streak: number;
  progress: number;
  feedback: { correct: boolean; symbol: string } | null;
  onEnd: () => void;
}) {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Find It</h3>
        <button onClick={onEnd} className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium">
          End Game
        </button>
      </div>

      {/* Target */}
      <div className="text-center mb-6">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Find this element</p>
        <p className="text-3xl font-black text-gray-800 dark:text-gray-100">{targetName}</p>
        {/* Inline feedback */}
        <div className="h-5 mt-2">
          {feedback && (
            <span
              className={`text-xs font-semibold ${
                feedback.correct
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-500 dark:text-rose-400"
              }`}
            >
              {feedback.correct ? "Correct" : `Nope — ${feedback.symbol}`}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-0 mb-4">
        <div className="text-center py-2">
          <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{timeLeft}s</div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Time</div>
        </div>
        <div className="text-center py-2 border-x border-gray-100 dark:border-white/10">
          <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{score}/{total}</div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Score</div>
        </div>
        <div className="text-center py-2">
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{streak}</div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Streak</div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ── Right panel: Game Over ──
export function ElementHuntResults({
  score,
  total,
  onPlayAgain,
  onMenu,
}: {
  score: number;
  total: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}) {
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const [funFact] = useState(() => funFacts[Math.floor(Math.random() * funFacts.length)]);

  return (
    <div className="p-5">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
        {accuracy >= 80 ? "Excellent!" : accuracy >= 50 ? "Good effort!" : "Keep practicing!"}
      </h3>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-5">Stay Hungry. Stay Periodic.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-0 mb-5">
        <div className="text-center py-2">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{score}</div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Score</div>
        </div>
        <div className="text-center py-2 border-x border-gray-100 dark:border-white/10">
          <div className={`text-2xl font-bold ${accuracy >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{accuracy}%</div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Accuracy</div>
        </div>
        <div className="text-center py-2">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{total}</div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total</div>
        </div>
      </div>

      {/* Fun fact */}
      <div className="mb-5">
        <div className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Did you know?</div>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{funFact}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onPlayAgain}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gray-800 dark:bg-white/15 text-white font-medium hover:bg-gray-900 dark:hover:bg-white/20 transition text-sm"
        >
          <RotateCcw size={13} /> Play Again
        </button>
        <button
          onClick={onMenu}
          className="w-full py-2.5 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition text-sm"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

// ── Find It game logic hook (uses the real periodic table as game board) ──
export function useFindItGame(level: LearningLevel, started: boolean) {
  const maxElements = level === "beginner" ? 20 : level === "school" ? 40 : 118;
  const [gameKey, setGameKey] = useState(0);
  const pool = useMemo(
    () => elements.filter((e) => e.atomicNumber <= maxElements).sort(() => Math.random() - 0.5).slice(0, 15),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxElements, gameKey]
  );

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(pool.length * 6);
  const [feedback, setFeedback] = useState<{ correct: boolean; symbol: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Reset when a new game starts
  useEffect(() => {
    if (started) {
      setCurrent(0);
      setScore(0);
      setStreak(0);
      setTimeLeft(15 * 6);
      setFeedback(null);
      setGameOver(false);
      setGameKey((k) => k + 1);
    }
  }, [started]);

  // Timer — only tick when started and not game over
  useEffect(() => {
    if (!started || gameOver) return;
    if (timeLeft <= 0) { setGameOver(true); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameOver, started]);

  const target = pool[current];

  const handleElementClick = useCallback((el: Element) => {
    if (gameOver || !target || !started) return null;
    const correct = el.atomicNumber === target.atomicNumber;
    setFeedback({ correct, symbol: el.symbol });
    setTimeout(() => setFeedback(null), 600);

    let newScore = score;
    if (correct) { newScore = score + 1; setScore(newScore); setStreak((s) => s + 1); }
    else { setStreak(0); }

    if (current + 1 >= pool.length) {
      setGameOver(true);
      return { score: newScore, total: pool.length };
    } else {
      setCurrent((c) => c + 1);
    }
    return null;
  }, [current, pool, target, score, gameOver, started]);

  const endEarly = useCallback(() => {
    setGameOver(true);
    return { score, total: current };
  }, [score, current]);

  return {
    target,
    current,
    total: pool.length,
    score,
    streak,
    timeLeft,
    feedback,
    gameOver,
    handleElementClick,
    endEarly,
  };
}
