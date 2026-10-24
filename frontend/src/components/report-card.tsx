"use client";

import Link from "next/link";
import { formatDateTime, type Report } from "@/lib/data";
import { useI18n } from "@/components/language-provider";
import { categoryKey, statusKey } from "@/lib/i18n";
import { Icon } from "@/components/icons";

const STATUS_STYLES: Record<string, string> = {
  New: "badge-navy",
  "Under review": "badge-warn",
  Assigned: "badge-gold",
  "In progress": "badge-warn",
  Resolved: "badge-emerald",
};

const STATUS_BAR: Record<string, string> = {
  New: "#1b365d",
  "Under review": "#b8952b",
  Assigned: "#d4af37",
  "In progress": "#c47a2b",
  Resolved: "#006a4e",
};

export default function ReportCard({ report }: { report: Report }) {
  const { t } = useI18n();

  return (
    <Link
      href={`/challenges/${report.id}`}
      className="card-gov card-hover group relative block overflow-hidden p-4"
    >
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: STATUS_BAR[report.status] ?? "#94a3b8" }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`badge ${STATUS_STYLES[report.status] ?? "badge-navy"}`}>
            {t(statusKey(report.status)) || report.status}
          </span>
          {report.urgency === "High" && (
            <span className="badge badge-danger">
              <Icon name="alertTriangle" size={10} />
              {t("urg.high")}
            </span>
          )}
          <span className="rounded-[2px] border border-[var(--gov-border)] bg-[var(--gov-slate)] px-1.5 py-0.5 text-[9px] font-extrabold tracking-[0.04em] text-[var(--gov-muted)]">
            {report.id}
          </span>
        </div>
        <Icon
          name="arrowRight"
          size={14}
          className="shrink-0 text-[var(--gov-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--gov-link)]"
        />
      </div>

      <h3 className="mt-2 line-clamp-2 text-[13px] font-extrabold leading-snug text-[var(--gov-heading)] transition-colors group-hover:text-[var(--gov-link)]">
        {report.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--gov-muted)]">
        {report.description}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--gov-muted)]">
        <span className="flex items-center gap-1 font-semibold">
          <Icon name="mapPin" size={11} className="shrink-0" />
          {report.district}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="grid" size={10} className="shrink-0" />
          {t(categoryKey(report.category)) || report.category}
        </span>
        <span className="ml-auto flex items-center gap-1 whitespace-nowrap text-[9.5px] text-[var(--gov-muted)]">
          <Icon name="clock" size={10} className="shrink-0" />
          {formatDateTime(report.created_at)}
        </span>
      </div>

      {report.partner && (
        <p className="mt-2 truncate border-t border-dashed border-[var(--gov-border)] pt-1.5 text-[9.5px] font-semibold text-[var(--gov-muted)]">
          <span className="text-[var(--gov-muted)]">Assigned: </span>
          {report.partner}
        </p>
      )}
    </Link>
  );
}
