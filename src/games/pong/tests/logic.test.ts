import { describe, expect, it } from "vitest";
import { createPong, serve, stepPong } from "../engine/logic";

describe("pong logic", () => {
  it("serves with velocity", () => {
    const s = serve(createPong(), true, 300);
    expect(s.serving).toBe(false);
    expect(Math.abs(s.ballVX)).toBeGreaterThan(0);
  });

  it("bounces off top wall", () => {
    let s = createPong();
    s = { ...s, serving: false, ballX: 200, ballY: 5, ballVX: 0, ballVY: -100 };
    const { state } = stepPong(s, 0.05, null);
    expect(state.ballVY).toBeGreaterThan(0);
  });

  it("scores when ball exits left", () => {
    let s = createPong();
    s = { ...s, serving: false, ballX: -30, ballY: 100, ballVX: -200, ballVY: 0 };
    const { state, scored } = stepPong(s, 0.016, null);
    expect(scored).toBe("right");
    expect(state.rightScore).toBe(1);
    expect(state.serving).toBe(true);
  });

  it("resets ball after score", () => {
    let s = createPong();
    s = { ...s, serving: false, ballX: 700, ballY: 100, ballVX: 200, ballVY: 0, width: 640 };
    const { state } = stepPong(s, 0.016, null);
    expect(state.ballX).toBe(state.width / 2);
  });
});
