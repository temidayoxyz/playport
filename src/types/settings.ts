export type ThemeMode = "light" | "dark";
export type PerformanceQuality = "auto" | "high" | "balanced" | "low";

export interface AppSettings {
  theme: ThemeMode;
  masterSound: boolean;
  musicVolume: number;
  effectsVolume: number;
  reducedMotion: boolean;
  vibration: boolean;
  preferFullscreen: boolean;
  highContrast: boolean;
  showHints: boolean;
  confirmLeave: boolean;
  performanceQuality: PerformanceQuality;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  masterSound: true,
  musicVolume: 0.4,
  effectsVolume: 0.7,
  reducedMotion: false,
  vibration: true,
  preferFullscreen: false,
  highContrast: false,
  showHints: true,
  confirmLeave: true,
  performanceQuality: "auto",
};
