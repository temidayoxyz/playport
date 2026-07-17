import { Link } from "react-router-dom";

export function Logo({ compact = false, to = "/" }: { compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5 no-underline" aria-label="PlayPort home">
      <span
        className="relative flex h-9 w-9 items-center justify-center rounded-[12px] shadow-[var(--shadow-sm)]"
        style={{ background: "var(--accent)" }}
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          {/* Launch gate mark */}
          <rect x="7" y="8" width="18" height="16" rx="4" fill="none" stroke="#171A10" strokeWidth="2.2" />
          <circle cx="16" cy="16" r="3.2" fill="#171A10" />
          <path d="M16 10v2.5M16 19.5V22M10 16h2.5M19.5 16H22" stroke="#171A10" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">PlayPort</span>
      )}
    </Link>
  );
}
