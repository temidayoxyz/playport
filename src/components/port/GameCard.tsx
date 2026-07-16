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
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)]"
      onMouseEnter={warm}
      onFocus={warm}
    >
      <GameIllustration game={game} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="pp-label">
              {category?.dockNumber} · {category?.shortName}
            </p>
            <h3 className="pp-title-lg mt-1">{game.name}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {game.featured && <span className="pp-badge-yellow">Now Docking</span>}
            {game.isNew && !game.featured && <span className="pp-badge-yellow">New</span>}
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{game.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          <span className="pp-badge">
            {game.players.includes("local-multiplayer") ? "Solo / Local" : "Solo"}
          </span>
          <span className="pp-badge">~{game.estimatedMinutes} min</span>
          <span className="pp-badge">{game.difficulties.length} difficulties</span>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button to={game.route} className="flex-1">
            Play
          </Button>
          <Button variant="secondary" onClick={() => onRules?.()} aria-label={`Rules for ${game.name}`}>
            Rules
          </Button>
        </div>
        <Link to={game.route} className="sr-only">
          Open {game.name}
        </Link>
      </div>
    </article>
  );
}
