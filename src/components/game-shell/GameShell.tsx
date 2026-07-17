import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { GameDefinition, GameSession } from "@/types/game";
import { getCategoryById } from "@/data/categories";
import { useSettingsStore } from "@/stores/settingsStore";
import { useProgressStore } from "@/stores/progressStore";
import { audioManager } from "@/lib/audio/audioManager";
import { toggleFullscreen } from "@/lib/fullscreen";
import { Button } from "@/components/common/Button";
import { Icon, Icons } from "@/components/common/Icon";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { GameIllustration } from "@/components/common/GameIllustration";
import { BottomSheet } from "@/components/common/BottomSheet";
import { getRandomGame } from "@/data/games";

function LoadingDock({ name }: { name: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-8">
      <div className="h-10 w-10 animate-pulse rounded-[12px] bg-[var(--accent)]" />
      <p className="pp-title-md">Preparing {name}</p>
      <p className="text-sm text-[var(--fg-muted)]">Setting the board…</p>
    </div>
  );
}

function GameErrorFallback({ name, onRetry }: { name: string; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-solid)] p-6 text-center">
      <h2 className="pp-title-lg">Could not launch {name}</h2>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Something went wrong. Your other games are still available.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button onClick={onRetry}>Try again</Button>
        <Button variant="secondary" to="/port">
          Return to Port
        </Button>
      </div>
    </div>
  );
}

class ShellErrorBoundary extends Component<
  { children: ReactNode; name: string },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(_e: Error, _i: ErrorInfo) {
    // isolated — do not crash the Port
  }
  render() {
    if (this.state.error) {
      return (
        <GameErrorFallback
          name={this.props.name}
          onRetry={() => this.setState({ error: false })}
        />
      );
    }
    return this.props.children;
  }
}

