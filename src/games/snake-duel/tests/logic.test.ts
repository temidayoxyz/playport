import { describe, expect, it } from "vitest";
import { createSnake, pathfindDir, spawnFood, stepSnake } from "../engine/logic";

describe("snake duel", () => {
  it("detects self collision", () => {
    let s = createSnake(10, 10);
    s = {
      ...s,
      snake: [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
      ],
      dir: "up",
      pendingDir: "right",
    };
    // head 5,5 going right would be ok; force into body
    s = { ...s, pendingDir: "down" };
    // head at 5,5 down -> 5,4 which is in body
    const next = stepSnake(s);
    expect(next.alive).toBe(false);
  });

  it("spawns food off the snake", () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
    const food = spawnFood(3, 1, snake, []);
    expect(snake.some((c) => c.x === food.x && c.y === food.y)).toBe(false);
  });

  it("pathfinding returns a valid direction", () => {
    const s = createSnake(10, 10);
    const dir = pathfindDir(s);
    expect(dir === null || ["up", "down", "left", "right"].includes(dir)).toBe(true);
  });

  it("grows and scores on food", () => {
    let s = createSnake(10, 10);
    const head = s.snake[0]!;
    s = { ...s, food: { x: head.x + 1, y: head.y }, dir: "right", pendingDir: "right" };
    const next = stepSnake(s);
    expect(next.score).toBe(10);
    expect(next.snake.length).toBe(s.snake.length + 1);
  });
});
