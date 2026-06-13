import { Element } from "./types";

export interface BondPrediction {
  bondType: "ionic" | "covalent" | "metallic" | "unlikely";
  reason: string;
  cation?: { symbol: string; charge: number; formula: string };
  anion?: { symbol: string; charge: number; formula: string };
  compoundFormula: string;
  compoundName: string;
  explanation: string;
  caveat?: string;
}

const anionSuffixes: Record<string, string> = {
  O: "oxide", S: "sulfide", Se: "selenide", Te: "telluride",
  N: "nitride", P: "phosphide",
  F: "fluoride", Cl: "chloride", Br: "bromide", I: "iodide", At: "astatide",
  H: "hydride",
};

function getCompoundName(metal: Element, nonMetal: Element): string {
  const suffix = anionSuffixes[nonMetal.symbol];
  if (!suffix) return "";
  // For transition metals with multiple oxidation states, add Roman numeral
  const metalName = metal.name.toLowerCase();
  return `${metal.name} ${suffix}`;
}

function isMetal(el: Element): boolean {
  return [
    "alkali-metal",
    "alkaline-earth-metal",
    "transition-metal",
    "post-transition-metal",
    "lanthanide",
    "actinide",
  ].includes(el.category);
}

function isNonMetal(el: Element): boolean {
  return ["reactive-nonmetal", "halogen", "noble-gas"].includes(el.category);
}

