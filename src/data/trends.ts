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
    id: "electronAffinity",
    name: "Electron Affinity",
    description: "The energy released when an atom gains an electron to form a negative ion.",
    directionAcross: "Generally increases across a period (left → right), with notable exceptions",
    directionDown: "Generally decreases down a group (top → bottom)",
    beginnerExplanation: "Most atoms release energy when they gain an electron. Halogens release the most because they are one electron away from a full shell. Noble gases don't want extra electrons at all.",
    schoolExplanation: "Electron affinity measures the energy change when a neutral atom gains an electron. Across a period, increasing nuclear charge attracts incoming electrons more strongly. Key exception: Cl has higher EA than F because fluorine's tiny size causes strong electron-electron repulsion. Group 15 elements (N, P, As) have lower EA than expected due to the stability of half-filled p orbitals.",
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
  {
    id: "zeff",
    name: "Effective Nuclear Charge",
    description: "The net positive charge experienced by valence electrons after accounting for shielding by inner electrons. Calculated using Slater's rules.",
    directionAcross: "Increases across a period (left → right) — each proton added is poorly shielded by electrons in the same shell",
    directionDown: "Roughly constant within a group for valence electrons — additional protons are offset by additional shielding shells",
    beginnerExplanation: "Inner electrons act like a shield, blocking some of the nucleus's pull on outer electrons. The 'effective' charge is what the outer electrons actually feel. More protons with the same shielding means a stronger pull.",
    schoolExplanation: "Zeff = Z − σ, where Z is the atomic number and σ is the shielding constant. Across a period, each added proton increases Z by 1, but electrons added to the same shell shield poorly (σ increases by ~0.35), so Zeff rises. This explains why atoms shrink, IE increases, and electronegativity increases across a period. Down a group, new shielding shells largely cancel the extra protons.",
  },
];

export function getTrendInfo(id: string): TrendInfo | undefined {
  return trends.find(t => t.id === id);
}
