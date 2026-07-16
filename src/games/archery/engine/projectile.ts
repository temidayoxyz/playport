export interface ShotInput {
  aimX: number; // -1..1 horizontal
  aimY: number; // -1..1 vertical
  power: number; // 0..1
  wind: number; // -1..1
  distance: number;
}

export interface Impact {
  x: number;
  y: number;
  ring: number; // 0 miss, 1 outer ... 5 bullseye
  points: number;
}

export function applyWind(aimX: number, wind: number, power: number): number {
  return aimX + wind * 0.22 * (1.15 - power * 0.4);
}

export function projectImpact(input: ShotInput): Impact {
  const { aimY, power, wind, distance } = input;
  const drop = (1 - power) * 0.35 + distance * 0.02;
  const x = applyWind(input.aimX, wind, power);
  const y = aimY - drop;
  const dist = Math.hypot(x, y);
  // rings by radial distance on target plane
  if (dist < 0.08) return { x, y, ring: 5, points: 10 };
  if (dist < 0.16) return { x, y, ring: 4, points: 8 };
  if (dist < 0.28) return { x, y, ring: 3, points: 6 };
  if (dist < 0.42) return { x, y, ring: 2, points: 4 };
  if (dist < 0.58) return { x, y, ring: 1, points: 2 };
  return { x, y, ring: 0, points: 0 };
}

export function computerShot(difficulty: string, wind: number): ShotInput {
  const error = difficulty === "easy" ? 0.28 : difficulty === "hard" ? 0.06 : 0.14;
  return {
    aimX: (Math.random() - 0.5) * error - wind * 0.15,
    aimY: (Math.random() - 0.5) * error * 0.8 + 0.05,
    power: 0.78 + (Math.random() - 0.5) * error,
    wind,
    distance: 1,
  };
}

export function flightPoints(
  from: [number, number, number],
  to: [number, number, number],
  steps = 16,
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const yArc = Math.sin(Math.PI * t) * 0.35;
    pts.push([
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t + yArc,
      from[2] + (to[2] - from[2]) * t,
    ]);
  }
  return pts;
}
