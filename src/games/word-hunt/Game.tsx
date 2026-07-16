import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { COMMON_WORDS } from "@/data/wordLists/common-words";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { buildTrie } from "./engine/trie";
import {
  createBoard,
  dailySeed,
  isValidPath,
  pathToWord,
  scoreWord,
  solveBoard,
  type Coord,
} from "./engine/board";
import { boardSizeFor, timeForMode } from "./config";

export default function WordHuntGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
}: GameShellProps) {
  const size = boardSizeFor(difficultyId);
  const trie = useMemo(() => buildTrie(COMMON_WORDS.filter((w) => w.length >= 3)), []);
  const seed = modeId === "daily" ? dailySeed() : undefined;
  const [board] = useState(() => createBoard(size, seed));
  const [path, setPath] = useState<Coord[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => timeForMode(modeId));
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [preview, setPreview] = useState("");
  const [missed, setMissed] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const dragging = useRef(false);
  const started = useRef(Date.now());

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score,
        elapsedSeconds: elapsed,
        stats: { Words: found.length, Board: `${size}×${size}` },
        ...partial,
      });
    },
    [elapsed, found.length, onSessionChange, score, size, status],
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
          const solutions = solveBoard(board, trie).filter((w) => !found.includes(w)).slice(0, 12);
          setMissed(solutions);
          setStatus("won");
          if (sound) audioManager.play("win");
          announce(`Round over. Score ${score}`);
          emit({ status: "won", score });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [board, emit, found, score, sound, status, timeLeft, trie]);

  const cellKey = (c: Coord) => `${c.r},${c.c}`;

  const extendPath = (coord: Coord) => {
    if (status !== "playing") return;
    setPath((prev) => {
      if (prev.some((p) => p.r === coord.r && p.c === coord.c)) {
        if (prev.length > 1 && prev[prev.length - 2]!.r === coord.r && prev[prev.length - 2]!.c === coord.c) {
          const next = prev.slice(0, -1);
          setPreview(pathToWord(board, next));
          return next;
        }
        return prev;
      }
      const next = [...prev, coord];
      if (!isValidPath(next, size)) return prev;
      setPreview(pathToWord(board, next));
      return next;
    });
  };

  const submitPath = () => {
    if (path.length < 3) {
      setPath([]);
      setPreview("");
      return;
    }
    const word = pathToWord(board, path);
    if (found.includes(word)) {
      if (sound) audioManager.play("incorrect");
      setPreview("Already found");
    } else if (trie.has(word)) {
      const gained = scoreWord(word);
      setFound((f) => [...f, word]);
      setScore((s) => s + gained);
      if (sound) audioManager.play("correct");
      announce(`Found ${word}`);
    } else {
      if (sound) audioManager.play("incorrect");
      setPreview("Not in dictionary");
    }
    setPath([]);
    window.setTimeout(() => setPreview(""), 600);
  };

  const pathSet = new Set(path.map(cellKey));

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-wrap justify-between gap-2 text-sm">
        <span className="rounded-full surface px-3 py-1.5">Score {score}</span>
        <span className="rounded-full surface px-3 py-1.5">Words {found.length}</span>
        {timeLeft !== null && (
          <span className="rounded-full surface px-3 py-1.5">{timeLeft}s</span>
        )}
      </div>

      <div className="min-h-8 font-display text-xl tracking-wide uppercase">{preview || " "}</div>

      <div
        className="grid w-full gap-2 game-gesture select-none"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        onPointerUp={() => {
          if (dragging.current) {
            dragging.current = false;
            submitPath();
          }
        }}
        onPointerLeave={() => {
          if (dragging.current) {
            dragging.current = false;
            submitPath();
          }
        }}
      >
        {board.map((row, r) =>
          row.map((ch, c) => {
            const active = pathSet.has(`${r},${c}`);
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={`touch-target aspect-square rounded-xl font-display text-lg font-bold ${
                  active ? "bg-[var(--accent)] text-white" : "surface"
                }`}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  dragging.current = true;
                  setPath([{ r, c }]);
                  setPreview(ch);
                }}
                onPointerEnter={() => {
                  if (dragging.current) extendPath({ r, c });
                }}
                onPointerMove={(e) => {
                  if (!dragging.current) return;
                  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
                  const btn = el?.closest("button");
                  // handled via enter on buttons
                  void btn;
                }}
              >
                {ch.toUpperCase()}
              </button>
            );
          }),
        )}
      </div>

      <div className="max-h-28 w-full overflow-y-auto rounded-xl surface p-2 text-sm">
        {found.length ? found.join(" · ") : "Found words appear here."}
      </div>

      {status !== "playing" && missed.length > 0 && (
        <div className="w-full rounded-xl border border-dashed border-[var(--border)] p-3 text-sm text-muted">
          Missed high-scorers: {missed.slice(0, 8).join(", ")}
        </div>
      )}
    </div>
  );
}
