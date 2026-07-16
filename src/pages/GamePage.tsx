import { useParams } from "react-router-dom";
import { getGameBySlug } from "@/data/games";
import { GameShell } from "@/components/game-shell/GameShell";
import { Button } from "@/components/common/Button";

export function GamePage() {
  const { slug = "" } = useParams();
  const game = getGameBySlug(slug);

  if (!game || game.status !== "available") {
    return (
      <div className="mx-auto max-w-lg safe-px py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Terminal offline</h1>
        <p className="mt-2 text-muted">This game is not available at the Port.</p>
        <Button to="/port" className="mt-4">
          Back to Port
        </Button>
      </div>
    );
  }

  return <GameShell game={game} />;
}
