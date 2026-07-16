import { describe, expect, it } from "vitest";
import {
  aiMove,
  applyMove,
  createEmptyBoard,
  getWinner,
  isDraw,
  validMoves,
} from "../engine/logic";
import type { Board } from "../types";

describe("tic-tac-toe logic", () => {
  it("detects wins", () => {
    const board: Board = ["X", "X", "X", null, null, null, null, null, null];
    expect(getWinner(board)?.winner).toBe("X");
  });

  it("detects draws", () => {
    const board: Board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(isDraw(board)).toBe(true);
  });

  it("lists valid moves", () => {
    const board = createEmptyBoard();
    board[0] = "X";
    expect(validMoves(board)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("impossible AI only chooses legal moves", () => {
    let board = createEmptyBoard();
    board = applyMove(board, 0, "X");
    board = applyMove(board, 4, "O");
    board = applyMove(board, 1, "X");
    const move = aiMove(board, "O", "impossible");
    expect(validMoves(board)).toContain(move);
  });

  it("impossible AI blocks immediate loss", () => {
    const board: Board = ["X", "X", null, "O", null, null, null, null, null];
    const move = aiMove(board, "O", "impossible");
    expect(move).toBe(2);
  });
});
