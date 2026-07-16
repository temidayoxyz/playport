import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { resolveQuality, supportsWebGL } from "@/lib/performance/quality";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  aimToVelocity,
  computerAim,
  createCups,
  detectCupScore,
  isMissed,
  nextShotState,
  stepBall,
  type BallState,
  type Cup,
  type ShotState,
} from "./engine/physics";

function Scene({
  cups,
  ball,
  preview,
  reducedMotion,
}: {
  cups: Cup[];
  ball: BallState;
  preview: [number, number, number][];
  reducedMotion: boolean;
}) {
  const ballRef = useRef<Mesh>(null);

  useFrame(() => {
    if (ballRef.current) {
      ballRef.current.position.set(ball.pos.x, ball.pos.y, ball.pos.z);
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 6, 2]} intensity={0.9} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      <mesh position={[0, 0.05, 1.6]}>
        <boxGeometry args={[2.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      {cups.map((c) =>
        c.hit ? null : (
          <group key={c.id} position={[c.x, 0.2, c.z]}>
            <mesh>
              <cylinderGeometry args={[c.radius, c.radius * 0.85, 0.4, 16]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[c.radius * 0.75, c.radius * 0.75, 0.05, 16]} />
              <meshStandardMaterial color="#0b1220" />
            </mesh>
          </group>
        ),
      )}
      <mesh ref={ballRef} position={[ball.pos.x, ball.pos.y, ball.pos.z]}>
        <sphereGeometry args={[ball.radius, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {!reducedMotion &&
        preview.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
          </mesh>
        ))}
      <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
    </>
  );
}

export default function CupPongGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
  reducedMotion = false,
}: GameShellProps) {
  const qualityPref = useSettingsStore((s) => s.performanceQuality);
  const quality = useMemo(() => resolveQuality(qualityPref, reducedMotion), [qualityPref, reducedMotion]);
  const webgl = supportsWebGL();

  const [cups, setCups] = useState(() => createCups(modeId === "trick" ? "diamond" : "triangle"));
  const [ball, setBall] = useState<BallState>({
    pos: { x: 0, y: 0.35, z: 1.8 },
    vel: { x: 0, y: 0, z: 0 },
    radius: 0.12,
    active: false,
  });
  const [shot, setShot] = useState<ShotState>("idle");
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(modeId === "limited" || modeId === "trick" ? 6 : 12);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [aim, setAim] = useState({ dx: 0, dy: 0, power: 0 });
  const [elapsed, setElapsed] = useState(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const started = useRef(Date.now());
  const raf = useRef(0);

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score,
        elapsedSeconds: elapsed,
        stats: {
          Cups: cups.filter((c) => !c.hit).length,
          Balls: ballsLeft,
          Shot: shot,
        },
        ...partial,
      });
    },
    [ballsLeft, cups, elapsed, onSessionChange, score, shot, status],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    emit();
  }, [emit]);

  const preview = useMemo(() => {
    if (difficultyId !== "easy" || shot !== "aiming") return [] as [number, number, number][];
    const pts: [number, number, number][] = [];
    let b: BallState = {
      ...ball,
      active: true,
      vel: aimToVelocity(aim.dx, aim.dy, Math.max(0.35, aim.power), difficultyId),
    };
    for (let i = 0; i < 24; i++) {
      b = stepBall(b, 0.04);
      pts.push([b.pos.x, b.pos.y, b.pos.z]);
    }
    return pts;
  }, [aim, ball, difficultyId, shot]);

  const resetBall = useCallback(() => {
    setBall({
      pos: { x: 0, y: 0.35, z: 1.8 },
      vel: { x: 0, y: 0, z: 0 },
      radius: 0.12,
      active: false,
    });
    setShot("idle");
  }, []);

  // flight loop
  useEffect(() => {
    if (shot !== "flying") return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      setBall((prev) => {
        const next = stepBall(prev, dt);
        const cupId = detectCupScore(next, cups);
        if (cupId !== null) {
          setCups((cs) => cs.map((c) => (c.id === cupId ? { ...c, hit: true } : c)));
          setScore((s) => s + 100);
          setShot(nextShotState("flying", "score"));
          if (sound) audioManager.play("correct");
          announce("Cup scored");
          window.setTimeout(() => {
            const remaining = cups.filter((c) => !c.hit && c.id !== cupId);
            if (remaining.length === 0) {
              setStatus("won");
              if (sound) audioManager.play("win");
              emit({ status: "won", score: score + 100 });
            } else {
              resetBall();
            }
          }, 400);
          return { ...next, active: false };
        }
        if (isMissed(next) || (Math.abs(next.vel.y) < 0.05 && next.pos.y <= next.radius + 0.01 && Math.hypot(next.vel.x, next.vel.z) < 0.15)) {
          setShot(nextShotState("flying", "miss"));
          if (sound) audioManager.play("incorrect");
          window.setTimeout(() => {
            setBallsLeft((b) => {
              const left = b - 1;
              if (left <= 0) {
                setStatus("lost");
                if (sound) audioManager.play("lose");
                emit({ status: "lost", score });
              } else {
                resetBall();
              }
              return left;
            });
          }, 350);
          return { ...next, active: false };
        }
        return next;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [cups, emit, resetBall, score, shot, sound]);

  // computer turn
  useEffect(() => {
    if (modeId !== "vs-computer" || shot !== "idle" || status !== "playing") return;
    if (score % 200 !== 100) return; // simple alternate after player scores — skip for solo flow
  }, [modeId, score, shot, status]);

  const fireComputer = () => {
    const a = computerAim(difficultyId);
    const vel = aimToVelocity(a.dx, a.dy, a.power, difficultyId);
    setBall((b) => ({ ...b, active: true, vel, pos: { x: 0, y: 0.35, z: 1.8 } }));
    setShot("flying");
  };

  if (!webgl) {
    return (
      <div className="rounded-2xl surface p-6 text-center">
        <p className="font-display text-lg">WebGL is required for Cup Pong</p>
        <p className="mt-2 text-sm text-muted">Try another browser or enable hardware acceleration.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <span className="rounded-full surface px-3 py-1.5">Score {score}</span>
        <span className="rounded-full surface px-3 py-1.5">Balls {ballsLeft}</span>
        <span className="rounded-full surface px-3 py-1.5">Cups {cups.filter((c) => !c.hit).length}</span>
      </div>

      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl surface game-gesture"
        onPointerDown={(e) => {
          if (shot !== "idle" || status !== "playing") return;
          drag.current = { x: e.clientX, y: e.clientY };
          setShot(nextShotState("idle", "start-aim"));
          setAim({ dx: 0, dy: 0, power: 0 });
        }}
        onPointerMove={(e) => {
          if (!drag.current || shot !== "aiming") return;
          const dx = (e.clientX - drag.current.x) / 120;
          const dy = (e.clientY - drag.current.y) / 160;
          const power = Math.min(1, Math.max(0, dy));
          setAim({ dx: Math.max(-1, Math.min(1, -dx)), dy: 0, power });
        }}
        onPointerUp={() => {
          if (shot !== "aiming") return;
          drag.current = null;
          const vel = aimToVelocity(aim.dx, aim.dy, Math.max(0.35, aim.power), difficultyId);
          setBall((b) => ({ ...b, active: true, vel }));
          setShot(nextShotState("aiming", "release"));
          if (sound) audioManager.play("whoosh");
        }}
      >
        <Canvas
          dpr={quality.dpr}
          camera={{ position: [0, 2.4, 3.6], fov: 45 }}
          gl={{ antialias: quality.antialias, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#0b1220");
          }}
        >
          <Suspense fallback={null}>
            <Scene cups={cups} ball={ball} preview={preview} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs text-white/80">
          {shot === "idle" ? "Drag to aim & set power" : shot === "aiming" ? `Power ${Math.round(aim.power * 100)}%` : shot}
        </div>
      </div>

      {modeId === "vs-computer" && (
        <button type="button" className="touch-target rounded-xl surface px-4 py-2 text-sm" onClick={fireComputer}>
          Computer shot
        </button>
      )}
    </div>
  );
}
