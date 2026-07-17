import { useEffect, useRef } from "react";
import type { GameDefinition } from "@/types/game";
import { GameIllustration } from "@/components/common/GameIllustration";
import { getCategoryById } from "@/data/categories";
import { preloadGame } from "@/data/games";
import { Icon, Icons } from "@/components/common/Icon";

interface Props {
  game: GameDefinition;
  onSelect: (game: GameDefinition) => void;
}

export function GameCard({ game, onSelect }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
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

  const multi = game.players.includes("local-multiplayer");

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(game)}
      onMouseEnter={() => preloadGame(game)}
      onFocus={() => preloadGame(game)}
      className="group pp-press flex w-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-solid)] text-left shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
    >
      <div className="overflow-hidden">
        <div className="transition-transform duration-200 ease-out group-hover:scale-[1.02]">
          <GameIllustration game={game} />
        </div>
      </div>
      <div className="flex items-start gap-2 p-3.5 pt-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: category?.accent ?? game.accent }}
            />
            <span className="truncate text-[11px] font-medium text-[var(--fg-muted)]">
              {category?.shortName}
            </span>
            {game.isNew && <span className="pp-badge-accent !px-1.5 !py-0 !text-[10px]">New</span>}
          </div>
          <h3 className="mt-1 truncate text-[15px] font-semibold leading-tight text-[var(--fg)]">
            {game.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-[var(--fg-muted)]">
            <Icon icon={multi ? Icons.Users : Icons.UserRound} size={14} />
            <span className="text-[11px] font-medium">{multi ? "Solo · Local" : "Solo"}</span>
          </div>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] shadow-[var(--shadow-sm)] transition-transform duration-150 group-hover:scale-105"
          aria-hidden
        >
          <Icon icon={Icons.Play} size={16} />
        </span>
      </div>
    </button>
  );
}
