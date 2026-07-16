import { COMMON_WORDS, WORD_SET } from "@/data/wordLists/common-words";

export function shuffleWord(word: string): string {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  const shuffled = chars.join("");
  // avoid identical scramble when possible
  if (shuffled === word && word.length > 1) return shuffleWord(word);
  return shuffled;
}

export function isValidAnswer(answer: string, target: string): boolean {
  return answer.trim().toLowerCase() === target.toLowerCase();
}

export function scoreForWord(word: string, streak: number, timeBonus = 0): number {
  const base = word.length * 10;
  const multiplier = 1 + Math.min(streak, 10) * 0.15;
  return Math.round(base * multiplier + timeBonus);
}

export function pickWord(difficulty: string, round: number): string {
  let min = 4;
  let max = 5;
  if (difficulty === "medium") {
    min = 5;
    max = 6;
  } else if (difficulty === "hard") {
    min = 6;
    max = 7;
  }
  const len = Math.min(max, min + Math.floor(round / 5));
  const pool = COMMON_WORDS.filter((w) => w.length >= min && w.length <= len);
  return pool[Math.floor(Math.random() * pool.length)] ?? "play";
}

export function isDictionaryWord(word: string): boolean {
  return WORD_SET.has(word.toLowerCase());
}

export function definitionsStub(word: string): string {
  return `“${word}” — a valid English word used in PlayPort word games.`;
}
