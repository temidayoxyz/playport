import type { GameDefinition } from "@/types/game";

/** Editorial 2.5D-style SVG artwork — consistent system, category accents, no text badges. */
export function GameIllustration({
  game,
  className = "",
  compact = false,
}: {
  game: GameDefinition;
  className?: string;
  compact?: boolean;
}) {
  const accent = game.accent;
  const isDark =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const board = isDark ? "#2a2c26" : "#e8e6de";
  const ink = isDark ? "#f5f4ee" : "#171814";
  const soft = isDark ? "#3a3c34" : "#d4d2c8";

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${compact ? "aspect-square" : "aspect-[4/3]"} ${className}`}
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, ${accent} 18%, var(--bg-elevated)) 0%, var(--bg-elevated) 55%, color-mix(in srgb, ${accent} 8%, var(--bg)) 100%)`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 200 150" className="h-full w-full p-3" preserveAspectRatio="xMidYMid meet">
        {game.id === "tic-tac-toe" && (
          <>
            <rect x="42" y="22" width="116" height="106" rx="14" fill={board} stroke={soft} strokeWidth="1.5" />
            <path d="M80 32v86M124 32v86M52 58h96M52 92h96" stroke={soft} strokeWidth="3" strokeLinecap="round" />
            <path d="M58 38l14 14M72 38L58 52" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="148" cy="75" r="14" fill="none" stroke={ink} strokeWidth="4" />
            <ellipse cx="100" cy="132" rx="40" ry="4" fill={ink} opacity="0.08" />
          </>
        )}

        {game.id === "chess" && (
          <>
            <rect x="48" y="28" width="104" height="96" rx="10" fill={board} stroke={soft} strokeWidth="1.5" />
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}${c}`}
                  x={56 + c * 22}
                  y={36 + r * 20}
                  width="22"
                  height="20"
                  fill={(r + c) % 2 === 0 ? soft : "transparent"}
                  opacity={(r + c) % 2 === 0 ? 0.55 : 1}
                />
              )),
            )}
            {/* Knight silhouette */}
            <path
              d="M78 110h28v-6c0-5-6-7-6-12h-3c2-4 5-7 5-12 0-7-5-11-12-11s-12 4-12 11c0 5 3 8 5 12h-3c0 5-6 7-6 12v6z"
              fill={ink}
            />
            {/* Rook */}
            <path d="M128 110h22v-8h-3v-6h3v-8h-4v4h-4v-4h-4v4h-4v-4h-4v8h3v6h-5v8z" fill={accent} />
          </>
        )}

        {game.id === "anagram-rush" && (
          <>
            <rect x="36" y="88" width="128" height="28" rx="10" fill={board} stroke={soft} strokeWidth="1.5" />
            {["R", "U", "S", "H"].map((ch, i) => (
              <g key={ch} transform={`translate(${44 + i * 30} ${i % 2 === 0 ? 36 : 28}) rotate(${i === 1 ? -6 : i === 2 ? 5 : 0})`}>
                <rect width="26" height="32" rx="7" fill={i === 2 ? accent : board} stroke={soft} strokeWidth="1.2" />
                <text
                  x="13"
                  y="21"
                  textAnchor="middle"
                  fill={i === 2 ? "#171A10" : ink}
                  fontSize="14"
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
            <rect x="44" y="24" width="112" height="102" rx="14" fill={board} stroke={soft} strokeWidth="1.5" />
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}${c}`}
                  x={54 + c * 24}
                  y={34 + r * 22}
                  width="20"
                  height="18"
                  rx="5"
                  fill={soft}
                  opacity="0.45"
                />
              )),
            )}
            <path
              d="M64 43 L88 65 L112 65 L136 87"
              fill="none"
              stroke={accent}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="64" cy="43" r="5" fill={accent} />
            <circle cx="136" cy="87" r="5" fill={accent} />
          </>
        )}

        {game.id === "cup-pong" && (
          <>
            <ellipse cx="100" cy="118" rx="70" ry="14" fill={soft} opacity="0.5" />
            <path d="M40 110 Q100 70 160 110 L160 118 Q100 88 40 118 Z" fill={board} stroke={soft} strokeWidth="1" />
            {[
              [100, 58],
              [84, 72],
              [116, 72],
              [68, 86],
              [100, 86],
              [132, 86],
            ].map(([x, y], i) => (
              <g key={i}>
                <path
                  d={`M${x - 10} ${y + 18} Q${x} ${y - 4} ${x + 10} ${y + 18} Z`}
                  fill={accent}
                  opacity={0.85 + (i % 3) * 0.05}
                />
                <ellipse cx={x} cy={y + 2} rx="7" ry="3" fill={ink} opacity="0.25" />
              </g>
            ))}
            <circle cx="62" cy="98" r="9" fill={ink} opacity="0.9" />
            <ellipse cx="62" cy="108" rx="10" ry="3" fill={ink} opacity="0.12" />
          </>
        )}

        {game.id === "archery" && (
          <>
            <ellipse cx="100" cy="120" rx="48" ry="8" fill={ink} opacity="0.08" />
            {[36, 28, 20, 12, 6].map((r, i) => (
              <circle
                key={r}
                cx="118"
                cy="68"
                r={r}
                fill={i % 2 === 0 ? board : accent}
                opacity={i === 4 ? 1 : 0.9}
                stroke={soft}
                strokeWidth="0.8"
              />
            ))}
            <path d="M28 92 L95 72" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M95 72 L88 66 M95 72 L90 78" stroke={ink} strokeWidth="2" strokeLinecap="round" />
            <path d="M48 50 Q70 58 90 52" fill="none" stroke={soft} strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M52 100 Q74 90 96 94" fill="none" stroke={soft} strokeWidth="1.5" strokeDasharray="3 3" />
          </>
        )}

        {game.id === "pong" && (
          <>
            <rect x="36" y="22" width="128" height="106" rx="14" fill={board} stroke={soft} strokeWidth="1.5" />
            <path d="M100 30v90" stroke={soft} strokeWidth="2" strokeDasharray="5 7" />
            <rect x="48" y="48" width="10" height="36" rx="4" fill={accent} />
            <rect x="142" y="62" width="10" height="36" rx="4" fill={ink} opacity="0.75" />
            <circle cx="96" cy="72" r="7" fill={ink} />
            <path d="M80 72h12" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </>
        )}

        {game.id === "snake-duel" && (
          <>
            <rect x="36" y="22" width="128" height="106" rx="14" fill={board} stroke={soft} strokeWidth="1.5" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={`a${i}`}
                x={48 + i * 14}
                y={70}
                width="12"
                height="12"
                rx="3.5"
                fill={i === 5 ? accent : ink}
                opacity={i === 5 ? 1 : 0.75}
              />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={`b${i}`}
                x={132}
                y={40 + i * 14}
                width="12"
                height="12"
                rx="3.5"
                fill={soft}
                opacity="0.9"
              />
            ))}
            <circle cx="70" cy="48" r="5" fill={accent} opacity="0.85" />
          </>
        )}

        {game.id === "sudoku" && (
          <>
            <rect x="44" y="22" width="112" height="106" rx="12" fill={board} stroke={soft} strokeWidth="1.5" />
            {[1, 2].map((i) => (
              <path
                key={`v${i}`}
                d={`M${44 + i * 37.3} 22v106`}
                stroke={ink}
                strokeWidth="2"
                opacity="0.35"
              />
            ))}
            {[1, 2].map((i) => (
              <path
                key={`h${i}`}
                d={`M44 ${22 + i * 35.3}h112`}
                stroke={ink}
                strokeWidth="2"
                opacity="0.35"
              />
            ))}
            <rect x="48" y="26" width="30" height="28" rx="4" fill={accent} opacity="0.35" />
            <text x="63" y="46" textAnchor="middle" fill={ink} fontSize="14" fontWeight="700" fontFamily="Inter,sans-serif">
              5
            </text>
            <text x="100" y="80" textAnchor="middle" fill={ink} fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif" opacity="0.7">
              9
            </text>
            <text x="137" y="114" textAnchor="middle" fill={accent} fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">
              3
            </text>
          </>
        )}

        {game.id === "game-2048" && (
          <>
            <rect x="40" y="28" width="120" height="100" rx="14" fill={board} stroke={soft} strokeWidth="1.5" />
            {[
              { x: 52, y: 40, v: "2", c: soft },
              { x: 108, y: 40, v: "4", c: soft },
              { x: 52, y: 86, v: "8", c: accent },
              { x: 108, y: 86, v: "16", c: accent },
            ].map((t) => (
              <g key={t.v}>
                <rect x={t.x} y={t.y} width="40" height="36" rx="8" fill={t.c} opacity={t.c === accent ? 1 : 0.55} />
                <text
                  x={t.x + 20}
                  y={t.y + 24}
                  textAnchor="middle"
                  fill={t.c === accent ? "#171A10" : ink}
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Inter,sans-serif"
                >
                  {t.v}
                </text>
              </g>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
