export type Grid = number[][]; // 0 empty

export function emptyGrid(): Grid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function cloneGrid(g: Grid): Grid {
  return g.map((row) => row.slice());
}

export function isValidPlacement(grid: Grid, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row]![i] === num || grid[i]![col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (grid[r]![c] === num) return false;
    }
  }
  return true;
}

export function solve(grid: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r]![c] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (isValidPlacement(grid, r, c, n)) {
            grid[r]![c] = n;
            if (solve(grid)) return true;
            grid[r]![c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function countSolutions(grid: Grid, limit = 2): number {
  let count = 0;
  const g = cloneGrid(grid);

  function dfs(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r]![c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isValidPlacement(g, r, c, n)) {
              g[r]![c] = n;
              if (dfs()) return true;
              g[r]![c] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  dfs();
  return count;
}

function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function generateSolved(): Grid {
  const grid = emptyGrid();
  const fill = (cell: number): boolean => {
    if (cell === 81) return true;
    const r = Math.floor(cell / 9);
    const c = cell % 9;
    for (const n of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      if (isValidPlacement(grid, r, c, n)) {
        grid[r]![c] = n;
        if (fill(cell + 1)) return true;
        grid[r]![c] = 0;
      }
    }
    return false;
  };
  fill(0);
  return grid;
}

export function generatePuzzle(difficulty: string): { puzzle: Grid; solution: Grid } {
  const solution = generateSolved();
  const puzzle = cloneGrid(solution);
  const removals =
    difficulty === "easy" ? 36 : difficulty === "hard" ? 52 : difficulty === "expert" ? 56 : 46;

  const cells = shuffled(Array.from({ length: 81 }, (_, i) => i));
  let removed = 0;
  for (const idx of cells) {
    if (removed >= removals) break;
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const backup = puzzle[r]![c]!;
    puzzle[r]![c] = 0;
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[r]![c] = backup;
    } else {
      removed++;
    }
  }
  return { puzzle, solution };
}

export function dailyPuzzle(date = new Date()): { puzzle: Grid; solution: Grid } {
  // seeded by date string via mulberry-ish: use fixed pattern from generate with seeded shuffle
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const rand = mulberry32(seed);
  // temporarily replace Math.random
  const original = Math.random;
  Math.random = rand;
  try {
    return generatePuzzle("medium");
  } finally {
    Math.random = original;
  }
}

function mulberry32(a: number): () => number {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function isComplete(grid: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r]![c] === 0) return false;
    }
  }
  return countSolutions(grid, 2) === 1 || isValidFull(grid);
}

function isValidFull(grid: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const n = grid[r]![c]!;
      grid[r]![c] = 0;
      if (!isValidPlacement(grid, r, c, n)) {
        grid[r]![c] = n;
        return false;
      }
      grid[r]![c] = n;
    }
  }
  return true;
}
