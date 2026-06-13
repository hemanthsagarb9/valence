"use client";

import { Element } from "@/lib/types";
import { categoryBgOnly } from "@/data/elements";
import { motion } from "framer-motion";

interface ElementTileProps {
  element: Element;
  isSelected: boolean;
  isHighlighted: boolean;
  trendValue?: number | null;
  trendMax?: number;
  trendMin?: number;
  dimmed?: boolean;
  onClick: (element: Element) => void;
}

export default function ElementTile({
  element,
  isSelected,
  isHighlighted,
  trendValue,
  trendMax,
  trendMin,
  dimmed = false,
  onClick,
}: ElementTileProps) {
  const baseClasses = categoryBgOnly[element.category] || categoryBgOnly["unknown"];

  let trendBg = "";
  if (trendValue !== undefined && trendValue !== null && trendMax && trendMin) {
    const normalized = (trendValue - trendMin) / (trendMax - trendMin);
    const hue = 220 - normalized * 180; // blue(220) -> red(40)
    const sat = 60 + normalized * 30;
    const light = 92 - normalized * 30;
    trendBg = `hsl(${hue}, ${sat}%, ${light}%)`;
  }

  return (
    <motion.button
      layout
      whileHover={{ scale: 1.08, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(element)}
      className={`
        relative flex flex-col items-center justify-center
        border rounded-md cursor-pointer transition-all duration-150
        min-w-0 p-0.5 sm:p-1
        ${isSelected ? "ring-2 ring-blue-500 shadow-lg z-10" : ""}
        ${isHighlighted ? "ring-2 ring-amber-400" : ""}
        ${dimmed ? "opacity-25" : ""}
        ${!trendBg ? baseClasses : "border-gray-300"}
      `}
      style={trendBg ? { backgroundColor: trendBg } : undefined}
      aria-label={`${element.name}, atomic number ${element.atomicNumber}, symbol ${element.symbol}`}
    >
      <span className="text-[8px] sm:text-[10px] leading-tight text-gray-500 font-medium">
        {element.atomicNumber}
      </span>
      <span className="text-sm sm:text-lg font-bold leading-tight text-gray-800">
        {element.symbol}
      </span>
      <span className="text-[7px] sm:text-[9px] leading-tight text-gray-600 truncate w-full text-center">
        {element.name}
      </span>
      <span className="text-[7px] sm:text-[8px] leading-tight text-gray-400 hidden sm:block">
        {element.atomicMass?.toFixed(element.atomicMass < 10 ? 3 : 2) ?? "—"}
      </span>
    </motion.button>
  );
}
