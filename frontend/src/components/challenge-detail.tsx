"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReports } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { categoryKey, statusKey } from "@/lib/i18n";
import { getReport as apiGetReport, ApiError } from "@/lib/api";
import { formatDateTime, type Report } from "@/lib/data";
import { Icon } from "@/components/icons";
import CopyButton from "@/components/portal/copy-button";
import { Skeleton } from "@/components/portal/skeleton";

const STATUS_TONES: Record<string, string> = {
  new: "badge-navy",
  "under review": "badge-warn",
  assigned: "badge-warn",
  "in progress": "badge-warn",
  resolved: "badge-emerald",
  rejected: "badge-danger",
};

function statusTone(status: string): string {
  return STATUS_TONES[status.trim().toLowerCase()] ?? "badge-navy";
}

export default function ChallengeDetail({ id }: { id: string }) {
  const { reports } = useReports();
  const { t } = useI18n();
  const inStore = reports.find((r) => r.id === id);

  // A deep link to a report that is not in the (paginated) register is
  // fetched directly, so /challenges/TNCR-2049 always resolves.
  const [fetched, setFetched] = useState<Report | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (inStore) return;
    let cancelled = false;

    apiGetReport(id)
      .then((r) => {
        if (!cancelled) setFetched(r);
      })
      .catch((err) => {
        if (!cancelled) {
          setFetched(null);
          setNotFound(err instanceof ApiError && err.status === 404);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, inStore]);

  const report = inStore ?? fetched;

  // Absolute URL for the copy action. The value is never rendered, so reading
  // the origin during render cannot affect hydration.
  const trackingUrl =
    typeof window === "undefined"
      ? `/challenges/${id}`
      : `${window.location.origin}/challenges/${id}`;

  if (!report) {
    return (
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-4 text-[11px]">
          <Link
            href="/challenges"
            className="inline-flex items-center gap-1 font-semibold text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
          >
            <Icon name="arrowLeft" size={12} />
            {t("detail.back")}
          </Link>
        </nav>

        {notFound ? (
          <div className="card-gov px-6 py-14 text-center">
            <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
              <Icon name="search" size={22} />
            </span>
            <h1 className="text-lg font-extrabold text-[var(--gov-heading)]">
              {t("detail.notFound")} <span className="font-mono">{id}</span>
            </h1>
            <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-[var(--gov-muted)]">
              {t("detail.notFoundP")}
            </p>
            <Link href="/challenges" className="btn btn-primary mt-4">
              {t("detail.back")}
            </Link>
          </div>
        ) : (
          <div className="card-gov p-5 sm:p-8" role="status" aria-label={t("detail.loading")}>
            <Skeleton className="mb-3 h-5 w-40" />
            <Skeleton className="mb-2 h-7 w-4/5" />
            <Skeleton className="mb-6 h-7 w-3/5" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <span className="sr-only">{t("detail.loading")}…</span>
          </div>
        )}
      </div>
    );
  }

  const facts = [
    { icon: "mapPin" as const, label: t("detail.district"), value: report.district },
    {
      icon: "building" as const,
      label: t("detail.location"),
      value: report.landmark || t("detail.noneSpecified"),
    },
    ...(report.lat !== null && report.lng !== null
      ? [
          {
            icon: "mapPin" as const,
            label: t("detail.coords"),
            value: `${report.lat.toFixed(4)}° N, ${report.lng.toFixed(4)}° E`,
          },
        ]
      : []),
    ...(report.pincode
      ? [{ icon: "fileText" as const, label: t("detail.pincode"), value: report.pincode }]
      : []),
    {
      icon: "calendar" as const,
      label: t("detail.submitted"),
      value: formatDateTime(report.created_at),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px]">
        <Link
          href="/"
          className="font-semibold text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
        >
          {t("gov.nav.home")}
        </Link>
        <Icon name="chevronRight" size={10} className="text-[var(--gov-muted)]" />
        <Link
          href="/challenges"
          className="font-semibold text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
        >
          {t("gov.nav.issues")}
        </Link>
        <Icon name="chevronRight" size={10} className="text-[var(--gov-muted)]" />
        <span className="font-mono font-bold text-[var(--gov-heading)]">{report.id}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <article className="card-gov overflow-hidden">
            <div className="h-1 w-full bg-[var(--gov-gold)]" aria-hidden="true" />
            <div className="p-5 sm:p-6">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="badge badge-navy font-mono">{report.id}</span>
                <span className="badge badge-navy">
                  {t(categoryKey(report.category)) || report.category}
                </span>
                <span className={report.urgency === "High" ? "badge badge-danger" : "badge badge-gold"}>
                  {t(report.urgency === "High" ? "urg.high" : "urg.normal")}
                </span>
                <span className={`badge ${statusTone(report.status)}`}>
                  {t(statusKey(report.status)) || report.status}
                </span>
              </div>

              <h1 className="text-xl font-extrabold leading-snug text-[var(--gov-heading)] sm:text-2xl">
                {report.title}
              </h1>

              <div className="no-print mt-4 flex flex-wrap gap-2 border-t border-[var(--gov-border)] pt-3">
                <CopyButton
                  value={trackingUrl}
                  label={t("detail.copy")}
                  className="btn btn-outline btn-sm"
                />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-ghost btn-sm"
                >
                  <Icon name="printer" size={13} />
                  {t("detail.print")}
                </button>
                <Link href="/map" className="btn btn-ghost btn-sm">
                  <Icon name="mapPin" size={13} />
                  {t("detail.mapLink")}
                </Link>
              </div>

              <section className="mt-5">
                <h2 className="eyebrow">{t("detail.description")}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--gov-ink)]">
                  {report.description}
                </p>
              </section>

              <section className="mt-5">
                <div className="overflow-hidden rounded border border-[var(--gov-border)]">
                  <dl className="grid grid-cols-1 gap-px bg-[var(--gov-border)] sm:grid-cols-2">
                    {facts.map((fact) => (
                      <div key={fact.label} className="flex items-start gap-2 bg-[var(--gov-card)] px-3 py-2.5">
                        <Icon
                          name={fact.icon}
                          size={13}
                          className="mt-0.5 shrink-0 text-[var(--gov-link)]"
                        />
                        <div className="min-w-0">
                          <dt className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                            {fact.label}
                          </dt>
                          <dd className="text-[12px] font-semibold text-[var(--gov-heading)]">
                            {fact.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              <section className="mt-5 rounded border border-[var(--gov-emerald)]/30 bg-[var(--gov-emerald-soft)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-[var(--gov-link)]">
                    <Icon name="sparkle" size={13} />
                    {t("detail.ai")}
                  </p>
                  <span className="badge badge-emerald">{t("detail.aiSuggested")}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--gov-link)]">
                  {report.ai_summary}
                </p>
              </section>

              {report.partner && (
                <section className="mt-5 rounded-r border-l-4 border-[var(--gov-navy)] bg-[var(--gov-slate)] px-3.5 py-2.5">
                  <p className="eyebrow">{t("detail.partner")}</p>
                  <p className="text-[13px] font-bold text-[var(--gov-heading)]">{report.partner}</p>
                </section>
              )}
            </div>
          </article>

          <article className="card-gov p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="section-title">{t("detail.timeline")}</h2>
                <p className="mt-1 text-[11px] text-[var(--gov-muted)]">{t("detail.timelineNote")}</p>
              </div>
              <span className="badge badge-navy">{formatDateTime(report.created_at)}</span>
            </div>

            {report.timeline.length === 0 ? (
              <p className="rounded border border-dashed border-[var(--gov-border)] px-3 py-6 text-center text-[11.5px] text-[var(--gov-muted)]">
                {t("detail.noneSpecified")}
              </p>
            ) : (
              <ol className="relative ml-1.5 border-l-2 border-[var(--gov-border)] pl-5">
                {report.timeline.map((item, idx) => (
                  <li key={`${report.id}-tl-${idx}`} className="relative pb-5 last:pb-0">
                    <span
                      className={`absolute -left-[26px] top-1 grid h-3 w-3 place-items-center rounded-full ring-2 ring-white ${
                        idx === report.timeline.length - 1
                          ? "bg-[var(--gov-emerald)]"
                          : "bg-[#a9b8c7]"
                      }`}
                      aria-hidden="true"
                    />
                    <p className="text-[12px] font-extrabold text-[var(--gov-heading)]">
                      {t(statusKey(item.status)) || item.status}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--gov-muted)]">
                      {item.date}
                    </p>
                    {item.note && (
                      <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--gov-muted)]">
                        {item.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </article>
        </div>

        <aside className="no-print space-y-3 self-start lg:sticky lg:top-24">
          <div className="card-gov overflow-hidden">
            <div className="bg-[var(--gov-navy)] px-4 py-2 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em]">
                {t("detail.reference")}
              </p>
            </div>
            <div className="p-4">
              <p className="font-mono text-base font-extrabold tracking-wide text-[var(--gov-heading)]">
                {report.id}
              </p>
              <dl className="mt-3 space-y-2 border-t border-[var(--gov-border)] pt-3">
                <div>
                  <dt className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                    {t("detail.status")}
                  </dt>
                  <dd className="mt-0.5">
                    <span className={`badge ${statusTone(report.status)}`}>
                      {t(statusKey(report.status)) || report.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                    {t("detail.department")}
                  </dt>
                  <dd className="text-[11.5px] font-semibold text-[var(--gov-heading)]">
                    {report.partner ?? "Pending allocation"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                    {t("detail.submitted")}
                  </dt>
                  <dd className="text-[11.5px] font-semibold text-[var(--gov-heading)]">
                    {formatDateTime(report.created_at)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded border border-[var(--gov-emerald)]/25 bg-[var(--gov-emerald-soft)]/70 p-4">
            <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-[var(--gov-link)]">
              <Icon name="shield" size={13} className="mt-[1px] shrink-0" />
              {t("report.f.secure")}
            </p>
          </div>

          <div className="card-gov p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
              {t("faq.helpTitle")}
            </p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
              {t("faq.helpBody")}
            </p>
            <Link href="/officers" className="btn btn-outline btn-sm mt-2 w-full">
              {t("faq.helpCta")}
              <Icon name="arrowRight" size={12} />
            </Link>
          </div>

          <Link href="/challenges" className="btn btn-ghost btn-sm w-full">
            <Icon name="arrowLeft" size={12} />
            {t("detail.back")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
