import { categories } from "@/data/categories";
import { games } from "@/data/games";
import { Link } from "react-router-dom";

export function HowToPlayPage() {
  return (
    <div className="mx-auto max-w-3xl safe-px py-12">
      <h1 className="font-display text-4xl font-bold">How to Play</h1>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-muted">
        <li>Open <Link to="/port" className="text-[var(--accent)]">The Port</Link> and browse category docks.</li>
        <li>Choose a game card — hover or focus preloads the terminal.</li>
        <li>Select mode and difficulty, then launch.</li>
        <li>Use touch, mouse, or keyboard as listed on each game.</li>
        <li>Adjust sound, theme, and accessibility in Settings.</li>
      </ol>

      <h2 className="mt-10 font-display text-2xl font-bold">Docks</h2>
      <ul className="mt-4 space-y-3">
        {categories.map((c) => (
          <li key={c.id} className="rounded-xl surface p-4">
            <Link to={`/category/${c.slug}`} className="font-semibold" style={{ color: c.accent }}>
              {c.name}
            </Link>
            <p className="text-sm text-muted">{c.description}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold">Games</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {games.map((g) => (
          <li key={g.id}>
            <Link to={g.route} className="block rounded-xl surface px-4 py-3 text-sm font-medium hover:bg-[var(--bg-muted)]">
              {g.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
