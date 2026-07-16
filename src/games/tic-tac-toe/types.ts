export type Cell = "X" | "O" | null;
export type Board = Cell[];
export type Mark = "X" | "O";

export interface MatchScore {
  x: number;
  o: number;
  draws: number;
}
