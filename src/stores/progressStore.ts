import { create } from "zustand";
import { getJSON, setJSON } from "@/lib/storage/safeStorage";

const RECENT_KEY = "playport:recent";
const SCORES_KEY = "playport:highscores";
const TUTORIALS_KEY = "playport:tutorials";
const PREFS_KEY = "playport:preferences";

interface GamePreference {
  modeId?: string;
  difficultyId?: string;
}

interface ProgressState {
  recentGameIds: string[];
  highScores: Record<string, number>;
  completedTutorials: Record<string, boolean>;
  preferences: Record<string, GamePreference>;
  hydrate: () => void;
  recordPlay: (gameId: string) => void;
  setHighScore: (gameId: string, score: number) => void;
  markTutorialComplete: (gameId: string) => void;
  isTutorialComplete: (gameId: string) => boolean;
  setGamePreference: (gameId: string, pref: GamePreference) => void;
  getGamePreference: (gameId: string) => GamePreference;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  recentGameIds: [],
  highScores: {},
  completedTutorials: {},
  preferences: {},
  hydrate: () => {
    set({
      recentGameIds: getJSON<string[]>(RECENT_KEY, []),
      highScores: getJSON<Record<string, number>>(SCORES_KEY, {}),
      completedTutorials: getJSON<Record<string, boolean>>(TUTORIALS_KEY, {}),
      preferences: getJSON<Record<string, GamePreference>>(PREFS_KEY, {}),
    });
  },
  recordPlay: (gameId) => {
    const next = [gameId, ...get().recentGameIds.filter((id) => id !== gameId)].slice(0, 8);
    set({ recentGameIds: next });
    setJSON(RECENT_KEY, next);
  },
  setHighScore: (gameId, score) => {
    const current = get().highScores[gameId] ?? 0;
    if (score <= current) return;
    const highScores = { ...get().highScores, [gameId]: score };
    set({ highScores });
    setJSON(SCORES_KEY, highScores);
  },
  markTutorialComplete: (gameId) => {
    const completedTutorials = { ...get().completedTutorials, [gameId]: true };
    set({ completedTutorials });
    setJSON(TUTORIALS_KEY, completedTutorials);
  },
  isTutorialComplete: (gameId) => Boolean(get().completedTutorials[gameId]),
  setGamePreference: (gameId, pref) => {
    const preferences = {
      ...get().preferences,
      [gameId]: { ...get().preferences[gameId], ...pref },
    };
    set({ preferences });
    setJSON(PREFS_KEY, preferences);
  },
  getGamePreference: (gameId) => get().preferences[gameId] ?? {},
}));
