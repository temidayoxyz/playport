import type { GameDefinition } from "@/types/game";

/** Lightweight original SVG illustrations — monochrome + yellow, no color clash. */
export function GameIllustration({ game, className = "" }: { game: GameDefinition; className?: string }) {
  return (
    <div
      className={`relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[var(--bg-muted)] ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 160 100" className="h-full w-full max-h-36 p-4">
        {game.id === "tic-tac-toe" && (
          <>
            <path d="M40 20v60M80 20v60M20 40h80M20 70h80" stroke="var(--fg-muted)" strokeWidth="3" />
            <path d="M28 28l16 16M44 28L28 44" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="100" cy="55" r="12" fill="none" stroke="var(--fg)" strokeWidth="3" />
          </>
        )}
        {game.id === "chess" && (
          <path
            d="M70 80h40v-8c0-6-8-8-8-14h-4c2-4 6-8 6-14 0-8-6-12-14-12s-14 4-14 12c0 6 4 10 6 14h-4c0 6-8 8-8 14v8z"
            fill="var(--accent)"
          />
        )}
        {game.id === "anagram-rush" && (
          <>
            {["P", "L", "A", "Y"].map((ch, i) => (
              <g key={ch}>
                <rect
                  x={28 + i * 28}
                  y={32}
                  width="22"
                  height="28"
                  rx="6"
                  fill={i % 2 === 0 ? "var(--accent)" : "var(--bg-elevated)"}
                  stroke="var(--border)"
                />
                <text
                  x={39 + i * 28}
                  y={51}
                  textAnchor="middle"
                  fill={i % 2 === 0 ? "#0a0a0a" : "var(--fg)"}
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {ch}
                </text>
              </g>
            ))}
          </>
        )}
        {game.id === "word-hunt" && (
          <>
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}${c}`}
                  x={40 + c * 20}
                  y={18 + r * 18}
                  width="16"
                  height="14"
                  rx="3"
                  fill="var(--bg-elevated)"
                  stroke="var(--border)"
                />
              )),
            )}
            <path d="M48 25l40 36" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {game.id === "cup-pong" && (
          <>
            <ellipse cx="80" cy="78" rx="50" ry="10" fill="var(--border)" opacity="0.6" />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${55 + i * 22} 70 l-8 -28 h16 z`}
                fill="var(--fg-muted)"
                opacity={0.7 + i * 0.1}
              />
            ))}
            <circle cx="50" cy="40" r="8" fill="var(--accent)" />
          </>
        )}
        {game.id === "archery" && (
          <>
            <circle cx="100" cy="50" r="28" fill="none" stroke="var(--fg-muted)" strokeWidth="3" />
            <circle cx="100" cy="50" r="18" fill="none" stroke="var(--fg-muted)" strokeWidth="3" />
            <circle cx="100" cy="50" r="8" fill="var(--accent)" />
            <path d="M20 50h50" stroke="var(--fg)" strokeWidth="2.5" />
            <path d="M70 50l-10 -6M70 50l-10 6" stroke="var(--fg)" strokeWidth="2.5" />
          </>
        )}
        {game.id === "pong" && (
          <>
            <rect x="24" y="30" width="8" height="40" rx="3" fill="var(--accent)" />
            <rect x="128" y="40" width="8" height="40" rx="3" fill="var(--fg-muted)" />
            <circle cx="80" cy="50" r="7" fill="var(--fg)" />
            <path d="M80 10v80" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="4 6" />
          </>
        )}
        {game.id === "snake-duel" && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={30 + i * 16}
                y={48}
                width="14"
                height="14"
                rx="3"
                fill={i === 4 ? "var(--accent)" : "var(--fg-muted)"}
              />
            ))}
            <rect x="110" y="30" width="14" height="14" rx="3" fill="var(--fg)" />
          </>
        )}
        {game.id === "sudoku" && (
          <>
            <rect x="35" y="15" width="90" height="70" rx="6" fill="none" stroke="var(--fg-muted)" strokeWidth="2.5" />
            <path d="M65 15v70M95 15v70M35 38h90M35 62h90" stroke="var(--border-strong)" strokeWidth="1.5" />
            <text x="48" y="33" fill="var(--accent)" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">
              5
            </text>
            <text x="78" y="55" fill="var(--fg)" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">
              9
            </text>
          </>
        )}
        {game.id === "game-2048" && (
          <>
            <rect x="40" y="25" width="32" height="32" rx="6" fill="var(--bg-elevated)" stroke="var(--border)" />
            <rect x="78" y="25" width="32" height="32" rx="6" fill="var(--accent)" />
            <rect x="40" y="63" width="32" height="22" rx="6" fill="var(--bg-elevated)" stroke="var(--border)" />
            <text
              x={94}
              y={47}
              textAnchor="middle"
              fill="#0a0a0a"
              fontSize="12"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              8
            </text>
          </>
        )}
      </svg>
      <div className="absolute bottom-2 right-2 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        {game.technology.includes("threejs")
          ? "3D"
          : game.technology.includes("canvas")
            ? "Arcade"
            : "Terminal"}
      </div>
    </div>
  );
}
