export interface FactSection {
  title: string;
  lead: string; // one-line intro that sets context
  points: string[];
}

export interface FactChapter {
  title: string;
  sections: FactSection[];
}

export const factChapters: FactChapter[] = [
  {
    title: "How the Table Is Organised",
    sections: [
      {
        title: "Rows and Columns",
        lead: "The periodic table isn't random — position tells you almost everything about an element.",
        points: [
          "Period number = number of electron shells. Na (Period 3) has 3 shells: 2, 8, 1.",
          "Group number (for main-group) = valence electrons. Group 16 elements all have 6 valence electrons.",
          "Elements in the same group have similar chemistry because they share the same valence configuration.",
        ],
      },
      {
        title: "Blocks",
        lead: "Which sublevel is being filled tells you which block the element belongs to.",
        points: [
          "s-block (Groups 1–2): filling ns orbitals. Metals, strong reducers.",
          "p-block (Groups 13–18): filling np orbitals. Includes metals, metalloids, and all nonmetals.",
          "d-block (Groups 3–12): filling (n−1)d orbitals. Transition metals — variable oxidation states, coloured ions.",
          "f-block (lanthanides/actinides): filling (n−2)f orbitals. Poor shielding by f electrons → lanthanide contraction.",
        ],
      },
    ],
  },
  {
    title: "Periodic Trends and Why They Exist",
    sections: [
      {
        title: "Atomic Size",
        lead: "Two forces compete: more shells make atoms bigger, higher nuclear charge pulls them smaller.",
        points: [
          "Across a period: radius decreases. More protons, same shell count → electrons pulled closer.",
          "Down a group: radius increases. Each period adds a new shell, outweighing the extra nuclear charge.",
          "Ga ≈ Al in size — the 3d electrons added between them shield very poorly (d-block contraction).",
        ],
      },
      {
        title: "Ionisation Energy",
        lead: "How tightly an atom holds its outermost electron.",
        points: [
          "Across a period: IE generally increases (higher Zeff, smaller radius).",
          "Down a group: IE decreases (electron is farther from nucleus, more shielding).",
          "Exception: IE₁ of N > O. Nitrogen's half-filled 2p³ has extra exchange energy — removing one electron costs more.",
          "Exception: IE₁ of Be > B. Beryllium's filled 2s² is more stable than boron's lone 2p¹ electron.",
        ],
      },
      {
        title: "Electron Affinity",
        lead: "Energy released when a neutral atom gains an electron. More negative = more favourable.",
        points: [
          "Generally increases (becomes more negative) across a period — atoms are smaller, Zeff is higher.",
          "Cl has the highest EA (−349 kJ/mol), not F. Fluorine is so small that the incoming electron faces severe repulsion in the compact 2p shell.",
          "EA of nitrogen ≈ 0. The half-filled 2p³ is stable — it resists gaining a fourth p electron.",
          "Noble gases and Group 2 elements have positive (unfavourable) EA — their subshells are already full.",
        ],
      },
      {
        title: "Electronegativity",
        lead: "The tendency of a bonded atom to attract shared electrons toward itself.",
        points: [
          "Increases across a period, decreases down a group — follows the same logic as IE.",
          "Fluorine is the most electronegative element (3.98 on the Pauling scale).",
          "Electronegativity difference between bonded atoms predicts bond polarity and ionic character.",
        ],
      },
      {
        title: "Effective Nuclear Charge (Zeff)",
        lead: "The net positive charge felt by valence electrons after accounting for shielding.",
        points: [
          "Across a period: Zeff increases significantly. Each added proton is only partially shielded by electrons in the same shell.",
          "Down a group: Zeff for the outermost electron increases slightly but the electron is much farther away — so IE still drops.",
          "Shielding effectiveness: s > p > d > f. This is why d and f electrons shield so poorly.",
        ],
      },
    ],
  },
  {
    title: "Electron Configuration",
    sections: [
      {
        title: "Filling Rules",
        lead: "Three rules determine how electrons fill orbitals — and two elements famously break them.",
        points: [
          "Aufbau: fill lowest energy first. Order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d ...",
          "Pauli exclusion: max 2 electrons per orbital, with opposite spins.",
          "Hund's rule: fill degenerate orbitals singly first (parallel spins) before pairing.",
        ],
      },
      {
        title: "Anomalous Configurations",
        lead: "Half-filled and fully-filled d subshells have extra stability from exchange energy.",
        points: [
          "Cr: [Ar] 3d⁵4s¹ (not 3d⁴4s²) — half-filled d⁵ maximises exchange energy.",
          "Cu: [Ar] 3d¹⁰4s¹ (not 3d⁹4s²) — fully-filled d¹⁰ is exceptionally stable.",
          "Same pattern repeats: Mo [Kr]4d⁵5s¹, Ag [Kr]4d¹⁰5s¹, Au [Xe]4f¹⁴5d¹⁰6s¹.",
          "Pd is extreme: [Kr]4d¹⁰5s⁰ — it gives up both s electrons to complete the d shell.",
        ],
      },
      {
        title: "Ionisation ≠ Filling",
        lead: "Electrons don't leave in the same order they arrive.",
        points: [
          "4s fills before 3d (lower energy in neutral atoms), but 4s is ionised first in cations.",
          "Fe: [Ar]3d⁶4s² → Fe²⁺: [Ar]3d⁶ → Fe³⁺: [Ar]3d⁵. The 4s electrons leave first.",
          "This is why transition metal ions mostly differ in d-electron count, not s.",
        ],
      },
      {
        title: "Successive Ionisation Energies",
        lead: "The pattern of jumps in successive IEs reveals how many valence electrons an element has.",
        points: [
          "Each successive IE is higher (less shielding, same nuclear charge).",
          "A huge jump signals that a core electron is being removed — the previous electron was the last valence electron.",
          "Na: big jump after IE₁ → 1 valence e⁻. Mg: after IE₂ → 2 valence e⁻. Al: after IE₃ → 3.",
        ],
      },
    ],
  },
  {
    title: "Chemical Behaviour Across the Table",
    sections: [
      {
        title: "s-Block Behaviour",
        lead: "Groups 1 and 2 are the most reactive metals — their chemistry is driven by losing 1 or 2 electrons.",
        points: [
          "Reactivity increases down the group (lower IE → easier to lose electrons).",
          "Li is anomalous: small size, high polarising power → forms covalent compounds, resembles Mg (diagonal relationship).",
          "Na forms peroxide (Na₂O₂), K and heavier alkali metals form superoxides (KO₂). Li forms only the oxide (Li₂O).",
          "Be is anomalous: BeCl₂ is covalent (not ionic), BeO is amphoteric. Resembles Al diagonally.",
          "Flame test colours: Li crimson, Na yellow, K violet, Ca brick-red, Sr crimson, Ba apple-green.",
        ],
      },
      {
        title: "p-Block Behaviour",
        lead: "The most diverse block — contains metals, metalloids, nonmetals, and noble gases.",
        points: [
          "Inert pair effect: heavier p-block elements prefer an oxidation state 2 lower than the group valency. Tl⁺ over Tl³⁺, Pb²⁺ over Pb⁴⁺, Bi³⁺ over Bi⁵⁺.",
          "N cannot expand its octet (no d-orbitals): max covalency is 4. So NCl₅ doesn't exist, but PCl₅ does.",
          "C forms pπ–pπ bonds (C=C, C≡C, CO₂). Si cannot → SiO₂ is a giant covalent network, not a small molecule.",
          "O₂ is paramagnetic (unpaired electrons in π* MOs). OF₂ is the rare case where O has a +2 state.",
          "Noble gas compounds exist: XeF₂ (linear), XeF₄ (square planar), XeF₆ (distorted octahedral). Kr forms KrF₂ only.",
        ],
      },
      {
        title: "d-Block Behaviour",
        lead: "Transition metals stand out for their variable oxidation states, colour, and catalytic ability.",
        points: [
          "A true transition metal has a partially filled d subshell in at least one stable oxidation state.",
          "Zn (always d¹⁰) and Sc (only Sc³⁺, d⁰) don't meet this definition strictly.",
          "Max oxidation state rises to Mn (+7 in MnO₄⁻), then drops — later d-electrons are harder to remove.",
          "Coloured ions arise from d–d transitions. d⁰ and d¹⁰ ions are colourless (no transition possible).",
          "Key ions: Fe²⁺/Fe³⁺, Cu⁺/Cu²⁺, Mn²⁺/Mn⁴⁺/Mn⁷⁺, Cr³⁺/Cr⁶⁺.",
        ],
      },
      {
        title: "Diagonal Relationships",
        lead: "Some elements resemble their diagonal neighbour more than the element directly below — because charge/radius ratio matters more than group number.",
        points: [
          "Li ~ Mg: both form nitrides directly, their carbonates decompose on heating, both form covalent organometallics.",
          "Be ~ Al: both amphoteric oxides, both form covalent chlorides, protective oxide coatings.",
          "B ~ Si: both metalloids/semiconductors, acidic oxides, volatile hydrides (boranes ~ silanes).",
        ],
      },
    ],
  },
  {
    title: "Bonding and Oxidation States",
    sections: [
      {
        title: "Ionic vs Covalent Character",
        lead: "The boundary between ionic and covalent is not sharp — Fajan's rules predict where a compound falls.",
        points: [
          "More covalent character when: cation is small and highly charged, anion is large and highly charged.",
          "LiCl is more covalent than NaCl. FeCl₃ is more covalent than FeCl₂ (Fe³⁺ has higher charge density).",
          "Ionic compounds: high melting points, conduct electricity when molten or dissolved, form crystalline lattices.",
        ],
      },
      {
        title: "Lanthanide Contraction",
        lead: "The f-block creates a ripple effect that shapes the chemistry of elements that come after it.",
        points: [
          "4f electrons are poor shielders — as the lanthanides are crossed, Zeff rises steeply → radii shrink.",
          "Result: Hf ≈ Zr and Ta ≈ Nb in atomic radius, despite being a full period apart.",
          "This is why Hf/Zr and Ta/Nb pairs occur together in nature and are notoriously difficult to separate.",
          "The contraction also explains why third-row transition metals have higher IEs and are more noble (Au, Pt, Ir).",
        ],
      },
    ],
  },
];
