"use client";

import { useCallback, useEffect, useId, useRef, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Accessible confirmation dialog for destructive actions. Traps focus,
 * closes on Escape, restores focus to the trigger and locks page scroll.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the safe action (cancel) first.
    const t = window.setTimeout(() => cancelRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!busy) onCancel();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [busy, onCancel]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 cursor-default bg-[rgba(10,30,49,0.62)] backdrop-blur-[2px]"
        onClick={() => !busy && onCancel()}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="card-gov relative w-full max-w-md overflow-hidden rounded-lg shadow-2xl fade-up"
      >
        <div className="flex items-start gap-3 border-b border-[var(--gov-border)] p-5">
          <span
            className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${
              tone === "danger"
                ? "bg-[var(--gov-danger-soft)] text-[var(--gov-danger)]"
                : "bg-[var(--gov-emerald-soft)] text-[var(--gov-link)]"
            }`}
          >
            <Icon name={tone === "danger" ? "alertTriangle" : "info"} size={18} />
          </span>
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-extrabold text-[var(--gov-heading)]">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-[13px] leading-relaxed text-[var(--gov-muted)]">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 bg-[var(--gov-slate)] p-4 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${tone === "danger" ? "btn-navy" : "btn-primary"}`}
            style={tone === "danger" ? { background: "var(--gov-danger)" } : undefined}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
