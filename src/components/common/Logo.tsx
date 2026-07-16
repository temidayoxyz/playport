import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5 no-underline" aria-label="PlayPort home">
      <span
        className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]"
        style={{ background: "var(--accent)" }}
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path d="M8 6h9c4.5 0 7.5 2.8 7.5 7S21.5 20 17 20h-4v6H8V6z" fill="#0a0a0a" />
          <path d="M22 22l6-3.5L22 15v7z" fill="#0a0a0a" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">
          PlayPort
        </span>
      )}
    </Link>
  );
}
