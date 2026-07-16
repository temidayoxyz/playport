import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategoryBySlug } from "@/data/categories";
import { comingSoonSlots, getGamesByCategory, getRandomGame } from "@/data/games";
import { GameCard } from "@/components/port/GameCard";
import { Button } from "@/components/common/Button";
import { useState } from "react";
import type { GameDefinition } from "@/types/game";

export function CategoryPage() {
  const { slug = "" } = useParams();
  const category = getCategoryBySlug(slug);
  const navigate = useNavigate();
  const [rulesGame, setRulesGame] = useState<GameDefinition | null>(null);

  if (!category) {
    return (
      <div className="mx-auto max-w-lg safe-px py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Dock not found</h1>
        <Button to="/port" className="mt-4">
          Return to Port
        </Button>
      </div>
    );
  }

  const list = getGamesByCategory(category.id);
  const suggested = list[0];
  const future = comingSoonSlots.filter((s) => s.categoryId === category.id);

  return (
    <div className="mx-auto max-w-6xl safe-px py-10">
      <Link to="/port" className="text-sm text-muted">
        ← Port
      </Link>
      <div
        className="mt-4 rounded-3xl border p-6 shadow-[var(--shadow-dock)]"
        style={{ borderColor: `${category.accent}55`, background: `${category.accent}10` }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: category.accent }}>
          Dock {category.dockNumber}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">
          <span className="mr-2" aria-hidden>
            {category.icon}
          </span>
          {category.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex touch-target items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: category.accent }}
            onClick={() => {
              const g = getRandomGame((x) => x.categoryId === category.id);
              navigate(g.route);
            }}
          >
            Random in this dock
          </button>
          <Button variant="secondary" to="/port">
            All docks
          </Button>
        </div>
      </div>

      {suggested && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Suggested departure</h2>
          <div className="mt-4 max-w-md">
            <GameCard game={suggested} onRules={() => setRulesGame(suggested)} />
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Available games</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="py-2 pr-3">Game</th>
                <th className="py-2 pr-3">Players</th>
                <th className="py-2 pr-3">Duration</th>
                <th className="py-2 pr-3">Tech</th>
              </tr>
            </thead>
            <tbody>
              {list.map((g) => (
                <tr key={g.id} className="border-t border-[var(--border)]">
                  <td className="py-3 pr-3 font-semibold">
                    <Link to={g.route}>{g.name}</Link>
                  </td>
                  <td className="py-3 pr-3 text-muted">
                    {g.players.includes("local-multiplayer") ? "Solo / Local" : "Solo"}
                  </td>
                  <td className="py-3 pr-3 text-muted">~{g.estimatedMinutes} min</td>
                  <td className="py-3 pr-3 text-muted">{g.technology.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {list.map((g) => (
            <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-dashed border-[var(--border)] p-5">
        <h2 className="font-display text-lg font-bold">
          {category.comingSoonLabel ?? "Expansion berths"}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {future.map((f) => (
            <div key={f.name} className="rounded-xl bg-[var(--bg-muted)] p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Coming soon</p>
              <p className="font-semibold">{f.name}</p>
              <p className="text-sm text-muted">{f.blurb}</p>
            </div>
          ))}
          {future.length === 0 && (
            <p className="text-sm text-muted">More titles will dock here in a future release.</p>
          )}
        </div>
      </section>

      {rulesGame && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl surface p-6">
            <h2 className="font-display text-xl font-bold">{rulesGame.name} rules</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              {rulesGame.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Button className="mt-5" onClick={() => setRulesGame(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
