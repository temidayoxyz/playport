import { describe, expect, it } from "vitest";
import {
  createCups,
  detectCupScore,
  nextShotState,
  stepBall,
  type BallState,
} from "../engine/physics";

describe("cup pong physics", () => {
  it("transitions shot states", () => {
    expect(nextShotState("idle", "start-aim")).toBe("aiming");
    expect(nextShotState("aiming", "release")).toBe("flying");
    expect(nextShotState("flying", "score")).toBe("scored");
    expect(nextShotState("flying", "miss")).toBe("missed");
  });

  it("detects cup scores", () => {
    const cups = createCups("line");
    const cup = cups[0]!;
    const ball: BallState = {
      pos: { x: cup.x, y: 0.25, z: cup.z },
      vel: { x: 0, y: -0.2, z: 0 },
      radius: 0.12,
      active: true,
    };
    expect(detectCupScore(ball, cups)).toBe(cup.id);
  });

  it("steps gravity", () => {
    const ball: BallState = {
      pos: { x: 0, y: 2, z: 0 },
      vel: { x: 0, y: 0, z: 0 },
      radius: 0.12,
      active: true,
    };
    const next = stepBall(ball, 0.1);
    expect(next.pos.y).toBeLessThan(2);
  });

  it("progresses rounds when cups hit", () => {
    const cups = createCups("triangle");
    expect(cups.length).toBe(6);
    const remaining = cups.filter((c) => !c.hit);
    expect(remaining.length).toBe(6);
  });
});
