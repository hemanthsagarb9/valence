export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "reactive-nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide"
  | "unknown";

export type LearningLevel = "beginner" | "school" | "advanced";

export type PeriodicTableMode =
  | "explore"
  | "families"
  | "trends"
  | "bonding"
  | "collections"
  | "hunt"
  | "quiz";

export type TrendType =
  | "atomicRadius"
  | "ionizationEnergy"
  | "electronegativity"
  | "metallicCharacter";

export type CollectionCategory =
  | "technology"
  | "biology"
  | "history"
  | "environment"
  | "space"
  | "everyday";

export type HuntGameMode = "find" | "sort" | "predict" | "build";

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number | null;
  group: number | null;
  period: number;
  block: "s" | "p" | "d" | "f";
  category: ElementCategory;
  phaseAtRoomTemp: "solid" | "liquid" | "gas" | "unknown";
  electronConfiguration: string;
  shells: number[];
  valenceElectrons: number | null;
  commonIons: string[];
  commonOxidationStates: number[];
  electronegativity: number | null;
  atomicRadius: number | null;
  ionizationEnergy: number | null;
  meltingPoint: number | null;
  boilingPoint: number | null;
  summary: string;
  realWorld: string;
  abundance: string;
  row: number;
  col: number;
}

export interface ThematicCollection {
  id: string;
  name: string;
  emoji: string;
  description: string;
  elements: number[]; // atomic numbers
  category: CollectionCategory;
  difficulty: LearningLevel;
}

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "true_false" | "comparison" | "formula_builder" | "prediction";
  difficulty: LearningLevel;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  relatedElements: string[];
  isMisconception?: boolean;
}

export interface TrendInfo {
  id: TrendType;
  name: string;
  description: string;
  directionAcross: string;
  directionDown: string;
  beginnerExplanation: string;
  schoolExplanation: string;
}

export interface FamilyInfo {
  id: ElementCategory;
  name: string;
  definition: string;
  location: string;
  valencePattern: string;
  commonBehavior: string;
  examples: string[];
  memoryHook: string;
  color: string;
}

export interface UserProgress {
  elementsExplored: number[];
  collectionsCompleted: string[];
  quizCorrect: number;
  quizTotal: number;
  predictionsCorrect: number;
  predictionsTotal: number;
  streakDays: number;
  lastVisit: string;
  level: LearningLevel;
}
