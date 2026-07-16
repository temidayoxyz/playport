import { useSettingsStore } from "@/stores/settingsStore";
import { Button } from "@/components/common/Button";
import type { PerformanceQuality } from "@/types/settings";

export function SettingsPage() {
  const s = useSettingsStore();

  return (
    <div className="mx-auto max-w-xl safe-px py-12">
      <h1 className="font-display text-4xl font-bold">Settings</h1>
      <p className="mt-2 text-sm text-muted">Stored only on this device.</p>

      <div className="mt-8 space-y-5 rounded-3xl surface p-6">
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Theme</span>
          <select
            value={s.theme}
            onChange={(e) => s.setTheme(e.target.value as "light" | "dark")}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Master sound</span>
          <input type="checkbox" checked={s.masterSound} onChange={(e) => s.setMasterSound(e.target.checked)} />
        </label>

        <label className="block text-sm">
          <span className="flex justify-between">Music volume <span>{Math.round(s.musicVolume * 100)}%</span></span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.musicVolume}
            onChange={(e) => s.setMusicVolume(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>

        <label className="block text-sm">
          <span className="flex justify-between">Effects volume <span>{Math.round(s.effectsVolume * 100)}%</span></span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.effectsVolume}
            onChange={(e) => s.setEffectsVolume(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Reduced motion</span>
          <input type="checkbox" checked={s.reducedMotion} onChange={(e) => s.setReducedMotion(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Vibration</span>
          <input type="checkbox" checked={s.vibration} onChange={(e) => s.setVibration(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Prefer fullscreen launches</span>
          <input type="checkbox" checked={s.preferFullscreen} onChange={(e) => s.setPreferFullscreen(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>High contrast</span>
          <input type="checkbox" checked={s.highContrast} onChange={(e) => s.setHighContrast(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Show game hints</span>
          <input type="checkbox" checked={s.showHints} onChange={(e) => s.setShowHints(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Confirm before leaving active games</span>
          <input type="checkbox" checked={s.confirmLeave} onChange={(e) => s.setConfirmLeave(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Performance quality</span>
          <select
            value={s.performanceQuality}
            onChange={(e) => s.setPerformanceQuality(e.target.value as PerformanceQuality)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            <option value="auto">Auto</option>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="low">Low</option>
          </select>
        </label>

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
  );
}
