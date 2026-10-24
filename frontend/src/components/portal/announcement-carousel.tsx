"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ANNOUNCEMENTS } from "@/lib/portal-data";

/** Auto-rotating official announcements with manual controls. */
export default function AnnouncementCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 7000);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [paused]);

  const go = (next: number) => {
    setIndex((next + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[index];

  return (
    <div
      role="region"
      aria-label="Official announcements"
      className="rounded-md border border-[var(--gov-border)] bg-[var(--gov-card)] p-4 shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--gov-link)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--gov-emerald)] opacity-70 live-dot" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--gov-emerald)]" />
          </span>
          Announcements
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous announcement"
            className="grid h-6 w-6 place-items-center rounded border border-[var(--gov-border)] text-[var(--gov-muted)] transition-colors hover:border-[var(--gov-emerald)] hover:text-[var(--gov-link)]"
          >
            <Icon name="chevronLeft" size={12} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next announcement"
            className="grid h-6 w-6 place-items-center rounded border border-[var(--gov-border)] text-[var(--gov-muted)] transition-colors hover:border-[var(--gov-emerald)] hover:text-[var(--gov-link)]"
          >
            <Icon name="chevronRight" size={12} />
          </button>
        </div>
      </div>

      <div aria-live="polite" className="min-h-[3.6rem]">
        <p key={index} className="fade-up text-[12.5px] font-semibold leading-relaxed text-[var(--gov-ink)]">
          {current.text}
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-[var(--gov-border)] pt-2.5">
        <div className="flex items-center gap-1" role="tablist" aria-label="Announcement slides">
          {ANNOUNCEMENTS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Announcement ${i + 1} of ${ANNOUNCEMENTS.length}`}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-[var(--gov-gold)]" : "w-1.5 bg-[var(--gov-border)] hover:bg-[var(--gov-muted)]"
              }`}
            />
          ))}
        </div>
        <Link
          href={current.href}
          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[var(--gov-link)] hover:underline"
        >
          Read more
          <Icon name="arrowRight" size={12} />
        </Link>
      </div>
    </div>
  );
}
