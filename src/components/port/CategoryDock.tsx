import { Link } from "react-router-dom";
import type { CategoryDefinition } from "@/types/game";
import { getGamesByCategory } from "@/data/games";
import { GameIllustration } from "@/components/common/GameIllustration";

export function CategoryDock({ category }: { category: CategoryDefinition }) {
  const games = getGamesByCategory(category.id).filter((g) => g.status === "available");

  return (
    <section
      className="rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-dock)]"
      style={{ borderColor: `${category.accent}44` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: category.accent }}>
            Dock {category.dockNumber}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold">
            <span className="mr-2" aria-hidden>
              {category.icon}
            </span>
            {category.name}
          </h3>
          <p className="mt-1 max-w-xl text-sm text-muted">{category.description}</p>
        </div>
        <div className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${category.accent}22`, color: category.accent }}>
          {games.length} games
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {games.slice(0, 2).map((g) => (
          <Link
            key={g.id}
            to={g.route}
            className="flex gap-3 rounded-2xl border border-[var(--border)] p-2 transition hover:bg-[var(--bg-muted)]"
          >
            <div className="w-28 shrink-0">
              <GameIllustration game={g} className="aspect-square max-h-none rounded-xl" />
            </div>
            <div className="min-w-0 py-1">
              <p className="font-display font-semibold">{g.name}</p>
              <p className="text-xs text-muted line-clamp-2">{g.shortDescription}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Link
          to={`/category/${category.slug}`}
          className="inline-flex touch-target items-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ background: category.accent }}
        >
          Explore dock
        </Link>
      </div>
    </section>
  );
}
