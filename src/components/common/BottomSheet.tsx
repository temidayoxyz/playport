import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon, Icons } from "@/components/common/Icon";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Force center modal even on mobile */
  centered?: boolean;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, centered, className = "" }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
  const useCenter = centered || isDesktop;

  return createPortal(
    <>
      <button
        type="button"
        className="pp-sheet-backdrop border-0 p-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`pp-sheet ${useCenter ? "pp-sheet-center" : "pp-sheet-bottom"} flex flex-col overflow-hidden ${className}`}
      >
        {!useCenter && <div className="pp-sheet-handle" aria-hidden />}
        {title && (
          <div className="flex items-center justify-between gap-3 px-5 pt-3 pb-2">
            <h2 id={titleId} className="pp-title-lg">
              {title}
            </h2>
            <button type="button" className="pp-icon-btn" aria-label="Close" onClick={onClose}>
              <Icon icon={Icons.X} size="md" />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
      </div>
    </>,
    document.body,
  );
}
