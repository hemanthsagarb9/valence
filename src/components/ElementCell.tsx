"use client";

import { Element, ElementCategory } from "@/lib/types";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

// Category color mapping → CSS custom property values
const categoryColorMap: Record<ElementCategory, string> = {
  "alkali-metal":        "239, 68, 68",    // red
  "alkaline-earth-metal":"249, 115, 22",   // orange
  "transition-metal":    "234, 179, 8",    // yellow
  "post-transition-metal":"132, 204, 22",  // lime
  "metalloid":           "6, 182, 212",    // cyan
  "reactive-nonmetal":   "59, 130, 246",   // blue
  "halogen":             "139, 92, 246",   // violet
  "noble-gas":           "236, 72, 153",   // pink
  "lanthanide":          "20, 184, 166",   // teal
  "actinide":            "244, 63, 94",    // rose
  "unknown":             "107, 114, 128",  // gray
};

const phaseIcon: Record<string, string> = {
  solid: "■",
  liquid: "●",
  gas: "○",
  unknown: "?",
};

interface ElementCellProps {
  element: Element;
  isSelected?: boolean;
  isBondingFirst?: boolean;
  isBondingTarget?: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  trendValue?: number | null;
  trendMax?: number;
  trendMin?: number;
  trendDelay?: number; // staggered delay for wave animation
  showValenceDots?: boolean;
  onClick: (element: Element) => void;
}

export default function ElementCell({
  element,
  isSelected = false,
  isBondingFirst = false,
  isBondingTarget = false,
  isDimmed = false,
  isHighlighted = false,
  trendValue,
  trendMax,
  trendMin,
  trendDelay = 0,
  showValenceDots = true,
  onClick,
}: ElementCellProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rgb = categoryColorMap[element.category] || categoryColorMap["unknown"];

  // Compute trend background if in trend mode
  let trendBg = "";
  const isTrendMode = trendMax !== undefined && trendMin !== undefined;
  const isTrendNoData = isTrendMode && (trendValue === undefined || trendValue === null);
  if (trendValue !== undefined && trendValue !== null && trendMax && trendMin && trendMax !== trendMin) {
    const normalized = (trendValue - trendMin) / (trendMax - trendMin);
    if (isDark) {
      // Dark mode: deep navy → vivid teal
      const sat = 40 + normalized * 40;    // 40% → 80%
      const light = 15 + normalized * 35;  // 15% → 50%
      trendBg = `hsl(174, ${sat}%, ${light}%)`;
    } else {
      // Light mode: light teal → deep teal
      const sat = 30 + normalized * 50;    // 30% → 80%
      const light = 95 - normalized * 50;  // 95% → 45%
      trendBg = `hsl(174, ${sat}%, ${light}%)`;
    }
  }

  // Determine selection classes
  let selectionClass = "";
  if (isSelected) selectionClass = "element-selected";
  else if (isBondingFirst) selectionClass = "element-bonding-first";
  else if (isBondingTarget) selectionClass = "ring-1 ring-amber-300/50";

  // Valence dots (max 8)
  const ve = element.valenceElectrons;
  const dots = ve !== null && ve > 0 ? Math.min(ve, 8) : 0;

  return (
    <motion.button
      onClick={() => onClick(element)}
      className={`
        element-cell flex flex-col items-center justify-center
        min-w-0 w-full h-full overflow-hidden p-[2px] sm:p-1
        ${selectionClass}
        ${isDimmed ? "collection-dimmed" : ""}
        ${isHighlighted ? "collection-highlighted" : ""}
      `}
      style={{
        backgroundColor: isTrendNoData
          ? (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)")
          : trendBg || `rgba(${rgb}, ${isDark ? 0.22 : 0.18})`,
        borderWidth: 1,
        borderColor: isTrendNoData
          ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")
          : trendBg ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)") : `rgba(${rgb}, 0.35)`,
        opacity: isTrendNoData ? 0.4 : undefined,
        transitionDelay: trendDelay ? `${trendDelay}ms` : undefined,
        ["--cell-rgb" as string]: rgb,
      }}
      whileHover={{
        scale: 1.08,
        zIndex: 20,
        borderColor: `rgba(${rgb}, 0.6)`,
        backgroundColor: trendBg || `rgba(${rgb}, 0.3)`,
        boxShadow: `0 0 16px rgba(${rgb}, 0.25)`,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={`${element.name}, element ${element.atomicNumber}, ${element.category.replace(/-/g, " ")}, ${element.phaseAtRoomTemp}, ${ve ?? 0} valence electrons`}
    >
      {/* Atomic number */}
      <span className="text-[7px] sm:text-[8px] font-medium opacity-40 self-start pl-[3px] leading-none">
        {element.atomicNumber}
      </span>

      {/* Symbol */}
      <span
        className="text-lg sm:text-xl font-bold leading-none tracking-tight"
        style={{ color: `rgba(${rgb}, 0.9)` }}
      >
        {element.symbol}
      </span>

      {/* Valence dots */}
      {showValenceDots && dots > 0 && (
        <div className="valence-dots mt-[1px]">
          {Array.from({ length: dots }).map((_, i) => (
            <span
              key={i}
              className="valence-dot"
              style={{ background: `rgba(${rgb}, 0.6)` }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}
