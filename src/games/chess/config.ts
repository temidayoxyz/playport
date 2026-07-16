import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "vs-computer", name: "vs Computer", description: "Play against Stockfish.", default: true },
  { id: "local", name: "Two Players", description: "Pass-and-play chess." },
  { id: "practice", name: "Practice", description: "Free play with undo." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "beginner", name: "Beginner", description: "Skill 0, shallow depth." },
  { id: "easy", name: "Easy", description: "Gentle opponent." },
  { id: "medium", name: "Medium", description: "Solid club-level pressure.", recommended: true },
  { id: "hard", name: "Hard", description: "Strong tactical play." },
  { id: "expert", name: "Expert", description: "Deep search — tough." },
];

export const RULES = [
  "Standard chess rules: check, checkmate, castling, en passant, and promotion.",
  "Tap a piece, then a highlighted square — or drag to move.",
  "Against the computer, Stockfish runs in a Web Worker so the UI stays smooth.",
  "Practice mode allows undoing moves.",
];

export const TUTORIAL = [
  "Select your colour before starting against the computer.",
  "Legal moves are highlighted after you select a piece.",
  "Promote pawns using the promotion dialog.",
  "Resign or offer a draw from the controls when stuck.",
];

export function stockfishParams(difficulty: string): { depth: number; skill: number; movetime: number } {
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
