import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { categories } from "@/data/categories";
import { games, getRandomGame } from "@/data/games";
import { GameCard } from "@/components/port/GameCard";
import { GameSetupSheet } from "@/components/port/GameSetupSheet";
import { Button } from "@/components/common/Button";
import { Icon, Icons, CategoryIcon } from "@/components/common/Icon";
import { BottomSheet } from "@/components/common/BottomSheet";
import { useProgressStore } from "@/stores/progressStore";
import type { GameDefinition } from "@/types/game";

export function PortPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const viewCategories = params.get("view") === "categories";
  const recentIds = useProgressStore((s) => s.recentGameIds);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    solo: false,
    local: false,
    quick: false,
    longer: false,
    easy: false,
    medium: false,
    hard: false,
  });
  const [setupGame, setSetupGame] = useState<GameDefinition | null>(null);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (g.status !== "available") return false;
      if (category !== "all" && g.categoryId !== category) return false;
      if (filters.solo && !g.players.includes("solo") && !g.players.includes("vs-computer")) return false;
      if (filters.local && !g.players.includes("local-multiplayer")) return false;
      if (filters.quick && g.estimatedMinutes > 5) return false;
      if (filters.longer && g.estimatedMinutes <= 5) return false;
      if (filters.easy && !g.difficulties.some((d) => d.id === "easy" || d.id === "beginner")) return false;
      if (filters.medium && !g.difficulties.some((d) => d.id === "medium")) return false;
      if (filters.hard && !g.difficulties.some((d) => ["hard", "expert", "impossible"].includes(d.id)))
        return false;
      if (query) {
        const q = query.toLowerCase();
        const cat = categories.find((c) => c.id === g.categoryId);
        const hay = [
          g.name,
          g.shortDescription,
          g.categoryId,
          cat?.name ?? "",
          cat?.shortName ?? "",
          ...g.modes.map((m) => m.name),
          ...g.players,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [category, filters, query]);

  const recent = recentIds
    .map((id) => games.find((g) => g.id === id))
    .filter((g): g is GameDefinition => Boolean(g))
    .slice(0, 4);

  const newGames = games.filter((g) => g.isNew && g.status === "available").slice(0, 4);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  if (viewCategories) {
    return (
      <div className="pp-app safe-px pt-5 pb-6">
        <h1 className="pp-display-md">Categories</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">Five docks. Ten games ready to launch.</p>
        <div className="mt-5 grid gap-3">
          {categories.map((c) => {
            const count = games.filter((g) => g.categoryId === c.id && g.status === "available").length;
            return (
              <button
                key={c.id}
                type="button"
                className="pp-press flex w-full min-w-0 items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-solid)] p-4 text-left shadow-[var(--shadow-sm)]"
                onClick={() => navigate(`/category/${c.slug}`)}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-[14px]"
                  style={{ background: `color-mix(in srgb, ${c.accent} 22%, var(--bg-elevated))` }}
                >
                  <CategoryIcon id={c.icon} size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[var(--fg)]">{c.name}</p>
                  <p className="mt-0.5 truncate text-sm text-[var(--fg-muted)]">{c.description}</p>
                </div>
                <span className="text-xs font-medium text-[var(--fg-muted)]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="pp-app safe-px pt-4 pb-6">
      {/* Greeting */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--fg)] md:text-[26px]">
            The Port
          </h1>
          <p className="mt-0.5 text-sm text-[var(--fg-muted)]">Choose a game and start playing.</p>
        </div>
        <Button
          variant="soft"
          size="sm"
          className="shrink-0"
          onClick={() => navigate(getRandomGame().route + "?autostart=0")}
          aria-label="Surprise me"
        >
          <Icon icon={Icons.Sparkles} size={16} />
          Surprise me
        </Button>
      </div>

      {/* Search */}
      <div className="relative mt-4">
        <Icon
          icon={Icons.Search}
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games"
          className="pp-input !pl-10"
          aria-label="Search games"
        />
      </div>

      {/* Category chips */}
      <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        <button
          type="button"
          className="pp-chip"
          data-active={category === "all"}
          onClick={() => setCategory("all")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="pp-chip"
            data-active={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: category === c.id ? "var(--on-accent)" : c.accent }}
            />
            {c.shortName}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--fg-muted)]">
          {filtered.length} game{filtered.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-solid)] px-3 text-xs font-semibold text-[var(--fg)]"
          onClick={() => setFilterOpen(true)}
        >
          <Icon icon={Icons.SlidersHorizontal} size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--on-accent)]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Recently played */}
      {!query && category === "all" && recent.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-[var(--fg)]">Recently played</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {recent.map((g) => (
              <GameCard key={`r-${g.id}`} game={g} onSelect={setSetupGame} />
            ))}
          </div>
        </section>
      )}

      {/* New */}
      {!query && category === "all" && newGames.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-[var(--fg)]">New arrivals</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {newGames.map((g) => (
              <GameCard key={`n-${g.id}`} game={g} onSelect={setSetupGame} />
            ))}
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-[var(--fg)]">
          {category === "all" ? "All games" : categories.find((c) => c.id === category)?.name}
        </h2>
        {filtered.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="pp-title-md">No games found</p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">Try another name or category.</p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setFilters({
                  solo: false,
                  local: false,
                  quick: false,
                  longer: false,
                  easy: false,
                  medium: false,
                  hard: false,
                });
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((g) => (
              <GameCard key={g.id} game={g} onSelect={setSetupGame} />
            ))}
          </div>
        )}
      </section>

      <GameSetupSheet
        game={setupGame}
        open={Boolean(setupGame)}
        onClose={() => setSetupGame(null)}
      />

      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <div className="space-y-3">
          {(
            [
              ["solo", "Solo / vs computer"],
              ["local", "Local two-player"],
              ["quick", "Quick games"],
              ["longer", "Longer games"],
              ["easy", "Easy"],
              ["medium", "Medium"],
              ["hard", "Hard"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--fg)]"
            >
              {label}
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.checked }))}
                className="h-5 w-5 accent-[var(--accent)]"
              />
            </label>
          ))}
          <Button className="mt-2 w-full" onClick={() => setFilterOpen(false)}>
            Apply
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
