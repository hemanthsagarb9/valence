import { ThematicCollection, CollectionCategory, LearningLevel } from "@/lib/types";

export const collections: ThematicCollection[] = [
  {
    id: "smartphone",
    name: "Elements in Your Smartphone",
    emoji: "📱",
    description:
      "Key elements that make modern smartphones possible",
    elements: [14, 3, 27, 49, 50, 73, 79, 29, 13, 26],
    category: "technology",
    difficulty: "beginner",
  },
  {
    id: "human-body",
    name: "Elements in the Human Body",
    emoji: "🧬",
    description:
      "The essential elements that compose the human body and enable life",
    elements: [8, 6, 1, 7, 20, 15, 19, 16, 11, 17, 12],
    category: "biology",
    difficulty: "beginner",
  },
  {
    id: "earth-crust",
    name: "Most Abundant in Earth's Crust",
    emoji: "🌍",
    description: "The elements that form the foundation of our planet",
    elements: [8, 14, 13, 26, 20, 11, 12, 19, 22, 1, 15, 25],
    category: "environment",
    difficulty: "beginner",
  },
  {
    id: "universe",
    name: "Most Abundant in the Universe",
    emoji: "🌌",
    description:
      "The elements that make up most of the observable universe",
    elements: [1, 2, 8, 6, 10, 26, 7, 14, 12, 16],
    category: "space",
    difficulty: "school",
  },
  {
    id: "dna",
    name: "Elements in DNA",
    emoji: "🧪",
    description:
      "The building blocks of deoxyribonucleic acid, the molecule of life",
    elements: [6, 1, 8, 7, 15],
    category: "biology",
    difficulty: "school",
  },
  {
    id: "fireworks",
    name: "Elements in Fireworks",
    emoji: "🎆",
    description:
      "The elements responsible for the colors and effects in fireworks",
    elements: [38, 56, 29, 11, 19, 26, 22, 12, 13, 16, 6, 17, 3, 20],
    category: "everyday",
    difficulty: "beginner",
  },
  {
    id: "antiquity",
    name: "Known Since Antiquity",
    emoji: "⚱️",
    description:
      "Elements discovered and used by ancient civilizations thousands of years ago",
    elements: [79, 47, 29, 26, 50, 82, 80, 16, 6],
    category: "history",
    difficulty: "beginner",
  },
  {
    id: "medicine",
    name: "Elements in Medicine",
    emoji: "💊",
    description: "Elements used in medical treatments and diagnostic imaging",
    elements: [43, 53, 64, 78, 3, 56, 31, 26, 79, 88, 27, 34, 30],
    category: "biology",
    difficulty: "school",
  },
  {
    id: "named-scientists",
    name: "Named After Scientists",
    emoji: "🔬",
    description:
      "Synthetic elements named to honor the scientists who discovered them",
    elements: [96, 99, 100, 101, 102, 103, 104, 106, 107, 109, 112],
    category: "history",
    difficulty: "school",
  },
  {
    id: "named-places",
    name: "Named After Places",
    emoji: "🗺️",
    description:
      "Elements named after geographical locations around the world",
    elements: [95, 63, 87, 32, 72, 67, 84, 75, 21, 38, 65],
    category: "history",
    difficulty: "school",
  },
  {
    id: "radioactive",
    name: "Radioactive Elements",
    emoji: "☢️",
    description: "Elements with unstable nuclei that emit radiation",
    elements: [84, 86, 88, 90, 92, 94, 61, 43],
    category: "environment",
    difficulty: "advanced",
  },
  {
    id: "kitchen",
    name: "Elements in Your Kitchen",
    emoji: "🍳",
    description:
      "Elements found in common cooking ingredients and kitchen equipment",
    elements: [11, 17, 26, 13, 29, 6, 7, 8, 1, 24, 28, 14, 20, 19, 50],
    category: "everyday",
    difficulty: "beginner",
  },
  {
    id: "ev-battery",
    name: "Elements in an EV Battery",
    emoji: "🔋",
    description:
      "The critical materials powering electric vehicle battery technology",
    elements: [3, 27, 28, 25, 13, 29, 26, 15, 6, 14, 8],
    category: "technology",
    difficulty: "school",
  },
  {
    id: "ocean",
    name: "Elements in Seawater",
    emoji: "🌊",
    description:
      "Elements dissolved in the vast oceans covering our planet",
    elements: [8, 1, 17, 11, 12, 16, 20, 19, 35, 6, 38, 5, 14, 9],
    category: "environment",
    difficulty: "school",
  },
  {
    id: "painting",
    name: "Elements in Paint Pigments",
    emoji: "🎨",
    description:
      "Elements that give paints and pigments their vibrant colors",
    elements: [82, 24, 48, 27, 22, 30, 26, 29, 80, 56, 16, 34, 6, 13],
    category: "everyday",
    difficulty: "school",
  },
  {
    id: "trace-essential",
    name: "Essential Trace Elements",
    emoji: "🫀",
    description:
      "Vital micronutrients required in small amounts for human health",
    elements: [26, 30, 29, 25, 53, 34, 42, 24, 27, 9, 14, 23, 28, 50],
    category: "biology",
    difficulty: "advanced",
  },
  {
    id: "noble",
    name: "The Noble Gases",
    emoji: "👑",
    description:
      "Inert gases that rarely react with other elements",
    elements: [2, 10, 18, 36, 54, 86, 118],
    category: "everyday",
    difficulty: "beginner",
  },
  {
    id: "liquid-room-temp",
    name: "Liquid at Room Temperature",
    emoji: "💧",
    description: "Elements that exist as liquids near room temperature",
    elements: [80, 35],
    category: "everyday",
    difficulty: "beginner",
  },
  {
    id: "steel",
    name: "Elements in Steel",
    emoji: "⚙️",
    description:
      "The alloying elements that give steel its strength and durability",
    elements: [26, 6, 25, 24, 28, 42, 23, 74, 27, 14, 22, 41],
    category: "technology",
    difficulty: "school",
  },
  {
    id: "sun",
    name: "Elements in the Sun",
    emoji: "☀️",
    description:
      "The elements that compose our nearest star and power the solar system",
    elements: [1, 2, 8, 6, 10, 26, 7, 14, 12, 16, 18, 20, 28, 13, 11],
    category: "space",
    difficulty: "beginner",
  },
  {
    id: "diagonal-relationships",
    name: "Diagonal Relationships",
    emoji: "↗️",
    description:
      "Elements that share properties diagonally across the periodic table. Li resembles Mg more than Na, Be resembles Al more than Ca, and B resembles Si more than Al.",
    elements: [3, 12, 4, 13, 5, 14],
    category: "everyday",
    difficulty: "advanced",
  },
  {
    id: "anomalous-electron-configs",
    name: "Anomalous Electron Configurations",
    emoji: "⚛️",
    description:
      "Elements whose actual electron configurations differ from predictions. Half-filled and fully-filled d subshells provide extra stability.",
    elements: [24, 29, 42, 47, 79, 46, 41, 44, 45, 78],
    category: "everyday",
    difficulty: "advanced",
  },
  {
    id: "lanthanide-contraction",
    name: "Lanthanide Contraction Effects",
    emoji: "🔻",
    description:
      "The lanthanide contraction causes the 5d transition metals to be almost the same size as their 4d counterparts. Hf and Zr have nearly identical radii despite Hf having 32 more electrons.",
    elements: [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 40],
    category: "everyday",
    difficulty: "advanced",
  },
  {
    id: "inert-pair-effect",
    name: "Inert Pair Effect",
    emoji: "👥",
    description:
      "In heavier p-block elements, the s-electron pair becomes reluctant to participate in bonding. This is why Pb²⁺ is more stable than Pb⁴⁺, and Tl⁺ is more stable than Tl³⁺.",
    elements: [81, 82, 83, 50, 49, 31],
    category: "everyday",
    difficulty: "advanced",
  },
  {
    id: "variable-oxidation-states",
    name: "Variable Oxidation States",
    emoji: "♻️",
    description:
      "Transition metals can show multiple oxidation states because the energy difference between their d and s electrons is small. Manganese shows the widest range: +2 to +7.",
    elements: [26, 29, 25, 24, 23, 27, 28, 22],
    category: "everyday",
    difficulty: "school",
  },
];

export function getCollection(id: string): ThematicCollection | undefined {
  return collections.find((c) => c.id === id);
}

export function getCollectionsByCategory(
  cat: CollectionCategory
): ThematicCollection[] {
  return collections.filter((c) => c.category === cat);
}
