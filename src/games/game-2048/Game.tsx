import { useCallback, useEffect, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { useProgressStore } from "@/stores/progressStore";
import {
  addRandomTile,
  canMove,
  createBoard,
  hasTarget,
  moveBoard,
  type Board,
  type Dir,
} from "./engine/logic";
import { sizeForMode } from "./config";

const COLORS: Record<number, string> = {
  0: "bg-[var(--bg-muted)]",
  2: "bg-[#dbeafe] text-port-900",
  4: "bg-[#bfdbfe] text-port-900",
  8: "bg-[#93c5fd] text-port-900",
  16: "bg-[#60a5fa] text-white",
  32: "bg-[#3b82f6] text-white",
  64: "bg-[#2563eb] text-white",
  128: "bg-[#a78bfa] text-white",
  256: "bg-[#8b5cf6] text-white",
  512: "bg-[#ec4899] text-white",
  1024: "bg-[#f97316] text-white",
  2048: "bg-[#84cc16] text-port-900",
};

export default function Game2048({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
}: GameShellProps) {
  const size = sizeForMode(modeId);
  const [board, setBoard] = useState<Board>(() => createBoard(size));
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [wonOnce, setWonOnce] = useState(false);
  const [prev, setPrev] = useState<{ board: Board; score: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(modeId === "timed" ? 120 : null);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(Date.now());
  const best = useProgressStore((s) => s.highScores["game-2048"] ?? 0);
  const setHighScore = useProgressStore((s) => s.setHighScore);

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score,
        elapsedSeconds: elapsed,
        stats: { Best: best, Size: `${size}×${size}` },
        ...partial,
      });
    },
    [best, elapsed, onSessionChange, score, size, status],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    emit();
  }, [emit]);

  useEffect(() => {
    if (timeLeft === null || status !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return t;
        if (t <= 1) {
          setStatus("won");
          setHighScore("game-2048", score);
          if (sound) audioManager.play("win");
          emit({ status: "won", score });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [emit, score, setHighScore, sound, status, timeLeft]);

  const applyDir = useCallback(
    (dir: Dir) => {
      if (status !== "playing" && status !== "won") return;
      if (status === "won" && modeId === "target" && !wonOnce) return;
      const { board: moved, scoreGained, moved: didMove } = moveBoard(board, dir);
      if (!didMove) return;
      setPrev({ board, score });
      const withTile = addRandomTile(moved);
      const nextScore = score + scoreGained;
      setBoard(withTile);
      setScore(nextScore);
      setHighScore("game-2048", nextScore);
      if (sound && scoreGained) audioManager.play("merge" in audioManager ? "click" : "click");
      if (sound) audioManager.play(scoreGained ? "correct" : "click");

      if (!wonOnce && hasTarget(withTile, 2048)) {
        setWonOnce(true);
        if (modeId === "target") {
          setStatus("won");
          if (sound) audioManager.play("win");
          announce("You reached 2048");
          emit({ status: "won", score: nextScore });
          return;
        }
        announce("2048 reached — keep going?");
      }

      if (!canMove(withTile)) {
        setStatus("lost");
        if (sound) audioManager.play("lose");
        announce("No moves left");
        emit({ status: "lost", score: nextScore });
      } else {
        emit({ score: nextScore });
      }
    },
    [board, emit, modeId, score, setHighScore, sound, status, wonOnce],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        applyDir(dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyDir]);

  const swipe = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div className="flex w-full flex-wrap justify-between gap-2 text-sm">
        <span className="rounded-full surface px-3 py-1.5">Score {score}</span>
        <span className="rounded-full surface px-3 py-1.5">Best {Math.max(best, score)}</span>
        {timeLeft !== null && (
          <span className="rounded-full surface px-3 py-1.5">{timeLeft}s</span>
        )}
      </div>

      <div
        className="grid w-full gap-2 rounded-2xl bg-[var(--bg-muted)] p-2 game-gesture"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (!swipe.current) return;
          const dx = e.clientX - swipe.current.x;
          const dy = e.clientY - swipe.current.y;
          if (Math.hypot(dx, dy) < 24) return;
          if (Math.abs(dx) > Math.abs(dy)) applyDir(dx > 0 ? "right" : "left");
          else applyDir(dy > 0 ? "down" : "up");
          swipe.current = null;
        }}
        role="grid"
        aria-label="2048 board"
      >
        {board.flatMap((row, r) =>
          row.map((v, c) => (
            <div
              key={`${r}-${c}`}
              role="gridcell"
              aria-label={v ? `Tile ${v}` : "Empty tile"}
              className={`flex aspect-square items-center justify-center rounded-xl font-display text-lg font-bold sm:text-xl ${COLORS[v] ?? "bg-[#0f172a] text-white"}`}
            >
              {v || ""}
            </div>
          )),
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {difficultyId !== "hard" && (
          <button
            type="button"
            className="touch-target rounded-xl surface px-4 py-2 text-sm"
            disabled={!prev}
            onClick={() => {
              if (!prev) return;
              setBoard(prev.board);
              setScore(prev.score);
              setPrev(null);
              setStatus("playing");
            }}
          >
            Undo
          </button>
        )}
        <button
          type="button"
          className="touch-target rounded-xl surface px-4 py-2 text-sm"
          onClick={() => {
            setBoard(createBoard(size));
            setScore(0);
            setPrev(null);
            setWonOnce(false);
            setStatus("playing");
            started.current = Date.now();
            setElapsed(0);
            setTimeLeft(modeId === "timed" ? 120 : null);
          }}
        >
          New game
        </button>
        {wonOnce && status === "playing" && (
          <span className="rounded-xl bg-lime-500/20 px-3 py-2 text-sm text-lime-600 dark:text-lime-300">
            Keep going!
          </span>
        )}
      </div>
    </div>
  );
}
