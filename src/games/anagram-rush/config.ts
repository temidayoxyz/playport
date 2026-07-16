import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "classic", name: "Classic", description: "10 words, no timer.", default: true },
  { id: "timed", name: "Timed Rush", description: "60 seconds of unscrambling." },
  { id: "endless", name: "Endless", description: "Play until you quit." },
  { id: "survival", name: "Survival", description: "Three mistakes and you're out." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy", description: "Shorter everyday words." },
  { id: "medium", name: "Medium", description: "Mixed mid-length words.", recommended: true },
  { id: "hard", name: "Hard", description: "Longer, trickier scrambles." },
];

export const RULES = [
  "Unscramble the letters to form the original word.",
  "Tap letters or type on the keyboard.",
  "Build combos for higher scores.",
  "Hints rearrange letters once per word (limited uses).",
];

export const TUTORIAL = [
  "Tap letter tiles to build your answer.",
  "Use Shuffle if the scramble is hard to read.",
  "Submit when ready — correctness is checked instantly.",
];
