import { describe, expect, it } from "vitest";
import { buildTrie } from "../engine/trie";
import { isAdjacent, isValidPath, scoreWord, solveBoard } from "../engine/board";

describe("word hunt", () => {
  it("checks adjacency", () => {
    expect(isAdjacent({ r: 0, c: 0 }, { r: 1, c: 1 })).toBe(true);
    expect(isAdjacent({ r: 0, c: 0 }, { r: 2, c: 0 })).toBe(false);
  });

  it("prevents duplicate tiles in path", () => {
    expect(
      isValidPath(
        [
          { r: 0, c: 0 },
          { r: 0, c: 1 },
          { r: 0, c: 0 },
        ],
        4,
      ),
    ).toBe(false);
  });

  it("validates trie membership", () => {
    const trie = buildTrie(["cat", "cats", "dog"]);
    expect(trie.has("cat")).toBe(true);
    expect(trie.has("car")).toBe(false);
    expect(trie.hasPrefix("ca")).toBe(true);
  });

  it("solves a small board", () => {
    const board = [
      ["c", "a", "t"],
      ["x", "x", "s"],
      ["d", "o", "g"],
    ];
    const trie = buildTrie(["cat", "cats", "dog", "do", "at"]);
    const words = solveBoard(board, trie, 3);
    expect(words).toContain("cat");
    expect(words).toContain("dog");
  });

  it("scores by length", () => {
    expect(scoreWord("cat")).toBe(100);
    expect(scoreWord("planet")).toBe(1400);
  });
});
