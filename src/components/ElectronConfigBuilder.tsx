"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { elements } from "@/data/elements";
import { Element } from "@/lib/types";
import { RotateCcw, Check, X } from "lucide-react";

// Aufbau order for filling orbitals
const AUFBAU_ORDER = [
  "1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p",
  "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p",
];

const MAX_ELECTRONS: Record<string, number> = {
  s: 2, p: 6, d: 10, f: 14,
};

function getOrbitalType(orbital: string): string {
  return orbital[orbital.length - 1];
}

function getMaxForOrbital(orbital: string): number {
  return MAX_ELECTRONS[getOrbitalType(orbital)] ?? 0;
}

// Generate the correct electron config for an element (Aufbau, no exceptions)
function aufbauConfig(atomicNumber: number): string[] {
  const config: string[] = [];
  let remaining = atomicNumber;

  for (const orbital of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const max = getMaxForOrbital(orbital);
    const fill = Math.min(remaining, max);
    config.push(`${orbital}${toSuperscript(fill)}`);
    remaining -= fill;
  }

  return config;
}

function toSuperscript(n: number): string {
  const superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  return n.toString().split("").map(d => superscripts[parseInt(d)]).join("");
}

function fromSuperscript(s: string): number {
  const map: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
  return parseInt(s.split("").map(c => map[c] ?? c).join(""));
}

interface ElectronConfigBuilderProps {
  onClose: () => void;
}

