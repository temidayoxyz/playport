/** Lightweight CSS/SVG port radar — no Three.js on the landing page. */
export function HeroRadar() {
  const docks = [
    { label: "A", color: "#8b5cf6", x: 30, y: 28 },
    { label: "B", color: "#84cc16", x: 68, y: 24 },
    { label: "C", color: "#f97316", x: 78, y: 58 },
    { label: "D", color: "#22d3ee", x: 42, y: 72 },
    { label: "E", color: "#ec4899", x: 22, y: 52 },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-dock)]" />
      <div className="absolute inset-[12%] rounded-full border border-dashed border-[var(--border)] opacity-70" />
      <div className="absolute inset-[28%] rounded-full border border-[var(--border)] opacity-50" />
      <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full">
        <div className="absolute left-1/2 top-1/2 h-1/2 w-[2px] origin-top bg-gradient-to-b from-[var(--accent)] to-transparent" />
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {docks.map((d, i) => (
          <g key={d.label}>
            <circle cx={d.x} cy={d.y} r="3.5" fill={d.color}>
              <animate
                attributeName="r"
                values="3;5;3"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <text x={d.x} y={d.y + 10} textAnchor="middle" fontSize="4" fill="currentColor" opacity="0.7">
              {d.label}
            </text>
          </g>
        ))}
        <circle cx="50" cy="50" r="2" fill="var(--accent)" />
      </svg>
      <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-muted">
        Live docks · games arriving
      </p>
    </div>
  );
}
