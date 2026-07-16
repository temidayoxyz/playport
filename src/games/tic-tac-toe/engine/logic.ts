import type { Board, Cell, Mark } from "../types";

export const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => null);
}

export function getWinner(board: Board): { winner: Mark; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Mark, line };
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every((c) => c !== null) && !getWinner(board);
}

export function validMoves(board: Board): number[] {
  const moves: number[] = [];
  board.forEach((cell, i) => {
    if (cell === null) moves.push(i);
  });
  return moves;
}

export function applyMove(board: Board, index: number, mark: Mark): Board {
  if (board[index] !== null) return board;
  const next = board.slice();
  next[index] = mark;
  return next;
}

function minimax(
  board: Board,
  maximizing: boolean,
  ai: Mark,
  human: Mark,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const win = getWinner(board);
  if (win?.winner === ai) return 10 - depth;
  if (win?.winner === human) return depth - 10;
  if (isDraw(board)) return 0;

  const moves = validMoves(board);
  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      const score = minimax(applyMove(board, m, ai), false, ai, human, depth + 1, alpha, beta);
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const m of moves) {
    const score = minimax(applyMove(board, m, human), true, ai, human, depth + 1, alpha, beta);
    best = Math.min(best, score);
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

export function bestMove(board: Board, ai: Mark): number {
  const human: Mark = ai === "X" ? "O" : "X";
  const moves = validMoves(board);
  let bestScore = -Infinity;
  let choice = moves[0] ?? 0;
  for (const m of moves) {
    const score = minimax(applyMove(board, m, ai), false, ai, human, 0, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      choice = m;
    }
  }
  return choice;
}

function findWinningMove(board: Board, mark: Mark): number | null {
  for (const m of validMoves(board)) {
    if (getWinner(applyMove(board, m, mark))?.winner === mark) return m;
  }
  return null;
}

export function aiMove(
  board: Board,
  ai: Mark,
  difficulty: string,
): number {
  const moves = validMoves(board);
  if (moves.length === 0) return -1;
  const human: Mark = ai === "X" ? "O" : "X";
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;

  if (difficulty === "easy") {
    return pick(moves);
  }

  if (difficulty === "medium") {
    const win = findWinningMove(board, ai);
    if (win !== null) return win;
    const block = findWinningMove(board, human);
    if (block !== null && Math.random() < 0.75) return block;
    return pick(moves);
  }

  if (difficulty === "hard") {
    if (Math.random() < 0.15) return pick(moves);
    return bestMove(board, ai);
  }

  // impossible
  return bestMove(board, ai);
}

export function cellLabel(cell: Cell, index: number): string {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  if (!cell) return `Empty cell row ${row} column ${col}`;
  return `${cell} at row ${row} column ${col}`;
}
