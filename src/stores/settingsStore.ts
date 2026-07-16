import { create } from "zustand";
import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type PerformanceQuality,
  type ThemeMode,
} from "@/types/settings";
import { getJSON, setJSON, clearPlayPortData } from "@/lib/storage/safeStorage";
import { audioManager } from "@/lib/audio/audioManager";

const STORAGE_KEY = "playport:settings";

function applyDocumentSettings(settings: AppSettings): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", settings.theme === "dark");
  root.classList.toggle("reduced-motion", settings.reducedMotion);
  root.classList.toggle("high-contrast", settings.highContrast);
  audioManager.configure({
    masterEnabled: settings.masterSound,
    musicVolume: settings.musicVolume,
    effectsVolume: settings.effectsVolume,
  });
}

function loadSettings(): AppSettings {
  const saved = getJSON<Partial<AppSettings>>(STORAGE_KEY, {});
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return {
    ...DEFAULT_SETTINGS,
    theme: prefersDark ? "dark" : DEFAULT_SETTINGS.theme,
    reducedMotion: prefersReduced,
    ...saved,
  };
}

interface SettingsState extends AppSettings {
  hydrated: boolean;
  hydrate: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setMasterSound: (value: boolean) => void;
  toggleSound: () => void;
  setMusicVolume: (value: number) => void;
  setEffectsVolume: (value: number) => void;
  setReducedMotion: (value: boolean) => void;
  setVibration: (value: boolean) => void;
  setPreferFullscreen: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setShowHints: (value: boolean) => void;
  setConfirmLeave: (value: boolean) => void;
  setPerformanceQuality: (value: PerformanceQuality) => void;
  update: (partial: Partial<AppSettings>) => void;
  resetLocalData: () => void;
}

function persist(state: AppSettings): void {
  const {
    theme,
    masterSound,
    musicVolume,
    effectsVolume,
    reducedMotion,
    vibration,
    preferFullscreen,
    highContrast,
    showHints,
    confirmLeave,
    performanceQuality,
  } = state;
  setJSON(STORAGE_KEY, {
    theme,
    masterSound,
    musicVolume,
    effectsVolume,
    reducedMotion,
    vibration,
    preferFullscreen,
    highContrast,
    showHints,
    confirmLeave,
    performanceQuality,
  });
  applyDocumentSettings(state);
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,
  hydrate: () => {
    const loaded = loadSettings();
    set({ ...loaded, hydrated: true });
    applyDocumentSettings(loaded);
  },
  setTheme: (theme) => {
    set({ theme });
    persist(get());
  },
  toggleTheme: () => {
    const theme = get().theme === "dark" ? "light" : "dark";
    set({ theme });
    persist(get());
  },
  setMasterSound: (masterSound) => {
    set({ masterSound });
    persist(get());
  },
  toggleSound: () => {
    set({ masterSound: !get().masterSound });
    persist(get());
  },
  setMusicVolume: (musicVolume) => {
    set({ musicVolume });
    persist(get());
  },
  setEffectsVolume: (effectsVolume) => {
    set({ effectsVolume });
    persist(get());
  },
  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion });
    persist(get());
  },
  setVibration: (vibration) => {
    set({ vibration });
    persist(get());
  },
  setPreferFullscreen: (preferFullscreen) => {
    set({ preferFullscreen });
    persist(get());
  },
  setHighContrast: (highContrast) => {
    set({ highContrast });
    persist(get());
  },
  setShowHints: (showHints) => {
    set({ showHints });
    persist(get());
  },
  setConfirmLeave: (confirmLeave) => {
    set({ confirmLeave });
    persist(get());
  },
  setPerformanceQuality: (performanceQuality) => {
    set({ performanceQuality });
    persist(get());
  },
  update: (partial) => {
    set(partial);
    persist(get());
  },
  resetLocalData: () => {
    clearPlayPortData();
    set({ ...DEFAULT_SETTINGS, hydrated: true });
    applyDocumentSettings(DEFAULT_SETTINGS);
  },
}));
