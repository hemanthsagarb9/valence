"use client";

import { useState, useMemo, useCallback } from "react";
import { elements } from "@/data/elements";
import { Element } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Lightbulb, Check, RotateCcw } from "lucide-react";

interface ProgressiveDiscoveryProps {
  onBack: () => void;
}

interface World {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  elementNumbers: number[];
  gridCols: number;
  gridRows: number;
  discoveryMessage: string;
  hint: string;
}

const worlds: World[] = [
  {
    id: 1,
    title: "The First 8",
    subtitle: "Where it all begins",
    description: "These 8 elements have different numbers of electrons in their outer shell. Can you arrange them so similar elements are in the same column?",
    elementNumbers: [1, 2, 3, 4, 5, 6, 7, 8],
    gridCols: 8,
    gridRows: 1,
    discoveryMessage: "You just discovered GROUPS! Elements in the same column have the same number of valence electrons and behave similarly.",
    hint: "Look at the valence electrons — elements with the same number go in the same column.",
  },
  {
    id: 2,
    title: "Adding a Row",
    subtitle: "History repeats itself",
    description: "These new elements are eerily similar to ones you already know. Place them in a second row, matching each to its twin above.",
    elementNumbers: [11, 12, 13, 14, 15, 16, 17, 18],
    gridCols: 8,
    gridRows: 2,
    discoveryMessage: "You just discovered PERIODS! Properties repeat in cycles. Na behaves like Li, Mg like Be... that's periodicity!",
    hint: "Sodium has 1 valence electron, just like Lithium. Match them up!",
  },
  {
    id: 3,
    title: "The Metals",
    subtitle: "Not everything fits neatly",
    description: "Period 4 brings a surprise: transition metals that don't follow the simple pattern. Place K and Ca first, then figure out where the d-block metals go.",
    elementNumbers: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    gridCols: 18,
    gridRows: 1,
    discoveryMessage: "You just discovered the D-BLOCK! Transition metals fill in a new set of orbitals (3d) between Groups 2 and 13. This is why the periodic table is 18 columns wide!",
    hint: "K goes under Na (Group 1), Ca under Mg (Group 2). The 10 transition metals fill columns 3–12.",
  },
  {
    id: 4,
    title: "Predict the Unknown",
    subtitle: "Think like Mendeleev",
    description: "There's a gap in the table. Based on the elements above and below, predict what properties the missing element should have.",
    elementNumbers: [31], // Gallium - Mendeleev's famous prediction
    gridCols: 1,
    gridRows: 1,
    discoveryMessage: "This is exactly what Mendeleev did in 1871! He predicted 'eka-aluminium' would have an atomic mass of ~68 and a density of ~5.9 g/cm³. When Gallium was discovered in 1875, it matched perfectly!",
    hint: "Look at Aluminium above (Group 13) and Indium below. What valence electrons should this element have?",
  },
  {
    id: 5,
    title: "The Full Picture",
    subtitle: "Your periodic table is complete",
    description: "Congratulations! You've built the periodic table from scratch. Now you understand WHY it's organized this way — not just what it looks like.",
    elementNumbers: [],
    gridCols: 18,
    gridRows: 7,
    discoveryMessage: "You've completed the Periodic Table! From 8 elements to 118, you discovered groups, periods, transition metals, and even predicted unknown elements — just like the great chemists did.",
    hint: "",
  },
];

type WorldPhase = "intro" | "playing" | "complete";

