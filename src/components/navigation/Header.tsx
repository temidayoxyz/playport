import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { Icon, Icons } from "@/components/common/Icon";
import { useSettingsStore } from "@/stores/settingsStore";
import { getRandomGame } from "@/data/games";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const isLanding = location.pathname === "/";
  const isPortApp =
    location.pathname.startsWith("/port") ||
    location.pathname.startsWith("/category") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/about");

  if (isLanding) {
    return (
      <header className="sticky top-0 z-40 h-14 pp-glass border-b">
        <div className="pp-container flex h-full items-center justify-between gap-3 safe-px">
          <Logo />
          <div className="flex items-center gap-1.5">
            <a
              href="#how-it-works"
              className="pp-nav-link hidden sm:inline-flex"
            >
              How it works
            </a>
            <button
              type="button"
              className="pp-icon-btn"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
            >
              <Icon icon={theme === "dark" ? Icons.Sun : Icons.Moon} size="md" />
            </button>
            <Button to="/port" size="sm" className="!h-10">
              Enter the Port
            </Button>
          </div>
        </div>
      </header>
    );
  }

  if (isPortApp) {
    return (
      <header className="sticky top-0 z-40 h-14 pp-glass border-b">
        <div className="pp-app flex h-full items-center justify-between gap-3 safe-px">
          <div className="flex items-center gap-3 min-w-0">
            <Logo compact to="/port" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--fg)]">
                {location.pathname.startsWith("/settings")
                  ? "Settings"
                  : location.pathname.startsWith("/about")
                    ? "About"
                    : location.pathname.startsWith("/category")
                      ? "Categories"
                      : "The Port"}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
            <NavLink to="/port" end className={({ isActive }) => `pp-nav-link ${isActive ? "is-active" : ""}`}>
              Port
            </NavLink>
            <NavLink
              to="/port?view=categories"
              className={({ isActive }) => `pp-nav-link ${isActive || location.pathname.startsWith("/category") ? "is-active" : ""}`}
            >
              Categories
            </NavLink>
            <button
              type="button"
              className="pp-nav-link"
              onClick={() => navigate(getRandomGame().route)}
            >
              Random
            </button>
            <NavLink to="/settings" className={({ isActive }) => `pp-nav-link ${isActive ? "is-active" : ""}`}>
              Settings
            </NavLink>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="pp-icon-btn"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
            >
              <Icon icon={theme === "dark" ? Icons.Sun : Icons.Moon} size="md" />
            </button>
            <Link to="/settings" className="pp-icon-btn md:hidden" aria-label="Settings">
              <Icon icon={Icons.Settings} size="md" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 h-14 pp-glass border-b">
      <div className="pp-container flex h-full items-center justify-between gap-3 safe-px">
        <Logo />
        <Button to="/port" size="sm">
          Enter the Port
        </Button>
      </div>
    </header>
  );
}
