import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2 no-underline" aria-label="PlayPort home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-violet shadow-[var(--shadow-card)]">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path d="M8 6h10c5 0 8 3.2 8 7.5S23 21 18 21h-5v5H8V6z" fill="#0b1220" opacity="0.35" />
          <path d="M8 6h9c4.5 0 7.5 2.8 7.5 7S21.5 20 17 20h-4v6H8V6z" fill="white" />
          <path d="M22 22l6-3.5L22 15v7z" fill="#84cc16" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
          PlayPort
        </span>
      )}
    </Link>
  );
}
