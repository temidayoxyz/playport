import { useCallback, useEffect, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { Icon, Icons } from "@/components/common/Icon";
import {
  createSnake,
  mazeObstacles,
  pathfindDir,
  setDirection,
  stepSnake,
  type Dir,
  type SnakeState,
} from "./engine/logic";

export default function SnakeDuelGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
}: GameShellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<SnakeState>(createSnake());
  const cpuRef = useRef<SnakeState | null>(null);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [showPad, setShowPad] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(Date.now());
  const tickMs = difficultyId === "easy" ? 160 : difficultyId === "hard" ? 80 : 110;
  const wrap = modeId === "classic";
  const maze = modeId === "maze";

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score: playerRef.current.score,
        opponentScore: cpuRef.current?.score,
        elapsedSeconds: elapsed,
        stats: { Length: playerRef.current.snake.length },
        ...partial,
      });
    },
    [elapsed, onSessionChange, status],
  );

  useEffect(() => {
    const obstacles = maze ? mazeObstacles(20, 20) : [];
    playerRef.current = createSnake(20, 20, wrap, obstacles);
    if (modeId === "vs-computer" || modeId === "local") {
      const cpu = createSnake(20, 20, wrap, obstacles);
      cpu.snake = [
        { x: 15, y: 10 },
        { x: 16, y: 10 },
        { x: 17, y: 10 },
      ];
      cpu.dir = "left";
      cpu.pendingDir = "left";
      cpuRef.current = cpu;
    } else {
      cpuRef.current = null;
    }
  }, [maze, modeId, wrap]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        playerRef.current = setDirection(playerRef.current, dir);
      }
      if (modeId === "local") {
        const map2: Record<string, Dir> = { i: "up", k: "down", j: "left", l: "right" };
        const d2 = map2[e.key.toLowerCase()];
        if (d2 && cpuRef.current) cpuRef.current = setDirection(cpuRef.current, d2);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    let speed = tickMs;

    const draw = () => {
      const cell = canvas.width / 20;
      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark ? "#171814" : "#22241e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // subtle grid
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(245,244,238,0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(canvas.width, i * cell);
        ctx.stroke();
      }
      const p = playerRef.current;
      for (const o of p.obstacles) {
        ctx.fillStyle = isDark ? "#3a3c34" : "#4a4c42";
        ctx.beginPath();
        ctx.roundRect(o.x * cell + 1, o.y * cell + 1, cell - 2, cell - 2, 3);
        ctx.fill();
      }
      // food
      ctx.fillStyle = "#CAF15A";
      ctx.beginPath();
      ctx.roundRect(p.food.x * cell + 2, p.food.y * cell + 2, cell - 4, cell - 4, 4);
      ctx.fill();
      // player snake — coral head + body outline distinction
      p.snake.forEach((c, i) => {
        ctx.fillStyle = i === 0 ? "#EF6C58" : "#c45646";
        ctx.beginPath();
        ctx.roundRect(c.x * cell + 1, c.y * cell + 1, cell - 2, cell - 2, 3);
        ctx.fill();
        if (i === 0) {
          ctx.strokeStyle = "#f5f4ee";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });
      if (cpuRef.current) {
        ctx.fillStyle = "#D8B54A";
        ctx.beginPath();
        ctx.roundRect(
          cpuRef.current.food.x * cell + 2,
          cpuRef.current.food.y * cell + 2,
          cell - 4,
          cell - 4,
          4,
        );
        ctx.fill();
        cpuRef.current.snake.forEach((c, i) => {
          ctx.fillStyle = i === 0 ? "#F5F4EE" : "#b5b7ae";
          ctx.beginPath();
          ctx.roundRect(c.x * cell + 1, c.y * cell + 1, cell - 2, cell - 2, 3);
          ctx.fill();
          if (i === 0) {
            ctx.strokeStyle = "#171814";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      }
      ctx.fillStyle = "rgba(245,244,238,0.7)";
      ctx.font = "600 13px Inter, system-ui, sans-serif";
      ctx.fillText(`Score ${p.score}`, 8, 18);
      if (cpuRef.current) ctx.fillText(`Opp ${cpuRef.current.score}`, 8, 36);
    };

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (status === "playing") {
        acc += dt;
        if (modeId === "survival") speed = Math.max(55, tickMs - Math.floor(elapsed / 10) * 8);
        while (acc >= speed) {
          acc -= speed;
          if (modeId === "vs-computer" && cpuRef.current?.alive) {
            const d = pathfindDir(cpuRef.current);
            if (d) cpuRef.current = setDirection(cpuRef.current, d);
            cpuRef.current = stepSnake(cpuRef.current);
          }
          if (modeId === "local" && cpuRef.current?.alive) {
            cpuRef.current = stepSnake(cpuRef.current);
          }
          playerRef.current = stepSnake(playerRef.current);
          if (!playerRef.current.alive) {
            setStatus("lost");
            if (sound) audioManager.play("lose");
            announce("Game over");
            emit({ status: "lost", score: playerRef.current.score });
          } else if (playerRef.current.score > 0 && playerRef.current.score % 10 === 0) {
            emit({ score: playerRef.current.score });
          }
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [elapsed, emit, modeId, sound, status, tickMs]);

  const swipe = useRef<{ x: number; y: number } | null>(null);

  const steer = (dir: Dir) => {
    playerRef.current = setDirection(playerRef.current, dir);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-full touch-none rounded-2xl border border-[var(--border)] game-gesture"
        aria-label="Snake board"
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (!swipe.current) return;
          const dx = e.clientX - swipe.current.x;
          const dy = e.clientY - swipe.current.y;
          if (Math.hypot(dx, dy) < 20) return;
          if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? "right" : "left");
          else steer(dy > 0 ? "down" : "up");
          swipe.current = null;
        }}
      />
      <button type="button" className="text-sm text-muted underline" onClick={() => setShowPad((v) => !v)}>
        {showPad ? "Hide" : "Show"} direction pad
      </button>
      {showPad && (
        <div className="grid grid-cols-3 gap-2">
          <span />
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-xl surface"
            aria-label="Up"
            onClick={() => steer("up")}
          >
            <Icon icon={Icons.ArrowUp} size="md" />
          </button>
          <span />
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-xl surface"
            aria-label="Left"
            onClick={() => steer("left")}
          >
            <Icon icon={Icons.ArrowLeft} size="md" />
          </button>
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-xl surface"
            aria-label="Down"
            onClick={() => steer("down")}
          >
            <Icon icon={Icons.ArrowDown} size="md" />
          </button>
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-xl surface"
            aria-label="Right"
            onClick={() => steer("right")}
          >
            <Icon icon={Icons.ArrowRight} size="md" />
          </button>
        </div>
      )}
    </div>
  );
}
