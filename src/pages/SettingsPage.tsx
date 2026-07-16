import { useSettingsStore } from "@/stores/settingsStore";
import { Button } from "@/components/common/Button";
import type { PerformanceQuality } from "@/types/settings";

export function SettingsPage() {
  const s = useSettingsStore();

  return (
    <div className="pp-container mx-auto max-w-xl safe-px pp-section">
      <p className="pp-label">Preferences</p>
      <h1 className="pp-display-md mt-2">Settings</h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">Stored only on this device.</p>

      <div className="mt-8 space-y-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
        <label className="flex items-center justify-between gap-4 text-sm text-[var(--fg)]">
          <span>Theme</span>
          <select
            value={s.theme}
            onChange={(e) => s.setTheme(e.target.value as "light" | "dark")}
            className="pp-input w-auto min-w-[8rem]"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-4 text-sm text-[var(--fg)]">
          <span>Master sound</span>
          <input
            type="checkbox"
            checked={s.masterSound}
            onChange={(e) => s.setMasterSound(e.target.checked)}
          />
        </label>

        <label className="block text-sm text-[var(--fg)]">
          <span className="flex justify-between">
            Music volume <span className="text-[var(--fg-muted)]">{Math.round(s.musicVolume * 100)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.musicVolume}
            onChange={(e) => s.setMusicVolume(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </label>

        <label className="block text-sm text-[var(--fg)]">
          <span className="flex justify-between">
            Effects volume{" "}
            <span className="text-[var(--fg-muted)]">{Math.round(s.effectsVolume * 100)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.effectsVolume}
            onChange={(e) => s.setEffectsVolume(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </label>

        {(
          [
            ["Reduced motion", s.reducedMotion, s.setReducedMotion],
            ["Vibration", s.vibration, s.setVibration],
            ["Prefer fullscreen launches", s.preferFullscreen, s.setPreferFullscreen],
            ["High contrast", s.highContrast, s.setHighContrast],
            ["Show game hints", s.showHints, s.setShowHints],
            ["Confirm before leaving active games", s.confirmLeave, s.setConfirmLeave],
          ] as const
        ).map(([label, value, setter]) => (
          <label key={label} className="flex items-center justify-between gap-4 text-sm text-[var(--fg)]">
            <span>{label}</span>
            <input type="checkbox" checked={value} onChange={(e) => setter(e.target.checked)} />
          </label>
        ))}

        <label className="flex items-center justify-between gap-4 text-sm text-[var(--fg)]">
          <span>Performance quality</span>
          <select
            value={s.performanceQuality}
            onChange={(e) => s.setPerformanceQuality(e.target.value as PerformanceQuality)}
            className="pp-input w-auto min-w-[8rem]"
          >
            <option value="auto">Auto</option>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="low">Low</option>
          </select>
        </label>

        <div className="border-t border-[var(--border)] pt-5">
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm("Reset all local PlayPort data on this device?")) {
                s.resetLocalData();
              }
            }}
          >
            Reset local data
          </Button>
        </div>
      </div>
    </div>
  );
}
