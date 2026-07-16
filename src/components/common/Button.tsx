import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "on-yellow";

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--on-accent)] active:bg-[var(--accent-active)] border border-transparent",
  secondary:
    "bg-[var(--bg-elevated)] text-[var(--fg)] border border-[var(--border)] active:bg-[var(--bg-muted)]",
  ghost: "bg-transparent text-[var(--fg)] border border-transparent active:bg-[var(--bg-muted)]",
  danger:
    "bg-transparent text-[var(--color-accent-rose)] border border-[var(--border)] active:bg-[var(--bg-muted)]",
  "on-yellow":
    "bg-[var(--bg)] text-[var(--fg)] border border-transparent active:opacity-90",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  to?: string;
  children: ReactNode;
}

export function Button({ variant = "primary", to, className = "", children, ...rest }: Props) {
  const cls = [
    "inline-flex items-center justify-center gap-2",
    "h-10 min-h-10 px-5",
    "rounded-[var(--radius-md)]",
    "text-sm font-semibold leading-none",
    "transition-none",
    "disabled:opacity-40 disabled:pointer-events-none",
    styles[variant],
    className,
  ].join(" ");

  if (to) {
    const { onClick } = rest;
    return (
      <Link
        to={to}
        className={cls}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
