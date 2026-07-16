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
      if (player === "solo" && !g.players.includes("solo") && g.players.length === 1 && g.players[0] !== "solo") {
        // games with only vs-computer still playable solo-ish — keep
      }
      if (player === "local" && !g.players.includes("local-multiplayer")) return false;
      if (player === "vs-cpu" && !g.players.includes("vs-computer") && !g.players.includes("solo")) return false;
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
    <div className="mx-auto max-w-6xl safe-px py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            Arrival hall
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">The Port</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Search the terminals, filter by dock, and board any of{" "}
            <strong className="text-[var(--fg)]">{games.length} available games</strong>. New berths open as the fleet grows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const g = getRandomGame();
              navigate(g.route);
            }}
          >
            Surprise Me
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const g = getRandomGame();
              navigate(g.route);
            }}
          >
            Random game
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 rounded-2xl surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm sm:col-span-2">
          <span className="text-muted">Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a game…"
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
          />
        </label>
        <label className="text-sm">
          <span className="text-muted">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
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
          <span className="text-muted">Players</span>
          <select
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
          >
            <option value="all">Any</option>
            <option value="local">Local multiplayer</option>
            <option value="vs-cpu">vs Computer / Solo</option>
          </select>
        </label>
        <label className="text-sm sm:col-span-2 lg:col-span-1">
          <span className="text-muted">Duration</span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
          >
            <option value="all">Any length</option>
            <option value="short">Quick (≤5 min)</option>
            <option value="medium">Medium (5–10)</option>
            <option value="long">Longer (10+)</option>
          </select>
        </label>
      </div>

      {featured && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Featured docking</h2>
          <div className="mt-4 max-w-md">
            <GameCard game={featured} onRules={() => setRulesGame(featured)} />
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Recently played</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((g) => (
              <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12" id="categories">
        <h2 className="font-display text-2xl font-bold">Category docks</h2>
        <div className="mt-6 grid gap-6">
          {categories.map((c) => (
            <CategoryDock key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="mt-12" id="games">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-bold">All terminals</h2>
          <p className="text-sm text-muted">{filtered.length} shown</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-dashed border-[var(--border)] p-6">
        <h2 className="font-display text-xl font-bold">More ports opening soon</h2>
        <p className="mt-1 text-sm text-muted">Under-construction berths — not yet playable.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoonSlots.map((slot) => (
            <div key={slot.name} className="rounded-2xl bg-[var(--bg-muted)] p-4 opacity-90">
              <p className="text-xs uppercase tracking-wider text-muted">Coming soon</p>
              <p className="font-display font-semibold">{slot.name}</p>
              <p className="text-sm text-muted">{slot.blurb}</p>
            </div>
          ))}
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
