import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { Icon, Icons } from "@/components/common/Icon";
import { useSettingsStore } from "@/stores/settingsStore";

export function Footer() {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="pp-container flex flex-col gap-6 safe-px py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-[var(--fg-muted)]">Games ready when you are.</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--fg-muted)]" aria-label="Footer">
          <Link to="/port" className="hover:text-[var(--fg)]">
            Port
          </Link>
          <Link to="/about" className="hover:text-[var(--fg)]">
            About
          </Link>
          <a
            href="https://github.com/temidayoxyz/playport"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--fg)]"
          >
            GitHub
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 hover:text-[var(--fg)]"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Icon icon={theme === "dark" ? Icons.Sun : Icons.Moon} size="sm" />
            Theme
          </button>
        </nav>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-[13px] text-[var(--fg-muted)]">
        © {new Date().getFullYear()} PlayPort
      </div>
    </footer>
  );
}
