import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { StockfishEngine } from "./engine/stockfishEngine";
import { applyUci, needsPromotion, pieceLabel } from "./engine/gameState";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

/** Letter marks — no emoji glyphs */
const PIECE_MARK: Record<string, string> = {
  p: "P",
  n: "N",
  b: "B",
  r: "R",
  q: "Q",
  k: "K",
};

export default function ChessGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
}: GameShellProps) {
  const [game, setGame] = useState(() => new Chess());
  const [selected, setSelected] = useState<Square | null>(null);
  const [legal, setLegal] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<[Square, Square] | null>(null);
  const [orientation, setOrientation] = useState<"w" | "b">("w");
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [thinking, setThinking] = useState(false);
  const [ready, setReady] = useState(false);
  const [promotion, setPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const engineRef = useRef<StockfishEngine | null>(null);
  const started = useRef(Date.now());
  const vsComputer = modeId === "vs-computer";
  const practice = modeId === "practice";

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        elapsedSeconds: elapsed,
        message: thinking
          ? "Computer is thinking"
          : !ready && vsComputer
            ? "Preparing opponent…"
            : undefined,
        stats: {
          Moves: history.length,
          Turn: game.turn() === "w" ? "White" : "Black",
          Check: game.isCheck() ? "Yes" : "No",
        },
        ...partial,
      });
    },
    [elapsed, game, history.length, onSessionChange, ready, status, thinking, vsComputer],
  );

  useEffect(() => {
    const engine = new StockfishEngine();
    engineRef.current = engine;
    void engine.init().then(() => {
      setReady(true);
    });
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    emit();
  }, [emit]);

  const restart = () => {
    setGame(new Chess());
    setSelected(null);
    setLegal([]);
    setLastMove(null);
    setPromotion(null);
    setHistory([]);
    setStatus("playing");
    started.current = Date.now();
    setElapsed(0);
    emit({ status: "playing" });
  };

  const evaluateEnd = useCallback(
    (g: Chess, humanJustMoved: boolean) => {
      if (g.isCheckmate()) {
        const st: GameSession["status"] =
          !vsComputer ? "won" : humanJustMoved ? "won" : "lost";
        setStatus(st);
        if (sound) audioManager.play(st === "won" ? "win" : "lose");
        announce(st === "won" ? "Checkmate. You win." : "Checkmate. You lose.");
        emit({ status: st, winner: humanJustMoved ? "You" : "Computer" });
        return true;
      }
      if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition() || g.isInsufficientMaterial()) {
        setStatus("draw");
        if (sound) audioManager.play("draw");
        announce("Draw");
        emit({ status: "draw", winner: "Draw" });
        return true;
      }
      return false;
    },
    [emit, sound, vsComputer],
  );

  const tryMove = useCallback(
    (from: Square, to: Square, promo?: string) => {
      if (status !== "playing") return;
      const g = new Chess(game.fen());
      try {
        const move = g.move({ from, to, promotion: (promo as "q") || "q" });
        if (!move) return;
        setGame(g);
        setLastMove([from, to]);
        setSelected(null);
        setLegal([]);
        setHistory((h) => [...h, move.san]);
        if (sound) audioManager.play("click");
        if (g.isCheck()) announce("Check");
        const human = !vsComputer || g.turn() !== playerColor;
        if (evaluateEnd(g, human)) return;
      } catch {
        // illegal
      }
    },
    [evaluateEnd, game, playerColor, sound, status, vsComputer],
  );

  // Computer move
  useEffect(() => {
    if (!vsComputer || status !== "playing") return;
    if (game.turn() === playerColor) return;
    let cancelled = false;
    setThinking(true);
    const run = async () => {
      const engine = engineRef.current;
      if (!engine) return;
      const moves = game.moves({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
      const best = await engine.getBestMove(game.fen(), difficultyId, moves);
      if (cancelled) return;
      setThinking(false);
      if (best) applyUciAndSync(best);
    };
    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyId, game, playerColor, status, vsComputer]);

  function applyUciAndSync(uci: string) {
    const g = new Chess(game.fen());
    if (!applyUci(g, uci)) return;
    const from = uci.slice(0, 2) as Square;
    const to = uci.slice(2, 4) as Square;
    setGame(g);
    setLastMove([from, to]);
    const san = g.history({ verbose: true }).at(-1)?.san ?? uci;
    setHistory((h) => [...h, san]);
    if (sound) audioManager.play("drop");
    evaluateEnd(g, false);
  }

  const onSquare = (sq: Square) => {
    if (status !== "playing" || thinking) return;
    if (vsComputer && game.turn() !== playerColor) return;

    if (selected) {
      if (legal.includes(sq)) {
        if (needsPromotion(game, selected, sq)) {
          setPromotion({ from: selected, to: sq });
          return;
        }
        tryMove(selected, sq);
        return;
      }
      if (sq === selected) {
        setSelected(null);
        setLegal([]);
        return;
      }
    }

    const piece = game.get(sq);
    if (!piece || piece.color !== game.turn()) {
      setSelected(null);
      setLegal([]);
      return;
    }
    if (vsComputer && piece.color !== playerColor) return;
    setSelected(sq);
    const targets = game.moves({ square: sq, verbose: true }).map((m) => m.to as Square);
    setLegal(targets);
  };

  const boardSquares = useMemo(() => {
    const ranks = orientation === "w" ? [...RANKS].reverse() : [...RANKS];
    const files = orientation === "w" ? [...FILES] : [...FILES].reverse();
    return ranks.flatMap((r) => files.map((f) => `${f}${r}` as Square));
  }, [orientation]);

  const captured = useMemo(() => {
    const start: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 0 };
    const count = (color: "w" | "b") => {
      const have: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
      for (const row of game.board()) {
        for (const p of row) {
          if (p?.color === color) have[p.type] = (have[p.type] ?? 0) + 1;
        }
      }
      return (Object.keys(start) as Array<keyof typeof start>)
        .flatMap((t) =>
          Array.from({ length: Math.max(0, start[t] - (have[t] ?? 0)) }, () => PIECE_MARK[t] ?? t),
        )
        .join(" ");
    };
    return { w: count("w"), b: count("b") };
  }, [game]);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm">
        <span className="rounded-full surface px-3 py-1.5">
          {thinking
            ? "Computer is thinking"
            : game.isCheck()
              ? "Check!"
              : `${game.turn() === "w" ? "White" : "Black"} to move`}
        </span>
      </div>

      {vsComputer && (
        <div className="flex flex-wrap gap-2">
          {(["w", "b"] as const).map((c) => (
            <button
              key={c}
              type="button"
              className={`touch-target rounded-xl px-3 py-2 text-sm ${playerColor === c ? "bg-[var(--accent)] text-[var(--on-accent)]" : "surface"}`}
              onClick={() => {
                setPlayerColor(c);
                setOrientation(c);
                restart();
              }}
            >
              Play {c === "w" ? "White" : "Black"}
            </button>
          ))}
        </div>
      )}

      <div className="flex w-full justify-between text-xs text-muted">
        <span aria-label="Captured by black" className="font-mono">
          Black took: {captured.w || "—"}
        </span>
        <span aria-label="Captured by white" className="font-mono">
          White took: {captured.b || "—"}
        </span>
      </div>

      <div
        className="grid aspect-square w-full max-w-md grid-cols-8 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-strong)] shadow-[var(--shadow-sm)] game-gesture"
        role="grid"
        aria-label="Chess board"
      >
        {boardSquares.map((sq) => {
          const file = sq.charCodeAt(0) - 97;
          const rank = Number(sq[1]) - 1;
          const dark = (file + rank) % 2 === 0;
          const piece = game.get(sq);
          const isSel = selected === sq;
          const isLegal = legal.includes(sq);
          const isLast = lastMove && (lastMove[0] === sq || lastMove[1] === sq);
          const inCheck =
            game.isCheck() && piece?.type === "k" && piece.color === game.turn();
          return (
            <button
              key={sq}
              type="button"
              role="gridcell"
              aria-label={pieceLabel(piece ?? null, sq)}
              onClick={() => onSquare(sq)}
              className={`relative flex items-center justify-center text-[clamp(1.25rem,5vw,2rem)] ${
                dark ? "bg-[#8da85a]" : "bg-[#e8e6d8]"
              } ${isSel ? "ring-2 ring-inset ring-[var(--fg)]" : ""} ${
                isLast && !isSel ? "bg-[color-mix(in_srgb,#c8f04d_35%,transparent)]" : ""
              } ${inCheck ? "bg-[color-mix(in_srgb,var(--error)_40%,transparent)]" : ""}`}
            >
              {piece && (
                <span
                  className={`font-display font-bold leading-none ${
                    piece.color === "w"
                      ? "text-[#f5f4ee] drop-shadow-[0_1px_1px_rgba(23,24,20,0.55)]"
                      : "text-[#171814]"
                  }`}
                >
                  {PIECE_MARK[piece.type]}
                </span>
              )}
              {isLegal && (
                <span
                  className={`absolute rounded-full ${piece ? "inset-1 border-2 border-[var(--fg)]/30" : "h-3 w-3 bg-[var(--fg)]/25"}`}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className="touch-target rounded-xl surface px-3 py-2 text-sm" onClick={() => setOrientation((o) => (o === "w" ? "b" : "w"))}>
          Flip board
        </button>
        {practice && (
          <button
            type="button"
            className="touch-target rounded-xl surface px-3 py-2 text-sm"
            onClick={() => {
              const g = new Chess(game.fen());
              g.undo();
              setGame(g);
              setHistory((h) => h.slice(0, -1));
            }}
          >
            Undo
          </button>
        )}
        <button
          type="button"
          className="touch-target rounded-xl surface px-3 py-2 text-sm"
          onClick={() => {
            setStatus("lost");
            emit({ status: "lost", winner: "Resigned" });
          }}
        >
          Resign
        </button>
        <button type="button" className="touch-target rounded-xl surface px-3 py-2 text-sm" onClick={restart}>
          New game
        </button>
      </div>

      <div className="max-h-20 w-full overflow-y-auto rounded-xl surface p-2 text-xs text-muted">
        {history.length ? history.map((m, i) => (
          <span key={`${m}-${i}`} className="mr-2">{i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ""}{m}</span>
        )) : "Moves will appear here."}
      </div>

      {promotion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-label="Promote pawn">
          <div className="surface flex gap-2 rounded-2xl p-4">
            {(["q", "r", "b", "n"] as const).map((p) => (
              <button
                key={p}
                type="button"
                className="touch-target rounded-xl bg-[var(--bg-muted)] px-4 py-3 text-2xl"
                onClick={() => {
                  tryMove(promotion.from, promotion.to, p);
                  setPromotion(null);
                }}
              >
                {PIECE_MARK[p]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
