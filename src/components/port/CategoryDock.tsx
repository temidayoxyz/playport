import { Link } from "react-router-dom";
import type { CategoryDefinition } from "@/types/game";
import { getGamesByCategory } from "@/data/games";
import { GameIllustration } from "@/components/common/GameIllustration";

export function CategoryDock({ category }: { category: CategoryDefinition }) {
  const games = getGamesByCategory(category.id).filter((g) => g.status === "available");

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="pp-label">Dock {category.dockNumber}</p>
          <h3 className="pp-display-sm mt-2">
            <span className="mr-2 text-[var(--fg-muted)]" aria-hidden>
              {category.icon}
            </span>
            {category.name}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--fg-muted)]">
            {category.description}
          </p>
        </div>
        <span className="pp-badge">{games.length} games</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {games.slice(0, 2).map((g) => (
          <Link
            key={g.id}
            to={g.route}
            className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-2 active:bg-[var(--bg-muted)]"
          >
            <div className="w-24 shrink-0 sm:w-28">
              <GameIllustration game={g} className="aspect-square max-h-none rounded-[var(--radius-md)]" />
            </div>
            <div className="min-w-0 py-1.5 pr-1">
              <p className="pp-title-sm">{g.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)] line-clamp-2">
                {g.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link
          to={`/category/${category.slug}`}
          className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--on-accent)]"
        >
          Explore dock
        </Link>
      </div>
    </section>
  );
}