export default function ProgressiveDiscovery({ onBack }: ProgressiveDiscoveryProps) {
  const [worldIndex, setWorldIndex] = useState(0);
  const [phase, setPhase] = useState<WorldPhase>("intro");
  const [showHint, setShowHint] = useState(false);
  const [placedElements, setPlacedElements] = useState<Map<string, number>>(new Map());
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [correctPlacements, setCorrectPlacements] = useState(0);

  const world = worlds[worldIndex];
  const worldElements = useMemo(
    () => elements.filter((e) => world.elementNumbers.includes(e.atomicNumber)),
    [world]
  );

  const placedNumbers = useMemo(() => new Set(placedElements.values()), [placedElements]);
  const unplacedElements = worldElements.filter((e) => !placedNumbers.has(e.atomicNumber));
  const isWorldComplete = unplacedElements.length === 0 && worldElements.length > 0;

  // For world 5 (celebration), auto-complete
  const isLastWorld = worldIndex === worlds.length - 1;

  const handleSlotClick = useCallback(
    (row: number, col: number) => {
      if (!selectedCard || phase !== "playing") return;

      const key = `${row}-${col}`;
      const el = elements.find((e) => e.atomicNumber === selectedCard);
      if (!el) return;

      // Check if correct position (simplified: group matching)
      const isCorrect = world.id <= 2
        ? el.valenceElectrons === col || (el.valenceElectrons === 8 && col === world.gridCols)
        : true; // For worlds 3+, any placement is tracked

      setPlacedElements((prev) => new Map(prev).set(key, selectedCard));
      if (isCorrect) setCorrectPlacements((c) => c + 1);
      setSelectedCard(null);
    },
    [selectedCard, phase, world]
  );

  const handleNextWorld = () => {
    if (worldIndex < worlds.length - 1) {
      setWorldIndex((i) => i + 1);
      setPhase("intro");
      setPlacedElements(new Map());
      setSelectedCard(null);
      setCorrectPlacements(0);
      setShowHint(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">Discovery</h1>
          <p className="text-sm text-gray-400">Build the periodic table from scratch</p>
        </div>
        {/* World progress */}
        <div className="flex items-center gap-1">
          {worlds.map((w, i) => (
            <div
              key={w.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < worldIndex
                  ? "bg-emerald-500 text-white"
                  : i === worldIndex
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {i < worldIndex ? <Check size={12} /> : w.id}
            </div>
          ))}
        </div>
      </div>

      {/* ── Intro ── */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">
            World {world.id} of {worlds.length}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{world.title}</h2>
          <p className="text-lg text-gray-500">{world.subtitle}</p>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">{world.description}</p>

          {isLastWorld ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="space-y-4"
            >
              <p className="text-lg font-medium text-gray-800">{world.discoveryMessage}</p>
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition"
              >
                Back to Periodic Table
              </button>
            </motion.div>
          ) : (
            <button
              onClick={() => setPhase("playing")}
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition flex items-center gap-2 mx-auto"
            >
              Start World {world.id} <ChevronRight size={16} />
            </button>
          )}
        </motion.div>
      )}

      {/* ── Playing ── */}
      {phase === "playing" && (
        <div className="space-y-6">
          {/* Element cards to drag/place */}
          <div className="flex flex-wrap gap-2 justify-center">
            {unplacedElements.map((el) => (
              <motion.button
                key={el.atomicNumber}
                onClick={() => setSelectedCard(el.atomicNumber === selectedCard ? null : el.atomicNumber)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[72px] ${
                  selectedCard === el.atomicNumber
                    ? "border-violet-400 bg-violet-50 shadow-md scale-105"
                    : "border-gray-200 bg-white hover:border-violet-200 hover:shadow-sm"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl font-bold text-gray-800">{el.symbol}</span>
                <span className="text-[10px] text-gray-500">{el.name}</span>
                <span className="text-[9px] text-gray-400 mt-0.5">
                  {el.valenceElectrons} val. e⁻
                </span>
              </motion.button>
            ))}
          </div>

          {selectedCard && (
            <p className="text-center text-sm text-violet-600 font-medium">
              Now click a slot below to place {elements.find((e) => e.atomicNumber === selectedCard)?.name}
            </p>
          )}

          {/* Grid slots */}
          <div
            className="grid gap-2 max-w-3xl mx-auto"
            style={{ gridTemplateColumns: `repeat(${world.gridCols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: world.gridRows * world.gridCols }, (_, idx) => {
              const row = Math.floor(idx / world.gridCols) + 1;
              const col = (idx % world.gridCols) + 1;
              const key = `${row}-${col}`;
              const placedNum = placedElements.get(key);
              const placedEl = placedNum ? elements.find((e) => e.atomicNumber === placedNum) : null;

              return (
                <button
                  key={key}
                  onClick={() => handleSlotClick(row, col)}
                  className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                    placedEl
                      ? "border-emerald-300 bg-emerald-50"
                      : selectedCard
                      ? "border-violet-300 bg-violet-50/30 hover:bg-violet-50 cursor-pointer"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  {placedEl ? (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <span className="text-lg font-bold text-emerald-700">{placedEl.symbol}</span>
                      <span className="block text-[9px] text-emerald-600">{placedEl.name}</span>
                    </motion.div>
                  ) : (
                    <span className="text-xs text-gray-300">?</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition border border-amber-200"
            >
              <Lightbulb size={14} /> {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {isWorldComplete && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => setPhase("complete")}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
              >
                <Check size={14} /> Complete!
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center overflow-hidden"
              >
                <p className="text-sm text-amber-800">{world.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Complete ── */}
      {phase === "complete" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-6xl"
          >
            🎆
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">World {world.id} Complete!</h2>
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 max-w-lg mx-auto">
            <div className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1 justify-center">
              Discovery
            </div>
            <p className="text-sm text-emerald-900">{world.discoveryMessage}</p>
          </div>

          <button
            onClick={handleNextWorld}
            className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition flex items-center gap-2 mx-auto"
          >
            {worldIndex < worlds.length - 2 ? (
              <>Next World <ChevronRight size={16} /></>
            ) : (
              <>Final Challenge</>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}