export function GameShell({ game }: { game: GameDefinition }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = getCategoryById(game.categoryId);
  const settings = useSettingsStore();
  const recordPlay = useProgressStore((s) => s.recordPlay);
  const markTutorial = useProgressStore((s) => s.markTutorialComplete);
  const isTutorialComplete = useProgressStore((s) => s.isTutorialComplete);
  const getPref = useProgressStore((s) => s.getGamePreference);
  const setPref = useProgressStore((s) => s.setGamePreference);

  const pref = getPref(game.id);
  const defaultMode =
    searchParams.get("mode") ??
    pref.modeId ??
    game.modes.find((m) => m.default)?.id ??
    game.modes[0]!.id;
  const defaultDiff =
    searchParams.get("difficulty") ??
    pref.difficultyId ??
    game.difficulties.find((d) => d.recommended)?.id ??
    game.difficulties[0]!.id;

  const autoStart = searchParams.get("autostart") === "1";

  const [modeId, setModeId] = useState(defaultMode);
  const [difficultyId, setDifficultyId] = useState(defaultDiff);
  const [started, setStarted] = useState(autoStart);
  const [session, setSession] = useState<GameSession>({ status: "idle", elapsedSeconds: 0 });
  const [showRules, setShowRules] = useState(false);
  const [showTutorial, setShowTutorial] = useState(!isTutorialComplete(game.id));
  const [showSettings, setShowSettings] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    recordPlay(game.id);
    void audioManager.unlock();
  }, [game.id, recordPlay]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (settings.confirmLeave && started && session.status === "playing" && !paused) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [session.status, settings.confirmLeave, started, paused]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden && started && session.status === "playing") {
        setPaused(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [session.status, started]);

  const onSessionChange = useCallback((s: GameSession) => {
    setSession(s);
  }, []);

  const restart = () => {
    setGameKey((k) => k + 1);
    setSession({ status: "playing", elapsedSeconds: 0 });
    setPaused(false);
  };

  const leave = () => {
    if (
      settings.confirmLeave &&
      started &&
      session.status === "playing" &&
      !paused &&
      !window.confirm("Leave this active game and return to the Port?")
    ) {
      return;
    }
    navigate("/port");
  };

  const GameComponent = game.component;

  if (!started) {
    return (
      <div className="mx-auto max-w-md safe-px py-6">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--fg-muted)]"
          onClick={() => navigate("/port")}
        >
          <Icon icon={Icons.ChevronLeft} size={18} />
          Port
        </button>

        <div className="mt-4 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-sm)]">
          <GameIllustration game={game} className="!aspect-[16/10]" />
          <div className="p-5">
            <p className="pp-caption" style={{ color: category?.accent }}>
              {category?.name}
            </p>
            <h1 className="pp-title-lg mt-1">{game.name}</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
              {game.shortDescription}
            </p>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold text-[var(--fg)]">Mode</p>
              <SegmentedControl
                ariaLabel="Mode"
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
              <p className="mb-2 text-xs font-semibold text-[var(--fg)]">Difficulty</p>
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
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  setPref(game.id, { modeId, difficultyId });
                  setStarted(true);
                  setSession({ status: "playing", elapsedSeconds: 0 });
                  audioManager.play("click");
                }}
              >
                Start game
              </Button>
              <Button variant="ghost" onClick={() => setShowRules(true)}>
                Rules
              </Button>
            </div>
          </div>
        </div>

        <BottomSheet open={showRules} onClose={() => setShowRules(false)} title={`${game.name} rules`}>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
            {game.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </BottomSheet>
      </div>
    );
  }

  const resultOpen =
    session.status === "won" || session.status === "lost" || session.status === "draw";

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 h-14 pp-glass border-b">
        <div className="mx-auto flex h-full max-w-3xl items-center gap-1 safe-px">
          <button type="button" className="pp-icon-btn" onClick={leave} aria-label="Back to Port">
            <Icon icon={Icons.ChevronLeft} size={22} />
          </button>
          <div className="min-w-0 flex-1 px-1">
            <p className="truncate text-sm font-semibold text-[var(--fg)]">{game.name}</p>
            <p className="truncate text-[11px] text-[var(--fg-muted)]">
              {game.modes.find((m) => m.id === modeId)?.name} ·{" "}
              {game.difficulties.find((d) => d.id === difficultyId)?.name}
            </p>
          </div>
          <button
            type="button"
            className="pp-icon-btn"
            aria-label={settings.masterSound ? "Mute sound" : "Unmute sound"}
            onClick={() => {
              void audioManager.unlock();
              settings.toggleSound();
            }}
          >
            <Icon icon={settings.masterSound ? Icons.VolumeOn : Icons.VolumeOff} size="md" />
          </button>
          <button
            type="button"
            className="pp-icon-btn"
            onClick={() => setPaused(true)}
            aria-label="Pause"
          >
            <Icon icon={Icons.Pause} size="md" />
          </button>
          <button
            type="button"
            className="pp-icon-btn"
            onClick={() => setShowMore(true)}
            aria-label="More"
          >
            <Icon icon={Icons.SlidersHorizontal} size="md" />
          </button>
        </div>
      </div>

      {/* Info bar */}
      {(session.score !== undefined ||
        session.message ||
        session.stats ||
        session.elapsedSeconds > 0) && (
        <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-1.5 safe-px pt-2.5 text-xs">
          {session.message && (
            <span className="pp-badge-accent !text-[11px]">{session.message}</span>
          )}
          {session.score !== undefined && (
            <span className="pp-badge">Score {session.score}</span>
          )}
          {session.opponentScore !== undefined && (
            <span className="pp-badge">Opp {session.opponentScore}</span>
          )}
          {session.stats &&
            Object.entries(session.stats).map(([k, v]) => (
              <span key={k} className="pp-badge">
                {k}: {v}
              </span>
            ))}
          <span className="pp-badge">
            {Math.floor(session.elapsedSeconds / 60)}:
            {String(session.elapsedSeconds % 60).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* Game surface */}
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center safe-px py-3">
        <ShellErrorBoundary name={game.name}>
          <Suspense fallback={<LoadingDock name={game.name} />}>
            <GameComponent
              key={gameKey}
              modeId={modeId}
              difficultyId={difficultyId}
              onSessionChange={onSessionChange}
              onRequestExit={leave}
              sound={settings.masterSound}
              reducedMotion={settings.reducedMotion || paused}
              showHints={settings.showHints}
            />
          </Suspense>
        </ShellErrorBoundary>
      </div>

      {/* Pause sheet */}
      <BottomSheet open={paused && !resultOpen} onClose={() => setPaused(false)} title="Paused" centered>
        <div className="flex flex-col gap-2 pt-1">
          <Button size="lg" className="w-full" onClick={() => setPaused(false)}>
            Resume
          </Button>
          <Button variant="secondary" className="w-full" onClick={restart}>
            Restart
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              void audioManager.unlock();
              settings.toggleSound();
            }}
          >
            Sound: {settings.masterSound ? "On" : "Off"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setPaused(false);
              setShowSettings(true);
            }}
          >
            Game settings
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setPaused(false);
              setShowRules(true);
            }}
          >
            Rules
          </Button>
          <Button variant="ghost" className="w-full" onClick={leave}>
            Return to Port
          </Button>
        </div>
      </BottomSheet>

      {/* Result sheet */}
      <BottomSheet
        open={resultOpen}
        onClose={() => {}}
        title={
          session.status === "won"
            ? "You win"
            : session.status === "lost"
              ? "Defeat"
              : session.status === "draw"
                ? "Draw"
                : "Complete"
        }
        centered
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_30%,var(--surface-solid))]">
            <Icon icon={Icons.Trophy} size={22} />
          </div>
          {session.score !== undefined && (
            <p className="text-sm text-[var(--fg-muted)]">
              Final score: <strong className="text-[var(--fg)]">{session.score}</strong>
              {session.opponentScore !== undefined ? ` · Opponent ${session.opponentScore}` : ""}
            </p>
          )}
          {session.stats && (
            <ul className="mt-3 space-y-1 text-sm text-[var(--fg-muted)]">
              {Object.entries(session.stats).map(([k, v]) => (
                <li key={k}>
                  {k}: {v}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Button size="lg" className="w-full" onClick={restart}>
            Play again
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setStarted(false);
              setSession({ status: "idle", elapsedSeconds: 0 });
            }}
          >
            Change mode
          </Button>
          <Button variant="secondary" className="w-full" to="/port">
            Return to Port
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              const next = getRandomGame((g) => g.id !== game.id);
              navigate(next.route);
            }}
          >
            Try another game
          </Button>
        </div>
      </BottomSheet>

      {/* Tutorial */}
      <BottomSheet
        open={showTutorial && started}
        onClose={() => {
          markTutorial(game.id);
          setShowTutorial(false);
        }}
        title={`How to play ${game.name}`}
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
          {game.tutorial.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <Button
          className="mt-5 w-full"
          onClick={() => {
            markTutorial(game.id);
            setShowTutorial(false);
          }}
        >
          Got it
        </Button>
      </BottomSheet>

      <BottomSheet open={showRules} onClose={() => setShowRules(false)} title={`${game.name} rules`}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
          {game.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet open={showMore} onClose={() => setShowMore(false)} title="Options">
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setShowMore(false);
              restart();
            }}
          >
            Restart
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setShowMore(false);
              setShowRules(true);
            }}
          >
            Rules
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setShowMore(false);
              setShowSettings(true);
            }}
          >
            Settings
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => void toggleFullscreen()}
          >
            Fullscreen
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet open={showSettings} onClose={() => setShowSettings(false)} title="Game settings">
        <label className="flex items-center justify-between py-3 text-sm text-[var(--fg)] border-b border-[var(--border)]">
          Hints
          <input
            type="checkbox"
            checked={settings.showHints}
            onChange={(e) => settings.setShowHints(e.target.checked)}
            className="h-5 w-5 accent-[var(--accent)]"
          />
        </label>
        <label className="flex items-center justify-between py-3 text-sm text-[var(--fg)]">
          Vibration
          <input
            type="checkbox"
            checked={settings.vibration}
            onChange={(e) => settings.setVibration(e.target.checked)}
            className="h-5 w-5 accent-[var(--accent)]"
          />
        </label>
      </BottomSheet>
    </div>
  );
}
