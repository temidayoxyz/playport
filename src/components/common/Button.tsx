import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:brightness-110 shadow-[var(--shadow-card)]",
  secondary: "surface hover:bg-[var(--bg-muted)]",
  ghost: "bg-transparent hover:bg-[var(--bg-muted)]",
  danger: "bg-red-500/15 text-red-600 dark:text-red-300 hover:bg-red-500/25",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  to?: string;
  children: ReactNode;
}

export function Button({ variant = "primary", to, className = "", children, ...rest }: Props) {
  const cls = `inline-flex touch-target items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
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
