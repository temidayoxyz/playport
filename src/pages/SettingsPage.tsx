import { useSettingsStore } from "@/stores/settingsStore";
import { Button } from "@/components/common/Button";
import type { PerformanceQuality } from "@/types/settings";

export function SettingsPage() {
  const s = useSettingsStore();

  return (
    <div className="pp-app mx-auto max-w-xl safe-px pt-5 pb-8">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--fg)]">Settings</h1>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">Stored only on this device.</p>

      <div className="mt-6 space-y-1 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-solid)] p-2 shadow-[var(--shadow-sm)]">
        <label className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] px-3 py-3.5 text-sm text-[var(--fg)]">
          <span className="font-medium">Theme</span>
          <select
            value={s.theme}
            onChange={(e) => s.setTheme(e.target.value as "light" | "dark")}
            className="pp-input w-auto min-w-[8rem] !h-10"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] px-3 py-3.5 text-sm text-[var(--fg)]">
          <span className="font-medium">Sound effects</span>
          <input
            type="checkbox"
            checked={s.masterSound}
            onChange={(e) => s.setMasterSound(e.target.checked)}
            className="h-5 w-5 accent-[var(--accent)]"
          />
        </label>

        <label className="block rounded-[var(--radius-md)] px-3 py-3.5 text-sm text-[var(--fg)]">
          <span className="flex justify-between font-medium">
            Music volume{" "}
            <span className="text-[var(--fg-muted)] font-normal">
              {Math.round(s.musicVolume * 100)}%
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.musicVolume}
            onChange={(e) => s.setMusicVolume(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent)]"
          />
        </label>

        <label className="block rounded-[var(--radius-md)] px-3 py-3.5 text-sm text-[var(--fg)]">
          <span className="flex justify-between font-medium">
            Effects volume{" "}
            <span className="text-[var(--fg-muted)] font-normal">
              {Math.round(s.effectsVolume * 100)}%
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.effectsVolume}
            onChange={(e) => s.setEffectsVolume(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent)]"
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
          <label
            key={label}
            className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] px-3 py-3.5 text-sm text-[var(--fg)]"
          >
            <span className="font-medium">{label}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setter(e.target.checked)}
              className="h-5 w-5 accent-[var(--accent)]"
            />
          </label>
        ))}

        <label className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] px-3 py-3.5 text-sm text-[var(--fg)]">
          <span className="font-medium">Performance</span>
          <select
            value={s.performanceQuality}
            onChange={(e) => s.setPerformanceQuality(e.target.value as PerformanceQuality)}
            className="pp-input w-auto min-w-[8rem] !h-10"
          >
            <option value="auto">Auto</option>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <div className="mt-6">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            if (window.confirm("Reset all local PlayPort data on this device?")) {
              s.resetLocalData();
            }
          }}
        >
          Reset local preferences
        </Button>
      </div>
    </div>
  );
}
