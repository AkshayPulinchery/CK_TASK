"use client";

import { useSyncExternalStore } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The date never changes while the page is open, so there is nothing to
// subscribe to — we only need a browser snapshot that differs from the
// server snapshot (the server cannot know the visitor's timezone).
const subscribe = () => () => {};

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

/**
 * "Page Last Updated: 23 Oct 2026".
 *
 * The date is resolved from a client store snapshot after hydration so the
 * server and client markup always agree. A placeholder dash is rendered until
 * the browser snapshot is available.
 */
export default function LastUpdated({
  className = "",
  label = "Page Last Updated",
}: {
  className?: string;
  label?: string;
}) {
  const iso = useSyncExternalStore(subscribe, todayIso, () => "");
  const [year, month, day] = iso.split("-");

  return (
    <span className={className}>
      {label}:{" "}
      <time dateTime={iso || undefined} suppressHydrationWarning>
        {iso ? `${day} ${MONTHS[Number(month) - 1]} ${year}` : "—"}
      </time>
    </span>
  );
}
