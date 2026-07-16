import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "classic", name: "Classic 4×4", description: "The standard merge grid.", default: true },
  { id: "compact", name: "Compact 3×3", description: "Smaller, denser board." },
  { id: "extended", name: "Extended 5×5", description: "More room to plan." },
  { id: "timed", name: "Timed Challenge", description: "Score under pressure." },
  { id: "target", name: "Target Challenge", description: "Reach 2048 to win." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Relaxed", description: "No special pressure." },
  { id: "medium", name: "Standard", description: "Classic feel.", recommended: true },
  { id: "hard", name: "Strict", description: "No undo in target mode." },
];

export const RULES = [
  "Swipe or use arrow keys to slide all tiles.",
  "Matching numbers merge into their sum.",
  "Each move spawns a new 2 or 4 tile.",
  "The game ends when no moves remain.",
];

export const TUTORIAL = [
  "Swipe in any direction to move tiles.",
  "Plan merges to build toward 2048.",
  "Undo is available for one step back.",
];

export function sizeForMode(modeId: string): number {
  if (modeId === "compact") return 3;
  if (modeId === "extended") return 5;
  return 4;
}
