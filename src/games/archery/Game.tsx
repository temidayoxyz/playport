import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import { Icon, Icons } from "@/components/common/Icon";
import { resolveQuality, supportsWebGL } from "@/lib/performance/quality";
import { useSettingsStore } from "@/stores/settingsStore";
import { computerShot, flightPoints, projectImpact, type Impact } from "./engine/projectile";

function Target({ xOffset, scale }: { xOffset: number; scale: number }) {
  return (
    <group position={[xOffset, 1.1, -6]} scale={scale}>
      {[0.9, 0.7, 0.5, 0.3, 0.12].map((r, i) => (
        <mesh key={r} position={[0, 0, i * 0.01]}>
          <circleGeometry args={[r, 32]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#f8fafc" : "#ef4444"} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.06]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

function ArrowMesh({ points, active }: { points: [number, number, number][]; active: boolean }) {
  const ref = useRef<Mesh>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    if (!active || !ref.current || points.length === 0) return;
    t.current = Math.min(1, t.current + dt * 2.2);
    const idx = Math.min(points.length - 1, Math.floor(t.current * (points.length - 1)));
    const p = points[idx]!;
    ref.current.position.set(p[0], p[1], p[2]);
    if (t.current >= 1) t.current = 0;
  });
  useEffect(() => {
    t.current = 0;
  }, [points]);
  if (!active) return null;
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
  );
}

export default function ArcheryGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
  reducedMotion = false,
}: GameShellProps) {
  const qualityPref = useSettingsStore((s) => s.performanceQuality);
  const quality = useMemo(() => resolveQuality(qualityPref, reducedMotion), [qualityPref, reducedMotion]);
  const webgl = supportsWebGL();

  const [wind, setWind] = useState(() => (Math.random() * 2 - 1) * (difficultyId === "hard" ? 1 : 0.55));
  const [score, setScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [arrows, setArrows] = useState(modeId === "practice" ? 99 : 10);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [impact, setImpact] = useState<Impact | null>(null);
  const [flight, setFlight] = useState<[number, number, number][]>([]);
  const [flying, setFlying] = useState(false);
  const [targetX, setTargetX] = useState(0);
  const [timeLeft, setTimeLeft] = useState(modeId === "timed" ? 45 : null);
  const [elapsed, setElapsed] = useState(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [aim, setAim] = useState({ x: 0, y: 0, power: 0 });
  const started = useRef(Date.now());
  const scale = difficultyId === "hard" ? 0.75 : difficultyId === "easy" ? 1.15 : 1;

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score,
        opponentScore: oppScore,
        elapsedSeconds: elapsed,
        stats: {
          Arrows: arrows,
          Wind: wind.toFixed(2),
          Last: impact ? `${impact.points} pts` : "—",
        },
        ...partial,
      });
    },
    [arrows, elapsed, impact, onSessionChange, oppScore, score, status, wind],
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

  useEffect(() => {
    if (modeId !== "moving" || status !== "playing") return;
    let t = 0;
    const id = window.setInterval(() => {
      t += 0.05;
      setTargetX(Math.sin(t) * (difficultyId === "hard" ? 1.2 : 0.7));
    }, 50);
    return () => clearInterval(id);
  }, [difficultyId, modeId, status]);

  useEffect(() => {
    if (timeLeft === null || status !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return t;
        if (t <= 1) {
          setStatus("won");
          if (sound) audioManager.play("win");
          emit({ status: "won", score });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [emit, score, sound, status, timeLeft]);

  const fire = (aimX: number, aimY: number, power: number, forComputer = false) => {
    if (status !== "playing" || flying || arrows <= 0) return;
    const result = projectImpact({
      aimX: aimX - targetX * 0.15,
      aimY,
      power,
      wind,
      distance: difficultyId === "hard" ? 1.3 : 1,
    });
    const pts = flightPoints([0, 1, 2], [result.x * 2 + targetX, 1.1 + result.y, -6]);
    setFlight(pts);
    setFlying(true);
    setImpact(result);
    if (sound) audioManager.play(result.points > 0 ? "correct" : "incorrect");
    if (result.ring === 5) announce("Bullseye");

    window.setTimeout(() => {
      setFlying(false);
      if (forComputer) {
        setOppScore((s) => s + result.points);
      } else {
        setScore((s) => s + result.points);
      }
      setArrows((a) => {
        const left = a - 1;
        if (modeId !== "practice" && left <= 0) {
          if (modeId === "vs-computer") {
            const finalScore = forComputer ? score : score + result.points;
            const finalOpp = forComputer ? oppScore + result.points : oppScore;
            // after player finishes, computer plays remaining in batch — simplified end
            const st = finalScore >= finalOpp ? "won" : "lost";
            setStatus(st);
            if (sound) audioManager.play(st === "won" ? "win" : "lose");
            emit({ status: st, score: finalScore, opponentScore: finalOpp });
          } else {
            setStatus("won");
            if (sound) audioManager.play("win");
            emit({ status: "won", score: score + result.points });
          }
        }
        return left;
      });
      setWind((Math.random() * 2 - 1) * (difficultyId === "hard" ? 1 : 0.55));
    }, reducedMotion ? 200 : 700);
  };

  if (!webgl) {
    return (
      <div className="rounded-2xl surface p-6 text-center">
        <p className="font-display text-lg">WebGL is required for Archery</p>
        <p className="mt-2 text-sm text-muted">Your device does not appear to support WebGL.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <span className="rounded-full surface px-3 py-1.5">Score {score}</span>
        {modeId === "vs-computer" && (
          <span className="rounded-full surface px-3 py-1.5">CPU {oppScore}</span>
        )}
        <span className="rounded-full surface px-3 py-1.5">Arrows {arrows}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full surface px-3 py-1.5">
          <Icon icon={Icons.Wind} size="sm" />
          Wind
          <Icon icon={wind > 0 ? Icons.ArrowRight : Icons.ArrowLeft} size="sm" />
          {Math.abs(wind).toFixed(2)}
        </span>
        {timeLeft !== null && <span className="rounded-full surface px-3 py-1.5">{timeLeft}s</span>}
      </div>

      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl surface game-gesture"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY };
          setAim({ x: 0, y: 0, power: 0 });
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = (e.clientX - drag.current.x) / 140;
          const dy = (e.clientY - drag.current.y) / 140;
          setAim({
            x: Math.max(-1, Math.min(1, dx)),
            y: Math.max(-1, Math.min(1, -dy * 0.5)),
            power: Math.min(1, Math.max(0, dy)),
          });
        }}
        onPointerUp={() => {
          if (!drag.current) return;
          drag.current = null;
          fire(aim.x, aim.y, Math.max(0.35, aim.power));
          if (modeId === "vs-computer" && arrows > 1) {
            window.setTimeout(() => {
              const cpu = computerShot(difficultyId, wind);
              fire(cpu.aimX, cpu.aimY, cpu.power, true);
            }, 800);
          }
        }}
      >
        <Canvas
          dpr={quality.dpr}
          camera={{ position: [0, 1.4, 4], fov: 50 }}
          gl={{ antialias: quality.antialias, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor("#87a7c7")}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 4, 3]} intensity={0.85} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#4d7c4d" />
            </mesh>
            <Target xOffset={targetX} scale={scale} />
            <ArrowMesh points={flight} active={flying} />
            {/* bow rest marker */}
            <mesh position={[0, 1, 2]}>
              <boxGeometry args={[0.08, 0.5, 0.08]} />
              <meshStandardMaterial color="#7c4a1e" />
            </mesh>
          </Suspense>
        </Canvas>
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs text-port-900">
          {drag.current || aim.power > 0 ? `Power ${Math.round(aim.power * 100)}%` : "Drag to aim · pull for power"}
          {impact && !flying ? ` · Last: ${impact.points} pts` : ""}
        </div>
      </div>
    </div>
  );
}
