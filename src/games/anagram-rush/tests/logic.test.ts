import { describe, expect, it } from "vitest";
import { isValidAnswer, scoreForWord, shuffleWord } from "../engine/logic";

describe("anagram rush", () => {
  it("shuffles without losing letters", () => {
    const word = "planet";
    const s = shuffleWord(word);
    expect([...s].sort().join("")).toBe([...word].sort().join(""));
  });

  it("validates answers case-insensitively", () => {
    expect(isValidAnswer("Planet", "planet")).toBe(true);
    expect(isValidAnswer("plan", "planet")).toBe(false);
  });

  it("scores with streak multiplier", () => {
    const base = scoreForWord("apple", 0);
    const combo = scoreForWord("apple", 5);
    expect(combo).toBeGreaterThan(base);
  });
});
