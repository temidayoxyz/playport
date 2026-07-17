import { lazy, type ComponentType } from "react";
import type { GameDefinition, GameShellProps } from "@/types/game";
import {
  MODES as tttModes,
  DIFFICULTIES as tttDiff,
  RULES as tttRules,
  TUTORIAL as tttTutorial,
} from "@/games/tic-tac-toe/config";
import {
  MODES as chessModes,
  DIFFICULTIES as chessDiff,
  RULES as chessRules,
  TUTORIAL as chessTutorial,
} from "@/games/chess/config";
import {
  MODES as anagramModes,
  DIFFICULTIES as anagramDiff,
  RULES as anagramRules,
  TUTORIAL as anagramTutorial,
} from "@/games/anagram-rush/config";
import {
  MODES as huntModes,
  DIFFICULTIES as huntDiff,
  RULES as huntRules,
  TUTORIAL as huntTutorial,
} from "@/games/word-hunt/config";
import {
  MODES as cupModes,
  DIFFICULTIES as cupDiff,
  RULES as cupRules,
  TUTORIAL as cupTutorial,
} from "@/games/cup-pong/config";
import {
  MODES as archModes,
  DIFFICULTIES as archDiff,
  RULES as archRules,
  TUTORIAL as archTutorial,
} from "@/games/archery/config";
import {
  MODES as pongModes,
  DIFFICULTIES as pongDiff,
  RULES as pongRules,
  TUTORIAL as pongTutorial,
} from "@/games/pong/config";
import {
  MODES as snakeModes,
  DIFFICULTIES as snakeDiff,
  RULES as snakeRules,
  TUTORIAL as snakeTutorial,
} from "@/games/snake-duel/config";
import {
  MODES as sudokuModes,
  DIFFICULTIES as sudokuDiff,
  RULES as sudokuRules,
  TUTORIAL as sudokuTutorial,
} from "@/games/sudoku/config";
import {
  MODES as g2048Modes,
  DIFFICULTIES as g2048Diff,
  RULES as g2048Rules,
  TUTORIAL as g2048Tutorial,
} from "@/games/game-2048/config";

function lazyGame(loader: () => Promise<{ default: ComponentType<GameShellProps> }>) {
  return lazy(loader);
}

