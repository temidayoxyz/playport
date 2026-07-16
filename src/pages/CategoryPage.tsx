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
      <div className="pp-container mx-auto max-w-lg safe-px py-16 text-center">
        <h1 className="pp-display-sm">Dock not found</h1>
        <Button to="/port" className="mt-6">
          Return to Port
        </Button>
      </div>
    );
  }

  const list = getGamesByCategory(category.id);
  const suggested = list[0];
  const future = comingSoonSlots.filter((s) => s.categoryId === category.id);

  return (
    <div className="pp-container safe-px pp-section">
      <Link to="/port" className="text-sm font-medium text-[var(--fg-muted)]">
        ← Port
      </Link>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8">
        <p className="pp-label">Dock {category.dockNumber}</p>
        <h1 className="pp-display-lg mt-2">
          <span className="mr-2 text-[var(--fg-muted)]" aria-hidden>
            {category.icon}
          </span>
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--fg-muted)] leading-relaxed">{category.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const g = getRandomGame((x) => x.categoryId === category.id);
              navigate(g.route);
            }}
          >
            Random in this dock
          </Button>
          <Button variant="secondary" to="/port">
            All docks
          </Button>
        </div>
      </div>

      {suggested && (
        <section className="mt-14">
          <p className="pp-label">Suggested</p>
          <h2 className="pp-display-sm mt-2">Suggested departure</h2>
          <div className="mt-6 max-w-md">
            <GameCard game={suggested} onRules={() => setRulesGame(suggested)} />
          </div>
        </section>
      )}

      <section className="mt-14">
        <p className="pp-label">Compare</p>
        <h2 className="pp-display-sm mt-2">Available games</h2>
        <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-[var(--bg-muted)] text-[var(--fg-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Game</th>
                <th className="px-4 py-3 font-medium">Players</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Tech</th>
              </tr>
            </thead>
            <tbody>
              {list.map((g) => (
                <tr key={g.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-semibold text-[var(--fg)]">
                    <Link to={g.route}>{g.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">
                    {g.players.includes("local-multiplayer") ? "Solo / Local" : "Solo"}
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">~{g.estimatedMinutes} min</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{g.technology.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {list.map((g) => (
            <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-6">
        <p className="pp-label">Expansion</p>
        <h2 className="pp-title-lg mt-2">{category.comingSoonLabel ?? "Expansion berths"}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {future.map((f) => (
            <div key={f.name} className="rounded-[var(--radius-lg)] bg-[var(--bg-muted)] p-4">
              <p className="pp-label">Coming soon</p>
              <p className="pp-title-md mt-1">{f.name}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{f.blurb}</p>
            </div>
          ))}
          {future.length === 0 && (
            <p className="text-sm text-[var(--fg-muted)]">
              More titles will dock here in a future release.
            </p>
          )}
        </div>
      </section>

      {rulesGame && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
            <h2 className="pp-title-lg">{rulesGame.name} rules</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
              {rulesGame.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Button className="mt-6" onClick={() => setRulesGame(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
