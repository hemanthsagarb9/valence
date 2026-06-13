"use client";

import { Element } from "@/lib/types";
import { predictBond } from "@/lib/bondingRules";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface BondingPanelProps {
  elementA: Element;
  elementB: Element;
  onClose: () => void;
}

const bondAccent: Record<string, string> = {
  ionic: "59, 130, 246",    // blue
  covalent: "16, 185, 129", // emerald
  metallic: "234, 179, 8",  // amber
  unlikely: "107, 114, 128", // gray
};

export default function BondingPanel({ elementA, elementB, onClose }: BondingPanelProps) {
  const prediction = predictBond(elementA, elementB);
  const rgb = bondAccent[prediction.bondType] || bondAccent.unlikely;

  const showFormula = prediction.compoundFormula !== "?" && prediction.compoundFormula !== "—" && prediction.compoundFormula !== "alloy";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background: `linear-gradient(180deg, rgba(${rgb}, 0.08) 0%, rgba(${rgb}, 0.02) 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {elementA.symbol} + {elementB.symbol}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/60 dark:hover:bg-white/20 rounded-lg transition shrink-0"
            aria-label="Close"
          >
            <X size={14} className="text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        {/* Bond type + formula */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-sm font-semibold capitalize"
            style={{ color: `rgb(${rgb})` }}
          >
            {prediction.bondType} Bond
          </span>
          {showFormula && (
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              {prediction.compoundFormula}
            </span>
          )}
        </div>
        {showFormula && prediction.compoundName && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{prediction.compoundName}</p>
        )}

        <div className="h-[2px] rounded-full mt-3" style={{ background: `rgba(${rgb}, 0.2)` }} />
      </div>

      <div className="px-5 pb-5 space-y-4">
        {/* Reason */}
        <div className="pt-2">
          <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">{prediction.reason}</p>
        </div>

        {/* Ions */}
        {prediction.cation && prediction.anion && (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center py-3">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{prediction.cation.formula}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">Cation</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Loses {prediction.cation.charge} e⁻
              </div>
            </div>
            <div className="text-center py-3 border-l border-gray-100 dark:border-white/10">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{prediction.anion.formula}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">Anion</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Gains {Math.abs(prediction.anion.charge)} e⁻
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: `rgba(${rgb}, 0.65)` }}
          >
            Step by Step
          </div>
          <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {prediction.explanation}
          </p>
        </div>

        {/* Caveat */}
        {prediction.caveat && (
          <p className="text-[12px] text-gray-400 dark:text-gray-500 italic">{prediction.caveat}</p>
        )}
      </div>
    </motion.div>
  );
}
