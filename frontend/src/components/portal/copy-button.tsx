"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";

type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  /** Icon-only button (used inside dense table rows). */
  iconOnly?: boolean;
  ariaLabel?: string;
};

/**
 * One-click copy with a "Copied!" tooltip. Falls back to a hidden textarea
 * when the Clipboard API is unavailable (older browsers, insecure origins).
 */
export default function CopyButton({
  value,
  label = "Copy link",
  copiedLabel = "Copied!",
  className = "btn btn-outline btn-sm",
  iconOnly = false,
  ariaLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = value;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        ok = document.execCommand("copy");
        document.body.removeChild(el);
      } catch {
        ok = false;
      }
    }

    if (!ok) return;
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        className={className}
        aria-label={ariaLabel ?? label}
        title={copied ? copiedLabel : label}
      >
        <Icon name={copied ? "check" : "copy"} size={15} />
        {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
      </button>
      <span
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--gov-navy)] px-2 py-1 text-[11px] font-bold text-white shadow-lg transition-all duration-200 ${
          copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {copied ? copiedLabel : ""}
      </span>
    </span>
  );
}
