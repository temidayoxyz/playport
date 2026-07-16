import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "two-min", name: "2 Minutes", description: "Race the clock.", default: true },
  { id: "three-min", name: "3 Minutes", description: "A longer hunt." },
  { id: "relaxed", name: "Relaxed", description: "No timer — explore freely." },
  { id: "daily", name: "Daily Board", description: "Same board for everyone today." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy 4×4", description: "Smaller grid." },
  { id: "medium", name: "Medium 5×5", description: "Balanced challenge.", recommended: true },
  { id: "hard", name: "Hard 6×6", description: "Dense letter field." },
];

export const RULES = [
  "Connect adjacent letters (including diagonals) to form words.",
  "Do not reuse the same tile in a single word.",
  "Words must be at least 3 letters and in the local dictionary.",
  "Longer words score more points.",
];

export const TUTORIAL = [
  "Drag across letters to build a path.",
  "Release to submit the word.",
  "Found words appear in your list — duplicates are ignored.",
];

export function boardSizeFor(difficulty: string): number {
  if (difficulty === "easy") return 4;
  if (difficulty === "hard") return 6;
  return 5;
}

export function timeForMode(modeId: string): number | null {
  if (modeId === "two-min") return 120;
  if (modeId === "three-min") return 180;
  return null;
}