export default function ElectronConfigBuilder({ onClose }: ElectronConfigBuilderProps) {
  const pool = useMemo(() => elements.filter(e => e.atomicNumber <= 36), []);
  const [target, setTarget] = useState<Element | null>(null);
  const [placedOrbitals, setPlacedOrbitals] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Pick random element on mount (client only to avoid hydration mismatch)
  useEffect(() => {
    setTarget(pool[Math.floor(Math.random() * pool.length)]);
  }, [pool]);

  const correctConfig = useMemo(() => target ? aufbauConfig(target.atomicNumber) : [], [target]);

  // How many electrons placed so far
  const electronsPlaced = useMemo(() => {
    return placedOrbitals.reduce((sum, o) => {
      const match = o.match(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/);
      return sum + (match ? fromSuperscript(match[0]) : 0);
    }, 0);
  }, [placedOrbitals]);

  const electronsNeeded = target?.atomicNumber ?? 0;
  const remaining = electronsNeeded - electronsPlaced;

  // Available orbitals to add (in Aufbau order, only those not yet placed)
  const availableOrbitals = useMemo(() => {
    const placed = new Set(placedOrbitals.map(o => o.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/, "")));
    return AUFBAU_ORDER.filter(o => !placed.has(o)).slice(0, 6); // show next 6
  }, [placedOrbitals]);

  const addOrbital = useCallback((orbital: string) => {
    if (remaining <= 0) return;
    const max = getMaxForOrbital(orbital);
    const fill = Math.min(remaining, max);
    setPlacedOrbitals(prev => [...prev, `${orbital}${toSuperscript(fill)}`]);
  }, [remaining]);

  const removeLastOrbital = useCallback(() => {
    setPlacedOrbitals(prev => prev.slice(0, -1));
    setResult(null);
  }, []);

  const checkAnswer = useCallback(() => {
    const userConfig = placedOrbitals.join(" ");
    const correct = correctConfig.join(" ");
    const isCorrect = userConfig === correct;
    setResult(isCorrect ? "correct" : "wrong");
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [placedOrbitals, correctConfig]);

  const nextElement = useCallback(() => {
    setTarget(pool[Math.floor(Math.random() * pool.length)]);
    setPlacedOrbitals([]);
    setResult(null);
  }, [pool]);

  const reset = useCallback(() => {
    setPlacedOrbitals([]);
    setResult(null);
  }, []);

  if (!target) return null;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Electron Config Builder</h3>
        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          {score.correct}/{score.total}
        </span>
      </div>

      {/* Target element */}
      <div className="text-center mb-5">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Build the configuration for</p>
        <p className="text-3xl font-black text-gray-800 dark:text-gray-100">{target.symbol}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{target.name} (Z = {target.atomicNumber})</p>
      </div>

      {/* Built config so far */}
      <div className="mb-4">
        <div className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Your Configuration</div>
        <div className="min-h-[40px] p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
          {placedOrbitals.length > 0 ? (
            <span className="text-[14px] font-mono text-gray-800 dark:text-gray-100">
              {placedOrbitals.join("  ")}
            </span>
          ) : (
            <span className="text-[13px] text-gray-300 dark:text-gray-600 italic">
              Tap orbitals below to build...
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {electronsPlaced}/{electronsNeeded} electrons
          </span>
          {placedOrbitals.length > 0 && !result && (
            <button
              onClick={removeLastOrbital}
              className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            >
              Undo
            </button>
          )}
        </div>
      </div>

      {/* Orbital buttons */}
      {!result && (
        <div className="mb-4">
          <div className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Add Orbital</div>
          <div className="grid grid-cols-3 gap-1.5">
            {availableOrbitals.map(orbital => {
              const type = getOrbitalType(orbital);
              const max = MAX_ELECTRONS[type];
              const fill = Math.min(remaining, max);
              const disabled = remaining <= 0;

              const typeColors: Record<string, string> = {
                s: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
                p: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                d: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                f: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
              };

              return (
                <button
                  key={orbital}
                  onClick={() => addOrbital(orbital)}
                  disabled={disabled}
                  className={`
                    px-3 py-2 rounded-lg text-[13px] font-mono font-semibold transition-all
                    ${disabled
                      ? "bg-gray-50 text-gray-300 dark:bg-white/5 dark:text-gray-600 cursor-not-allowed"
                      : `${typeColors[type]} hover:scale-105 active:scale-95`
                    }
                  `}
                >
                  {orbital}{toSuperscript(fill)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Check / Skip */}
      {!result && placedOrbitals.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={checkAnswer}
            className="w-full py-2.5 rounded-lg bg-gray-800 dark:bg-white/15 text-white text-sm font-medium hover:bg-gray-900 dark:hover:bg-white/20 transition"
          >
            Check{remaining > 0 ? ` (${remaining} e⁻ remaining)` : ""}
          </button>
          <button
            onClick={() => { setResult("wrong"); setScore(prev => ({ correct: prev.correct, total: prev.total + 1 })); }}
            className="w-full py-2 rounded-lg text-gray-400 dark:text-gray-500 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            Show Answer
          </button>
        </div>
      )}

      {result && (
        <div>
          <div className={`flex items-center gap-2 mb-3 ${
            result === "correct" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}>
            {result === "correct" ? <Check size={16} /> : <X size={16} />}
            <span className="text-sm font-semibold">
              {result === "correct" ? "Correct!" : "Not quite"}
            </span>
          </div>

          {result === "wrong" && (
            <div className="mb-3">
              <div className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Correct answer</div>
              <p className="text-[13px] font-mono text-gray-600 dark:text-gray-300">
                {correctConfig.join("  ")}
              </p>
            </div>
          )}

          {/* Show if this element has an anomalous config */}
          {target.jeeNote?.includes("config") && (
            <p className="text-[12px] text-amber-600 dark:text-amber-400 mb-3 leading-relaxed">
              Note: {target.name} has an anomalous configuration. The Aufbau prediction differs from the actual config due to extra stability of half-filled/fully-filled d subshells.
            </p>
          )}

          <button
            onClick={nextElement}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gray-800 dark:bg-white/15 text-white text-sm font-medium hover:bg-gray-900 dark:hover:bg-white/20 transition"
          >
            <RotateCcw size={13} /> Next Element
          </button>
        </div>
      )}
    </div>
  );
}
