"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { elements } from "@/data/elements";
import {
  Element,
  LearningLevel,
  PeriodicTableMode,
  TrendType,
  ElementCategory,
  ThematicCollection,
} from "@/lib/types";
import ElementCell from "./ElementCell";
import ElementDetailCard from "./ElementDetailCard";
import BondingPanel from "./BondingPanel";
import QuizPanel from "./QuizPanel";
import FamilyLegend from "./FamilyLegend";
import FamilyInfoPanel from "./FamilyInfoPanel";
import TrendSelector from "./TrendSelector";
import {
  ElementHuntMenu,
  FindItHUD,
  ElementHuntResults,
  useFindItGame,
  HuntPhase,
} from "./ElementHunt";
import { collections as allCollections } from "@/data/collections";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import Logo from "./Logo";

const springs = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 25 },
};

export default function PeriodicTable() {
  const { theme, toggle: toggleTheme } = useTheme();

  // Core state
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [level, setLevel] = useState<LearningLevel>("school");
  const [mode, setMode] = useState<PeriodicTableMode>("explore");

  // Mode-specific state
  const [highlightedFamily, setHighlightedFamily] = useState<ElementCategory | null>(null);
  const [activeTrend, setActiveTrend] = useState<TrendType | null>(null);
  const [bondElements, setBondElements] = useState<[Element | null, Element | null]>([null, null]);
  const [activeCollection, setActiveCollection] = useState<ThematicCollection | null>(null);
  const [trendWaveKey, setTrendWaveKey] = useState(0);

  // Hunt state (lifted for two-column integration)
  const [huntPhase, setHuntPhase] = useState<HuntPhase>("menu");
  const [huntScore, setHuntScore] = useState({ score: 0, total: 0 });
  const [huntPlaying, setHuntPlaying] = useState(false);

  // Refs
  const gridRef = useRef<HTMLDivElement>(null);

  // Helper: get trend value for an element (metallic character is computed)
  const getTrendValue = useCallback((el: Element, trend: TrendType): number | null => {
    if (trend === "metallicCharacter") {
      // Metallic character is inverse of electronegativity
      if (el.electronegativity === null) return null;
      return -el.electronegativity; // negate so higher = more metallic
    }
    return el[trend as keyof Element] as number | null;
  }, []);

  // Trend stats
  const trendStats = useMemo(() => {
    if (!activeTrend) return null;
    const values = elements
      .map((e) => getTrendValue(e, activeTrend))
      .filter((v): v is number => v !== null);
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [activeTrend, getTrendValue]);

  // Collection members set
  const collectionMembers = useMemo(() => {
    if (!activeCollection) return null;
    return new Set(activeCollection.elements);
  }, [activeCollection]);

  // Element lookup by (row, col)
  const elementAt = useMemo(() => {
    const map = new Map<string, Element>();
    elements.forEach((el) => map.set(`${el.row}-${el.col}`, el));
    return map;
  }, []);

  // Find It game hook (always called, but only active when hunt mode + find + playing)
  const findItStarted = mode === "hunt" && huntPhase === "playing";
  const findItGame = useFindItGame(level, findItStarted);

  // Watch for Find It game over (timer expired)
  useEffect(() => {
    if (findItStarted && findItGame.gameOver) {
      setHuntScore({ score: findItGame.score, total: findItGame.total });
      setHuntPhase("gameover");
      setHuntPlaying(false);
    }
  }, [findItStarted, findItGame.gameOver, findItGame.score, findItGame.total]);

  // Click handler
  const handleElementClick = useCallback(
    (element: Element) => {
      // Find It mode: intercept clicks for game
      if (mode === "hunt" && huntPhase === "playing") {
        const result = findItGame.handleElementClick(element);
        if (result) {
          setHuntScore(result);
          setHuntPhase("gameover");
          setHuntPlaying(false);
        }
        return;
      }

      if (mode === "bonding") {
        if (!bondElements[0]) {
          setBondElements([element, null]);
        } else if (!bondElements[1] && element.atomicNumber !== bondElements[0].atomicNumber) {
          setBondElements([bondElements[0], element]);
        } else {
          setBondElements([element, null]);
        }
        return;
      }
      setSelectedElement(element);
    },
    [mode, bondElements, huntPhase, findItGame]
  );

  const handleModeChange = useCallback(
    (newMode: PeriodicTableMode) => {
      setMode(newMode);
      setSelectedElement(null);
      setBondElements([null, null]);
      setActiveCollection(null);
      if (newMode === "trends" && !activeTrend) setActiveTrend("atomicRadius");
      if (newMode !== "families") setHighlightedFamily(null);
      // Reset hunt state
      if (newMode === "hunt") { setHuntPhase("menu"); setHuntPlaying(false); }
    },
    [activeTrend]
  );

  const handleTrendChange = useCallback((trend: TrendType) => {
    setActiveTrend(trend);
    setTrendWaveKey((k) => k + 1);
  }, []);

  const handleCollectionSelect = useCallback((collection: ThematicCollection | null) => {
    setActiveCollection(collection);
    if (collection && mode !== "collections") setMode("collections");
  }, [mode]);

  // Selection checks
  const isElementSelected = useCallback(
    (el: Element) => selectedElement?.atomicNumber === el.atomicNumber,
    [selectedElement]
  );

  // Modes config — text-only, no icons (cleaner)
  const modes: { id: PeriodicTableMode; label: string }[] = [
    { id: "explore", label: "Explore" },
    { id: "families", label: "Families" },
    { id: "trends", label: "Trends" },
    { id: "bonding", label: "Bond Lab" },
    { id: "collections", label: "Collections" },
    { id: "hunt", label: "Element Hunt" },
    { id: "quiz", label: "Quiz" },
  ];


  // Has a side panel open?

  // Compute trend wave delay: cells further from top-left get later delay
  const getTrendDelay = (row: number, col: number) => {
    if (mode !== "trends") return 0;
    // diagonal wave from top-left
    return (row + col) * 30; // ~30ms per step, max ~750ms
  };

  // ── Render a single cell ──
  const renderCell = (row: number, col: number) => {
    const el = elementAt.get(`${row}-${col}`);

    // Lanthanide/actinide placeholders
    if (!el && row === 6 && col === 3) {
      return (
        <div
          key="ph-6-3"
          className="flex items-center justify-center h-full text-[7px] text-teal-500/60 font-medium rounded-md border border-teal-200/40 bg-teal-50/30"
        >
          57-71
        </div>
      );
    }
    if (!el && row === 7 && col === 3) {
      return (
        <div
          key="ph-7-3"
          className="flex items-center justify-center h-full text-[7px] text-rose-500/60 font-medium rounded-md border border-rose-200/40 bg-rose-50/30"
        >
          89-103
        </div>
      );
    }

    if (!el) return null;

    // Dimming logic
    const isDimmed =
      (highlightedFamily !== null && el.category !== highlightedFamily) ||
      (collectionMembers !== null && !collectionMembers.has(el.atomicNumber));

    const isHighlighted = collectionMembers !== null && collectionMembers.has(el.atomicNumber);

    // Trend values
    let trendValue: number | null = null;
    if (activeTrend && mode === "trends") {
      trendValue = getTrendValue(el, activeTrend);
    }

    return (
      <ElementCell
        key={`el-${el.atomicNumber}`}
        element={el}
        isSelected={isElementSelected(el)}
        isBondingFirst={bondElements[0]?.atomicNumber === el.atomicNumber || bondElements[1]?.atomicNumber === el.atomicNumber}
        isBondingTarget={mode === "bonding" && bondElements[0] !== null && !bondElements[1]}
        isDimmed={isDimmed}
        isHighlighted={isHighlighted}
        trendValue={mode === "trends" ? trendValue : undefined}
        trendMax={mode === "trends" ? trendStats?.max : undefined}
        trendMin={mode === "trends" ? trendStats?.min : undefined}
        trendDelay={getTrendDelay(row, col)}
        showValenceDots={mode !== "trends"}
        onClick={handleElementClick}
      />
    );
  };


  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 glass-panel !rounded-none border-x-0 border-t-0">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Logo size={28} />
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none">Periodic Table</h1>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">Chemistry Lab</p>
              </div>
            </div>

            {/* Mode tabs — text-only, underline active */}
            <nav className="flex items-center gap-0.5 overflow-x-auto collection-bar">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  className={`
                    relative px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors
                    ${
                      mode === m.id
                        ? "text-gray-800 dark:text-gray-100"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    }
                  `}
                >
                  {m.label}
                  {mode === m.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-gray-800 dark:bg-gray-200" />
                  )}
                </button>
              ))}
            </nav>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark"
                ? <Sun size={16} className="text-gray-400 dark:text-gray-400" />
                : <Moon size={16} className="text-gray-400" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Two-column layout: Table + Right Panel ── */}
      <div className="flex mx-auto px-2 sm:px-4 py-3 sm:py-4 gap-4">
        {/* ── Left: Main content area ── */}
        <div className="flex-1 min-w-0 lg:mr-[400px]">
          {/* Periodic Table Grid */}
          <div className="max-w-[1200px]">
            {/* Group numbers header */}
            <div
              className="grid gap-[3px] sm:gap-1 mb-1"
              style={{ gridTemplateColumns: "20px repeat(18, minmax(0, 1fr))" }}
            >
              <div /> {/* spacer for period labels */}
              {Array.from({ length: 18 }, (_, i) => (
                <div
                  key={`g-${i + 1}`}
                  className="text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 text-center font-medium"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Main grid: rows 1–7 */}
            <div ref={gridRef} key={`wave-${trendWaveKey}`}>
              {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                <div
                  key={`row-${row}`}
                  className="grid gap-[3px] sm:gap-1 mb-[3px] sm:mb-1"
                  style={{ gridTemplateColumns: "20px repeat(18, minmax(0, 1fr))" }}
                >
                  {/* Period label */}
                  <div className="flex items-center justify-center text-[9px] sm:text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                    {row}
                  </div>
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={`cell-${row}-${i + 1}`} className="min-h-[40px] sm:min-h-[52px]">
                      {renderCell(row, i + 1)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Gap */}
            <div className="h-2 sm:h-3" />

            {/* Lanthanides (row 8) */}
            <div
              className="grid gap-[3px] sm:gap-1 mb-[3px] sm:mb-1"
              style={{ gridTemplateColumns: "20px repeat(18, minmax(0, 1fr))" }}
            >
              <div className="flex items-center justify-center text-[8px] text-teal-400 font-medium">
                Ln
              </div>
              <div /> {/* col 1 spacer */}
              <div /> {/* col 2 spacer */}
              {Array.from({ length: 15 }, (_, i) => (
                <div key={`ln-${i}`} className="min-h-[40px] sm:min-h-[52px]">{renderCell(8, i + 3)}</div>
              ))}
              <div /> {/* col 18 spacer */}
            </div>

            {/* Actinides (row 9) */}
            <div
              className="grid gap-[3px] sm:gap-1"
              style={{ gridTemplateColumns: "20px repeat(18, minmax(0, 1fr))" }}
            >
              <div className="flex items-center justify-center text-[8px] text-rose-400 font-medium">
                Ac
              </div>
              <div /> {/* col 1 spacer */}
              <div /> {/* col 2 spacer */}
              {Array.from({ length: 15 }, (_, i) => (
                <div key={`ac-${i}`} className="min-h-[40px] sm:min-h-[52px]">{renderCell(9, i + 3)}</div>
              ))}
              <div /> {/* col 18 spacer */}
            </div>


            {/* Legend strip — hidden during trend mode */}
            {mode !== "trends" && (
              <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">Valence electrons:</span>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <span key={n} className="flex items-center gap-0.5">
                    <span className="flex gap-[2px]">
                      {Array.from({ length: n }, (_, i) => (
                        <span key={i} className="w-[4px] h-[4px] rounded-full bg-gray-400 dark:bg-gray-500" />
                      ))}
                    </span>
                    <span className="text-[9px] text-gray-400 dark:text-gray-500 ml-0.5">= {n}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Permanent Right Panel (desktop) ── */}
        <div className="fixed top-16 right-0 bottom-0 w-[400px] z-30 hidden lg:flex flex-col bg-white dark:bg-[var(--bg-secondary)] border-x border-gray-200/60 dark:border-white/10">
          <div className="flex-1 overflow-y-auto collection-bar">
            <AnimatePresence mode="wait">
              {/* Element detail — highest priority */}
              {selectedElement && mode !== "bonding" && (
                <motion.div
                  key={`detail-${selectedElement.atomicNumber}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ElementDetailCard
                    element={selectedElement}
                    level={level}
                    onClose={() => setSelectedElement(null)}
                  />
                </motion.div>
              )}

              {/* Bonding panel */}
              {bondElements[0] && bondElements[1] && (
                <motion.div
                  key="bonding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <BondingPanel
                    elementA={bondElements[0]}
                    elementB={bondElements[1]}
                    onClose={() => setBondElements([null, null])}
                  />
                </motion.div>
              )}

              {/* Family info */}
              {!selectedElement && mode === "families" && (
                <motion.div
                  key={`family-${highlightedFamily || "legend"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4">
                    <FamilyLegend
                      highlightedFamily={highlightedFamily}
                      onFamilyClick={(fam) =>
                        setHighlightedFamily(fam === highlightedFamily ? null : fam)
                      }
                    />
                  </div>
                  {highlightedFamily && (
                    <FamilyInfoPanel
                      selectedFamily={highlightedFamily}
                      level={level}
                      onClose={() => setHighlightedFamily(null)}
                    />
                  )}
                </motion.div>
              )}

              {/* Trends */}
              {!selectedElement && mode === "trends" && (
                <motion.div
                  key="trends"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4">
                    <TrendSelector
                      activeTrend={activeTrend}
                      onTrendChange={handleTrendChange}
                      level={level}
                    />
                  </div>
                </motion.div>
              )}

              {/* Bonding instructions */}
              {!selectedElement && mode === "bonding" && !bondElements[1] && (
                <motion.div
                  key="bonding-instructions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Bond Lab</h3>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-4">Pick two elements to predict how they bond — ionic, covalent, or metallic.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {!bondElements[0]
                        ? "Select the first element from the table to begin."
                        : `${bondElements[0].name} selected — now pick the second element.`}
                    </p>
                    {bondElements[0] && (
                      <button
                        onClick={() => setBondElements([null, null])}
                        className="mt-3 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
                      >
                        Reset selection
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Collections */}
              {!selectedElement && mode === "collections" && (
                <motion.div
                  key="collections"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Collections</h3>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-4">See where elements appear in the real world — from your phone to the stars.</p>

                    {/* Selected collection detail */}
                    {activeCollection && (
                      <div className="mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">{activeCollection.name}</h4>
                          <button
                            onClick={() => handleCollectionSelect(null)}
                            className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium shrink-0"
                          >
                            Clear
                          </button>
                        </div>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{activeCollection.description}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{activeCollection.elements.length} elements highlighted on the table</p>
                      </div>
                    )}

                    {/* Grouped by category */}
                    {(["everyday", "technology", "biology", "environment", "space", "history"] as const).map((cat) => {
                      const catCollections = allCollections.filter((c) => c.category === cat);
                      if (catCollections.length === 0) return null;
                      const catLabels: Record<string, string> = {
                        everyday: "Everyday Life",
                        technology: "Technology",
                        biology: "Life Sciences",
                        environment: "Earth & Environment",
                        space: "Space",
                        history: "History",
                      };
                      return (
                        <div key={cat} className="mb-3">
                          <div className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-1">{catLabels[cat]}</div>
                          <div className="space-y-0">
                            {catCollections.map((c) => {
                              const isActive = activeCollection?.id === c.id;
                              return (
                                <button
                                  key={c.id}
                                  onClick={() => handleCollectionSelect(isActive ? null : c)}
                                  className={`
                                    w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left text-[13px] transition-all
                                    ${isActive
                                      ? "bg-gray-800 dark:bg-white/15 text-white"
                                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                    }
                                  `}
                                >
                                  <span className="font-medium truncate">{c.name}</span>
                                  <span className={`text-[10px] ${isActive ? "text-gray-400 dark:text-gray-500" : "text-gray-300 dark:text-gray-500"}`}>{c.elements.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Element Hunt — right panel states */}
              {!selectedElement && mode === "hunt" && (
                <motion.div
                  key={`hunt-${huntPhase}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {huntPhase === "menu" && (
                    <ElementHuntMenu
                      level={level}
                      onStart={() => {
                        setHuntPhase("playing");
                        setHuntPlaying(true);
                      }}
                    />
                  )}
                  {huntPhase === "playing" && (
                    <FindItHUD
                      targetName={findItGame.target?.name ?? ""}
                      timeLeft={findItGame.timeLeft}
                      score={findItGame.score}
                      total={findItGame.total}
                      streak={findItGame.streak}
                      progress={(findItGame.current / findItGame.total) * 100}
                      feedback={findItGame.feedback}
                      onEnd={() => {
                        const result = findItGame.endEarly();
                        setHuntScore(result);
                        setHuntPhase("gameover");
                        setHuntPlaying(false);
                      }}
                    />
                  )}
                  {huntPhase === "gameover" && (
                    <ElementHuntResults
                      score={huntScore.score}
                      total={huntScore.total}
                      onPlayAgain={() => {
                        setHuntPhase("playing");
                        setHuntPlaying(true);
                      }}
                      onMenu={() => {
                        setHuntPhase("menu");
                        setHuntPlaying(false);
                      }}
                    />
                  )}
                </motion.div>
              )}

              {/* Quiz — right panel */}
              {!selectedElement && mode === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <QuizPanel level={level} onClose={() => handleModeChange("explore")} />
                </motion.div>
              )}

              {/* Default: welcome / empty state */}
              {!selectedElement && !(bondElements[0] && bondElements[1]) && mode !== "families" && mode !== "trends" && mode !== "bonding" && mode !== "collections" && mode !== "hunt" && mode !== "quiz" && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-4xl font-black text-gray-200 dark:text-gray-700 tracking-tight mb-2">118</p>
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500">elements to explore</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Click any element to begin</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile panel (bottom sheet) */}
        <AnimatePresence>
          {selectedElement && mode !== "bonding" && (
            <motion.div
              key="mobile-detail"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={springs.gentle}
              className="fixed inset-x-0 bottom-0 z-50 lg:hidden max-h-[70vh] overflow-y-auto glass-panel-lg !rounded-b-none"
            >
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mt-2 mb-1" />
              <ElementDetailCard
                element={selectedElement}
                level={level}
                onClose={() => setSelectedElement(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>



    </div>
  );
}
