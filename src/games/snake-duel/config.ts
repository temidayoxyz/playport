import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "classic", name: "Classic Solo", description: "Grow and survive.", default: true },
  { id: "vs-computer", name: "vs Computer", description: "Race scores with a computer snake." },
  { id: "local", name: "Two Players", description: "Shared grid, two snakes." },
  { id: "survival", name: "Survival", description: "Speed ramps up over time." },
  { id: "maze", name: "Maze Mode", description: "Navigate obstacles." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy", description: "Slower tick rate." },
  { id: "medium", name: "Medium", description: "Standard pace.", recommended: true },
  { id: "hard", name: "Hard", description: "Fast snake, sharper opponent." },
];

export const RULES = [
  "Eat food to grow and score.",
  "Avoid walls, obstacles, and your own body.",
  "Swipe, arrow keys, or on-screen buttons to steer.",
  "You cannot reverse into yourself.",
];

export const TUTORIAL = [
  "Swipe on the board to change direction.",
  "Food appears as a bright cell.",
  "In maze mode, dark cells are walls.",
];
