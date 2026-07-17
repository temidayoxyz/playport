import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GameDefinition } from "@/types/game";
import { BottomSheet } from "@/components/common/BottomSheet";
import { Button } from "@/components/common/Button";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { GameIllustration } from "@/components/common/GameIllustration";
import { getCategoryById } from "@/data/categories";
import { useProgressStore } from "@/stores/progressStore";
import { audioManager } from "@/lib/audio/audioManager";

interface Props {
  game: GameDefinition | null;
  open: boolean;
  onClose: () => void;
}

export function GameSetupSheet({ game, open, onClose }: Props) {
  const navigate = useNavigate();
  const getPref = useProgressStore((s) => s.getGamePreference);
  const setPref = useProgressStore((s) => s.setGamePreference);
  const category = game ? getCategoryById(game.categoryId) : undefined;

  const [modeId, setModeId] = useState("");
  const [difficultyId, setDifficultyId] = useState("");
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (!game) return;
    const pref = getPref(game.id);
    const defaultMode = game.modes.find((m) => m.default)?.id ?? game.modes[0]?.id ?? "";
    const defaultDiff =
      game.difficulties.find((d) => d.recommended)?.id ?? game.difficulties[0]?.id ?? "";
    setModeId(pref.modeId ?? defaultMode);
    setDifficultyId(pref.difficultyId ?? defaultDiff);
    setShowRules(false);
  }, [game, getPref]);

  if (!game) return null;

  const start = () => {
    setPref(game.id, { modeId, difficultyId });
    void audioManager.unlock();
    audioManager.play("click");
    onClose();
    navigate(`${game.route}?mode=${encodeURIComponent(modeId)}&difficulty=${encodeURIComponent(difficultyId)}&autostart=1`);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={undefined}>
      <div className="mx-auto mb-3 overflow-hidden rounded-[var(--radius-lg)]">
        <GameIllustration game={game} className="!aspect-[16/10] max-h-40" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="pp-caption" style={{ color: category?.accent }}>
            {category?.name}
          </p>
          <h2 className="pp-title-lg mt-0.5">{game.name}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
            {game.shortDescription}
          </p>
        </div>
      </div>

      {!showRules ? (
        <>
          <div className="mt-5">
            <p className="text-xs font-semibold text-[var(--fg)] mb-2">Mode</p>
            <SegmentedControl
              ariaLabel="Game mode"
              value={modeId}
              onChange={setModeId}
              options={game.modes.map((m) => ({
                id: m.id,
                label: m.name,
                description: m.description,
              }))}
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-[var(--fg)] mb-2">Difficulty</p>
            <SegmentedControl
              ariaLabel="Difficulty"
              value={difficultyId}
              onChange={setDifficultyId}
              options={game.difficulties.map((d) => ({
                id: d.id,
                label: d.name,
                description: d.description,
              }))}
            />
            <p className="mt-2 text-xs text-[var(--fg-muted)]">
              {game.difficulties.find((d) => d.id === difficultyId)?.description}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button size="lg" className="w-full" onClick={start}>
              Play
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowRules(true)}>
              Rules
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <h3 className="pp-title-md">Rules</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
            {game.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <Button className="mt-5 w-full" variant="secondary" onClick={() => setShowRules(false)}>
            Back
          </Button>
        </div>
      )}
    </BottomSheet>
  );
}
