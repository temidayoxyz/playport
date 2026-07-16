import { describe, expect, it } from "vitest";
import { canMove, createBoard, moveBoard } from "../engine/logic";

describe("2048 logic", () => {
  it("merges tiles left", () => {
    const board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: next, scoreGained, moved } = moveBoard(board, "left");
    expect(moved).toBe(true);
    expect(next[0]![0]).toBe(4);
    expect(scoreGained).toBe(4);
  });

  it("does not move when blocked", () => {
    const board = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { moved } = moveBoard(board, "left");
    expect(moved).toBe(false);
  });

  it("detects game over", () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(canMove(board)).toBe(false);
  });

  it("creates board with two tiles", () => {
    const b = createBoard(4);
    const count = b.flat().filter((v) => v !== 0).length;
    expect(count).toBe(2);
  });
});
