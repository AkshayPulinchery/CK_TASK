"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { CIRCULARS, formatGovDate, type Circular } from "@/lib/portal-data";
import { downloadCircular } from "@/lib/document-download";
import { Icon } from "@/components/icons";

const KINDS = ["All", "Circular", "Notification", "Press Release", "Order"] as const;

const KIND_STYLES: Record<Circular["kind"], string> = {
  Circular: "badge-emerald",
  Notification: "badge-gold",
  "Press Release": "badge-navy",
  Order: "badge-warn",
};

export default function CircularsArchive() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CIRCULARS.filter((item) => {
      const matchesKind = kind === "All" || item.kind === kind;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.number.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q);
      return matchesKind && matchesQuery;
    });
  }, [query, kind]);

  return (
    <div className="space-y-4">
      <div className="card-gov p-3.5 sm:p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 grid w-9 place-items-center text-[var(--gov-muted)]">
              <Icon name="search" size={15} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by number, title or department"
              aria-label="Search circulars"
              className="input-gov pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by document type">
            {KINDS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={kind === item}
                onClick={() => setKind(item)}
                className={`rounded px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                  kind === item
                    ? "bg-[var(--gov-navy)] text-white"
                    : "border border-[var(--gov-border)] bg-[var(--gov-card)] text-[var(--gov-muted)] hover:border-[var(--gov-emerald)] hover:text-[var(--gov-link)]"
                }`}
              >
                {item === "All" ? "All documents" : item}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2.5 border-t border-[var(--gov-border)] pt-2 text-[10.5px] font-semibold text-[var(--gov-muted)]">
          {filtered.length} of {CIRCULARS.length} documents
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card-gov px-6 py-14 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
            <Icon name="newspaper" size={22} />
          </span>
          <h2 className="text-base font-extrabold text-[var(--gov-heading)]">No document matched</h2>
          <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-[var(--gov-muted)]">
            Try a different keyword or document type.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setKind("All");
            }}
            className="btn btn-outline btn-sm mt-4"
          >
            <Icon name="refresh" size={12} />
            {t("ch.reset")}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <article key={item.id} className="card-gov card-hover p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-11 shrink-0 place-content-center rounded border border-[var(--gov-border)] bg-[var(--gov-card)] text-center shadow-sm">
                  <span className="text-[16px] font-extrabold leading-none tabular-nums text-[var(--gov-heading)]">
                    {formatGovDate(item.date).split(" ")[0]}
                  </span>
                  <span className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                    {formatGovDate(item.date).split(" ")[1]}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`badge ${KIND_STYLES[item.kind]}`}>{item.kind}</span>
                    <span className="text-[10px] font-bold text-[var(--gov-muted)]">{item.number}</span>
                    <span className="text-[10px] text-[var(--gov-muted)]">· {formatGovDate(item.date)}</span>
                  </div>
                  <h2 className="mt-1 text-[13.5px] font-extrabold leading-snug text-[var(--gov-heading)]">
                    {item.title}
                  </h2>
                  <p className="mt-1 max-w-3xl text-[11.5px] leading-relaxed text-[var(--gov-muted)]">
                    {item.summary}
                  </p>
                  <p className="mt-1.5 text-[10px] font-semibold text-[var(--gov-muted)]">{item.department}</p>
                </div>

                <button
                  type="button"
                  onClick={() => downloadCircular(item)}
                  className="btn btn-outline btn-sm shrink-0"
                  aria-label={`Download ${item.number}`}
                >
                  <Icon name="download" size={12} />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="flex items-start gap-1.5 rounded border border-[var(--gov-gold)]/40 bg-[var(--gov-gold-soft)]/50 p-3 text-[10.5px] leading-relaxed text-[var(--gov-gold-ink)]">
        <Icon name="info" size={12} className="mt-[1px] shrink-0" />
        {t("circ.note")} Certified copies are issued by the concerned department. Downloads are generated
        on this device as plain-text documents.
      </p>
    </div>
  );
}
