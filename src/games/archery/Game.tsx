import { useCallback, useEffect, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { computerShot, projectImpact, type Impact } from "./engine/projectile";

export default function ArcheryGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
  reducedMotion = false,
}: GameShellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wind, setWind] = useState(() => (Math.random() * 2 - 1) * (difficultyId === "hard" ? 1 : 0.55));
  const [score, setScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [arrows, setArrows] = useState(modeId === "practice" ? 99 : 10);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [impact, setImpact] = useState<Impact | null>(null);
  const [flying, setFlying] = useState(false);
  const [flightT, setFlightT] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [timeLeft, setTimeLeft] = useState(modeId === "timed" ? 45 : null);
  const [elapsed, setElapsed] = useState(0);
  const [aim, setAim] = useState({ x: 0, y: 0, power: 0 });
  const [pulling, setPulling] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const started = useRef(Date.now());
  const scale = difficultyId === "hard" ? 0.75 : difficultyId === "easy" ? 1.15 : 1;
  const impactRef = useRef<Impact | null>(null);

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score,
        opponentScore: modeId === "vs-computer" ? oppScore : undefined,
        elapsedSeconds: elapsed,
        stats: {
          Arrows: modeId === "practice" ? "∞" : arrows,
          Wind: wind > 0.15 ? "→ right" : wind < -0.15 ? "← left" : "calm",
          Last: impact ? `${impact.points} pts` : "—",
          ...(timeLeft !== null ? { Time: `${timeLeft}s` } : {}),
        },
        ...partial,
      });
    },
    [arrows, elapsed, impact, modeId, onSessionChange, oppScore, score, status, timeLeft, wind],
  );

  useEffect(() => {
    emit();
  }, [emit]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (status !== "playing") return;
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (modeId !== "timed" || status !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return t;
        if (t <= 1) {
          setStatus(score >= 20 ? "won" : "lost");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [modeId, score, status]);

  // Moving target
  useEffect(() => {
    if (difficultyId === "easy" || status !== "playing") return;
    let raf = 0;
    let t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      setTargetX(Math.sin(t * (difficultyId === "hard" ? 1.4 : 0.9)) * 0.35);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [difficultyId, status]);

  // Flight animation
  useEffect(() => {
    if (!flying) return;
    let raf = 0;
    let start = performance.now();
    const loop = (now: number) => {
      const t = Math.min(1, (now - start) / (reducedMotion ? 200 : 550));
      setFlightT(t);
      if (t < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setFlying(false);
        const imp = impactRef.current;
        if (imp) {
          setScore((s) => s + imp.points);
          if (sound) audioManager.play(imp.points > 0 ? "correct" : "incorrect");
          announce(imp.points > 0 ? `${imp.points} points` : "Miss");
        }
        setWind((Math.random() * 2 - 1) * (difficultyId === "hard" ? 1 : 0.55));
        setArrows((a) => {
          const next = modeId === "practice" ? a : a - 1;
          if (modeId !== "practice" && next <= 0) {
            window.setTimeout(() => {
              if (modeId === "vs-computer") {
                // computer volley
                let cScore = 0;
                for (let i = 0; i < 10; i++) {
                  const shot = computerShot(difficultyId, (Math.random() * 2 - 1) * 0.5);
                  cScore += projectImpact({ ...shot, distance: 1 }).points;
                }
                setOppScore(cScore);
                setStatus(score + (imp?.points ?? 0) >= cScore ? "won" : "lost");
              } else {
                setStatus((score + (imp?.points ?? 0)) >= 30 ? "won" : "lost");
              }
            }, 400);
          }
          return next;
        });
        setAim({ x: 0, y: 0, power: 0 });
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [difficultyId, flying, modeId, reducedMotion, score, sound]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isDark = document.documentElement.classList.contains("dark");
    const skyTop = isDark ? "#1a1c16" : "#e8f0e4";
    const skyBot = isDark ? "#11120f" : "#f3f2ec";
    const ground = isDark ? "#22241e" : "#d8d4c4";
    const accent = "#F59A51";
    const ink = isDark ? "#f5f4ee" : "#171814";

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, skyTop);
    grad.addColorStop(0.65, skyBot);
    grad.addColorStop(0.65, ground);
    grad.addColorStop(1, isDark ? "#1a1c16" : "#cfcab8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Horizon line
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(23,24,20,0.08)";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.lineTo(w, h * 0.65);
    ctx.stroke();

    // Wind lines
    const windY = 28;
    ctx.strokeStyle = isDark ? "rgba(245,244,238,0.25)" : "rgba(23,24,20,0.2)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const y = windY + i * 8;
      const len = 28 + Math.abs(wind) * 20;
      const dir = wind >= 0 ? 1 : -1;
      const x0 = w * 0.5 - dir * len * 0.5;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x0 + dir * len, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x0 + dir * len, y);
      ctx.lineTo(x0 + dir * len - dir * 6, y - 4);
      ctx.moveTo(x0 + dir * len, y);
      ctx.lineTo(x0 + dir * len - dir * 6, y + 4);
      ctx.stroke();
    }

    // Target
    const tx = w * 0.5 + targetX * w * 0.28;
    const ty = h * 0.38;
    const baseR = Math.min(w, h) * 0.16 * scale;
    const rings = [
      { r: 1, c: isDark ? "#f5f4ee" : "#f8f7f2" },
      { r: 0.8, c: accent },
      { r: 0.6, c: isDark ? "#f5f4ee" : "#f8f7f2" },
      { r: 0.4, c: accent },
      { r: 0.22, c: "#D8B54A" },
      { r: 0.1, c: "#c8f04d" },
    ];
    // stand
    ctx.fillStyle = isDark ? "#3a3c34" : "#8a7a5a";
    ctx.fillRect(tx - 3, ty + baseR * 0.9, 6, h * 0.65 - ty - baseR * 0.5);
    ctx.beginPath();
    ctx.ellipse(tx, h * 0.65, 18, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();

    for (const ring of rings) {
      ctx.beginPath();
      ctx.arc(tx, ty, baseR * ring.r, 0, Math.PI * 2);
      ctx.fillStyle = ring.c;
      ctx.fill();
      ctx.strokeStyle = isDark ? "rgba(0,0,0,0.15)" : "rgba(23,24,20,0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Impact mark
    if (impact && !flying) {
      const ix = tx + impact.x * baseR * 1.6;
      const iy = ty + impact.y * baseR * 1.6;
      ctx.beginPath();
      ctx.arc(ix, iy, 4, 0, Math.PI * 2);
      ctx.fillStyle = ink;
      ctx.fill();
    }

    // Arrow in flight
    if (flying && impact) {
      const fromX = w * 0.5;
      const fromY = h * 0.82;
      const toX = tx + impact.x * baseR * 1.6;
      const toY = ty + impact.y * baseR * 1.6;
      const ease = 1 - Math.pow(1 - flightT, 2);
      const ax = fromX + (toX - fromX) * ease;
      const ay = fromY + (toY - fromY) * ease - Math.sin(Math.PI * ease) * 40;
      ctx.save();
      ctx.translate(ax, ay);
      const angle = Math.atan2(toY - fromY, toX - fromX) - Math.sin(Math.PI * ease) * 0.3;
      ctx.rotate(angle);
      ctx.fillStyle = ink;
      ctx.fillRect(-14, -1.5, 28, 3);
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(8, -4);
      ctx.lineTo(8, 4);
      ctx.fill();
      ctx.restore();
    }

    // Bow at bottom
    const bowX = w * 0.5;
    const bowY = h * 0.86;
    const pull = pulling ? aim.power : 0;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bowX, bowY, 28, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    // string
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bowX - 24, bowY - 8);
    ctx.lineTo(bowX - aim.x * 20, bowY + 10 + pull * 24);
    ctx.lineTo(bowX + 24, bowY - 8);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Power bar
    if (pulling || aim.power > 0) {
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
      ctx.fillRect(w * 0.25, h - 18, w * 0.5, 6);
      ctx.fillStyle = accent;
      ctx.fillRect(w * 0.25, h - 18, w * 0.5 * aim.power, 6);
    }

    if (!pulling && !flying && status === "playing") {
      ctx.fillStyle = isDark ? "rgba(245,244,238,0.4)" : "rgba(23,24,20,0.35)";
      ctx.font = "500 12px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Drag down to draw · release to shoot", w / 2, h - 28);
    }
  }, [aim, flying, flightT, impact, pulling, scale, status, targetX, wind]);

  const pointerPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const canShoot = status === "playing" && !flying && arrows > 0;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!canShoot) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = pointerPos(e);
    setPulling(true);
    setImpact(null);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !pulling) return;
    const p = pointerPos(e);
    const dx = (p.x - drag.current.x) / 80;
    const dy = (p.y - drag.current.y) / 100;
    const power = Math.min(1, Math.max(0, dy));
    setAim({
      x: Math.max(-1, Math.min(1, dx)),
      y: Math.max(-1, Math.min(1, -dy * 0.5)),
      power,
    });
  };

  const onPointerUp = () => {
    if (!pulling) return;
    setPulling(false);
    drag.current = null;
    if (aim.power < 0.12) {
      setAim({ x: 0, y: 0, power: 0 });
      return;
    }
    const imp = projectImpact({
      aimX: aim.x + targetX * 0.3,
      aimY: aim.y,
      power: aim.power,
      wind,
      distance: 1,
    });
    impactRef.current = imp;
    setImpact(imp);
    setFlying(true);
    setFlightT(0);
    if (sound) audioManager.play("whoosh");
  };

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-2">
      <div className="flex w-full items-center justify-between text-xs font-medium text-[var(--fg-muted)] px-1">
        <span>
          Wind{" "}
          <strong className="text-[var(--fg)]">
            {wind > 0.15 ? "→" : wind < -0.15 ? "←" : "·"}
          </strong>
        </span>
        <span style={{ color: "#F59A51" }}>
          {modeId === "practice" ? "Practice" : `${arrows} arrows`}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="game-gesture w-full touch-none rounded-[var(--radius-xl)] border border-[var(--border)]"
        style={{ height: "min(58vh, 420px)", maxHeight: 420 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="Archery range. Drag to draw the bow and release to shoot."
      />
    </div>
  );
}
