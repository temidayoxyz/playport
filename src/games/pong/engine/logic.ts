export interface PongState {
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  leftY: number;
  rightY: number;
  leftScore: number;
  rightScore: number;
  width: number;
  height: number;
  paddleH: number;
  paddleW: number;
  ballR: number;
  serving: boolean;
}

export function createPong(width = 640, height = 360): PongState {
  return {
    ballX: width / 2,
    ballY: height / 2,
    ballVX: 0,
    ballVY: 0,
    leftY: height / 2,
    rightY: height / 2,
    leftScore: 0,
    rightScore: 0,
    width,
    height,
    paddleH: 70,
    paddleW: 12,
    ballR: 8,
    serving: true,
  };
}

export function serve(state: PongState, toRight: boolean, speed = 280): PongState {
  const angle = (Math.random() * 0.6 - 0.3) * Math.PI;
  const dir = toRight ? 1 : -1;
  return {
    ...state,
    ballX: state.width / 2,
    ballY: state.height / 2,
    ballVX: Math.cos(angle) * speed * dir,
    ballVY: Math.sin(angle) * speed,
    serving: false,
  };
}

export function stepPong(
  state: PongState,
  dt: number,
  aiY: number | null,
  speedScale = 1,
): { state: PongState; scored: "left" | "right" | null } {
  let s = { ...state };
  if (s.serving) return { state: s, scored: null };

  if (aiY !== null) {
    const target = aiY;
    s.rightY += (target - s.rightY) * Math.min(1, dt * 8);
  }

  s.ballX += s.ballVX * dt * speedScale;
  s.ballY += s.ballVY * dt * speedScale;

  // walls
  if (s.ballY < s.ballR) {
    s.ballY = s.ballR;
    s.ballVY = Math.abs(s.ballVY);
  } else if (s.ballY > s.height - s.ballR) {
    s.ballY = s.height - s.ballR;
    s.ballVY = -Math.abs(s.ballVY);
  }

  // left paddle
  if (
    s.ballX - s.ballR < 24 + s.paddleW &&
    s.ballX > 24 &&
    s.ballY > s.leftY - s.paddleH / 2 &&
    s.ballY < s.leftY + s.paddleH / 2 &&
    s.ballVX < 0
  ) {
    s.ballX = 24 + s.paddleW + s.ballR;
    s.ballVX = Math.abs(s.ballVX) * 1.05;
    s.ballVY += (s.ballY - s.leftY) * 4;
  }

  // right paddle
  if (
    s.ballX + s.ballR > s.width - 24 - s.paddleW &&
    s.ballX < s.width - 24 &&
    s.ballY > s.rightY - s.paddleH / 2 &&
    s.ballY < s.rightY + s.paddleH / 2 &&
    s.ballVX > 0
  ) {
    s.ballX = s.width - 24 - s.paddleW - s.ballR;
    s.ballVX = -Math.abs(s.ballVX) * 1.05;
    s.ballVY += (s.ballY - s.rightY) * 4;
  }

  if (s.ballX < -20) {
    s.rightScore += 1;
    s.serving = true;
    s.ballX = s.width / 2;
    s.ballY = s.height / 2;
    s.ballVX = 0;
    s.ballVY = 0;
    return { state: s, scored: "right" };
  }
  if (s.ballX > s.width + 20) {
    s.leftScore += 1;
    s.serving = true;
    s.ballX = s.width / 2;
    s.ballY = s.height / 2;
    s.ballVX = 0;
    s.ballVY = 0;
    return { state: s, scored: "left" };
  }

  return { state: s, scored: null };
}

export function aiTrackY(state: PongState, difficulty: string): number {
  const error = difficulty === "easy" ? 40 : difficulty === "hard" ? 4 : 18;
  const lag = difficulty === "easy" ? 0.35 : difficulty === "hard" ? 0.92 : 0.65;
  const predicted = state.ballY + state.ballVY * (0.1 + Math.random() * 0.1);
  const target = predicted + (Math.random() - 0.5) * error;
  return state.rightY + (target - state.rightY) * lag;
}
