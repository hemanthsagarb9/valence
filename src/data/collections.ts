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
];

export function getCollection(id: string): ThematicCollection | undefined {
  return collections.find((c) => c.id === id);
}

export function getCollectionsByCategory(
  cat: CollectionCategory
): ThematicCollection[] {
  return collections.filter((c) => c.category === cat);
}
