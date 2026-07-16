import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import {
  aiMove,
  applyMove,
  cellLabel,
  createEmptyBoard,
  getWinner,
  isDraw,
  validMoves,
} from "./engine/logic";
import type { Board, Mark } from "./types";

function neededWins(modeId: string): number {
  if (modeId === "best-of-3") return 2;
  if (modeId === "best-of-5") return 3;
  return 1;
}

export default function TicTacToeGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
  showHints = true,
}: GameShellProps) {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [turn, setTurn] = useState<Mark>("X");
  const [playerMark, setPlayerMark] = useState<Mark>("X");
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [elapsed, setElapsed] = useState(0);
  const [turnLeft, setTurnLeft] = useState(15);
  const [hint, setHint] = useState<number | null>(null);
  const started = useRef(Date.now());
  const vsComputer = modeId === "vs-computer" || modeId === "timed" || modeId.startsWith("best-of");
  const timed = modeId === "timed";
  const aiMark: Mark = playerMark === "X" ? "O" : "X";
  const target = neededWins(modeId);

  const emit = useCallback(
    (partial: Partial<GameSession>) => {
      onSessionChange?.({
        status,
        score: scores.x,
        opponentScore: scores.o,
        elapsedSeconds: elapsed,
        stats: {
          X: scores.x,
          O: scores.o,
          Draws: scores.draws,
          Target: target,
        },
        ...partial,
      });
    },
    [elapsed, onSessionChange, scores, status, target],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    emit({ elapsedSeconds: elapsed });
  }, [elapsed, emit]);

  const resetRound = useCallback(() => {
    setBoard(createEmptyBoard());
    setTurn("X");
    setWinLine(null);
    setHint(null);
    setStatus("playing");
    setTurnLeft(15);
    emit({ status: "playing" });
  }, [emit]);

  const finishRound = useCallback(
    (result: "X" | "O" | "draw", line?: number[]) => {
      if (line) setWinLine(line);
      setScores((s) => {
        const next =
          result === "draw"
            ? { ...s, draws: s.draws + 1 }
            : result === "X"
              ? { ...s, x: s.x + 1 }
              : { ...s, o: s.o + 1 };
        const matchOver =
          result !== "draw" &&
          (result === "X" ? next.x >= target : next.o >= target);
        if (matchOver) {
          const won =
            (result === "X" && playerMark === "X") ||
            (result === "O" && playerMark === "O") ||
            !vsComputer;
          const sessionStatus: GameSession["status"] = !vsComputer
            ? "won"
            : won
              ? "won"
              : "lost";
          setStatus(sessionStatus);
          if (sound) audioManager.play(sessionStatus === "won" ? "win" : "lose");
          announce(`${result} wins the match`);
          emit({
            status: sessionStatus,
            winner: result,
            score: next.x,
            opponentScore: next.o,
            stats: { X: next.x, O: next.o, Draws: next.draws, Target: target },
          });
        } else {
          if (sound) audioManager.play(result === "draw" ? "draw" : "correct");
          announce(result === "draw" ? "Round draw" : `${result} wins the round`);
          window.setTimeout(resetRound, 900);
        }
        return next;
      });
    },
    [emit, playerMark, resetRound, sound, target, vsComputer],
  );

  const playAt = useCallback(
    (index: number, mark: Mark) => {
      if (status !== "playing" || board[index] !== null) return;
      const next = applyMove(board, index, mark);
      setBoard(next);
      setHint(null);
      if (sound) audioManager.play("click");
      const win = getWinner(next);
      if (win) {
        finishRound(win.winner, win.line);
        return;
      }
      if (isDraw(next)) {
        finishRound("draw");
        return;
      }
      setTurn(mark === "X" ? "O" : "X");
      setTurnLeft(15);
    },
    [board, finishRound, sound, status],
  );

  // AI turn
  useEffect(() => {
    if (!vsComputer || status !== "playing") return;
    if (turn !== aiMark) return;
    const id = window.setTimeout(() => {
      const move = aiMove(board, aiMark, difficultyId);
      if (move >= 0) playAt(move, aiMark);
    }, 280);
    return () => clearTimeout(id);
  }, [aiMark, board, difficultyId, playAt, status, turn, vsComputer]);

  // Timed turns
  useEffect(() => {
    if (!timed || status !== "playing") return;
    const id = window.setInterval(() => {
      setTurnLeft((t) => {
        if (t <= 1) {
          const moves = validMoves(board);
          if (moves.length) {
            const m = moves[Math.floor(Math.random() * moves.length)]!;
            playAt(m, turn);
          }
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [board, playAt, status, timed, turn]);

  const humanCanPlay = !vsComputer || turn === playerMark;

  const onCell = (index: number) => {
    if (!humanCanPlay || status !== "playing") return;
    playAt(index, turn);
  };

  const showHintMove = () => {
    if (!showHints || status !== "playing") return;
    const m = aiMove(board, turn, "impossible");
    setHint(m);
  };

  const cells = useMemo(() => board, [board]);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm">
        <div className="rounded-full surface px-3 py-1.5">
          Turn: <strong>{turn}</strong>
          {timed ? ` · ${turnLeft}s` : ""}
        </div>
        <div className="rounded-full surface px-3 py-1.5">
          X {scores.x} · O {scores.o} · D {scores.draws}
        </div>
      </div>

      {vsComputer && (
        <div className="flex gap-2">
          {(["X", "O"] as Mark[]).map((m) => (
            <button
              key={m}
              type="button"
              className={`touch-target rounded-xl px-4 py-2 text-sm font-semibold ${
                playerMark === m ? "bg-[var(--accent)] text-white" : "surface"
              }`}
              onClick={() => {
                setPlayerMark(m);
                resetRound();
                setScores({ x: 0, o: 0, draws: 0 });
              }}
            >
              Play as {m}
            </button>
          ))}
        </div>
      )}

      <div
        className="grid aspect-square w-full max-w-sm grid-cols-3 gap-2 game-gesture"
        role="grid"
        aria-label="Tic Tac Toe board"
      >
        {cells.map((cell, i) => {
          const won = winLine?.includes(i);
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              aria-label={cellLabel(cell, i)}
              disabled={!!cell || status !== "playing" || !humanCanPlay}
              onClick={() => onCell(i)}
              className={`touch-target flex items-center justify-center rounded-2xl text-4xl font-display font-bold transition surface ${
                won ? "ring-2 ring-[var(--accent)] bg-[var(--bg-muted)]" : ""
              } ${hint === i ? "outline outline-2 outline-dashed outline-[var(--accent)]" : ""}`}
            >
              <span className={cell === "X" ? "text-violet-500" : cell === "O" ? "text-cyan-500" : ""}>
                {cell}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {showHints && (
          <button type="button" className="touch-target rounded-xl surface px-4 py-2 text-sm" onClick={showHintMove}>
            Hint
          </button>
        )}
        <button
          type="button"
          className="touch-target rounded-xl surface px-4 py-2 text-sm"
          onClick={resetRound}
        >
          New Round
        </button>
        <button
          type="button"
          className="touch-target rounded-xl surface px-4 py-2 text-sm"
          onClick={() => {
            setScores({ x: 0, o: 0, draws: 0 });
            resetRound();
            started.current = Date.now();
            setElapsed(0);
          }}
        >
          Reset Match
        </button>
      </div>
    </div>
  );
}
