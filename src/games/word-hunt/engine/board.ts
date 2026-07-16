import type { Trie } from "./trie";

export type Coord = { r: number; c: number };

const DIRS: Array<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function isAdjacent(a: Coord, b: Coord): boolean {
  return Math.max(Math.abs(a.r - b.r), Math.abs(a.c - b.c)) === 1;
}

export function createBoard(size: number, seed?: number): string[][] {
  const letters = "EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ";
  let s = seed ?? Date.now();
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => letters[Math.floor(rand() * letters.length)]!.toLowerCase()),
  );
}

export function dailySeed(date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function pathToWord(board: string[][], path: Coord[]): string {
  return path.map(({ r, c }) => board[r]?.[c] ?? "").join("");
}

export function isValidPath(path: Coord[], boardSize: number): boolean {
  const seen = new Set<string>();
  for (let i = 0; i < path.length; i++) {
    const p = path[i]!;
    if (p.r < 0 || p.c < 0 || p.r >= boardSize || p.c >= boardSize) return false;
    const key = `${p.r},${p.c}`;
    if (seen.has(key)) return false;
    seen.add(key);
    if (i > 0 && !isAdjacent(path[i - 1]!, p)) return false;
  }
  return true;
}

export function scoreWord(word: string): number {
  const len = word.length;
  if (len < 3) return 0;
  if (len === 3) return 100;
  if (len === 4) return 400;
  if (len === 5) return 800;
  if (len === 6) return 1400;
  return 1400 + (len - 6) * 400;
}

export function solveBoard(board: string[][], trie: Trie, minLen = 3): string[] {
  const size = board.length;
  const found = new Set<string>();

  function dfs(r: number, c: number, node: Trie["root"], path: string, visited: boolean[][]) {
    const ch = board[r]![c]!;
    const next = node.children.get(ch);
    if (!next) return;
    const word = path + ch;
    if (next.end && word.length >= minLen) found.add(word);
    visited[r]![c] = true;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
      if (visited[nr]![nc]) continue;
      dfs(nr, nc, next, word, visited);
    }
    visited[r]![c] = false;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const visited = Array.from({ length: size }, () => Array(size).fill(false));
      dfs(r, c, trie.root, "", visited);
    }
  }
  return [...found].sort((a, b) => b.length - a.length || a.localeCompare(b));
}
