import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { GameDefinition } from "@/types/game";
import { GameIllustration } from "@/components/common/GameIllustration";
import { getCategoryById } from "@/data/categories";
import { preloadGame } from "@/data/games";
import { Button } from "@/components/common/Button";

export function GameCard({ game, onRules }: { game: GameDefinition; onRules?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const category = getCategoryById(game.categoryId);

  useEffect(() => {
    const el = ref.current;
    if (!el || !game.preload) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          preloadGame(game);
          io.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [game]);

  const warm = () => preloadGame(game);

  return (
    <article
      ref={ref}
      className="group flex flex-col overflow-hidden rounded-2xl surface shadow-[var(--shadow-card)] transition hover:-translate-y-0.5"
      onMouseEnter={warm}
      onFocus={warm}
    >
      <GameIllustration game={game} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: game.accent }}>
              {category?.dockNumber} · {category?.shortName}
            </p>
            <h3 className="font-display text-lg font-bold">{game.name}</h3>
          </div>
          <div className="flex gap-1">
            {game.featured && (
              <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--accent)]">
                Now Docking
              </span>
            )}
            {game.isNew && (
              <span className="rounded-full bg-lime-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-lime-600 dark:text-lime-300">
                New
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted">{game.shortDescription}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-full bg-[var(--bg-muted)] px-2 py-1">
            {game.players.includes("local-multiplayer") ? "Solo / Local" : "Solo"}
          </span>
          <span className="rounded-full bg-[var(--bg-muted)] px-2 py-1">
            ~{game.estimatedMinutes} min
          </span>
          <span className="rounded-full bg-[var(--bg-muted)] px-2 py-1">
            {game.difficulties.length} difficulties
          </span>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button to={game.route} className="flex-1">
            Play
          </Button>
          <Button
            variant="secondary"
            onClick={() => onRules?.()}
            aria-label={`Rules for ${game.name}`}
          >
            Rules
          </Button>
        </div>
        {/* keyboard path: Play is a real link */}
        <Link to={game.route} className="sr-only">
          Open {game.name}
        </Link>
      </div>
    </article>
  );
}
