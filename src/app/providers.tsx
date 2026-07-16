import { useEffect, type ReactNode } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useProgressStore } from "@/stores/progressStore";
import { audioManager } from "@/lib/audio/audioManager";

export function Providers({ children }: { children: ReactNode }) {
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateProgress = useProgressStore((s) => s.hydrate);

  useEffect(() => {
    hydrateSettings();
    hydrateProgress();
  }, [hydrateProgress, hydrateSettings]);

  useEffect(() => {
    const unlock = () => {
      void audioManager.unlock();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return children;
}
