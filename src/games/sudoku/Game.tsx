import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import {
  cloneGrid,
  dailyPuzzle,
  generatePuzzle,
  type Grid,
} from "./engine/generator";

export default function SudokuGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
  showHints = true,
}: GameShellProps) {
  const initial = useMemo(() => {
    return modeId === "daily" ? dailyPuzzle() : generatePuzzle(difficultyId);
  }, [difficultyId, modeId]);

  const [given] = useState(() => cloneGrid(initial.puzzle));
  const [grid, setGrid] = useState(() => cloneGrid(initial.puzzle));
  const [solution] = useState(() => cloneGrid(initial.solution));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>({ r: 0, c: 0 });
  const [notes, setNotes] = useState<Record<string, number[]>>({});
  const [notesMode, setNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [history, setHistory] = useState<Grid[]>([]);
  const [future, setFuture] = useState<Grid[]>([]);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(modeId === "timed" ? 600 : null);
  const started = useRef(Date.now());

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status: paused ? "paused" : status,
        elapsedSeconds: elapsed,
        stats: { Mistakes: mistakes, Mode: modeId },
        ...partial,
      });
    },
    [elapsed, mistakes, modeId, onSessionChange, paused, status],
  );

  useEffect(() => {
    if (paused || status !== "playing") return;
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [paused, status]);

  useEffect(() => {
    emit();
  }, [emit]);

  useEffect(() => {
    if (timeLeft === null || status !== "playing" || paused) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return t;
        if (t <= 1) {
          setStatus("lost");
          if (sound) audioManager.play("lose");
          emit({ status: "lost" });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [emit, paused, sound, status, timeLeft]);

  const pushHistory = (prev: Grid) => {
    setHistory((h) => [...h.slice(-40), cloneGrid(prev)]);
    setFuture([]);
  };

  const place = (num: number) => {
    if (!selected || status !== "playing" || paused) return;
    const { r, c } = selected;
    if (given[r]![c] !== 0) return;

    if (notesMode) {
      const key = `${r},${c}`;
      setNotes((n) => {
        const cur = new Set(n[key] ?? []);
        if (cur.has(num)) cur.delete(num);
        else cur.add(num);
        return { ...n, [key]: [...cur].sort() };
      });
      return;
    }

    pushHistory(grid);
    const next = cloneGrid(grid);
    if (num === 0) {
      next[r]![c] = 0;
      setGrid(next);
      return;
    }

    if (solution[r]![c] !== num) {
      const m = mistakes + 1;
      setMistakes(m);
      if (sound) audioManager.play("incorrect");
      announce(`Incorrect number ${num}`);
      if (modeId === "mistakes" && m >= 3) {
        setStatus("lost");
        if (sound) audioManager.play("lose");
        emit({ status: "lost" });
      }
      // still show briefly wrong
      next[r]![c] = num;
      setGrid(next);
      window.setTimeout(() => {
        setGrid((g) => {
          const fixed = cloneGrid(g);
          if (fixed[r]![c] === num && solution[r]![c] !== num) fixed[r]![c] = 0;
          return fixed;
        });
      }, 400);
      return;
    }

    next[r]![c] = num;
    setGrid(next);
    if (sound) audioManager.play("click");
    announce(`Number ${num} entered in row ${r + 1}, column ${c + 1}`);

    // complete?
    let done = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (next[i]![j] !== solution[i]![j]) done = false;
      }
    }
    if (done) {
      setStatus("won");
      if (sound) audioManager.play("win");
      announce("Puzzle complete");
      emit({ status: "won" });
    }
  };

  const hint = () => {
    if (!showHints || !selected) return;
    const { r, c } = selected;
    if (given[r]![c] !== 0 || grid[r]![c] === solution[r]![c]) {
      // find empty
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i]![j] === 0) {
            setSelected({ r: i, c: j });
            pushHistory(grid);
            const next = cloneGrid(grid);
            next[i]![j] = solution[i]![j]!;
            setGrid(next);
            return;
          }
        }
      }
      return;
    }
    pushHistory(grid);
    const next = cloneGrid(grid);
    next[r]![c] = solution[r]![c]!;
    setGrid(next);
  };

  const selectedVal = selected ? grid[selected.r]![selected.c] : 0;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-wrap justify-between gap-2 text-sm">
        <span className="rounded-full surface px-3 py-1.5">
          {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
        </span>
        <span className="rounded-full surface px-3 py-1.5">Mistakes {mistakes}</span>
        {timeLeft !== null && (
          <span className="rounded-full surface px-3 py-1.5">Left {timeLeft}s</span>
        )}
        <button type="button" className="rounded-full surface px-3 py-1.5" onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div
        className={`relative grid w-full grid-cols-9 gap-0 overflow-hidden rounded-xl border-2 border-[var(--border)] ${paused ? "blur-md" : ""}`}
        role="grid"
        aria-label="Sudoku board"
      >
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isGiven = given[r]![c] !== 0;
            const isSel = selected?.r === r && selected?.c === c;
            const same =
              selectedVal !== 0 && val === selectedVal && !(selected?.r === r && selected?.c === c);
            const peer =
              selected &&
              (selected.r === r ||
                selected.c === c ||
                (Math.floor(selected.r / 3) === Math.floor(r / 3) &&
                  Math.floor(selected.c / 3) === Math.floor(c / 3)));
            const thickR = c % 3 === 2 && c !== 8;
            const thickB = r % 3 === 2 && r !== 8;
            const key = `${r},${c}`;
            return (
              <button
                key={key}
                type="button"
                role="gridcell"
                aria-label={
                  val
                    ? `Cell row ${r + 1} column ${c + 1} is ${val}`
                    : `Cell row ${r + 1} column ${c + 1} is empty`
                }
                disabled={paused}
                onClick={() => setSelected({ r, c })}
                className={`aspect-square text-sm font-semibold sm:text-base ${
                  isSel ? "bg-[var(--accent)]/30" : peer ? "bg-[var(--bg-muted)]" : "bg-[var(--bg-elevated)]"
                } ${same ? "text-[var(--accent)]" : ""} ${isGiven ? "font-bold" : "font-medium text-[var(--accent)]"} ${
                  thickR ? "border-r-2 border-r-[var(--border)]" : "border-r border-r-[var(--border)]"
                } ${thickB ? "border-b-2 border-b-[var(--border)]" : "border-b border-b-[var(--border)]"}`}
              >
                {val || (
                  <span className="block text-[0.55rem] leading-tight text-muted">
                    {(notes[key] ?? []).join("")}
                  </span>
                )}
              </button>
            );
          }),
        )}
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/70 text-lg font-display">
            Paused
          </div>
        )}
      </div>

      <div className="grid w-full grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            className="touch-target rounded-xl surface font-display text-lg"
            onClick={() => place(n)}
          >
            {n}
          </button>
        ))}
        <button type="button" className="touch-target rounded-xl surface text-sm" onClick={() => place(0)}>
          Erase
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className={`touch-target rounded-xl px-3 py-2 text-sm ${notesMode ? "bg-[var(--accent)] text-white" : "surface"}`}
          onClick={() => setNotesMode((v) => !v)}
        >
          Notes
        </button>
        <button
          type="button"
          className="touch-target rounded-xl surface px-3 py-2 text-sm"
          onClick={() => {
            const prev = history.at(-1);
            if (!prev) return;
            setFuture((f) => [cloneGrid(grid), ...f]);
            setHistory((h) => h.slice(0, -1));
            setGrid(prev);
          }}
        >
          Undo
        </button>
        <button
          type="button"
          className="touch-target rounded-xl surface px-3 py-2 text-sm"
          onClick={() => {
            const next = future[0];
            if (!next) return;
            setHistory((h) => [...h, cloneGrid(grid)]);
            setFuture((f) => f.slice(1));
            setGrid(next);
          }}
        >
          Redo
        </button>
        {showHints && (
          <button type="button" className="touch-target rounded-xl surface px-3 py-2 text-sm" onClick={hint}>
            Hint
          </button>
        )}
      </div>
    </div>
  );
}
