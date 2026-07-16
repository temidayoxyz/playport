import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { Icon, Icons } from "@/components/common/Icon";
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
    <header className="sticky top-0 z-40 h-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="pp-container flex h-full items-center justify-between gap-3 safe-px">
        <Logo />
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `pp-nav-link ${isActive ? "is-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="pp-icon-btn"
            aria-label={masterSound ? "Mute sound" : "Unmute sound"}
            onClick={() => {
              void audioManager.unlock();
              toggleSound();
            }}
          >
            <Icon icon={masterSound ? Icons.VolumeOn : Icons.VolumeOff} size="md" />
          </button>
          <button
            type="button"
            className="pp-icon-btn"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
          >
            <Icon icon={theme === "dark" ? Icons.Moon : Icons.Sun} size="md" />
          </button>
          <Button to="/port" className="hidden sm:inline-flex">
            Enter Port
          </Button>
          <button
            type="button"
            className="pp-icon-btn md:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon icon={Icons.Menu} size="md" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-[var(--fg)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/settings"
              className="rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-[var(--fg)]"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
            <Link
              to="/about"
              className="rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-[var(--fg)]"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <div className="pt-2">
              <Button to="/port" className="w-full" onClick={() => setOpen(false)}>
                Enter Port
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
