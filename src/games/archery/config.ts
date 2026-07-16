import type { GameDifficultyDefinition, GameModeDefinition } from "@/types/game";

export const MODES: GameModeDefinition[] = [
  { id: "practice", name: "Target Practice", description: "Unlimited arrows.", default: true },
  { id: "score", name: "Score Challenge", description: "10 arrows — max points." },
  { id: "timed", name: "Timed Challenge", description: "45 seconds of shots." },
  { id: "moving", name: "Moving Target", description: "Target drifts horizontally." },
  { id: "vs-computer", name: "vs Computer", description: "Best score after equal arrows." },
];

export const DIFFICULTIES: GameDifficultyDefinition[] = [
  { id: "easy", name: "Easy", description: "Larger rings, light wind." },
  { id: "medium", name: "Medium", description: "Standard range.", recommended: true },
  { id: "hard", name: "Hard", description: "Stronger wind, smaller target." },
];

export const RULES = [
  "Drag to aim, pull to set power, release to fire.",
  "Wind pushes the arrow sideways — read the indicator.",
  "Inner rings score more points.",
  "Bullseye awards 10 points.",
];

export const TUTORIAL = [
  "Hold and drag on the range to aim.",
  "Pull down for more power.",
  "Watch wind before you release.",
];
