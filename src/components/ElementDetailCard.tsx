"use client";

import { Element, LearningLevel } from "@/lib/types";
import { categoryNames } from "@/data/elements";
import { getFamilyInfo } from "@/data/families";
import ElectronShell3D from "./ElectronShell3D";
import SuccessiveIEChart from "./SuccessiveIEChart";
import { X } from "lucide-react";

// Category → RGB used as the single accent throughout the card
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

interface ElementDetailCardProps {
  element: Element;
  level: LearningLevel;
  onClose: () => void;
}

export default function ElementDetailCard({
  element,
  level,
  onClose,
}: ElementDetailCardProps) {
  const family = getFamilyInfo(element.category);
  const rgb = categoryRgb[element.category] || categoryRgb["unknown"];

  const getExplanation = () => {
    if (element.valenceElectrons === null) return element.summary;

    const ve = element.valenceElectrons;
    const shells = element.shells.join(", ");

    if (level === "beginner") {
      if (element.category === "noble-gas") {
        return `${element.name} already has a full outer shell (${shells}). That is why it is very unreactive.`;
      }
      if (ve <= 3 && ve > 0) {
        return `${element.name} has ${ve} electron${ve > 1 ? "s" : ""} in its outer shell (${shells}). It becomes more stable by losing ${ve > 1 ? "those electrons" : "that electron"}.`;
      }
      if (ve >= 5 && ve <= 7) {
        const need = 8 - ve;
        return `${element.name} has ${ve} electrons in its outer shell (${shells}). It becomes more stable by gaining ${need} electron${need > 1 ? "s" : ""}.`;
      }
      return `${element.name} has ${ve} valence electrons. Its electron shells are ${shells}. ${element.summary}`;
    }

    if (level === "school") {
      const parts = [
        `${element.name} is in Period ${element.period}${element.group ? `, Group ${element.group}` : ""}.`,
        `Electron arrangement: ${shells}.`,
        `Valence electrons: ${ve}.`,
      ];
      if (element.commonIons.length > 0) {
        parts.push(`Common ion${element.commonIons.length > 1 ? "s" : ""}: ${element.commonIons.join(", ")}.`);
      }
      if (element.commonOxidationStates.length > 0) {
        parts.push(`Common oxidation state${element.commonOxidationStates.length > 1 ? "s" : ""}: ${element.commonOxidationStates.map(s => (s > 0 ? `+${s}` : `${s}`)).join(", ")}.`);
      }
      return parts.join("\n");
    }

    const parts = [
      `Electron configuration: ${element.electronConfiguration}`,
      `Block: ${element.block}-block`,
      `Shells: ${shells}`,
    ];
    if (element.electronegativity) parts.push(`Electronegativity: ${element.electronegativity}`);
    if (element.ionizationEnergy) parts.push(`First ionisation energy: ${element.ionizationEnergy} kJ/mol`);
    if (element.atomicRadius) parts.push(`Atomic radius: ${element.atomicRadius} pm`);
    if (element.meltingPoint) parts.push(`Melting point: ${element.meltingPoint} K`);
    if (element.boilingPoint) parts.push(`Boiling point: ${element.boilingPoint} K`);
    return parts.join("\n");
  };

  // Build stat items based on level
  const stats: { label: string; value: string }[] = [
    { label: "Atomic Mass", value: element.atomicMass?.toFixed(2) ?? "—" },
    { label: "Valence e\u207b", value: element.valenceElectrons?.toString() ?? "—" },
    { label: "Shells", value: element.shells.join(", ") },
  ];

  if (level !== "beginner") {
    stats.push({ label: "Phase", value: element.phaseAtRoomTemp.charAt(0).toUpperCase() + element.phaseAtRoomTemp.slice(1) });
    stats.push({ label: "Block", value: `${element.block}-block` });
  }

  if (element.commonIons.length > 0) {
    stats.push({ label: "Common Ion", value: element.commonIons[0] });
  }

  return (
    <div>
      {/* ── Hero header with gradient ── */}
      <div
        className="relative px-5 pt-5 pb-4"
        style={{
          background: `linear-gradient(180deg, rgba(${rgb}, 0.08) 0%, rgba(${rgb}, 0.02) 100%)`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-white/60 dark:hover:bg-white/5 rounded-lg transition"
          aria-label="Close"
        >
          <X size={14} className="text-gray-400 dark:text-gray-500" />
        </button>

        {/* Symbol + Name */}
        <div className="flex items-end gap-4 mb-3">
          <div className="flex flex-col items-center">
            <span
              className="text-5xl font-black leading-none tracking-tight"
              style={{ color: `rgb(${rgb})` }}
            >
              {element.symbol}
            </span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-1">{element.atomicNumber}</span>
          </div>
          <div className="pb-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">{element.name}</h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: `rgba(${rgb}, 0.8)` }}>
              {categoryNames[element.category]}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {element.group ? `Group ${element.group} · ` : ""}Period {element.period} · {element.block}-block
            </p>
          </div>
        </div>

        {/* Thin accent line */}
        <div className="h-[2px] rounded-full" style={{ background: `rgba(${rgb}, 0.2)` }} />
      </div>

      <div className="px-5 pb-5">
        {/* ── 3D Electron Shell ── */}
        <div className="h-40 rounded-xl overflow-hidden my-4" style={{ background: `rgba(${rgb}, 0.04)` }}>
          <ElectronShell3D
            shells={element.shells}
            symbol={element.symbol}
            className="h-full w-full"
          />
        </div>

        {/* ── Stats row — Apple-style big numbers ── */}
        <div className="grid grid-cols-3 gap-0 mb-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-2.5 text-center ${i > 0 ? "border-l border-gray-100 dark:border-white/10" : ""}`}
            >
              <div className="text-[15px] font-bold text-gray-800 dark:text-gray-100 leading-tight">{s.value}</div>
              <div className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Successive IE Chart ── */}
        {element.successiveIE && element.successiveIE.length > 1 && (
          <SuccessiveIEChart energies={element.successiveIE} rgb={rgb} />
        )}

        {/* ── Info sections ── */}
        <div className="space-y-4 mb-5">
          <InfoSection
            rgb={rgb}
            label={level === "beginner" ? "Core Idea" : level === "school" ? "Details" : "Advanced Data"}
            text={getExplanation()}
          />

          {family && (
            <InfoSection rgb={rgb} label={family.name} text={family.commonBehavior}>
              {level !== "advanced" && (
                <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-2 italic">{family.memoryHook}</p>
              )}
            </InfoSection>
          )}

          <InfoSection rgb={rgb} label="In the Real World" text={element.realWorld} />
          <InfoSection rgb={rgb} label="Where Is It Found?" text={element.abundance} />

          {element.jeeNote && (
            <InfoSection rgb={rgb} label="JEE Focus" text={element.jeeNote} />
          )}
        </div>

      </div>
    </div>
  );
}

function InfoSection({
  rgb,
  label,
  text,
  children,
}: {
  rgb: string;
  label: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: `rgba(${rgb}, 0.65)` }}
      >
        {label}
      </div>
      <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{text}</p>
      {children}
    </div>
  );
}
