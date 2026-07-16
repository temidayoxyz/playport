import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { useSettingsStore } from "@/stores/settingsStore";
import { audioManager } from "@/lib/audio/audioManager";

const links = [
  { to: "/port", label: "Port" },
  { to: "/port#categories", label: "Categories" },
  { to: "/how-to-play", label: "How to Play" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const theme = useSettingsStore((s) => s.theme);
  const masterSound = useSettingsStore((s) => s.masterSound);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 safe-px py-3">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-[var(--bg-muted)] text-[var(--fg)]" : "text-muted hover:bg-[var(--bg-muted)]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="touch-target rounded-xl px-3 text-sm surface"
            aria-label={masterSound ? "Mute sound" : "Unmute sound"}
            onClick={() => {
              void audioManager.unlock();
              toggleSound();
            }}
          >
            {masterSound ? "🔊" : "🔇"}
          </button>
          <button
            type="button"
            className="touch-target rounded-xl px-3 text-sm surface"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
          <Link to="/settings" className="touch-target hidden rounded-xl px-3 text-sm surface sm:inline-flex items-center">
            Settings
          </Link>
          <button
            type="button"
            className="touch-target rounded-xl px-3 text-sm surface md:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-lg px-3 py-3 text-sm" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link to="/settings" className="rounded-lg px-3 py-3 text-sm" onClick={() => setOpen(false)}>
              Settings
            </Link>
            <Link to="/about" className="rounded-lg px-3 py-3 text-sm" onClick={() => setOpen(false)}>
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
