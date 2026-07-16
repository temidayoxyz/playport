import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { applyUci, gameEndState, needsPromotion, uciToMove } from "../engine/gameState";
import { parseBestMove } from "../engine/stockfishEngine";

describe("chess engine helpers", () => {
  it("parses bestmove lines", () => {
    expect(parseBestMove("bestmove e2e4")).toBe("e2e4");
    expect(parseBestMove("bestmove (none)")).toBeNull();
  });

  it("applies UCI moves", () => {
    const g = new Chess();
    expect(applyUci(g, "e2e4")).toBe(true);
    expect(g.fen().startsWith("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")).toBe(true);
  });

  it("detects promotion need", () => {
    const g = new Chess("8/P7/8/8/8/8/8/4K2k w - - 0 1");
    expect(needsPromotion(g, "a7", "a8")).toBe(true);
  });

  it("detects checkmate end state", () => {
    const g = new Chess("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3");
    expect(g.isCheckmate()).toBe(true);
    expect(gameEndState(g)).toBe("won");
  });

  it("parses uci to squares", () => {
    expect(uciToMove("e7e8q")).toEqual({ from: "e7", to: "e8", promotion: "q" });
  });
});
