import type { PerformanceQuality } from "@/types/settings";

export interface ResolvedQuality {
  dpr: number;
  shadows: boolean;
  particles: boolean;
  physicsHz: number;
  antialias: boolean;
  label: PerformanceQuality;
}

export function resolveQuality(
  preference: PerformanceQuality,
  reducedMotion = false,
): ResolvedQuality {
  if (preference === "low" || reducedMotion) {
    return {
      dpr: 1,
      shadows: false,
      particles: false,
      physicsHz: 30,
      antialias: false,
      label: "low",
    };
  }

  if (preference === "high") {
    return {
      dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
      shadows: true,
      particles: true,
      physicsHz: 60,
      antialias: true,
      label: "high",
    };
  }

  if (preference === "balanced") {
    return {
      dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5),
      shadows: false,
      particles: true,
      physicsHz: 45,
      antialias: true,
      label: "balanced",
    };
  }

  // auto
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const mobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  if (mobile || cores <= 4 || dpr >= 2.5) {
    return {
      dpr: Math.min(dpr, 1.25),
      shadows: false,
      particles: false,
      physicsHz: 40,
      antialias: false,
      label: "auto",
    };
  }

  return {
    dpr: Math.min(dpr, 1.75),
    shadows: cores >= 8,
    particles: true,
    physicsHz: 60,
    antialias: true,
    label: "auto",
  };
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function supportsWasm(): boolean {
  try {
    if (typeof WebAssembly !== "object") return false;
    const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    return module instanceof WebAssembly.Module;
  } catch {
    return false;
  }
}
