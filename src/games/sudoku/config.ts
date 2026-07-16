import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "standard", name: "Standard", description: "Classic puzzle play.", default: true },
  { id: "timed", name: "Timed", description: "Beat the clock." },
  { id: "daily", name: "Daily Puzzle", description: "One shared puzzle per day." },
  { id: "mistakes", name: "Mistake Limit", description: "Three mistakes max." },
  { id: "relaxed", name: "Relaxed Practice", description: "Hints encouraged." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy", description: "More given digits." },
  { id: "medium", name: "Medium", description: "Balanced challenge.", recommended: true },
  { id: "hard", name: "Hard", description: "Sparse clues." },
  { id: "expert", name: "Expert", description: "Minimal givens." },
];

export const RULES = [
  "Fill the 9×9 grid so each row, column, and 3×3 box contains 1–9 once.",
  "Given numbers cannot be changed.",
  "Use notes to track candidates.",
  "Hints reveal a correct digit when available.",
];

export const TUTORIAL = [
  "Tap a cell, then a number on the pad.",
  "Toggle Notes to pencil in candidates.",
  "Matching numbers and peers highlight to help focus.",
];
