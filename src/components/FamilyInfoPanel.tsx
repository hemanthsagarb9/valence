"use client";

import { ElementCategory, LearningLevel } from "@/lib/types";
import { getFamilyInfo } from "@/data/families";

const categoryRgb: Record<string, string> = {
  "alkali-metal":         "239, 68, 68",
  "alkaline-earth-metal": "249, 115, 22",
  "transition-metal":     "234, 179, 8",
  "post-transition-metal":"132, 204, 22",
  "metalloid":            "6, 182, 212",
  "reactive-nonmetal":    "59, 130, 246",
  "halogen":              "139, 92, 246",
  "noble-gas":            "236, 72, 153",
  "lanthanide":           "20, 184, 166",
  "actinide":             "244, 63, 94",
  "unknown":              "107, 114, 128",
};

interface FamilyInfoPanelProps {
  selectedFamily: ElementCategory | null;
  level: LearningLevel;
  onClose: () => void;
}

export default function FamilyInfoPanel({ selectedFamily, level, onClose }: FamilyInfoPanelProps) {
  const family = selectedFamily ? getFamilyInfo(selectedFamily) : null;
  if (!family) return null;

  const rgb = categoryRgb[selectedFamily!] || categoryRgb["unknown"];

  return (
    <div className="px-4 pb-5">
      {/* Thin divider — subtle, not a wall */}
      <div className="h-px bg-gray-100 dark:bg-white/10 mb-4" />

      {/* Title + location — no close button, legend handles deselection */}
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">{family.name}</h3>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 mb-3">{family.location}</p>

      {/* Definition — the main story */}
      <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{family.definition}</p>

      {/* Example elements */}
      <div className="flex gap-1.5 mb-5">
        {family.examples.map((sym) => (
          <div
            key={sym}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: `rgba(${rgb}, 0.08)`,
              color: `rgb(${rgb})`,
            }}
          >
            {sym}
          </div>
        ))}
      </div>

      {/* Content — flows as natural prose, minimal labeling */}
      <div className="space-y-3 text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          <span className="font-semibold text-gray-700 dark:text-gray-200">{family.valencePattern}.</span>
          {" "}{family.commonBehavior}
        </p>

        {level !== "advanced" && (
          <p className="text-gray-400 dark:text-gray-500 italic text-[12px]">{family.memoryHook}</p>
        )}
      </div>
    </div>
  );
}
