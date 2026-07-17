import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  {
    id: "vs-computer",
    name: "vs Computer",
    description: "Play against the computer.",
    default: true,
  },
  { id: "local", name: "Local two-player", description: "Pass-and-play on one device." },
  { id: "practice", name: "Practice", description: "Free play with undo." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "beginner", name: "Beginner", description: "Very relaxed play with simple moves." },
  { id: "easy", name: "Easy", description: "Gentle opponent with occasional mistakes." },
  {
    id: "medium",
    name: "Medium",
    description: "Balanced and competitive.",
    recommended: true,
  },
  { id: "hard", name: "Hard", description: "Stronger decisions and fewer mistakes." },
  { id: "expert", name: "Expert", description: "Tough opponent — expect pressure." },
];

export const RULES = [
  "Standard chess rules: check, checkmate, castling, en passant, and promotion.",
  "Tap a piece, then a highlighted square — or drag to move.",
  "Against the computer, wait for its move after yours.",
  "Practice mode allows undoing moves.",
];

export const TUTORIAL = [
  "Select a piece to see legal moves.",
  "Tap a highlighted square to move.",
  "Promote pawns when they reach the far rank.",
  "Use pause anytime to restart or return to the Port.",
];

export function stockfishParams(difficulty: string): {
  depth: number;
  skill: number;
  movetime: number;
} {
  switch (difficulty) {
    case "beginner":
      return { depth: 5, skill: 0, movetime: 200 };
    case "easy":
      return { depth: 8, skill: 4, movetime: 350 };
    case "hard":
      return { depth: 14, skill: 14, movetime: 900 };
    case "expert":
      return { depth: 18, skill: 20, movetime: 1500 };
    default:
      return { depth: 11, skill: 10, movetime: 600 };
  }
}
