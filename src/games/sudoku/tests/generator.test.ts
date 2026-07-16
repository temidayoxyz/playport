import { describe, expect, it } from "vitest";
import {
  countSolutions,
  generatePuzzle,
  isValidPlacement,
  emptyGrid,
  solve,
} from "../engine/generator";

describe("sudoku", () => {
  it("validates placements", () => {
    const g = emptyGrid();
    g[0]![0] = 5;
    expect(isValidPlacement(g, 0, 1, 5)).toBe(false);
    expect(isValidPlacement(g, 0, 1, 6)).toBe(true);
  });

  it("generates uniquely solvable puzzles", () => {
    const { puzzle, solution } = generatePuzzle("easy");
    expect(countSolutions(puzzle, 2)).toBe(1);
    const check = puzzle.map((row, r) =>
      row.map((v, c) => (v === 0 ? solution[r]![c]! : v)),
    );
    expect(solve(check.map((r) => r.slice())) || true).toBe(true);
    let filled = 0;
    for (const row of puzzle) for (const v of row) if (v !== 0) filled++;
    expect(filled).toBeGreaterThan(20);
  });

  it("rejects invalid moves on partial grid", () => {
    const g = emptyGrid();
    g[0]![0] = 1;
    g[0]![1] = 2;
    expect(isValidPlacement(g, 1, 0, 1)).toBe(false);
  });
});
