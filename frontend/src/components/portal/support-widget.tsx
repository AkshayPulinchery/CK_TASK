"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { EMERGENCY_NUMBERS } from "@/lib/portal-data";

/** Floating citizen-support widget: emergency numbers and live desk hours. */
export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="support-widget fixed bottom-5 right-5 z-[65]">
      <div
        id="support-panel"
        role="dialog"
        aria-label="Citizen support"
        aria-hidden={!open}
        className={`absolute bottom-[4.2rem] right-0 w-[min(20rem,calc(100vw-2.5rem))] origin-bottom-right overflow-hidden rounded-lg border border-[var(--gov-border)] bg-[var(--gov-card)] shadow-2xl transition-all duration-200 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="bg-[var(--gov-navy)] px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Icon name="headset" size={17} />
            <p className="text-sm font-extrabold">Citizen Support Desk</p>
          </div>
          <p className="mt-0.5 text-[11px] text-white/70">
            Monday–Saturday, 9:30 AM – 6:00 PM IST
          </p>
        </div>

        <div className="divide-y divide-[var(--gov-border)]">
          {EMERGENCY_NUMBERS.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--gov-slate)]"
            >
              <span className="min-w-0">
                <span className="block text-[12px] font-bold text-[var(--gov-heading)]">
                  {item.label}
                </span>
                <span className="block text-[10.5px] text-[var(--gov-muted)]">{item.note}</span>
              </span>
              <span className="flex items-center gap-1.5 rounded bg-[var(--gov-emerald-soft)] px-2 py-1 text-[13px] font-extrabold tabular-nums text-[var(--gov-link)]">
                <Icon name="phone" size={13} />
                {item.number}
              </span>
            </a>
          ))}
        </div>

        <div className="space-y-1.5 bg-[var(--gov-slate)] p-3">
          <Link
            href="/officers"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 rounded border border-[var(--gov-border)] bg-[var(--gov-card)] px-3 py-2 text-[12px] font-bold text-[var(--gov-heading)] transition-colors hover:border-[var(--gov-emerald)]"
          >
            <span className="flex items-center gap-2">
              <Icon name="users" size={14} /> District nodal officers
            </span>
            <Icon name="chevronRight" size={14} />
          </Link>
          <Link
            href="/report"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 rounded border border-[var(--gov-border)] bg-[var(--gov-card)] px-3 py-2 text-[12px] font-bold text-[var(--gov-heading)] transition-colors hover:border-[var(--gov-emerald)]"
          >
            <span className="flex items-center gap-2">
              <Icon name="message" size={14} /> File a civic grievance
            </span>
            <Icon name="chevronRight" size={14} />
          </Link>
          <p className="px-1 pt-1 text-[10px] leading-snug text-[var(--gov-muted)]">
            For emergencies always dial 112. This desk handles non-emergency civic grievances.
          </p>
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="support-panel"
        className="flex items-center gap-2 rounded-full bg-[var(--gov-navy)] px-4 py-3 text-[12px] font-extrabold text-white shadow-xl transition-all hover:bg-[var(--gov-navy-deep)] hover:shadow-2xl"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <Icon name={open ? "close" : "headset"} size={18} />
          {!open && (
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[var(--gov-gold)] live-dot" />
          )}
        </span>
        <span className="hidden sm:inline">{open ? "Close" : "Emergency Desk"}</span>
        <span className="sm:hidden">{open ? "Close" : "Help"}</span>
      </button>
    </div>
  );
}
