import { Chess, type Square } from "chess.js";

export type PlayerColor = "w" | "b";

export function createGame(fen?: string): Chess {
  return fen ? new Chess(fen) : new Chess();
}

export function gameEndState(game: Chess): "won" | "lost" | "draw" | null {
  if (game.isCheckmate()) return "won"; // from side who just moved perspective handled by caller
  if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
    return "draw";
  }
  return null;
}

export function uciToMove(uci: string): { from: Square; to: Square; promotion?: string } | null {
  if (uci.length < 4) return null;
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const promotion = uci.length > 4 ? uci[4] : undefined;
  return { from, to, promotion };
}

export function applyUci(game: Chess, uci: string): boolean {
  const parsed = uciToMove(uci);
  if (!parsed) return false;
  try {
    const result = game.move({
      from: parsed.from,
      to: parsed.to,
      promotion: (parsed.promotion as "q" | "r" | "b" | "n" | undefined) ?? "q",
    });
    return Boolean(result);
  } catch {
    return false;
  }
}

export function pieceLabel(piece: { type: string; color: string } | null, square: string): string {
  if (!piece) return `Empty square ${square}`;
  const names: Record<string, string> = {
    p: "pawn",
    n: "knight",
    b: "bishop",
    r: "rook",
    q: "queen",
    k: "king",
  };
  const color = piece.color === "w" ? "White" : "Black";
  return `${color} ${names[piece.type] ?? piece.type} on ${square.toUpperCase()}`;
}

export function needsPromotion(game: Chess, from: Square, to: Square): boolean {
  const piece = game.get(from);
  if (!piece || piece.type !== "p") return false;
  const rank = to[1];
  return (piece.color === "w" && rank === "8") || (piece.color === "b" && rank === "1");
}
