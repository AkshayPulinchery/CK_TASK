"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { useReports } from "@/components/providers";
import { PORTAL_PAGES, type SearchEntry } from "@/lib/portal-data";

type Result = {
  title: string;
  description: string;
  href: string;
  group: string;
  icon: IconName;
  meta?: string;
};

/**
 * Global site search. Opens from the header trigger, with `/` or Ctrl/⌘+K,
 * and indexes both the public pages and the live grievance register.
 */
export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { reports } = useReports();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();

    const pages: Result[] = PORTAL_PAGES.filter((page: SearchEntry) => {
      if (!q) return true;
      return (
        page.title.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q) ||
        page.keywords.includes(q)
      );
    })
      .slice(0, q ? 6 : 7)
      .map((page) => ({
        title: page.title,
        description: page.description,
        href: page.href,
        group: page.group,
        icon:
          page.href === "/report"
            ? "megaphone"
            : page.href === "/map"
              ? "mapPin"
              : page.href === "/analytics"
                ? "chart"
                : page.href === "/officers"
                  ? "users"
                  : page.href === "/circulars"
                    ? "newspaper"
                    : "fileText",
      }));

    const matches = reports
      .filter((r) => {
        if (!q) return true;
        return (
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      })
      .slice(0, q ? 6 : 4)
      .map<Result>((r) => ({
        title: r.title,
        description: `${r.id} · ${r.district} · ${r.category}`,
        href: `/challenges/${r.id}`,
        group: "Grievance register",
        icon: "fileText",
        meta: r.status,
      }));

    return [...pages, ...matches];
  }, [query, reports]);

  // Lock background scroll and focus the input while the dialog is open.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  // Global keyboard shortcuts.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (open) return;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onCloseOpen();
        return;
      }
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onCloseOpen();
      }
    };

    function onCloseOpen() {
      // Header owns the state: dispatch a custom event it listens for.
      window.dispatchEvent(new CustomEvent("civicforce:open-search"));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Close from any path (Escape, backdrop, result) and reset the query here,
  // in an event handler rather than an effect.
  const closeModal = useCallback(() => {
    setQuery("");
    setActive(0);
    onClose();
  }, [onClose]);

  const go = useCallback(
    (href: string) => {
      closeModal();
      router.push(href);
    },
    [closeModal, router]
  );

  // Keep the highlight inside the current result list without an effect.
  const current = results.length === 0 ? 0 : Math.min(active, results.length - 1);

  // Keep the active option in view.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelectorAll<HTMLElement>("[data-result]")[current];
    node?.scrollIntoView({ block: "nearest" });
  }, [current, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(results.length ? (current + 1) % results.length : 0);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(results.length ? (current - 1 + results.length) % results.length : 0);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const target = results[current];
      if (target) go(target.href);
    }
  };

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center p-3 pt-[8vh] sm:p-6 sm:pt-[10vh]">
      <button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-[rgba(10,30,49,0.6)] backdrop-blur-[3px]"
        onClick={closeModal}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search CivicForce Tamil Nadu"
        className="card-gov relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg shadow-2xl fade-up"
      >
        <div className="flex items-center gap-3 border-b border-[var(--gov-border)] px-4 py-3">
          <Icon name="search" size={19} className="shrink-0 text-[var(--gov-link)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search grievances, departments, circulars, pages…"
            aria-label="Search the portal"
            aria-controls="site-search-results"
            aria-activedescendant={results[current] ? `search-result-${current}` : undefined}
            autoComplete="off"
            className="h-9 w-full border-0 bg-transparent text-[15px] font-medium text-[var(--gov-ink)] outline-none placeholder:text-[var(--gov-muted)]"
          />
          <kbd className="hidden rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--gov-muted)] sm:inline">
            ESC
          </kbd>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close search"
            className="grid h-7 w-7 place-items-center rounded text-[var(--gov-muted)] hover:bg-[var(--gov-slate)] sm:hidden"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <ul
          id="site-search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="thin-scroll min-h-0 flex-1 overflow-y-auto py-1.5"
        >
          {results.length === 0 && (
            <li className="px-4 py-10 text-center">
              <Icon name="search" size={26} className="mx-auto mb-2 text-[var(--gov-muted)]" />
              <p className="text-sm font-bold text-[var(--gov-heading)]">No matches found</p>
              <p className="mt-1 text-xs text-[var(--gov-muted)]">
                Try a reference ID (TNCR-2048), a district, or a department name.
              </p>
            </li>
          )}

          {results.map((result, index) => {
            const header = result.group !== lastGroup ? result.group : null;
            lastGroup = result.group;
            const selected = index === current;

            return (
              <li key={`${result.group}-${result.href}-${index}`}>
                {header && (
                  <p className="px-4 pb-1 pt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--gov-muted)]">
                    {header}
                  </p>
                )}
                <div
                  id={`search-result-${index}`}
                  data-result
                  role="option"
                  aria-selected={selected}
                  tabIndex={-1}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(result.href)}
                  className={`mx-1.5 flex cursor-pointer items-center gap-3 rounded px-2.5 py-2.5 transition-colors ${
                    selected ? "bg-[var(--gov-emerald-soft)]" : "hover:bg-[var(--gov-slate)]"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded ${
                      selected
                        ? "bg-[var(--gov-emerald)] text-white"
                        : "bg-[var(--gov-slate)] text-[var(--gov-heading)]"
                    }`}
                  >
                    <Icon name={result.icon} size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-[var(--gov-heading)]">
                      {result.title}
                    </span>
                    <span className="block truncate text-[11.5px] text-[var(--gov-muted)]">
                      {result.description}
                    </span>
                  </span>
                  {result.meta && (
                    <span className="badge badge-navy hidden sm:inline-flex">{result.meta}</span>
                  )}
                  <Icon name="arrowRight" size={14} className="shrink-0 text-[var(--gov-muted)]" />
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-2 border-t border-[var(--gov-border)] bg-[var(--gov-slate)] px-4 py-2 text-[10.5px] text-[var(--gov-muted)]">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-[var(--gov-border)] bg-[var(--gov-card)] px-1 py-0.5 font-bold">↑</kbd>
            <kbd className="rounded border border-[var(--gov-border)] bg-[var(--gov-card)] px-1 py-0.5 font-bold">↓</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-[var(--gov-border)] bg-[var(--gov-card)] px-1.5 py-0.5 font-bold">Enter</kbd>
            to open
          </span>
          <span className="hidden sm:inline">Search covers live grievance records</span>
        </div>
      </div>
    </div>
  );
}
