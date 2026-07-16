export type ShotState = "idle" | "aiming" | "flying" | "scored" | "missed" | "resetting";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Cup {
  id: number;
  x: number;
  z: number;
  radius: number;
  hit: boolean;
}

export interface BallState {
  pos: Vec3;
  vel: Vec3;
  radius: number;
  active: boolean;
}

export function createCups(layout: "triangle" | "line" | "diamond" = "triangle"): Cup[] {
  if (layout === "line") {
    return [-1.2, -0.4, 0.4, 1.2].map((x, i) => ({
      id: i,
      x,
      z: -2.2,
      radius: 0.22,
      hit: false,
    }));
  }
  if (layout === "diamond") {
    return [
      { id: 0, x: 0, z: -2.6, radius: 0.22, hit: false },
      { id: 1, x: -0.45, z: -2.1, radius: 0.22, hit: false },
      { id: 2, x: 0.45, z: -2.1, radius: 0.22, hit: false },
      { id: 3, x: 0, z: -1.6, radius: 0.22, hit: false },
    ];
  }
  // triangle
  const cups: Cup[] = [];
  let id = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col <= row; col++) {
      cups.push({
        id: id++,
        x: (col - row / 2) * 0.5,
        z: -1.6 - row * 0.45,
        radius: 0.22,
        hit: false,
      });
    }
  }
  return cups;
}

export function aimToVelocity(dx: number, dy: number, power: number, difficulty: string): Vec3 {
  const mult = difficulty === "easy" ? 1.05 : difficulty === "hard" ? 0.95 : 1;
  return {
    x: dx * 4.5 * mult,
    y: Math.max(2.2, power * 6.5 * mult),
    z: -Math.max(3, power * 8 * mult) + dy * 2,
  };
}

export function stepBall(ball: BallState, dt: number, gravity = -9.8): BallState {
  if (!ball.active) return ball;
  const vel = {
    x: ball.vel.x * 0.995,
    y: ball.vel.y + gravity * dt,
    z: ball.vel.z * 0.995,
  };
  const pos = {
    x: ball.pos.x + vel.x * dt,
    y: ball.pos.y + vel.y * dt,
    z: ball.pos.z + vel.z * dt,
  };

  // table bounce
  if (pos.y < ball.radius && vel.y < 0) {
    pos.y = ball.radius;
    vel.y = -vel.y * 0.55;
    vel.x *= 0.85;
    vel.z *= 0.85;
    if (Math.abs(vel.y) < 0.8) vel.y = 0;
  }

  return { ...ball, pos, vel };
}

export function detectCupScore(ball: BallState, cups: Cup[]): number | null {
  if (ball.pos.y > 0.55 || ball.pos.y < 0.05) return null;
  for (const cup of cups) {
    if (cup.hit) continue;
    const dx = ball.pos.x - cup.x;
    const dz = ball.pos.z - cup.z;
    const dist = Math.hypot(dx, dz);
    if (dist < cup.radius * 0.72 && ball.vel.y <= 0.5) {
      return cup.id;
    }
  }
  return null;
}

export function isMissed(ball: BallState): boolean {
  return ball.pos.y < -0.5 || ball.pos.z < -4.5 || Math.hypot(ball.pos.x, ball.pos.z) > 6;
}

export function computerAim(difficulty: string): { dx: number; dy: number; power: number } {
  const error = difficulty === "easy" ? 0.35 : difficulty === "hard" ? 0.08 : 0.18;
  return {
    dx: (Math.random() - 0.5) * error,
    dy: (Math.random() - 0.5) * error * 0.5,
    power: 0.72 + (Math.random() - 0.5) * error,
  };
}

export function nextShotState(
  state: ShotState,
  event: "start-aim" | "release" | "score" | "miss" | "reset",
): ShotState {
  const table: Record<ShotState, Partial<Record<typeof event, ShotState>>> = {
    idle: { "start-aim": "aiming" },
    aiming: { release: "flying" },
    flying: { score: "scored", miss: "missed" },
    scored: { reset: "idle" },
    missed: { reset: "idle" },
    resetting: { reset: "idle" },
  };
  return table[state][event] ?? state;
}
