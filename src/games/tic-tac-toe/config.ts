import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "vs-computer", name: "vs Computer", description: "Play against the AI.", default: true },
  { id: "local", name: "Two Players", description: "Pass-and-play on one device." },
  { id: "best-of-1", name: "Best of 1", description: "Single round match." },
  { id: "best-of-3", name: "Best of 3", description: "First to 2 wins." },
  { id: "best-of-5", name: "Best of 5", description: "First to 3 wins." },
  { id: "timed", name: "Timed Turns", description: "15 seconds per turn." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy", description: "Mostly random moves." },
  { id: "medium", name: "Medium", description: "Blocks and basic tactics.", recommended: true },
  { id: "hard", name: "Hard", description: "Strong play with rare mistakes." },
  { id: "impossible", name: "Impossible", description: "Optimal minimax — never loses." },
];

export const RULES = [
  "Players take turns placing X and O on a 3×3 grid.",
  "First to get three in a row (horizontal, vertical, or diagonal) wins.",
  "If the board fills with no winner, the round is a draw.",
  "In timed mode, missing a turn forfeits that turn to a random valid move.",
];

export const TUTORIAL = [
  "Tap an empty cell to place your mark.",
  "Watch the turn indicator at the top.",
  "Win lines animate when someone wins a round.",
  "Use hints (if enabled) to see a suggested move.",
];
