import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "solo", name: "Score Attack", description: "Clear cups for points.", default: true },
  { id: "vs-computer", name: "vs Computer", description: "Alternate shots with the computer." },
  { id: "trick", name: "Trick Shot", description: "Harder angles, fewer balls." },
  { id: "limited", name: "Limited Balls", description: "Only 6 balls — make them count." },
  { id: "local", name: "Local Turns", description: "Two players, one device." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy", description: "Trajectory preview, larger cups." },
  { id: "medium", name: "Medium", description: "Balanced physics.", recommended: true },
  { id: "hard", name: "Hard", description: "Tighter rims, moving cups." },
];

export const RULES = [
  "Drag to aim and set power, then release to throw.",
  "Land the ball in a cup to score and remove it.",
  "Clear the rack or outscore your opponent.",
  "Easy mode shows a trajectory guide.",
];

export const TUTORIAL = [
  "Pull back on the ball area to charge power.",
  "Aim left/right with horizontal drag.",
  "Watch the table — cups glow when scored.",
];
