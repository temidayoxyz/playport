import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import { comingSoonSlots, games, getFeaturedGames, getRandomGame } from "@/data/games";
import { GameCard } from "@/components/port/GameCard";
import { CategoryDock } from "@/components/port/CategoryDock";
import { Button } from "@/components/common/Button";
import { useProgressStore } from "@/stores/progressStore";
import type { GameDefinition } from "@/types/game";

export function PortPage() {
  const navigate = useNavigate();
  const recentIds = useProgressStore((s) => s.recentGameIds);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [player, setPlayer] = useState("all");
  const [duration, setDuration] = useState("all");
  const [rulesGame, setRulesGame] = useState<GameDefinition | null>(null);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (g.status !== "available") return false;
      if (category !== "all" && g.categoryId !== category) return false;
      if (player === "local" && !g.players.includes("local-multiplayer")) return false;
      if (player === "vs-cpu" && !g.players.includes("vs-computer") && !g.players.includes("solo")) {
        return false;
      }
      if (duration === "short" && g.estimatedMinutes > 5) return false;
      if (duration === "medium" && (g.estimatedMinutes < 5 || g.estimatedMinutes > 10)) return false;
      if (duration === "long" && g.estimatedMinutes <= 10) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !g.name.toLowerCase().includes(q) &&
          !g.shortDescription.toLowerCase().includes(q) &&
          !g.categoryId.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [category, duration, player, query]);

  const recent = recentIds
    .map((id) => games.find((g) => g.id === id))
    .filter((g): g is GameDefinition => Boolean(g));

  const featured = getFeaturedGames()[0];

  return (
    <div className="pp-container safe-px pp-section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="pp-label">Arrival hall</p>
          <h1 className="pp-display-lg mt-2">The Port</h1>
          <p className="mt-3 max-w-2xl text-[var(--fg-muted)] leading-relaxed">
            Search the terminals, filter by dock, and board any of{" "}
            <strong className="text-[var(--fg)] font-semibold">{games.length} available games</strong>.
            New berths open as the fleet grows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              navigate(getRandomGame().route);
            }}
          >
            Surprise Me
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(getRandomGame().route);
            }}
          >
            Random game
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm sm:col-span-2">
          <span className="pp-caption">Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a game…"
            className="pp-input mt-1.5"
          />
        </label>
        <label className="text-sm">
          <span className="pp-caption">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pp-input mt-1.5"
          >
            <option value="all">All docks</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="pp-caption">Players</span>
          <select value={player} onChange={(e) => setPlayer(e.target.value)} className="pp-input mt-1.5">
            <option value="all">Any</option>
            <option value="local">Local multiplayer</option>
            <option value="vs-cpu">vs Computer / Solo</option>
          </select>
        </label>
        <label className="text-sm sm:col-span-2 lg:col-span-1">
          <span className="pp-caption">Duration</span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="pp-input mt-1.5"
          >
            <option value="all">Any length</option>
            <option value="short">Quick (≤5 min)</option>
            <option value="medium">Medium (5–10)</option>
            <option value="long">Longer (10+)</option>
          </select>
        </label>
      </div>

      {featured && (
        <section className="mt-14">
          <p className="pp-label">Featured docking</p>
          <h2 className="pp-display-sm mt-2">Now boarding</h2>
          <div className="mt-6 max-w-md">
            <GameCard game={featured} onRules={() => setRulesGame(featured)} />
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-14">
          <p className="pp-label">History</p>
          <h2 className="pp-display-sm mt-2">Recently played</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((g) => (
              <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16" id="categories">
        <p className="pp-label">Map</p>
        <h2 className="pp-display-sm mt-2">Category docks</h2>
        <div className="mt-8 grid gap-6">
          {categories.map((c) => (
            <CategoryDock key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="mt-16" id="games">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="pp-label">Directory</p>
            <h2 className="pp-display-sm mt-2">All terminals</h2>
          </div>
          <p className="text-sm text-[var(--fg-muted)]">{filtered.length} shown</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-6 sm:p-8">
        <p className="pp-label">Expansion</p>
        <h2 className="pp-display-sm mt-2">More ports opening soon</h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Under-construction berths — not yet playable.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoonSlots.map((slot) => (
            <div
              key={slot.name}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-muted)] p-5"
            >
              <p className="pp-label">Coming soon</p>
              <p className="pp-title-md mt-2">{slot.name}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{slot.blurb}</p>
            </div>
          ))}
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
