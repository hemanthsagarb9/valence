"use client";

import { ElementCategory } from "@/lib/types";
import { categoryNames } from "@/data/elements";

const categoryRgb: Record<ElementCategory, string> = {
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

interface FamilyLegendProps {
  highlightedFamily: ElementCategory | null;
  onFamilyClick: (category: ElementCategory) => void;
}

const familyOrder: ElementCategory[] = [
  "alkali-metal",
  "alkaline-earth-metal",
  "transition-metal",
  "post-transition-metal",
  "metalloid",
  "reactive-nonmetal",
  "halogen",
  "noble-gas",
  "lanthanide",
  "actinide",
];

export default function FamilyLegend({ highlightedFamily, onFamilyClick }: FamilyLegendProps) {
  const hasSelection = highlightedFamily !== null;

  return (
    <div className="grid grid-cols-2 gap-x-1 gap-y-0">
      {familyOrder.map((cat) => {
        const isActive = highlightedFamily === cat;
        const rgb = categoryRgb[cat];
        return (
          <button
            key={cat}
            onClick={() => onFamilyClick(cat)}
            className={`
              flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-[12px] transition-all
              ${isActive
                ? "font-semibold"
                : hasSelection
                ? "text-gray-300 dark:text-gray-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
            style={isActive ? {
              backgroundColor: `rgba(${rgb}, 0.08)`,
              color: `rgb(${rgb})`,
            } : undefined}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: `rgb(${rgb})`,
                opacity: isActive ? 1 : hasSelection ? 0.2 : 0.5,
              }}
            />
            <span className="truncate">{categoryNames[cat]}</span>
          </button>
        );
      })}
    </div>
  );
}
