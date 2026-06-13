import { TrendInfo } from "@/lib/types";

export const trends: TrendInfo[] = [
  {
    id: "atomicRadius",
    name: "Atomic Radius",
    description: "The size of an atom, measured from the nucleus to the outer boundary of its electron cloud.",
    directionAcross: "Decreases across a period (left → right)",
    directionDown: "Increases down a group (top → bottom)",
    beginnerExplanation: "Atoms get bigger going down because they have more electron shells. Atoms get smaller going across because the nucleus pulls electrons more tightly.",
    schoolExplanation: "Across a period, each element gains a proton and an electron in the same shell. The increased nuclear charge pulls the electron cloud closer, shrinking the atom. Down a group, each element adds a new electron shell, increasing the distance from the nucleus to the outermost electrons.",
  },
  {
    id: "ionizationEnergy",
    name: "Ionisation Energy",
    description: "The energy needed to remove the outermost electron from an atom.",
    directionAcross: "Increases across a period (left → right)",
    directionDown: "Decreases down a group (top → bottom)",
    beginnerExplanation: "Small atoms hold their electrons tightly, so it takes more energy to remove one. Larger atoms have outer electrons that are easier to remove.",
    schoolExplanation: "Across a period, increasing nuclear charge holds outer electrons more tightly, requiring more energy for removal. Down a group, the outermost electron is farther from the nucleus and shielded by inner shells, making it easier to remove.",
  },
  {
    id: "electronegativity",
    name: "Electronegativity",
    description: "How strongly an atom attracts shared electrons when bonded to another atom.",
    directionAcross: "Increases across a period (left → right)",
    directionDown: "Decreases down a group (top → bottom)",
    beginnerExplanation: "Small atoms with strong nuclear pull attract shared electrons more strongly. Fluorine is the most electronegative element.",
    schoolExplanation: "Across a period, increasing nuclear charge attracts bonding electrons more strongly. Down a group, the bonding pair is farther from the nucleus and more shielded, weakening attraction. Electronegativity differences between atoms determine bond polarity.",
  },
  {
    id: "metallicCharacter",
    name: "Metallic Character",
    description: "How easily an atom loses electrons and behaves like a metal.",
    directionAcross: "Decreases across a period (left → right)",
    directionDown: "Increases down a group (top → bottom)",
    beginnerExplanation: "Metals are on the left and bottom of the table. Non-metals are on the top right. The easier it is for an atom to lose electrons, the more metallic it is.",
    schoolExplanation: "Metallic character follows the opposite pattern to ionisation energy. Elements that lose electrons easily (low ionisation energy) behave more like metals. This makes metals more concentrated in the lower-left of the periodic table.",
  },
];

export function getTrendInfo(id: string): TrendInfo | undefined {
  return trends.find(t => t.id === id);
}
