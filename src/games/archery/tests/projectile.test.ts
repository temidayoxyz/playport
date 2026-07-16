import { describe, expect, it } from "vitest";
import { applyWind, projectImpact } from "../engine/projectile";

describe("archery projectile", () => {
  it("awards bullseye for center hits", () => {
    const hit = projectImpact({ aimX: 0, aimY: 0.05, power: 0.95, wind: 0, distance: 1 });
    expect(hit.ring).toBeGreaterThanOrEqual(4);
    expect(hit.points).toBeGreaterThanOrEqual(8);
  });

  it("misses far shots", () => {
    const hit = projectImpact({ aimX: 1, aimY: 1, power: 0.2, wind: 0, distance: 1.5 });
    expect(hit.ring).toBe(0);
    expect(hit.points).toBe(0);
  });

  it("adjusts aim with wind", () => {
    expect(applyWind(0, 1, 0.5)).toBeGreaterThan(0);
    expect(applyWind(0, -1, 0.5)).toBeLessThan(0);
  });
});
