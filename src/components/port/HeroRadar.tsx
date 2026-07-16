/** Lightweight CSS/SVG port radar — no Three.js on the landing page. */
export function HeroRadar() {
  const docks = [
    { label: "A", x: 30, y: 28 },
    { label: "B", x: 68, y: 24 },
    { label: "C", x: 78, y: 58 },
    { label: "D", x: 42, y: 72 },
    { label: "E", x: 22, y: 52 },
  ];

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
      aria-hidden
    >
      <div className="absolute inset-6 rounded-full border border-[var(--border)]" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-[var(--border-strong)] opacity-70" />
      <div className="absolute inset-[38%] rounded-full border border-[var(--border)] opacity-50" />
      <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full">
        <div
          className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top"
          style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }}
        />
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full p-2">
        {docks.map((d, i) => (
          <g key={d.label}>
            <circle cx={d.x} cy={d.y} r="2.8" fill="var(--accent)">
              <animate
                attributeName="r"
                values="2.5;3.8;2.5"
                dur={`${2.2 + i * 0.25}s`}
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={d.x}
              y={d.y + 9}
              textAnchor="middle"
              fontSize="4"
              fill="var(--fg-muted)"
              fontFamily="Inter, sans-serif"
            >
              {d.label}
            </text>
          </g>
        ))}
        <circle cx="50" cy="50" r="1.8" fill="var(--fg)" />
      </svg>
      <p className="absolute bottom-4 left-0 right-0 text-center text-[12px] font-medium tracking-wide text-[var(--fg-muted)]">
        Live docks · games arriving
      </p>
    </div>
  );
}
