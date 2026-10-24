"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { useReports } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { Skeleton } from "@/components/portal/skeleton";

const FOCUS_DISTRICTS = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Vellore",
  "Thanjavur",
];

type Row = { district: string; total: number; resolved: number; rate: number };

export default function DistrictIndex() {
  const { reports, loading } = useReports();
  const { t } = useI18n();

  const rows = useMemo<Row[]>(() => {
    const map = new Map<string, { total: number; resolved: number }>();

    for (const name of FOCUS_DISTRICTS) map.set(name, { total: 0, resolved: 0 });

    for (const report of reports) {
      const entry = map.get(report.district) ?? { total: 0, resolved: 0 };
      entry.total += 1;
      if (report.status === "Resolved") entry.resolved += 1;
      map.set(report.district, entry);
    }

    return [...map.entries()]
      .map(([district, value]) => ({
        district,
        total: value.total,
        resolved: value.resolved,
        rate: value.total > 0 ? Math.round((value.resolved / value.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total || a.district.localeCompare(b.district))
      .slice(0, 8);
  }, [reports]);

  const state = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    return {
      total,
      resolved,
      rate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      districts: new Set(reports.map((r) => r.district)).size,
    };
  }, [reports]);

  return (
    <section aria-labelledby="district-index-title" className="flex flex-col">
      <div className="mb-4">
        <p className="eyebrow">{t("district.eyebrow")}</p>
        <h2 id="district-index-title" className="section-title mt-1">
          {t("district.title")}
        </h2>
        <span className="title-rule" aria-hidden="true" />
      </div>

      <div className="card-gov flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--gov-border)] bg-[var(--gov-slate)] px-4 py-2.5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-heading)]">
            {t("district.month")}
          </p>
          <span className="flex items-center gap-1.5 rounded bg-[var(--gov-card)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-link)] shadow-sm">
            <span className="h-1 w-1 rounded-full bg-[var(--gov-emerald)] live-dot" />
            {t("district.live")}
          </span>
        </div>

        <div className="min-h-0 flex-1 p-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 flex-1" />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <caption className="sr-only">
                District-wise grievance resolution index based on the live public register
              </caption>
              <thead>
                <tr className="text-left text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                  <th scope="col" className="pb-2 font-extrabold">
                    {t("district.colDistrict")}
                  </th>
                  <th scope="col" className="pb-2 text-center font-extrabold">
                    {t("district.colReports")}
                  </th>
                  <th scope="col" className="w-[42%] pb-2 font-extrabold">
                    {t("district.colIndex")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.district} className="border-t border-[var(--gov-border)]">
                    <td className="py-2 pr-2">
                      <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--gov-heading)]">
                        <Icon name="mapPin" size={11} className="shrink-0 text-[var(--gov-muted)]" />
                        {row.district}
                      </span>
                    </td>
                    <td className="py-2 text-center text-[11.5px] font-bold tabular-nums text-[var(--gov-ink)]">
                      {row.total}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--gov-slate)]"
                          role="img"
                          aria-label={`${row.district}: ${row.rate}% resolved`}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              row.rate >= 75
                                ? "bg-[var(--gov-emerald)]"
                                : row.rate >= 40
                                  ? "bg-[var(--gov-gold)]"
                                  : "bg-[#c47a6f]"
                            }`}
                            style={{ width: `${row.total === 0 ? 0 : Math.max(row.rate, 3)}%` }}
                          />
                        </div>
                        <span className="w-8 shrink-0 text-right text-[10.5px] font-extrabold tabular-nums text-[var(--gov-ink)]">
                          {row.total === 0 ? "—" : `${row.rate}%`}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-[var(--gov-border)] bg-[var(--gov-slate)] px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10.5px] text-[var(--gov-muted)]">
              {t("district.stateIndex")}{" "}
              <span className="font-extrabold text-[var(--gov-heading)]">{state.rate}%</span>{" "}
              <span className="text-[var(--gov-muted)]">
                ({state.resolved}/{state.total} {t("district.resolved")} · {state.districts}{" "}
                {t("district.districtsActive")})
              </span>
            </p>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-[var(--gov-link)] hover:underline"
            >
              {t("district.fullReport")}
              <Icon name="arrowRight" size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
