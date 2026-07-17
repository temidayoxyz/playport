import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--on-accent)] active:bg-[var(--accent-active)] border border-transparent shadow-[var(--shadow-sm)]",
  secondary:
    "bg-[var(--surface-solid)] text-[var(--fg)] border border-[var(--border)] active:bg-[var(--bg-elevated)]",
  ghost: "bg-transparent text-[var(--fg)] border border-transparent active:bg-[var(--bg-elevated)]",
  danger:
    "bg-transparent text-[var(--error)] border border-[var(--border)] active:bg-[var(--bg-elevated)]",
  soft: "bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface-solid))] text-[var(--fg)] border border-transparent active:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-10 min-h-10 px-4 text-sm rounded-[var(--radius-sm)]",
  md: "h-11 min-h-11 px-5 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 min-h-12 px-6 text-[15px] rounded-[var(--radius-md)]",
  icon: "h-11 w-11 min-h-11 min-w-11 p-0 rounded-[var(--radius-md)]",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  to,
  className = "",
  children,
  ...rest
}: Props) {
  const cls = [
    "inline-flex items-center justify-center gap-2",
    "font-semibold leading-none",
    "transition-[transform,background,opacity] duration-150 ease-out",
    "active:scale-[0.97]",
    "disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100",
    variants[variant],
    sizes[size],
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
