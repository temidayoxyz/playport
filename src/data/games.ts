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
    shortDescription: "Classic grid battles with razor-sharp AI.",
    fullDescription:
      "Place X and O on a 3×3 board. Challenge the computer across four difficulty tiers — including an unbeatable Impossible mode — or play locally.",
    categoryId: "board-strategy",
    route: "/game/tic-tac-toe",
    accent: "#8b5cf6",
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
    shortDescription: "Full chess with Stockfish in a Web Worker.",
    fullDescription:
      "Legal-move validation via chess.js and computer play powered by a Stockfish-compatible worker. Practice, local, or ranked-feeling AI difficulties.",
    categoryId: "board-strategy",
    route: "/game/chess",
    accent: "#a78bfa",
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
      "Letter tiles, combos, and a local dictionary. Race through classic, timed, endless, and survival modes.",
    categoryId: "word-games",
    route: "/game/anagram-rush",
    accent: "#84cc16",
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
      "Drag paths across adjacent letters. Trie-validated dictionary, daily boards, and end-of-round reveals.",
    categoryId: "word-games",
    route: "/game/word-hunt",
    accent: "#a3e635",
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
    shortDescription: "Lightweight 3D table toss with physics flair.",
    fullDescription:
      "Aim, charge, and sink cups in an optimised Three.js range. Solo, limited balls, trick shots, and local turns.",
    categoryId: "sports-skill",
    route: "/game/cup-pong",
    accent: "#f97316",
    estimatedMinutes: 6,
    players: ["solo", "vs-computer", "local-multiplayer"],
    difficulties: cupDiff,
    modes: cupModes,
    inputMethods: ["touch", "mouse"],
    technology: ["react", "threejs"],
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
    shortDescription: "Draw, aim, and read the wind in 3D.",
    fullDescription:
      "A stylised target range with wind, moving targets, and score challenges — built with React Three Fiber.",
    categoryId: "sports-skill",
    route: "/game/archery",
    accent: "#fb923c",
    estimatedMinutes: 5,
    players: ["solo", "vs-computer"],
    difficulties: archDiff,
    modes: archModes,
    inputMethods: ["touch", "mouse"],
    technology: ["react", "threejs"],
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
      "Canvas Pong with AI difficulties, local multiplayer, speed mode, and survival.",
    categoryId: "arcade-action",
    route: "/game/pong",
    accent: "#22d3ee",
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
    shortDescription: "Grow, dodge, and duel with pathfinding AI.",
    fullDescription:
      "Classic snake energy with maze mode, survival speed ramps, and optional computer rivalry.",
    categoryId: "arcade-action",
    route: "/game/snake-duel",
    accent: "#06b6d4",
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
      "Backtracking-generated boards with unique solutions, mistake limits, and pause protection.",
    categoryId: "puzzle-logic",
    route: "/game/sudoku",
    accent: "#ec4899",
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
      "Original PlayPort styling for the classic number-merge puzzle with 3×3, 4×4, 5×5, timed, and target modes.",
    categoryId: "puzzle-logic",
    route: "/game/2048",
    accent: "#f472b6",
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

export const comingSoonSlots = [
  { categoryId: "board-strategy", name: "Go Lite", blurb: "Territory skirmishes — berth reserved." },
  { categoryId: "word-games", name: "Cipher Bay", blurb: "Codeword puzzles approaching." },
  { categoryId: "sports-skill", name: "Disc Drive", blurb: "Future sports terminal." },
  { categoryId: "arcade-action", name: "Orbit Run", blurb: "More action bays opening soon." },
  { categoryId: "puzzle-logic", name: "Circuit Slide", blurb: "New puzzle berth under construction." },
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
