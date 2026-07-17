import { useEffect, useState } from "react";

const STAGES = [
  {
    title: "Choose a category",
    body: "Browse focused docks without hunting through a long catalogue page.",
  },
  {
    title: "Set up your game",
    body: "Pick a mode and difficulty in a compact sheet — no account required.",
  },
  {
    title: "Launch and play",
    body: "One tap starts the game. Pause, restart, or return to the Port anytime.",
  },
];

/** Abstract three-state demo of the Port interaction model — no real game names. */
export function HowItWorksDemo() {
  const [stage, setStage] = useState(0);
  const reduced =
    typeof window !== "undefined" &&
    (document.documentElement.classList.contains("reduced-motion") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setStage((s) => (s + 1) % 3), 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-sm)]">
      <div className="relative mx-auto h-44 max-w-sm overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] p-4">
        {stage === 0 && (
          <div className="flex h-full flex-col justify-center gap-2 animate-[pp-fade-in_280ms_ease-out]">
            <div className="flex gap-2 overflow-hidden">
              {["All", "Board", "Words", "Sports"].map((c, i) => (
                <span
                  key={c}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    i === 1
                      ? "bg-[var(--accent)] text-[var(--on-accent)]"
                      : "bg-[var(--surface-solid)] text-[var(--fg-muted)] border border-[var(--border)]"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-[12px] border border-[var(--border)] bg-[var(--surface-solid)]"
                  style={{ opacity: 0.5 + i * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}

        {stage === 1 && (
          <div className="flex h-full flex-col justify-end animate-[pp-fade-in_280ms_ease-out]">
            <div className="rounded-t-[18px] border border-[var(--border)] bg-[var(--surface-solid)] p-3 shadow-[var(--shadow-md)]">
              <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[var(--border-strong)]" />
              <div className="mb-2 h-3 w-24 rounded bg-[var(--bg-elevated)]" />
              <div className="mb-2 flex gap-1">
                {["Easy", "Medium", "Hard"].map((d, i) => (
                  <span
                    key={d}
                    className={`flex-1 rounded-[10px] py-1.5 text-center text-[10px] font-medium ${
                      i === 1
                        ? "bg-[var(--accent)] text-[var(--on-accent)]"
                        : "bg-[var(--bg-elevated)] text-[var(--fg-muted)]"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="h-8 rounded-[10px] bg-[var(--accent)]" />
            </div>
          </div>
        )}

        {stage === 2 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 animate-[pp-fade-in_280ms_ease-out]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] shadow-[var(--shadow-sm)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="var(--on-accent)" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="h-2 w-28 rounded-full bg-[var(--border)]" />
            <div className="h-16 w-full max-w-[180px] rounded-[14px] border border-[var(--border)] bg-[var(--surface-solid)]" />
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {STAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Step ${i + 1}`}
            onClick={() => setStage(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === stage ? "w-5 bg-[var(--accent)]" : "w-1.5 bg-[var(--border-strong)]"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-[var(--fg)]">{STAGES[stage]!.title}</p>
        <p className="mt-1 text-sm text-[var(--fg-muted)] leading-relaxed">{STAGES[stage]!.body}</p>
      </div>
    </div>
  );
}
