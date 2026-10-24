"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useReports } from "@/components/providers";
import ReportCard from "@/components/report-card";
import { useI18n } from "@/components/language-provider";
import { categoryKey, statusKey } from "@/lib/i18n";
import {
  CATEGORY_FILTER_OPTIONS,
  DISTRICT_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@/lib/data";
import { Icon } from "@/components/icons";
import { ReportCardSkeleton } from "@/components/portal/skeleton";

const subscribeToUrl = () => () => {};

function readUrlSearch(): string {
  return window.location.search;
}

function readServerSearch(): string {
  return "";
}

function pickFilter(value: string | null, options: string[]): string | null {
  return value && options.includes(value) ? value : null;
}

export default function ChallengeBrowser() {
  const { reports, loading } = useReports();
  const { t, tFill } = useI18n();

  // Deep links such as /challenges?category=Roads pre-select a filter. The URL
  // is treated as an external store: the server snapshot is empty, so the
  // first client render matches the prerendered HTML, and React re-reads the
  // query after hydration without a setState-in-effect cascade.
  const urlSearch = useSyncExternalStore(subscribeToUrl, readUrlSearch, readServerSearch);
  const params = useMemo(() => new URLSearchParams(urlSearch), [urlSearch]);

  const [search, setSearch] = useState("");
  const [districtChoice, setDistrict] = useState<string | null>(null);
  const [categoryChoice, setCategory] = useState<string | null>(null);
  const [statusChoice, setStatus] = useState<string | null>(null);

  const district =
    districtChoice ?? pickFilter(params.get("district"), DISTRICT_FILTER_OPTIONS) ?? "All";
  const category =
    categoryChoice ?? pickFilter(params.get("category"), CATEGORY_FILTER_OPTIONS) ?? "All";
  const status = statusChoice ?? pickFilter(params.get("status"), STATUS_FILTER_OPTIONS) ?? "All";

  const q = search.trim().toLowerCase();
  const filtered = reports.filter((r) => {
    const matchesQ =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.landmark !== null && r.landmark.toLowerCase().includes(q));
    const matchesDist = district === "All" || r.district === district;
    const matchesCat = category === "All" || r.category === category;
    const matchesStat = status === "All" || r.status === status;
    return matchesQ && matchesDist && matchesCat && matchesStat;
  });

  const activeFilters =
    (district !== "All" ? 1 : 0) +
    (category !== "All" ? 1 : 0) +
    (status !== "All" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setDistrict("All");
    setCategory("All");
    setStatus("All");
  };

  const isBootstrapping = loading && reports.length === 0;

  return (
    <div className="space-y-4">
      <div className="card-gov p-3.5 sm:p-4">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 grid w-9 place-items-center text-[var(--gov-muted)]">
              <Icon name="search" size={15} />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("ch.searchPh")}
              aria-label={t("ch.searchAria")}
              className="input-gov pl-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-auto">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              aria-label={t("ch.allDistricts")}
              className="select-gov lg:w-[150px]"
            >
              {DISTRICT_FILTER_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? t("ch.allDistricts") : d}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label={t("ch.allCategories")}
              className="select-gov lg:w-[160px]"
            >
              {CATEGORY_FILTER_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? t("ch.allCategories") : t(categoryKey(c)) || c}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label={t("ch.allStatuses")}
              className="select-gov lg:w-[140px]"
            >
              {STATUS_FILTER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? t("ch.allStatuses") : t(statusKey(s)) || s}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={activeFilters === 0}
            className="btn btn-outline btn-sm shrink-0"
          >
            <Icon name="refresh" size={12} />
            {t("ch.reset")}
            {activeFilters > 0 && (
              <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--gov-navy)] px-1 text-[9px] font-extrabold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--gov-border)] pt-2">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[var(--gov-muted)]">
            <span className="live-dot" aria-hidden="true" />
            {t("ch.live")} · {tFill("ch.showing", { n: filtered.length, total: reports.length })}
          </p>
          <p className="text-[10px] text-[var(--gov-muted)]">{t("home.recent.p")}</p>
        </div>
      </div>

      {isBootstrapping ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-gov px-6 py-14 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
            <Icon name="fileText" size={22} />
          </span>
          <h2 className="text-base font-extrabold text-[var(--gov-heading)]">{t("ch.empty")}</h2>
          <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-[var(--gov-muted)]">
            {t("report.f.sidebarPoint1")}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={resetFilters} className="btn btn-outline btn-sm">
              <Icon name="refresh" size={12} />
              {t("ch.reset")}
            </button>
            <Link href="/report" className="btn btn-primary btn-sm">
              <Icon name="plus" size={13} />
              {t("gov.report")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
