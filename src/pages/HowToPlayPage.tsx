import { categories } from "@/data/categories";
import { games } from "@/data/games";
import { Link } from "react-router-dom";

export function HowToPlayPage() {
  return (
    <div className="pp-container mx-auto max-w-3xl safe-px pp-section">
      <p className="pp-label">Guide</p>
      <h1 className="pp-display-md mt-2">How to Play</h1>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-[var(--fg-muted)] leading-relaxed">
        <li>
          Open{" "}
          <Link to="/port" className="font-semibold text-[var(--accent)]">
            The Port
          </Link>{" "}
          and browse category docks.
        </li>
        <li>Choose a game card — hover or focus preloads the terminal.</li>
        <li>Select mode and difficulty, then launch.</li>
        <li>Use touch, mouse, or keyboard as listed on each game.</li>
        <li>Adjust sound, theme, and accessibility in Settings.</li>
      </ol>

      <h2 className="pp-display-sm mt-14">Docks</h2>
      <ul className="mt-6 space-y-3">
        {categories.map((c) => (
          <li key={c.id} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
            <Link to={`/category/${c.slug}`} className="pp-title-md">
              {c.name}
            </Link>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">{c.description}</p>
          </li>
        ))}
      </ul>

      <h2 className="pp-display-sm mt-14">Games</h2>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {games.map((g) => (
          <li key={g.id}>
            <Link
              to={g.route}
              className="block rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--fg)] active:bg-[var(--bg-muted)]"
            >
              {g.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
