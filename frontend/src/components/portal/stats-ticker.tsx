"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { useReports } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { Skeleton } from "@/components/portal/skeleton";

function indianNumber(n: number): string {
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
}

type Kpi = {
  key: string;
  label: string;
  value: number;
  icon: IconName;
  tone: "navy" | "emerald" | "gold" | "slate";
  sub: string;
};

export default function StatsTicker() {
  const { reports, loading } = useReports();
  const { t } = useI18n();

  const stats = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const inProgress = reports.filter((r) =>
      ["In progress", "Assigned", "Under review"].includes(r.status)
    ).length;
    const departments = new Set(
      reports.map((r) => r.partner).filter((p): p is string => Boolean(p))
    );
    const activeDepartments = departments.size;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, resolved, inProgress, activeDepartments, rate };
  }, [reports]);

  const kpis: Kpi[] = [
    {
      key: "total",
      label: t("stats.total"),
      value: stats.total,
      icon: "fileText",
      tone: "navy",
      sub: t("stats.totalSub"),
    },
    {
      key: "resolved",
      label: t("stats.resolved"),
      value: stats.resolved,
      icon: "checkCircle",
      tone: "emerald",
      sub: `${stats.rate}% ${t("stats.rate")}`,
    },
    {
      key: "progress",
      label: t("stats.inProgress"),
      value: stats.inProgress,
      icon: "clock",
      tone: "gold",
      sub: t("stats.inProgressSub"),
    },
    {
      key: "departments",
      label: t("stats.departments"),
      value: stats.activeDepartments,
      icon: "building",
      tone: "slate",
      sub: t("stats.departmentsSub"),
    },
  ];

  const tickerItems = useMemo(() => {
    const recent = reports.slice(0, 8);
    if (recent.length === 0) {
      return [
        `${t("stats.live")} · ${t("stats.awaiting")}`,
        `${t("stats.live")} · ${t("stats.awaiting")}`,
      ];
    }
    return recent.map((r) => `${r.id}  ·  ${r.status}  ·  ${r.district}`);
  }, [reports, t]);

  return (
    <section aria-label={t("stats.region")} className="relative z-10 -mt-10 px-3 sm:-mt-12 sm:px-6 lg:px-10">
      <div className="card-gov overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-y divide-[var(--gov-border)] lg:grid-cols-4 lg:divide-y-0">
          {kpis.map((kpi) => (
            <div key={kpi.key} className="flex items-start gap-3 p-4 sm:p-5">
              <span
                className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded ${
                  kpi.tone === "emerald"
                    ? "bg-[var(--gov-emerald-soft)] text-[var(--gov-link)]"
                    : kpi.tone === "gold"
                      ? "bg-[var(--gov-gold-soft)] text-[var(--gov-gold-text)]"
                      : kpi.tone === "slate"
                        ? "bg-[var(--gov-slate)] text-[var(--gov-heading)]"
                        : "bg-[var(--gov-slate)] text-[var(--gov-heading)]"
                }`}
              >
                <Icon name={kpi.icon} size={17} />
              </span>
              <div className="min-w-0">
                {loading ? (
                  <Skeleton className="mb-1.5 mt-1 h-6 w-14" />
                ) : (
                  <p className="text-[22px] font-extrabold leading-none tabular-nums text-[var(--gov-heading)] sm:text-2xl">
                    {indianNumber(kpi.value)}
                  </p>
                )}
                <p className="mt-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--gov-ink)]">
                  {kpi.label}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-[var(--gov-muted)]">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--gov-border)] bg-[var(--gov-navy)] px-4 py-2 text-white">
          <span className="flex shrink-0 items-center gap-1.5 rounded bg-[#b3261e] px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.12em]">
            <span className="h-1 w-1 rounded-full bg-white live-dot" />
            {t("stats.live")}
          </span>
          <div className="relative min-w-0 flex-1 overflow-hidden" aria-hidden="true">
            <div className="ticker-track gap-8 whitespace-nowrap">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="text-[10.5px] font-medium text-white/65">
                  {item}
                  <span className="ml-8 text-[var(--gov-gold)]">◆</span>
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/challenges"
            className="hidden shrink-0 items-center gap-1 text-[10.5px] font-bold text-white/80 hover:text-white sm:flex"
          >
            {t("stats.viewAll")}
            <Icon name="arrowRight" size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
