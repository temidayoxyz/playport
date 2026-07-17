import { useEffect, useState } from "react";

const SIGNALS = [
  { id: 0, x: 28, y: 30, color: "#8DA85A", label: "Board" },
  { id: 1, x: 72, y: 26, color: "#C8F04D", label: "Words" },
  { id: 2, x: 80, y: 62, color: "#F59A51", label: "Sports" },
  { id: 3, x: 48, y: 78, color: "#EF6C58", label: "Arcade" },
  { id: 4, x: 20, y: 58, color: "#D8B54A", label: "Puzzle" },
];

/** Signature landing animation — destinations arriving at a central launch gate. */
export function PortSignal() {
  const [step, setStep] = useState(0);
  const [showPlay, setShowPlay] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    (document.documentElement.classList.contains("reduced-motion") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduced) {
      setStep(5);
      return;
    }
    let cancelled = false;
    let t1: number;
    let t2: number;
    let t3: number;

    const cycle = () => {
      if (cancelled) return;
      setStep(0);
      setShowPlay(false);
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setStep(i);
        if (i < 5) {
          t1 = window.setTimeout(tick, 520);
        } else {
          t2 = window.setTimeout(() => {
            if (cancelled) return;
            setShowPlay(true);
            t3 = window.setTimeout(() => {
              if (cancelled) return;
              setShowPlay(false);
              t1 = window.setTimeout(cycle, 900);
            }, 700);
          }, 400);
        }
      };
      t1 = window.setTimeout(tick, 400);
    };

    cycle();
    return () => {
      cancelled = true;
      window.clearTimeout(t1!);
      window.clearTimeout(t2!);
      window.clearTimeout(t3!);
    };
  }, [reduced]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[340px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-sm)]"
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* Route lines */}
        {SIGNALS.map((s, i) => (
          <line
            key={`line-${s.id}`}
            x1="50"
            y1="50"
            x2={s.x}
            y2={s.y}
            stroke="var(--border-strong)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            opacity={step > i ? 0.9 : 0.25}
            style={{ transition: "opacity 280ms ease-out" }}
          />
        ))}

        {/* Central launch gate */}
        <g style={{ transformOrigin: "50px 50px" }}>
          <circle
            cx="50"
            cy="50"
            r={showPlay ? 14 : 12}
            fill="color-mix(in srgb, var(--accent) 22%, var(--surface-solid))"
            stroke="var(--accent)"
            strokeWidth="1.4"
            style={{
              transition: "r 280ms ease-out",
              animation: showPlay && !reduced ? "pp-pulse-soft 700ms ease-out" : undefined,
            }}
          />
          <rect
            x="42"
            y="42"
            width="16"
            height="16"
            rx="4"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="1.3"
            opacity="0.85"
          />
          {showPlay ? (
            <path d="M47 46 L47 54 L55 50 Z" fill="var(--on-accent)" style={{ fill: "var(--fg)" }} />
          ) : (
            <circle cx="50" cy="50" r="2.2" fill="var(--accent)" />
          )}
        </g>

        {/* Category signals */}
        {SIGNALS.map((s, i) => {
          const active = step > i;
          return (
            <g key={s.id} opacity={active ? 1 : 0.2} style={{ transition: "opacity 280ms ease-out" }}>
              <circle
                cx={s.x}
                cy={s.y}
                r={active ? 5.5 : 4}
                fill={s.color}
                style={{
                  transformOrigin: `${s.x}px ${s.y}px`,
                  animation: active && step === i + 1 && !reduced ? "pp-signal-arrive 320ms ease-out" : undefined,
                }}
              />
              <circle cx={s.x} cy={s.y} r="2" fill="var(--surface-solid)" opacity="0.9" />
            </g>
          );
        })}
      </svg>
      <p className="absolute bottom-3 left-0 right-0 text-center text-[11px] font-medium tracking-wide text-[var(--fg-muted)]">
        Destinations ready
      </p>
    </div>
  );
}
