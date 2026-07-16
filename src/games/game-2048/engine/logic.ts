export type Board = number[][];

export type Dir = "up" | "down" | "left" | "right";

export function createBoard(size: number): Board {
  const board = Array.from({ length: size }, () => Array(size).fill(0));
  return addRandomTile(addRandomTile(board));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice());
}

function emptyCells(board: Board): Array<{ r: number; c: number }> {
  const cells: Array<{ r: number; c: number }> = [];
  board.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v === 0) cells.push({ r, c });
    }),
  );
  return cells;
}

export function addRandomTile(board: Board): Board {
  const cells = emptyCells(board);
  if (!cells.length) return board;
  const next = cloneBoard(board);
  const cell = cells[Math.floor(Math.random() * cells.length)]!;
  next[cell.r]![cell.c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideLine(line: number[]): { line: number[]; gained: number; moved: boolean } {
  const filtered = line.filter((n) => n !== 0);
  const result: number[] = [];
  let gained = 0;
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const v = filtered[i]! * 2;
      result.push(v);
      gained += v;
      i += 2;
    } else {
      result.push(filtered[i]!);
      i += 1;
    }
  }
  while (result.length < line.length) result.push(0);
  const moved = result.some((v, idx) => v !== line[idx]);
  return { line: result, gained, moved };
}

export function moveBoard(
  board: Board,
  dir: Dir,
): { board: Board; scoreGained: number; moved: boolean } {
  const size = board.length;
  let gained = 0;
  let moved = false;
  const next = cloneBoard(board);

  const process = (get: (i: number, j: number) => number, set: (i: number, j: number, v: number) => void) => {
    for (let i = 0; i < size; i++) {
      const line = Array.from({ length: size }, (_, j) => get(i, j));
      const res = slideLine(dir === "right" || dir === "down" ? line.reverse() : line);
      const out = dir === "right" || dir === "down" ? res.line.reverse() : res.line;
      out.forEach((v, j) => set(i, j, v));
      gained += res.gained;
      if (res.moved) moved = true;
    }
  };

  if (dir === "left" || dir === "right") {
    process(
      (r, c) => next[r]![c]!,
      (r, c, v) => {
        next[r]![c] = v;
      },
    );
  } else {
    process(
      (c, r) => next[r]![c]!,
      (c, r, v) => {
        next[r]![c] = v;
      },
    );
  }

  return { board: next, scoreGained: gained, moved };
}

export function canMove(board: Board): boolean {
  if (emptyCells(board).length) return true;
  const size = board.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = board[r]![c]!;
      if (c + 1 < size && board[r]![c + 1] === v) return true;
      if (r + 1 < size && board[r + 1]![c] === v) return true;
    }
  }
  return false;
}

export function hasTarget(board: Board, target = 2048): boolean {
  return board.some((row) => row.some((v) => v >= target));
}
