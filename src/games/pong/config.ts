import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "vs-computer", name: "vs Computer", description: "Classic paddle duel.", default: true },
  { id: "local", name: "Two Players", description: "W/S and arrow keys or dual touch." },
  { id: "first-5", name: "First to 5", description: "Race to five points." },
  { id: "first-10", name: "First to 10", description: "Longer match." },
  { id: "survival", name: "Endless Survival", description: "How long can you last?" },
  { id: "speed", name: "Speed Mode", description: "Faster ball acceleration." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy", description: "Slower computer reactions." },
  { id: "medium", name: "Medium", description: "Balanced rally.", recommended: true },
  { id: "hard", name: "Hard", description: "Sharp computer prediction." },
];

export const RULES = [
  "Keep the ball in play with your paddle.",
  "Score when the opponent misses.",
  "Touch/drag on your half, or use keyboard controls.",
  "Ball speed increases slightly after each paddle hit.",
];

export const TUTORIAL = [
  "Drag on the left side to move your paddle.",
  "In local mode, right side controls player 2.",
  "Serve starts after each point.",
];
