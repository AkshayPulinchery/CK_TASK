"use client";

import Link from "next/link";
import { useReports } from "@/components/providers";
import ReportCard from "@/components/report-card";
import { useI18n } from "@/components/language-provider";
import { ReportCardSkeleton } from "@/components/portal/skeleton";
import { Icon } from "@/components/icons";

export default function RecentReports() {
  const { reports, loading } = useReports();
  const { t } = useI18n();
  const recent = reports.slice(0, 6);

  return (
    <section aria-labelledby="recent-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{t("home.recent.eyebrow")}</p>
          <h2 id="recent-title" className="section-title mt-1">
            {t("home.recent.h2")}
          </h2>
          <span className="title-rule" aria-hidden="true" />
        </div>
        <Link
          href="/challenges"
          className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[var(--gov-link)] hover:underline"
        >
          {t("home.recent.viewAll")}
          <Icon name="arrowRight" size={13} />
        </Link>
      </div>

      {loading && reports.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="card-gov flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
            <Icon name="fileText" size={20} />
          </span>
          <p className="text-sm font-extrabold text-[var(--gov-heading)]">{t("home.recent.empty")}</p>
          <p className="max-w-sm text-[11.5px] text-[var(--gov-muted)]">{t("home.recent.emptyHint")}</p>
          <Link href="/report" className="btn btn-primary btn-sm mt-2">
            <Icon name="megaphone" size={13} />
            {t("home.ctaReport")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}
