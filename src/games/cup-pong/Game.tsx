import { useCallback, useEffect, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import {
  aimToVelocity,
  computerAim,
  createCups,
  detectCupScore,
  isMissed,
  nextShotState,
  stepBall,
  type BallState,
  type ShotState,
} from "./engine/physics";

/** Project 3D table space (x,z,y) into 2.5D canvas coordinates. */
function project(x: number, y: number, z: number, w: number, h: number) {
  const scale = 48;
  const cx = w * 0.5;
  const cy = h * 0.72;
  const depth = 1 + (z + 2.2) * 0.08;
  return {
    sx: cx + x * scale * depth,
    sy: cy + z * scale * 0.72 - y * scale * 0.9,
    s: Math.max(0.55, depth),
  };
}

export default function CupPongGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
  reducedMotion = false,
}: GameShellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cups, setCups] = useState(() => createCups(modeId === "trick" ? "diamond" : "triangle"));
  const [ball, setBall] = useState<BallState>({
    pos: { x: 0, y: 0.35, z: 1.8 },
    vel: { x: 0, y: 0, z: 0 },
    radius: 0.12,
    active: false,
  });
  const [shot, setShot] = useState<ShotState>("idle");
  const [ballsLeft, setBallsLeft] = useState(modeId === "limited" ? 8 : 99);
  const [score, setScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [turn, setTurn] = useState<"you" | "computer">("you");
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [elapsed, setElapsed] = useState(0);
  const [aimLine, setAimLine] = useState<{ dx: number; dy: number; power: number } | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const started = useRef(Date.now());
  const raf = useRef(0);
  const ballRef = useRef(ball);
  const cupsRef = useRef(cups);
  const shotRef = useRef(shot);

  ballRef.current = ball;
  cupsRef.current = cups;
  shotRef.current = shot;

  const remaining = cups.filter((c) => !c.hit).length;

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score,
        opponentScore: modeId === "vs-computer" ? oppScore : undefined,
        elapsedSeconds: elapsed,
        message: turn === "computer" ? "Computer is aiming" : remaining === 0 ? "Clear!" : undefined,
        stats: {
          Cups: remaining,
          Balls: modeId === "limited" ? ballsLeft : "∞",
        },
        ...partial,
      });
    },
    [ballsLeft, elapsed, modeId, onSessionChange, oppScore, remaining, score, status, turn],
  );

  useEffect(() => {
    emit();
  }, [emit]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (status !== "playing" || reducedMotion) return;
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [reducedMotion, status]);

  // Flight simulation
  useEffect(() => {
    if (shot !== "flying") return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      setBall((b) => {
        if (!b.active) return b;
        const next = stepBall(b, dt);
        const hitId = detectCupScore(next, cupsRef.current);
        if (hitId !== null) {
          setCups((cs) => cs.map((c) => (c.id === hitId ? { ...c, hit: true } : c)));
          setShot("scored");
          shotRef.current = "scored";
          if (sound) audioManager.play("correct");
          announce("Cup scored");
          const isYou = turn === "you";
          if (isYou) setScore((s) => s + 1);
          else setOppScore((s) => s + 1);
          return { ...next, active: false, vel: { x: 0, y: 0, z: 0 } };
        }
        if (isMissed(next)) {
          setShot("missed");
          shotRef.current = "missed";
          if (sound) audioManager.play("incorrect");
          announce("Miss");
          return { ...next, active: false };
        }
        return next;
      });
      if (shotRef.current === "flying") {
        raf.current = requestAnimationFrame(loop);
      }
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [shot, sound, turn]);

  // After score/miss — reset ball and check win
  useEffect(() => {
    if (shot !== "scored" && shot !== "missed") return;
    const t = window.setTimeout(() => {
      const left = cupsRef.current.filter((c) => !c.hit).length;
      if (left === 0) {
        setStatus("won");
        emit({ status: "won" });
        return;
      }
      if (modeId === "limited") {
        setBallsLeft((n) => {
          const next = n - 1;
          if (next <= 0 && left > 0) {
            setStatus("lost");
            emit({ status: "lost" });
          }
          return next;
        });
      }
      setBall({
        pos: { x: 0, y: 0.35, z: 1.8 },
        vel: { x: 0, y: 0, z: 0 },
        radius: 0.12,
        active: false,
      });
      setShot(nextShotState(shot, "reset"));
      setAimLine(null);
      if (modeId === "vs-computer" || modeId === "local") {
        setTurn((t) => (t === "you" ? "computer" : "you"));
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [emit, modeId, shot]);

  // Computer turn
  useEffect(() => {
    if (turn !== "computer" || shot !== "idle" || status !== "playing") return;
    if (modeId !== "vs-computer") return;
    const t = window.setTimeout(() => {
      const aim = computerAim(difficultyId);
      const vel = aimToVelocity(aim.dx, aim.dy, aim.power, difficultyId);
      setShot("flying");
      setBall({
        pos: { x: 0, y: 0.35, z: 1.8 },
        vel,
        radius: 0.12,
        active: true,
      });
      if (sound) audioManager.play("whoosh");
    }, 700);
    return () => window.clearTimeout(t);
  }, [difficultyId, modeId, shot, sound, status, turn]);

  // Local multiplayer: "computer" slot is player 2
  useEffect(() => {
    if (modeId === "local" && turn === "computer" && shot === "idle") {
      announce("Player 2 turn");
    }
  }, [modeId, shot, turn]);

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
    const bg = isDark ? "#171814" : "#faf9f5";
    const table = isDark ? "#2a3228" : "#d4cfc0";
    const tableEdge = isDark ? "#3a4236" : "#c4bfb0";
    const ink = isDark ? "#f5f4ee" : "#171814";
    const accent = "#F59A51";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Table surface (trapezoid)
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.88);
    ctx.lineTo(w * 0.88, h * 0.88);
    ctx.lineTo(w * 0.72, h * 0.28);
    ctx.lineTo(w * 0.28, h * 0.28);
    ctx.closePath();
    ctx.fillStyle = table;
    ctx.fill();
    ctx.strokeStyle = tableEdge;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Soft far shadow
    ctx.fillStyle = isDark ? "rgba(0,0,0,0.2)" : "rgba(23,24,20,0.06)";
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.36, w * 0.18, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cups back-to-front by z
    const sorted = [...cups].filter((c) => !c.hit).sort((a, b) => a.z - b.z);
    for (const cup of sorted) {
      const p = project(cup.x, 0.2, cup.z, w, h);
      const r = 16 * p.s;
      // cup body
      const grad = ctx.createLinearGradient(p.sx - r, p.sy - r * 1.6, p.sx + r, p.sy + r * 0.4);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, "#d4783a");
      ctx.beginPath();
      ctx.moveTo(p.sx - r * 0.85, p.sy + r * 0.35);
      ctx.lineTo(p.sx - r * 1.05, p.sy - r * 1.5);
      ctx.quadraticCurveTo(p.sx, p.sy - r * 1.75, p.sx + r * 1.05, p.sy - r * 1.5);
      ctx.lineTo(p.sx + r * 0.85, p.sy + r * 0.35);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      // rim
      ctx.beginPath();
      ctx.ellipse(p.sx, p.sy - r * 1.5, r * 1.05, r * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#1a120c" : "#3a2418";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.sx, p.sy - r * 1.5, r * 0.7, r * 0.18, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#0e0c0a" : "#2a1a12";
      ctx.fill();
      // contact shadow
      ctx.beginPath();
      ctx.ellipse(p.sx, p.sy + r * 0.45, r * 0.9, r * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fill();
    }

    // Aim guide
    if (aimLine && shot === "aiming" && !reducedMotion) {
      const start = project(0, 0.35, 1.8, w, h);
      const power = aimLine.power;
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(start.sx, start.sy);
      ctx.lineTo(
        start.sx + aimLine.dx * 80 * power,
        start.sy - 40 * power - aimLine.dy * 40,
      );
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      // power bar
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
      ctx.fillRect(w * 0.25, h - 28, w * 0.5, 6);
      ctx.fillStyle = accent;
      ctx.fillRect(w * 0.25, h - 28, w * 0.5 * power, 6);
    }

    // Ball
    const bp = project(ball.pos.x, ball.pos.y, ball.pos.z, w, h);
    const br = 10 * bp.s;
    ctx.beginPath();
    ctx.ellipse(bp.sx, bp.sy + br * 0.9, br * 0.85, br * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fill();
    const ballGrad = ctx.createRadialGradient(bp.sx - br * 0.3, bp.sy - br * 0.3, 1, bp.sx, bp.sy, br);
    ballGrad.addColorStop(0, "#ffffff");
    ballGrad.addColorStop(1, "#d8d6ce");
    ctx.beginPath();
    ctx.arc(bp.sx, bp.sy, br, 0, Math.PI * 2);
    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Hint
    if (shot === "idle" && turn === "you") {
      ctx.fillStyle = isDark ? "rgba(245,244,238,0.45)" : "rgba(23,24,20,0.4)";
      ctx.font = "500 12px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Drag back to aim · release to shoot", w / 2, h - 10);
    }
  }, [aimLine, ball, cups, reducedMotion, shot, turn]);

  const pointerPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const canAim =
    shot === "idle" &&
    status === "playing" &&
    (turn === "you" || modeId === "local") &&
    (modeId !== "limited" || ballsLeft > 0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!canAim) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = pointerPos(e);
    setShot("aiming");
    setAimLine({ dx: 0, dy: 0, power: 0 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || shot !== "aiming") return;
    const p = pointerPos(e);
    const dx = (drag.current.x - p.x) / 80;
    const dy = (p.y - drag.current.y) / 100;
    const power = Math.min(1, Math.hypot(dx, dy) / 1.2);
    setAimLine({ dx: Math.max(-1, Math.min(1, dx)), dy: Math.max(-0.5, Math.min(0.5, dy)), power });
  };

  const onPointerUp = () => {
    if (shot !== "aiming" || !aimLine) {
      setShot("idle");
      drag.current = null;
      return;
    }
    const vel = aimToVelocity(aimLine.dx, -aimLine.dy, Math.max(0.25, aimLine.power), difficultyId);
    setBall({
      pos: { x: 0, y: 0.35, z: 1.8 },
      vel,
      radius: 0.12,
      active: true,
    });
    setShot("flying");
    drag.current = null;
    if (sound) audioManager.play("whoosh");
    announce("Ball released");
  };

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-2">
      <div className="flex w-full items-center justify-between text-xs font-medium text-[var(--fg-muted)] px-1">
        <span>
          {modeId === "local"
            ? turn === "you"
              ? "Player 1"
              : "Player 2"
            : turn === "you"
              ? "Your turn"
              : "Computer is aiming"}
        </span>
        <span style={{ color: "#F59A51" }}>{remaining} cups left</span>
      </div>
      <canvas
        ref={canvasRef}
        className="game-gesture w-full touch-none rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)]"
        style={{ height: "min(58vh, 420px)", maxHeight: 420 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="Cup Pong table. Drag to aim and release to shoot."
      />
    </div>
  );
}