export const games: GameDefinition[] = [
  {
    id: "tic-tac-toe",
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    shortDescription: "Classic grid battles. Three in a row wins.",
    fullDescription:
      "Place X and O on a 3×3 board. Challenge the computer across four skill levels, or play locally with a friend.",
    categoryId: "board-strategy",
    route: "/game/tic-tac-toe",
    accent: "#8DA85A",
    estimatedMinutes: 3,
    players: ["vs-computer", "local-multiplayer"],
    difficulties: tttDiff,
    modes: tttModes,
    inputMethods: ["touch", "mouse", "keyboard"],
    technology: ["react"],
    featured: true,
    isNew: false,
    status: "available",
    rules: tttRules,
    tutorial: tttTutorial,
    component: lazyGame(() => import("@/games/tic-tac-toe/Game")),
    preload: () => import("@/games/tic-tac-toe/Game"),
  },
  {
    id: "chess",
    slug: "chess",
    name: "Chess",
    shortDescription: "Full chess with a skilled computer opponent.",
    fullDescription:
      "Standard chess with legal-move highlights. Practice solo, play locally, or challenge the computer at your preferred difficulty.",
    categoryId: "board-strategy",
    route: "/game/chess",
    accent: "#8DA85A",
    estimatedMinutes: 15,
    players: ["vs-computer", "local-multiplayer", "solo"],
    difficulties: chessDiff,
    modes: chessModes,
    inputMethods: ["touch", "mouse", "keyboard"],
    technology: ["react", "worker"],
    featured: true,
    isNew: true,
    status: "available",
    rules: chessRules,
    tutorial: chessTutorial,
    component: lazyGame(() => import("@/games/chess/Game")),
    preload: () => import("@/games/chess/Game"),
  },
  {
    id: "anagram-rush",
    slug: "anagram-rush",
    name: "Anagram Rush",
    shortDescription: "Unscramble words against the clock.",
    fullDescription:
      "Rearrange letter tiles into real words. Build combos in classic, timed, endless, and survival modes.",
    categoryId: "word-games",
    route: "/game/anagram-rush",
    accent: "#C8F04D",
    estimatedMinutes: 5,
    players: ["solo"],
    difficulties: anagramDiff,
    modes: anagramModes,
    inputMethods: ["touch", "mouse", "keyboard"],
    technology: ["react"],
    isNew: true,
    status: "available",
    rules: anagramRules,
    tutorial: anagramTutorial,
    component: lazyGame(() => import("@/games/anagram-rush/Game")),
    preload: () => import("@/games/anagram-rush/Game"),
  },
  {
    id: "word-hunt",
    slug: "word-hunt",
    name: "Word Hunt",
    shortDescription: "Connect letters on a grid and score big words.",
    fullDescription:
      "Drag paths across adjacent letters to form words. Longer words score more. Daily boards and timed rounds included.",
    categoryId: "word-games",
    route: "/game/word-hunt",
    accent: "#C8F04D",
    estimatedMinutes: 4,
    players: ["solo"],
    difficulties: huntDiff,
    modes: huntModes,
    inputMethods: ["touch", "mouse"],
    technology: ["react"],
    status: "available",
    rules: huntRules,
    tutorial: huntTutorial,
    component: lazyGame(() => import("@/games/word-hunt/Game")),
    preload: () => import("@/games/word-hunt/Game"),
  },
  {
    id: "cup-pong",
    slug: "cup-pong",
    name: "Cup Pong",
    shortDescription: "Aim, charge, and sink the cups.",
    fullDescription:
      "Swipe to aim and release to toss. Clear the triangular cup setup in solo, limited-ball, or local-turn modes.",
    categoryId: "sports-skill",
    route: "/game/cup-pong",
    accent: "#F59A51",
    estimatedMinutes: 6,
    players: ["solo", "vs-computer", "local-multiplayer"],
    difficulties: cupDiff,
    modes: cupModes,
    inputMethods: ["touch", "mouse"],
    technology: ["react", "canvas"],
    featured: true,
    isNew: true,
    status: "available",
    rules: cupRules,
    tutorial: cupTutorial,
    component: lazyGame(() => import("@/games/cup-pong/Game")),
    preload: () => import("@/games/cup-pong/Game"),
  },
  {
    id: "archery",
    slug: "archery",
    name: "Archery",
    shortDescription: "Draw, aim, and read the wind.",
    fullDescription:
      "Pull to power, aim for the bullseye, and account for wind. Practice, timed rounds, and score challenges.",
    categoryId: "sports-skill",
    route: "/game/archery",
    accent: "#F59A51",
    estimatedMinutes: 5,
    players: ["solo", "vs-computer"],
    difficulties: archDiff,
    modes: archModes,
    inputMethods: ["touch", "mouse"],
    technology: ["react", "canvas"],
    isNew: true,
    status: "available",
    rules: archRules,
    tutorial: archTutorial,
    component: lazyGame(() => import("@/games/archery/Game")),
    preload: () => import("@/games/archery/Game"),
  },
  {
    id: "pong",
    slug: "pong",
    name: "Pong",
    shortDescription: "Timeless paddle rallies, modern controls.",
    fullDescription:
      "Keep the ball in play. Challenge the computer, play locally, or survive speed ramps.",
    categoryId: "arcade-action",
    route: "/game/pong",
    accent: "#EF6C58",
    estimatedMinutes: 5,
    players: ["vs-computer", "local-multiplayer"],
    difficulties: pongDiff,
    modes: pongModes,
    inputMethods: ["touch", "mouse", "keyboard"],
    technology: ["react", "canvas"],
    status: "available",
    rules: pongRules,
    tutorial: pongTutorial,
    component: lazyGame(() => import("@/games/pong/Game")),
    preload: () => import("@/games/pong/Game"),
  },
  {
    id: "snake-duel",
    slug: "snake-duel",
    name: "Snake Duel",
    shortDescription: "Grow, dodge, and duel on a clean grid.",
    fullDescription:
      "Classic snake energy with maze mode, survival speed ramps, and optional computer rivalry.",
    categoryId: "arcade-action",
    route: "/game/snake-duel",
    accent: "#EF6C58",
    estimatedMinutes: 4,
    players: ["solo", "vs-computer", "local-multiplayer"],
    difficulties: snakeDiff,
    modes: snakeModes,
    inputMethods: ["touch", "keyboard"],
    technology: ["react", "canvas"],
    status: "available",
    rules: snakeRules,
    tutorial: snakeTutorial,
    component: lazyGame(() => import("@/games/snake-duel/Game")),
    preload: () => import("@/games/snake-duel/Game"),
  },
  {
    id: "sudoku",
    slug: "sudoku",
    name: "Sudoku",
    shortDescription: "Unique puzzles with notes, hints, and daily mode.",
    fullDescription:
      "Fill the grid so every row, column, and box has digits 1–9. Notes, undo, and mistake limits available.",
    categoryId: "puzzle-logic",
    route: "/game/sudoku",
    accent: "#D8B54A",
    estimatedMinutes: 12,
    players: ["solo"],
    difficulties: sudokuDiff,
    modes: sudokuModes,
    inputMethods: ["touch", "mouse", "keyboard"],
    technology: ["react"],
    status: "available",
    rules: sudokuRules,
    tutorial: sudokuTutorial,
    component: lazyGame(() => import("@/games/sudoku/Game")),
    preload: () => import("@/games/sudoku/Game"),
  },
  {
    id: "game-2048",
    slug: "2048",
    name: "2048",
    shortDescription: "Slide, merge, and chase the big tile.",
    fullDescription:
      "Swipe tiles to merge matching numbers. Classic 4×4 plus grid sizes, timed, and target modes.",
    categoryId: "puzzle-logic",
    route: "/game/2048",
    accent: "#D8B54A",
    estimatedMinutes: 8,
    players: ["solo"],
    difficulties: g2048Diff,
    modes: g2048Modes,
    inputMethods: ["touch", "keyboard"],
    technology: ["react"],
    status: "available",
    rules: g2048Rules,
    tutorial: g2048Tutorial,
    component: lazyGame(() => import("@/games/game-2048/Game")),
    preload: () => import("@/games/game-2048/Game"),
  },
];

export function getGameBySlug(slug: string): GameDefinition | undefined {
  return games.find((g) => g.slug === slug || g.id === slug);
}

export function getGamesByCategory(categoryId: string): GameDefinition[] {
  return games.filter((g) => g.categoryId === categoryId);
}

export function getFeaturedGames(): GameDefinition[] {
  return games.filter((g) => g.featured && g.status === "available");
}

export function getNewGames(): GameDefinition[] {
  return games.filter((g) => g.isNew && g.status === "available");
}

export function getRandomGame(filter?: (g: GameDefinition) => boolean): GameDefinition {
  const pool = games.filter((g) => g.status === "available" && (filter ? filter(g) : true));
  return pool[Math.floor(Math.random() * pool.length)] ?? games[0]!;
}

export function preloadGame(game: GameDefinition): void {
  void game.preload?.();
}
