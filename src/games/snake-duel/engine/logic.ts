export type Dir = "up" | "down" | "left" | "right";
export type Cell = { x: number; y: number };

export interface SnakeState {
  width: number;
  height: number;
  snake: Cell[];
  dir: Dir;
  pendingDir: Dir;
  food: Cell;
  score: number;
  alive: boolean;
  obstacles: Cell[];
  wrap: boolean;
}

export const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createSnake(
  width = 20,
  height = 20,
  wrap = false,
  obstacles: Cell[] = [],
): SnakeState {
  const snake = [
    { x: 4, y: Math.floor(height / 2) },
    { x: 3, y: Math.floor(height / 2) },
    { x: 2, y: Math.floor(height / 2) },
  ];
  return {
    width,
    height,
    snake,
    dir: "right",
    pendingDir: "right",
    food: spawnFood(width, height, snake, obstacles),
    score: 0,
    alive: true,
    obstacles,
    wrap,
  };
}

export function spawnFood(width: number, height: number, snake: Cell[], obstacles: Cell[]): Cell {
  const blocked = new Set([...snake, ...obstacles].map((c) => `${c.x},${c.y}`));
  for (let i = 0; i < 200; i++) {
    const cell = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    if (!blocked.has(`${cell.x},${cell.y}`)) return cell;
  }
  return { x: 0, y: 0 };
}

export function stepSnake(state: SnakeState): SnakeState {
  if (!state.alive) return state;
  const dir =
    OPPOSITE[state.pendingDir] === state.dir ? state.dir : state.pendingDir;
  const head = state.snake[0]!;
  let nx = head.x + (dir === "left" ? -1 : dir === "right" ? 1 : 0);
  let ny = head.y + (dir === "up" ? -1 : dir === "down" ? 1 : 0);

  if (state.wrap) {
    nx = (nx + state.width) % state.width;
    ny = (ny + state.height) % state.height;
  } else if (nx < 0 || ny < 0 || nx >= state.width || ny >= state.height) {
    return { ...state, alive: false, dir };
  }

  const nextHead = { x: nx, y: ny };
  if (state.snake.some((c) => c.x === nx && c.y === ny)) {
    return { ...state, alive: false, dir };
  }
  if (state.obstacles.some((c) => c.x === nx && c.y === ny)) {
    return { ...state, alive: false, dir };
  }

  const ate = nx === state.food.x && ny === state.food.y;
  const body = [nextHead, ...state.snake];
  if (!ate) body.pop();
  const food = ate
    ? spawnFood(state.width, state.height, body, state.obstacles)
    : state.food;

  return {
    ...state,
    snake: body,
    dir,
    pendingDir: dir,
    food,
    score: state.score + (ate ? 10 : 0),
  };
}

export function setDirection(state: SnakeState, dir: Dir): SnakeState {
  if (OPPOSITE[dir] === state.dir) return state;
  return { ...state, pendingDir: dir };
}

/** BFS pathfinding toward food — returns next direction or null */
export function pathfindDir(state: SnakeState): Dir | null {
  const start = state.snake[0]!;
  const goal = state.food;
  const blocked = new Set(
    [...state.snake.slice(0, -1), ...state.obstacles].map((c) => `${c.x},${c.y}`),
  );
  const q: Array<{ x: number; y: number; path: Dir[] }> = [
    { x: start.x, y: start.y, path: [] },
  ];
  const seen = new Set([`${start.x},${start.y}`]);
  const deltas: Array<[Dir, number, number]> = [
    ["up", 0, -1],
    ["down", 0, 1],
    ["left", -1, 0],
    ["right", 1, 0],
  ];

  while (q.length) {
    const cur = q.shift()!;
    if (cur.x === goal.x && cur.y === goal.y && cur.path.length) {
      return cur.path[0]!;
    }
    for (const [d, dx, dy] of deltas) {
      let nx = cur.x + dx;
      let ny = cur.y + dy;
      if (state.wrap) {
        nx = (nx + state.width) % state.width;
        ny = (ny + state.height) % state.height;
      } else if (nx < 0 || ny < 0 || nx >= state.width || ny >= state.height) {
        continue;
      }
      const key = `${nx},${ny}`;
      if (seen.has(key) || blocked.has(key)) continue;
      seen.add(key);
      q.push({ x: nx, y: ny, path: [...cur.path, d] });
    }
  }
  // fallback: any safe move
  for (const [d, dx, dy] of deltas) {
    const nx = start.x + dx;
    const ny = start.y + dy;
    if (nx < 0 || ny < 0 || nx >= state.width || ny >= state.height) continue;
    if (blocked.has(`${nx},${ny}`)) continue;
    return d;
  }
  return null;
}

export function mazeObstacles(width: number, height: number): Cell[] {
  const cells: Cell[] = [];
  for (let x = 4; x < width - 4; x += 4) {
    for (let y = 2; y < height - 2; y++) {
      if (y === Math.floor(height / 2)) continue;
      cells.push({ x, y });
    }
  }
  return cells;
}
