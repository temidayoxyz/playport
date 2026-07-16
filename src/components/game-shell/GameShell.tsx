import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import type { GameDefinition, GameSession } from "@/types/game";
import { getCategoryById } from "@/data/categories";
import { useSettingsStore } from "@/stores/settingsStore";
import { useProgressStore } from "@/stores/progressStore";
import { audioManager } from "@/lib/audio/audioManager";
import { toggleFullscreen } from "@/lib/fullscreen";
import { Button } from "@/components/common/Button";
import { Icon, Icons } from "@/components/common/Icon";
import { getRandomGame } from "@/data/games";

function LoadingDock({ name }: { name: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8">
      <div className="h-10 w-10 animate-pulse rounded-[var(--radius-md)] bg-[var(--accent)]" />
      <p className="pp-title-md">Preparing {name}…</p>
      <p className="text-sm text-[var(--fg-muted)]">Loading game systems at the Port</p>
      <Link to="/port" className="text-sm font-semibold text-[var(--accent)]">
        Return to Port
      </Link>
    </div>
  );
}

function GameErrorFallback({ name, onRetry }: { name: string; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
      <h2 className="pp-title-lg">Could not launch {name}</h2>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Something went wrong loading this terminal. Your other docks are still open.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button onClick={onRetry}>Try again</Button>
        <Button variant="secondary" to="/port">
          Back to Port
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

function RulesModal({ game, onClose }: { game: GameDefinition; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6"
        role="dialog"
        aria-label="Rules"
      >
        <h2 className="pp-title-lg">{game.name} rules</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
          {game.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <div className="mt-4 text-sm text-[var(--fg-muted)]">
          <p className="font-semibold text-[var(--fg)]">Mobile</p>
          <p>Use touch targets and drag gestures described in the tutorial.</p>
          <p className="mt-2 font-semibold text-[var(--fg)]">Desktop</p>
          <p>Mouse and keyboard shortcuts work where listed in-game.</p>
        </div>
        <Button className="mt-5" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

export function GameShell({ game }: { game: GameDefinition }) {
  const navigate = useNavigate();
  const category = getCategoryById(game.categoryId);
  const settings = useSettingsStore();
  const recordPlay = useProgressStore((s) => s.recordPlay);
  const markTutorial = useProgressStore((s) => s.markTutorialComplete);
  const isTutorialComplete = useProgressStore((s) => s.isTutorialComplete);
  const getPref = useProgressStore((s) => s.getGamePreference);
  const setPref = useProgressStore((s) => s.setGamePreference);

  const pref = getPref(game.id);
  const defaultMode = game.modes.find((m) => m.default)?.id ?? game.modes[0]!.id;
  const defaultDiff =
    game.difficulties.find((d) => d.recommended)?.id ?? game.difficulties[0]!.id;

  const [modeId, setModeId] = useState(pref.modeId ?? defaultMode);
  const [difficultyId, setDifficultyId] = useState(pref.difficultyId ?? defaultDiff);
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState<GameSession>({ status: "idle", elapsedSeconds: 0 });
  const [showRules, setShowRules] = useState(false);
  const [showTutorial, setShowTutorial] = useState(!isTutorialComplete(game.id));
  const [showSettings, setShowSettings] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    recordPlay(game.id);
    void audioManager.unlock();
  }, [game.id, recordPlay]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (settings.confirmLeave && started && session.status === "playing") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [session.status, settings.confirmLeave, started]);

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
      !window.confirm("Leave this active game and return to the Port?")
    ) {
      return;
    }
    navigate("/port");
  };

  const GameComponent = game.component;

  const loadingName = game.technology.includes("threejs")
    ? game.id === "archery"
      ? "the archery range"
      : "the cup table"
    : game.id === "chess"
      ? "the chess engine"
      : game.name;

  if (!started) {
    return (
      <div className="mx-auto max-w-lg safe-px py-8">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg-muted)]"
          onClick={() => navigate("/port")}
        >
          <Icon icon={Icons.ArrowLeft} size="sm" />
          Back to Port
        </button>
        <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
          <p className="pp-label">{category?.name}</p>
          <h1 className="pp-display-sm mt-2">{game.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{game.fullDescription}</p>

          <label className="mt-6 block text-sm font-semibold text-[var(--fg)]">Mode</label>
          <select
            className="pp-input mt-1.5 h-auto py-3"
            value={modeId}
            onChange={(e) => setModeId(e.target.value)}
          >
            {game.modes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.description}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-semibold text-[var(--fg)]">Difficulty</label>
          <select
            className="pp-input mt-1.5 h-auto py-3"
            value={difficultyId}
            onChange={(e) => setDifficultyId(e.target.value)}
          >
            {game.difficulties.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.description}
              </option>
            ))}
          </select>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                setPref(game.id, { modeId, difficultyId });
                setStarted(true);
                setSession({ status: "playing", elapsedSeconds: 0 });
                audioManager.play("click");
              }}
            >
              Launch game
            </Button>
            <Button variant="secondary" onClick={() => setShowRules(true)}>
              Rules
            </Button>
          </div>
        </div>

        {showRules && <RulesModal game={game} onClose={() => setShowRules(false)} />}
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <div className="sticky top-0 z-30 h-14 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="mx-auto flex h-full max-w-5xl flex-wrap items-center gap-2 safe-px">
          <button
            type="button"
            className="pp-icon-btn !w-auto gap-1.5 px-3 text-sm font-medium"
            onClick={leave}
          >
            <Icon icon={Icons.ArrowLeft} size="sm" />
            Port
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--fg)]">{game.name}</p>
            <p className="truncate text-xs text-[var(--fg-muted)]">
              {category?.shortName} · {game.modes.find((m) => m.id === modeId)?.name} ·{" "}
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
            className="pp-icon-btn !w-auto gap-1.5 px-3 text-sm"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume" : "Pause"}
          >
            <Icon icon={paused ? Icons.Play : Icons.Pause} size="sm" />
            <span className="hidden sm:inline">{paused ? "Resume" : "Pause"}</span>
          </button>
          <button type="button" className="pp-icon-btn !w-auto px-3 text-sm" onClick={restart}>
            Restart
          </button>
          <button
            type="button"
            className="pp-icon-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <Icon icon={Icons.Settings} size="md" />
          </button>
          <button
            type="button"
            className="pp-icon-btn"
            onClick={() => void toggleFullscreen()}
            aria-label="Fullscreen"
          >
            <Icon icon={Icons.Fullscreen} size="md" />
          </button>
        </div>
      </div>

      {(session.score !== undefined || session.message) && (
        <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-2 safe-px pt-3 text-sm">
          {session.score !== undefined && <span className="pp-badge">Score {session.score}</span>}
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

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center safe-px py-4 safe-pb">
        {paused && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg)]/90">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
              <p className="pp-title-lg">Paused</p>
              <Button className="mt-4" onClick={() => setPaused(false)}>
                Resume
              </Button>
            </div>
          </div>
        )}

        <ShellErrorBoundary name={game.name}>
          <Suspense fallback={<LoadingDock name={loadingName} />}>
            <GameComponent
              key={gameKey}
              modeId={modeId}
              difficultyId={difficultyId}
              onSessionChange={onSessionChange}
              onRequestExit={leave}
              sound={settings.masterSound}
              reducedMotion={settings.reducedMotion}
              showHints={settings.showHints}
            />
          </Suspense>
        </ShellErrorBoundary>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-2 safe-px pb-4 safe-pb md:hidden">
        <Button variant="secondary" onClick={restart}>
          Restart
        </Button>
        <Button variant="secondary" onClick={() => setShowRules(true)}>
          Rules
        </Button>
      </div>

      {(session.status === "won" || session.status === "lost" || session.status === "draw") && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div
            className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6"
            role="dialog"
            aria-label="Game result"
          >
            <p className="pp-label">Voyage complete</p>
            <h2 className="pp-display-sm mt-1">
              {session.status === "won" ? "You win!" : session.status === "lost" ? "Defeat" : "Draw"}
            </h2>
            {session.score !== undefined && (
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                Final score: {session.score}
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
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={restart}>Play again</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setStarted(false);
                  setSession({ status: "idle", elapsedSeconds: 0 });
                }}
              >
                Change mode
              </Button>
              <Button variant="secondary" to="/port">
                Return to Port
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const next = getRandomGame((g) => g.id !== game.id);
                  navigate(next.route);
                }}
              >
                Try another
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div
            className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6"
            role="dialog"
            aria-label="Tutorial"
          >
            <h2 className="pp-title-lg">First docking: {game.name}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
              {game.tutorial.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Button
              className="mt-5"
              onClick={() => {
                markTutorial(game.id);
                setShowTutorial(false);
              }}
            >
              Got it
            </Button>
          </div>
        </div>
      )}

      {showRules && <RulesModal game={game} onClose={() => setShowRules(false)} />}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div
            className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6"
            role="dialog"
          >
            <h2 className="pp-title-lg">Game settings</h2>
            <label className="mt-4 flex items-center justify-between text-sm text-[var(--fg)]">
              Hints
              <input
                type="checkbox"
                checked={settings.showHints}
                onChange={(e) => settings.setShowHints(e.target.checked)}
              />
            </label>
            <label className="mt-3 flex items-center justify-between text-sm text-[var(--fg)]">
              Vibration
              <input
                type="checkbox"
                checked={settings.vibration}
                onChange={(e) => settings.setVibration(e.target.checked)}
              />
            </label>
            <Button className="mt-5" variant="secondary" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
