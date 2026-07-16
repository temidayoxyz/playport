import type { ComponentType, LazyExoticComponent } from "react";

export type GameStatus =
  | "idle"
  | "playing"
  | "paused"
  | "won"
  | "lost"
  | "draw"
  | "loading";

export type GamePlayerMode = "solo" | "vs-computer" | "local-multiplayer";

export type GameDifficulty =
  | "easy"
  | "medium"
  | "hard"
  | "expert"
  | "impossible"
  | "beginner";

export type InputMethod = "touch" | "mouse" | "keyboard";

export type GameTechnology = "react" | "canvas" | "phaser" | "threejs" | "worker";

export interface GameModeDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;
  default?: boolean;
}

export interface GameDifficultyDefinition {
  id: GameDifficulty | string;
  name: string;
  description: string;
  recommended?: boolean;
}

export interface GameController {
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  destroy(): void;
}

export interface GameSession {
  status: GameStatus;
  score?: number;
  opponentScore?: number;
  level?: number;
  round?: number;
  elapsedSeconds: number;
  message?: string;
  winner?: string;
  stats?: Record<string, string | number>;
}

export interface GameShellProps {
  modeId: string;
  difficultyId: string;
  onSessionChange?: (session: GameSession) => void;
  onRequestExit?: () => void;
  sound?: boolean;
  reducedMotion?: boolean;
  showHints?: boolean;
}

export interface GameDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  route: string;
  accent: string;
  estimatedMinutes: number;
  players: GamePlayerMode[];
  difficulties: GameDifficultyDefinition[];
  modes: GameModeDefinition[];
  inputMethods: InputMethod[];
  technology: GameTechnology[];
  featured?: boolean;
  isNew?: boolean;
  status: "available" | "coming-soon";
  rules: string[];
  tutorial: string[];
  component: LazyExoticComponent<ComponentType<GameShellProps>>;
  preload?: () => Promise<unknown>;
}

export type CategoryIconId = "board" | "words" | "sports" | "arcade" | "puzzle";

export interface CategoryDefinition {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  accent: string;
  icon: CategoryIconId;
  dockNumber: string;
  comingSoonLabel?: string;
}
