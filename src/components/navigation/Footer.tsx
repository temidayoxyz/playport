import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto grid max-w-6xl gap-8 safe-px py-10 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">
            Pick a game. Enter the Port. Start playing.
          </p>
          <p className="mt-2 text-sm text-muted italic">
            More games are always approaching the Port.
          </p>
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
            Navigate
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/port">Port</Link></li>
            <li><Link to="/port#categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/how-to-play">How to Play</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
            Project
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li className="text-muted">
              Privacy note: PlayPort stores preferences only on this device. No accounts. No tracking servers.
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} PlayPort · MIT Licence
      </div>
    </footer>
  );
}