function getCommonCharge(el: Element): number | null {
  if (el.commonOxidationStates.length === 0) return null;
  if (el.category === "alkali-metal") return 1;
  if (el.category === "alkaline-earth-metal") return 2;
  if (el.category === "halogen") return -1;
  if (el.symbol === "O" || el.symbol === "S" || el.symbol === "Se") return -2;
  if (el.symbol === "N" || el.symbol === "P") return -3;
  if (el.symbol === "Al") return 3;
  if (el.symbol === "H") return 1;
  // For transition metals, use most common
  if (el.commonOxidationStates.length > 0) return el.commonOxidationStates[0];
  return null;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function buildFormula(
  cationSymbol: string,
  cationCharge: number,
  anionSymbol: string,
  anionCharge: number
): string {
  const absAnion = Math.abs(anionCharge);
  const absCation = Math.abs(cationCharge);
  const d = gcd(absCation, absAnion);
  let numCation = absAnion / d;
  let numAnion = absCation / d;

  let formula = cationSymbol;
  if (numCation > 1) formula += subscript(numCation);
  formula += anionSymbol;
  if (numAnion > 1) formula += subscript(numAnion);
  return formula;
}

function subscript(n: number): string {
  const subs = "₀₁₂₃₄₅₆₇₈₉";
  return String(n)
    .split("")
    .map((d) => subs[parseInt(d)])
    .join("");
}

export function predictBond(elA: Element, elB: Element): BondPrediction {
  // Noble gas involved
  if (elA.category === "noble-gas" || elB.category === "noble-gas") {
    return {
      bondType: "unlikely",
      reason: "Noble gases have full outer shells and are generally unreactive.",
      compoundFormula: "—",
      compoundName: "",
      explanation: `${elA.category === "noble-gas" ? elA.name : elB.name} is a noble gas with a full outer electron shell. In introductory chemistry, noble gases are considered unreactive.`,
      caveat: "Some noble gases like xenon can form compounds under special conditions, but this is beyond introductory chemistry.",
    };
  }

  // Metal + Metal → metallic
  if (isMetal(elA) && isMetal(elB)) {
    return {
      bondType: "metallic",
      reason: "Both elements are metals.",
      compoundFormula: "alloy",
      compoundName: `${elA.name}-${elB.name} alloy`,
      explanation: `When two metals combine, they form a metallic bond where electrons are shared in a 'sea of electrons'. ${elA.name} and ${elB.name} would form an alloy rather than a simple compound.`,
      caveat: "This is a simplified explanation. Alloy chemistry can be complex.",
    };
  }

  // Metal + Non-metal → ionic
  if ((isMetal(elA) && isNonMetal(elB)) || (isNonMetal(elA) && isMetal(elB))) {
    const metal = isMetal(elA) ? elA : elB;
    const nonMetal = isMetal(elA) ? elB : elA;

    const metalCharge = getCommonCharge(metal);
    const nonMetalCharge = getCommonCharge(nonMetal);

    if (metalCharge === null || nonMetalCharge === null) {
      return {
        bondType: "ionic",
        reason: `${metal.name} is a metal and ${nonMetal.name} is a non-metal.`,
        compoundFormula: "?",
        compoundName: "",
        explanation: `In introductory chemistry, metals and non-metals typically form ionic bonds through electron transfer. However, the exact formula for ${metal.name} and ${nonMetal.name} requires knowing their common charges.`,
      };
    }

    const posCharge = Math.abs(metalCharge);
    const negCharge = -Math.abs(nonMetalCharge);
    const formula = buildFormula(metal.symbol, posCharge, nonMetal.symbol, negCharge);

    const absAnion = Math.abs(negCharge);
    const d = gcd(posCharge, absAnion);
    const numCation = absAnion / d;
    const numAnion = posCharge / d;

    const ionExplanation = [
      `${metal.name} forms ${metal.symbol}${superscript(posCharge, "+")} by losing ${posCharge} electron${posCharge > 1 ? "s" : ""}.`,
      `${nonMetal.name} forms ${nonMetal.symbol}${superscript(Math.abs(negCharge), "−")} by gaining ${Math.abs(negCharge)} electron${Math.abs(negCharge) > 1 ? "s" : ""}.`,
      "",
      `To balance charges:`,
      numCation > 1 || numAnion > 1
        ? `${numCation} ${metal.symbol}${superscript(posCharge, "+")} and ${numAnion} ${nonMetal.symbol}${superscript(Math.abs(negCharge), "−")}`
        : `1 ${metal.symbol}${superscript(posCharge, "+")} and 1 ${nonMetal.symbol}${superscript(Math.abs(negCharge), "−")}`,
      `(${numCation > 1 ? numCation + "×" : ""}+${posCharge}) + (${numAnion > 1 ? numAnion + "×" : ""}${negCharge}) = 0`,
      "",
      `Formula: ${formula}`,
    ].join("\n");

    return {
      bondType: "ionic",
      reason: `${metal.name} is a metal and ${nonMetal.name} is a non-metal. Electron transfer occurs.`,
      cation: { symbol: metal.symbol, charge: posCharge, formula: `${metal.symbol}${superscript(posCharge, "+")}` },
      anion: { symbol: nonMetal.symbol, charge: negCharge, formula: `${nonMetal.symbol}${superscript(Math.abs(negCharge), "−")}` },
      compoundFormula: formula,
      compoundName: getCompoundName(metal, nonMetal),
      explanation: ionExplanation,
    };
  }

  // Non-metal + Non-metal → covalent
  if (isNonMetal(elA) && isNonMetal(elB)) {
    // Special known formulas
    const known = getKnownCovalent(elA, elB);
    if (known) return known;

    return {
      bondType: "covalent",
      reason: `Both ${elA.name} and ${elB.name} are non-metals.`,
      compoundFormula: "?",
      compoundName: "",
      explanation: `Non-metals typically share electrons through covalent bonds rather than transferring them. The exact formula depends on how many bonds each atom can form.`,
      caveat: "Predicting covalent formulas requires understanding of molecular structure beyond simple charge balancing.",
    };
  }

  // Metalloid cases
  return {
    bondType: "covalent",
    reason: `The bond between ${elA.name} and ${elB.name} likely has some covalent character.`,
    compoundFormula: "?",
    compoundName: "",
    explanation: `Metalloids and borderline elements can form bonds with both ionic and covalent character. The exact nature depends on the electronegativity difference.`,
    caveat: "This is a simplified prediction.",
  };
}

function superscript(n: number, sign: string): string {
  const sups = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const num = n > 1 ? String(n).split("").map(d => sups[parseInt(d)]).join("") : "";
  const s = sign === "+" ? "⁺" : "⁻";
  return num + s;
}

function getKnownCovalent(a: Element, b: Element): BondPrediction | null {
  const pair = [a.symbol, b.symbol].sort().join("-");
  const knownFormulas: Record<string, { formula: string; name: string; explanation: string }> = {
    "H-O": {
      formula: "H₂O", name: "Water",
      explanation: "Oxygen needs 2 more electrons to fill its outer shell.\nEach hydrogen shares 1 electron with oxygen.\nSo 2 hydrogen atoms bond with 1 oxygen atom.\n\nFormula: H₂O (water)",
    },
    "C-O": {
      formula: "CO₂", name: "Carbon dioxide",
      explanation: "Carbon has 4 valence electrons and needs 4 more.\nOxygen has 6 valence electrons and needs 2 more.\nCarbon forms double bonds with 2 oxygen atoms.\n\nFormula: CO₂ (carbon dioxide)",
    },
    "H-N": {
      formula: "NH₃", name: "Ammonia",
      explanation: "Nitrogen has 5 valence electrons and needs 3 more.\nEach hydrogen shares 1 electron.\nSo 3 hydrogen atoms bond with 1 nitrogen atom.\n\nFormula: NH₃ (ammonia)",
    },
    "H-Cl": {
      formula: "HCl", name: "Hydrogen chloride",
      explanation: "Hydrogen has 1 valence electron.\nChlorine has 7 valence electrons and needs 1 more.\nThey share 1 pair of electrons.\n\nFormula: HCl (hydrogen chloride)",
    },
    "H-F": {
      formula: "HF", name: "Hydrogen fluoride",
      explanation: "Hydrogen has 1 valence electron.\nFluorine has 7 valence electrons and needs 1 more.\nThey share 1 pair of electrons.\n\nFormula: HF (hydrogen fluoride)",
    },
    "C-H": {
      formula: "CH₄", name: "Methane",
      explanation: "Carbon has 4 valence electrons and needs 4 more.\nEach hydrogen shares 1 electron.\nSo 4 hydrogen atoms bond with 1 carbon atom.\n\nFormula: CH₄ (methane)",
    },
    "H-S": {
      formula: "H₂S", name: "Hydrogen sulfide",
      explanation: "Sulfur has 6 valence electrons and needs 2 more.\nEach hydrogen shares 1 electron.\nSo 2 hydrogen atoms bond with 1 sulfur atom.\n\nFormula: H₂S (hydrogen sulfide)",
    },
  };

  const entry = knownFormulas[pair];
  if (!entry) return null;

  return {
    bondType: "covalent",
    reason: `Both ${a.name} and ${b.name} are non-metals. They share electrons.`,
    compoundFormula: entry.formula,
    compoundName: entry.name,
    explanation: entry.explanation,
  };
}
