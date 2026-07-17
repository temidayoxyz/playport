import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategoryBySlug } from "@/data/categories";
import { getGamesByCategory, getRandomGame } from "@/data/games";
import { GameCard } from "@/components/port/GameCard";
import { GameSetupSheet } from "@/components/port/GameSetupSheet";
import { Button } from "@/components/common/Button";
import { CategoryIcon, Icon, Icons } from "@/components/common/Icon";
import type { GameDefinition } from "@/types/game";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function CategoryPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const category = getCategoryBySlug(slug);
  const [setupGame, setSetupGame] = useState<GameDefinition | null>(null);

  if (!category) return <NotFoundPage />;

  const list = getGamesByCategory(category.id).filter((g) => g.status === "available");

  return (
    <div className="pp-app safe-px pt-4 pb-6">
      <Link
        to="/port?view=categories"
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--fg-muted)]"
      >
        <Icon icon={Icons.ChevronLeft} size={18} />
        Categories
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-[16px]"
          style={{ background: `color-mix(in srgb, ${category.accent} 22%, var(--bg-elevated))` }}
        >
          <CategoryIcon id={category.icon} size={24} />
        </span>
        <div>
          <h1 className="pp-display-md">{category.name}</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)] leading-relaxed">{category.description}</p>
        </div>
      </div>

      <div className="mt-5">
        <Button
          variant="soft"
          size="sm"
          onClick={() => {
            const g = getRandomGame((x) => x.categoryId === category.id);
            navigate(g.route);
          }}
        >
          <Icon icon={Icons.Dices} size={16} />
          Random from this category
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {list.map((g) => (
          <GameCard key={g.id} game={g} onSelect={setSetupGame} />
        ))}
      </div>

      <GameSetupSheet
        game={setupGame}
        open={Boolean(setupGame)}
        onClose={() => setSetupGame(null)}
      />
    </div>
  );
}
