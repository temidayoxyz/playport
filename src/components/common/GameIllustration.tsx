import type { GameDefinition } from "@/types/game";

/** Lightweight original SVG illustrations per game — no external assets required. */
export function GameIllustration({ game, className = "" }: { game: GameDefinition; className?: string }) {
  const bg = game.accent;
  return (
    <div
      className={`relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(145deg, ${bg}33, transparent 55%), var(--bg-muted)`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 160 100" className="h-full w-full max-h-36 p-3">
        {game.id === "tic-tac-toe" && (
          <>
            <path d="M40 20v60M80 20v60M20 40h80M20 70h80" stroke={bg} strokeWidth="4" />
            <path d="M28 28l16 16M44 28L28 44" stroke={bg} strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="55" r="12" fill="none" stroke={bg} strokeWidth="4" />
          </>
        )}
        {game.id === "chess" && (
          <path
            d="M70 80h40v-8c0-6-8-8-8-14h-4c2-4 6-8 6-14 0-8-6-12-14-12s-14 4-14 12c0 6 4 10 6 14h-4c0 6-8 8-8 14v8z"
            fill={bg}
          />
        )}
        {game.id === "anagram-rush" && (
          <>
            {["P", "L", "A", "Y"].map((ch, i) => (
              <rect key={ch} x={28 + i * 28} y={30} width="22" height="28" rx="6" fill={bg} opacity={0.85 - i * 0.1} />
            ))}
            {["P", "L", "A", "Y"].map((ch, i) => (
              <text key={`t${ch}`} x={39 + i * 28} y={50} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">
                {ch}
              </text>
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
                  fill={bg}
                  opacity={0.4 + ((r + c) % 3) * 0.2}
                />
              )),
            )}
            <path d="M48 25l40 36" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {game.id === "cup-pong" && (
          <>
            <ellipse cx="80" cy="78" rx="50" ry="10" fill={bg} opacity="0.25" />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${55 + i * 22} 70 l-8 -28 h16 z`}
                fill={bg}
                opacity={0.7 + i * 0.1}
              />
            ))}
            <circle cx="50" cy="40" r="8" fill="white" />
          </>
        )}
        {game.id === "archery" && (
          <>
            <circle cx="100" cy="50" r="28" fill="none" stroke={bg} strokeWidth="4" />
            <circle cx="100" cy="50" r="18" fill="none" stroke={bg} strokeWidth="4" />
            <circle cx="100" cy="50" r="8" fill={bg} />
            <path d="M20 50h50" stroke={bg} strokeWidth="3" />
            <path d="M70 50l-10 -6M70 50l-10 6" stroke={bg} strokeWidth="3" />
          </>
        )}
        {game.id === "pong" && (
          <>
            <rect x="24" y="30" width="8" height="40" rx="3" fill={bg} />
            <rect x="128" y="40" width="8" height="40" rx="3" fill={bg} opacity="0.7" />
            <circle cx="80" cy="50" r="7" fill="white" />
            <path d="M80 10v80" stroke={bg} strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
          </>
        )}
        {game.id === "snake-duel" && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={30 + i * 16} y={48} width="14" height="14" rx="3" fill={bg} opacity={0.5 + i * 0.1} />
            ))}
            <rect x="110" y="30" width="14" height="14" rx="3" fill="#84cc16" />
          </>
        )}
        {game.id === "sudoku" && (
          <>
            <rect x="35" y="15" width="90" height="70" rx="6" fill="none" stroke={bg} strokeWidth="3" />
            <path d="M65 15v70M95 15v70M35 38h90M35 62h90" stroke={bg} strokeWidth="2" />
            <text x="48" y="33" fill={bg} fontSize="12" fontWeight="700">
              5
            </text>
            <text x="78" y="55" fill={bg} fontSize="12" fontWeight="700">
              9
            </text>
          </>
        )}
        {game.id === "game-2048" && (
          <>
            <rect x="40" y="25" width="32" height="32" rx="6" fill={bg} opacity="0.6" />
            <rect x="78" y="25" width="32" height="32" rx="6" fill={bg} />
            <rect x="40" y="63" width="32" height="22" rx="6" fill={bg} opacity="0.4" />
            <text x="94" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
              8
            </text>
          </>
        )}
      </svg>
      <div className="absolute bottom-2 right-2 rounded-full bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
        {game.technology.includes("threejs") ? "3D" : game.technology.includes("canvas") ? "Arcade" : "Terminal"}
      </div>
    </div>
  );
}
