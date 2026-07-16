import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="pp-container grid gap-10 safe-px py-16 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-[var(--fg-muted)]">
            Pick a game. Enter the Port. Start playing.
          </p>
          <p className="mt-2 text-sm text-[var(--fg-soft)]">
            More games are always approaching the Port.
          </p>
        </div>
        <div>
          <h2 className="pp-label">Navigate</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--fg-muted)]">
            <li>
              <Link to="/port" className="active:text-[var(--fg)]">
                Port
              </Link>
            </li>
            <li>
              <Link to="/port#categories" className="active:text-[var(--fg)]">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className="active:text-[var(--fg)]">
                About
              </Link>
            </li>
            <li>
              <Link to="/how-to-play" className="active:text-[var(--fg)]">
                How to Play
              </Link>
            </li>
            <li>
              <Link to="/settings" className="active:text-[var(--fg)]">
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="pp-label">Project</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--fg-muted)]">
            <li>
              <a
                href="https://github.com/temidayoxyz/playport"
                target="_blank"
                rel="noreferrer"
                className="active:text-[var(--fg)]"
              >
                GitHub
              </a>
            </li>
            <li className="text-[var(--fg-soft)] leading-relaxed">
              Privacy note: PlayPort stores preferences only on this device. No accounts. No
              tracking servers.
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center text-[13px] text-[var(--fg-soft)]">
        © {new Date().getFullYear()} PlayPort · MIT Licence
      </div>
    </footer>
  );
}
