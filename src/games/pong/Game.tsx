import { useCallback, useEffect, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { aiTrackY, createPong, serve, stepPong, type PongState } from "./engine/logic";

export default function PongGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
}: GameShellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<PongState>(createPong());
  const keys = useRef(new Set<string>());
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(Date.now());
  const target =
    modeId === "first-10" ? 10 : modeId === "survival" ? Infinity : modeId === "first-5" || modeId === "vs-computer" || modeId === "local" ? 5 : 5;
  const speedMode = modeId === "speed";
  const local = modeId === "local";

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      const s = stateRef.current;
      onSessionChange?.({
        status,
        score: s.leftScore,
        opponentScore: s.rightScore,
        elapsedSeconds: elapsed,
        stats: { You: s.leftScore, Opponent: s.rightScore },
        ...partial,
      });
    },
    [elapsed, onSessionChange, status],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key);
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    stateRef.current = serve(createPong(canvas.width, canvas.height), Math.random() > 0.5);

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      let s = stateRef.current;

      if (status === "playing") {
        const speed = keys.current.has("w") || keys.current.has("ArrowUp") ? -320 : keys.current.has("s") || keys.current.has("ArrowDown") ? 320 : 0;
        // left paddle: W/S primarily for local left; Arrow also moves left in solo
        if (keys.current.has("w")) s.leftY -= 320 * dt;
        if (keys.current.has("s")) s.leftY += 320 * dt;
        if (!local && (keys.current.has("ArrowUp") || keys.current.has("ArrowDown"))) {
          s.leftY += (keys.current.has("ArrowUp") ? -320 : 320) * dt;
        }
        if (local) {
          if (keys.current.has("ArrowUp")) s.rightY -= 320 * dt;
          if (keys.current.has("ArrowDown")) s.rightY += 320 * dt;
        }

        s.leftY = Math.max(s.paddleH / 2, Math.min(s.height - s.paddleH / 2, s.leftY));
        s.rightY = Math.max(s.paddleH / 2, Math.min(s.height - s.paddleH / 2, s.rightY));

        if (s.serving) {
          s = serve(s, Math.random() > 0.5, speedMode ? 360 : 280);
        }

        const ai = local ? null : aiTrackY(s, difficultyId);
        const stepped = stepPong(s, dt, ai, speedMode ? 1.35 : 1);
        s = stepped.state;
        if (stepped.scored) {
          if (sound) audioManager.play("tick");
          announce(stepped.scored === "left" ? "Point for you" : "Point for opponent");
          const winScore = target;
          if (s.leftScore >= winScore || s.rightScore >= winScore) {
            const st = s.leftScore >= winScore ? "won" : "lost";
            setStatus(st);
            if (sound) audioManager.play(st === "won" ? "win" : "lose");
            emit({ status: st, score: s.leftScore, opponentScore: s.rightScore });
          } else {
            emit({ score: s.leftScore, opponentScore: s.rightScore });
          }
        }
        void speed;
        stateRef.current = s;
      }

      // draw — coral accent, warm neutrals (no blue/cyan palette)
      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark ? "#171814" : "#22241e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(245,244,238,0.18)";
      ctx.setLineDash([8, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      // ball trail
      ctx.fillStyle = "rgba(239,108,88,0.25)";
      ctx.beginPath();
      ctx.arc(s.ballX - s.ballVX * 0.02, s.ballY - s.ballVY * 0.02, s.ballR * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#EF6C58";
      ctx.fillRect(24, s.leftY - s.paddleH / 2, s.paddleW, s.paddleH);
      ctx.fillStyle = "#F5F4EE";
      ctx.fillRect(canvas.width - 24 - s.paddleW, s.rightY - s.paddleH / 2, s.paddleW, s.paddleH);
      ctx.beginPath();
      ctx.fillStyle = "#F5F4EE";
      ctx.arc(s.ballX, s.ballY, s.ballR, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "600 24px Inter, system-ui, sans-serif";
      ctx.fillStyle = "rgba(245,244,238,0.55)";
      ctx.fillText(String(s.leftScore), canvas.width / 2 - 40, 36);
      ctx.fillText(String(s.rightScore), canvas.width / 2 + 24, 36);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [difficultyId, emit, local, sound, speedMode, status, target]);

  const onPointer = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * stateRef.current.height;
    const x = (e.clientX - rect.left) / rect.width;
    if (x < 0.5 || !local) stateRef.current.leftY = y;
    else stateRef.current.rightY = y;
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="w-full touch-none rounded-2xl border border-[var(--border)] game-gesture"
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        aria-label="Pong arena"
      />
      <p className="text-xs text-muted text-center">
        Drag on the arena · W/S {local ? "left · arrow keys right" : "or arrow keys"}
      </p>
    </div>
  );
}
