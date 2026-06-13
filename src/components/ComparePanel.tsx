"use client";

import { Element } from "@/lib/types";
import { categoryNames } from "@/data/elements";
import { X, ArrowLeftRight } from "lucide-react";

interface ComparePanelProps {
  elementA: Element;
  elementB: Element;
  onClose: () => void;
}

export default function ComparePanel({ elementA, elementB, onClose }: ComparePanelProps) {
  const a = elementA;
  const b = elementB;

  const sameGroup = a.group !== null && b.group !== null && a.group === b.group;
  const samePeriod = a.period === b.period;
  const sameCategory = a.category === b.category;

  const similarities: string[] = [];
  const differences: string[] = [];

  if (sameGroup) similarities.push(`Both are in Group ${a.group}.`);
  if (samePeriod) similarities.push(`Both are in Period ${a.period}.`);
  if (sameCategory) similarities.push(`Both are ${categoryNames[a.category]}s.`);
  if (a.valenceElectrons === b.valenceElectrons && a.valenceElectrons !== null) {
    similarities.push(`Both have ${a.valenceElectrons} valence electron${a.valenceElectrons > 1 ? "s" : ""}.`);
  }

  if (!sameGroup && a.group && b.group) differences.push(`${a.name} is in Group ${a.group}, ${b.name} is in Group ${b.group}.`);
  if (!samePeriod) differences.push(`${a.name} is in Period ${a.period}, ${b.name} is in Period ${b.period}.`);
  if (!sameCategory) differences.push(`${a.name} is a ${categoryNames[a.category]}, ${b.name} is a ${categoryNames[b.category]}.`);

  if (a.atomicRadius && b.atomicRadius) {
    const larger = a.atomicRadius > b.atomicRadius ? a : b;
    const smaller = a.atomicRadius > b.atomicRadius ? b : a;
    differences.push(`${larger.name} (${larger.atomicRadius} pm) has a larger atomic radius than ${smaller.name} (${smaller.atomicRadius} pm).`);
  }

  if (a.electronegativity && b.electronegativity) {
    const more = a.electronegativity > b.electronegativity ? a : b;
    const less = a.electronegativity > b.electronegativity ? b : a;
    differences.push(`${more.name} (${more.electronegativity}) is more electronegative than ${less.name} (${less.electronegativity}).`);
  }

  if (a.ionizationEnergy && b.ionizationEnergy) {
    const higher = a.ionizationEnergy > b.ionizationEnergy ? a : b;
    const lower = a.ionizationEnergy > b.ionizationEnergy ? b : a;
    differences.push(`${higher.name} (${higher.ionizationEnergy} kJ/mol) has higher ionisation energy than ${lower.name} (${lower.ionizationEnergy} kJ/mol).`);
  }

  const getInsight = () => {
    if (sameGroup && a.group === 1) {
      const lower = a.period > b.period ? a : b;
      return `Both are alkali metals with 1 valence electron. ${lower.name} is more reactive because its outer electron is farther from the nucleus and easier to remove.`;
    }
    if (sameGroup && a.group === 17) {
      const upper = a.period < b.period ? a : b;
      return `Both are halogens with 7 valence electrons. ${upper.name} is more reactive because it is smaller and attracts electrons more strongly.`;
    }
    if (sameGroup && a.group === 18) {
      return `Both are noble gases with full outer shells. They are both very unreactive.`;
    }
    if (samePeriod && a.atomicRadius && b.atomicRadius) {
      const left = (a.group ?? 99) < (b.group ?? 99) ? a : b;
      return `Both are in Period ${a.period}. ${left.name} is larger because atomic radius decreases across a period as nuclear charge increases.`;
    }
    if (sameCategory) {
      return `They belong to the same family (${categoryNames[a.category]}) and share similar chemical properties.`;
    }
    return `${a.name} and ${b.name} have different chemical properties due to their different positions on the periodic table.`;
  };

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={16} className="text-violet-600" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            {a.symbol} vs {b.symbol}
          </h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition">
          <X size={16} className="text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <div className="px-4 pb-4 space-y-2.5">
        {/* Side by Side */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-3 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{a.symbol}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{a.name}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              #{a.atomicNumber} · {a.shells.join(", ")}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{b.symbol}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{b.name}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              #{b.atomicNumber} · {b.shells.join(", ")}
            </div>
          </div>
        </div>

        {/* Similarities */}
        {similarities.length > 0 && (
          <div className="info-card bg-emerald-50/80 border-emerald-100">
            <div className="text-xs font-semibold text-emerald-700 mb-1">Similarities</div>
            <ul className="text-sm text-emerald-900 space-y-0.5">
              {similarities.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Differences */}
        {differences.length > 0 && (
          <div className="info-card bg-orange-50/80 border-orange-100">
            <div className="text-xs font-semibold text-orange-700 mb-1">Differences</div>
            <ul className="text-sm text-orange-900 space-y-0.5">
              {differences.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Insight */}
        <div className="info-card bg-blue-50/80 border-blue-100">
          <div className="text-xs font-semibold text-blue-700 mb-1">Key Insight</div>
          <p className="text-sm text-blue-900">{getInsight()}</p>
        </div>
      </div>
    </div>
  );
}
