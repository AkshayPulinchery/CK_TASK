"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { NODAL_OFFICERS, type NodalOfficer } from "@/lib/portal-data";
import { Icon } from "@/components/icons";

const ZONES = ["All", "North", "Central", "South", "West"] as const;

const ZONE_LABEL: Record<string, string> = {
  North: "North",
  Central: "Central",
  South: "South",
  West: "West",
};

function OfficerCard({ officer }: { officer: NodalOfficer }) {
  return (
    <article className="card-gov card-hover flex flex-col p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--gov-navy)] text-[11px] font-extrabold text-[var(--gov-gold)]">
          {officer.district.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h3 className="text-[13px] font-extrabold text-[var(--gov-heading)]">{officer.district}</h3>
          <p className="text-[10.5px] font-semibold text-[var(--gov-muted)]">{officer.designation}</p>
          <p className="mt-0.5 text-[10px] text-[var(--gov-muted)]">{officer.department}</p>
        </div>
        <span className="badge badge-navy ml-auto shrink-0">{ZONE_LABEL[officer.zone]}</span>
      </div>

      <dl className="mt-3 space-y-1.5 border-t border-[var(--gov-border)] pt-2.5">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Telephone</dt>
          <Icon name="phone" size={12} className="shrink-0 text-[var(--gov-link)]" />
          <dd>
            <a
              href={`tel:${officer.phone.replace(/\s/g, "")}`}
              className="text-[11.5px] font-semibold text-[var(--gov-heading)] hover:underline"
            >
              {officer.phone}
            </a>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Email</dt>
          <Icon name="mail" size={12} className="shrink-0 text-[var(--gov-link)]" />
          <dd className="min-w-0">
            <a
              href={`mailto:${officer.email}`}
              className="block truncate text-[11px] font-semibold text-[var(--gov-muted)] hover:text-[var(--gov-heading)] hover:underline"
            >
              {officer.email}
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default function OfficersDirectory() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<(typeof ZONES)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NODAL_OFFICERS.filter((officer) => {
      const matchesZone = zone === "All" || officer.zone === zone;
      const matchesQuery =
        !q ||
        officer.district.toLowerCase().includes(q) ||
        officer.department.toLowerCase().includes(q) ||
        officer.designation.toLowerCase().includes(q);
      return matchesZone && matchesQuery;
    });
  }, [query, zone]);

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
              placeholder="Search by district, office or designation"
              aria-label="Search the nodal officer directory"
              className="input-gov pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by zone">
            {ZONES.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={zone === item}
                onClick={() => setZone(item)}
                className={`rounded px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                  zone === item
                    ? "bg-[var(--gov-navy)] text-white"
                    : "border border-[var(--gov-border)] bg-[var(--gov-card)] text-[var(--gov-muted)] hover:border-[var(--gov-emerald)] hover:text-[var(--gov-link)]"
                }`}
              >
                {item === "All" ? "All zones" : item}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2.5 border-t border-[var(--gov-border)] pt-2 text-[10.5px] font-semibold text-[var(--gov-muted)]">
          {filtered.length} of {NODAL_OFFICERS.length} district officers shown
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card-gov px-6 py-14 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
            <Icon name="users" size={22} />
          </span>
          <h2 className="text-base font-extrabold text-[var(--gov-heading)]">No officer matched</h2>
          <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-[var(--gov-muted)]">
            Try a different district name or select “All zones”. For urgent non-emergency help call the
            state desk on 1100.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setZone("All");
            }}
            className="btn btn-outline btn-sm mt-4"
          >
            <Icon name="refresh" size={12} />
            {t("ch.reset")}
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((officer) => (
            <OfficerCard key={officer.district} officer={officer} />
          ))}
        </div>
      )}

      <p className="flex items-start gap-1.5 rounded border border-[var(--gov-gold)]/40 bg-[var(--gov-gold-soft)]/50 p-3 text-[10.5px] leading-relaxed text-[var(--gov-gold-ink)]">
        <Icon name="info" size={12} className="mt-[1px] shrink-0" />
        This directory is a demonstration listing prepared for the CivicForce TN prototype. Telephone
        numbers and email addresses are illustrative and must be verified against the notified
        departmental directory before use. For urgent non-emergency help call the state desk on 1100 or
        the women&apos;s helpline on 1913.
      </p>
    </div>
  );
}
