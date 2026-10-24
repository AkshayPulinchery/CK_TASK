"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReports } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { categoryKey, PARTNER_GROUP_KEYS, statusKey } from "@/lib/i18n";
import {
  CATEGORY_OPTIONS,
  PARTNER_GROUPS,
  STATUS_OPTIONS,
  formatDateTime,
  type Report,
  type Urgency,
} from "@/lib/data";
import { Icon } from "@/components/icons";

export default function AdminReviewForm({ id }: { id: string }) {
  const { reports, loading } = useReports();
  const { t } = useI18n();
  const report = reports.find((r) => r.id === id);

  // Wait for the live register before mounting the editable form. The store
  // starts with static seed rows and swaps in the API records on mount; the
  // form seeds its local state once, so mounting it against the seed would
  // leave stale status/department values on screen.
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="card-gov p-5">
          <p className="text-sm font-semibold text-[var(--gov-muted)]">Loading record…</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="card-gov space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded bg-[var(--gov-slate)]" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-40 w-full animate-pulse rounded bg-[var(--gov-slate)]" />
            <div className="h-28 w-full animate-pulse rounded bg-[var(--gov-slate)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-4 text-[11px]">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 font-semibold text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
          >
            <Icon name="arrowLeft" size={12} />
            {t("review.back")}
          </Link>
        </nav>
        <div className="card-gov px-6 py-14 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
            <Icon name="search" size={22} />
          </span>
          <h2 className="text-base font-extrabold text-[var(--gov-heading)]">
            {loading ? "Loading record…" : `${t("review.notFound")} ${id}`}
          </h2>
          {!loading && (
            <Link href="/admin" className="btn btn-outline btn-sm mt-4">
              {t("review.back")}
            </Link>
          )}
        </div>
      </div>
    );
  }

  // The register loads asynchronously, so the editable form lives in its own
  // component: it only mounts once the report exists, and the `key` makes it
  // re-seed itself if a different report is opened.
  return <AdminReviewFields key={report.id} report={report} />;
}

function AdminReviewFields({ report }: { report: Report }) {
  const router = useRouter();
  const { updateReport } = useReports();
  const { t } = useI18n();
  const id = report.id;
  const formId = useId();

  const [category, setCategory] = useState(report.category);
  const [urgency, setUrgency] = useState<Urgency>(report.urgency);
  const [summary, setSummary] = useState(report.ai_summary);
  const [status, setStatus] = useState(report.status);
  const [partner, setPartner] = useState(report.partner ?? "");
  const [publicUpdate, setPublicUpdate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const saveAdminReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    setSaved(false);

    const trimmedUpdate = publicUpdate.trim();

    try {
      // Persisted through PUT /api/reports/:id — the server appends the
      // timeline entry itself so the public history stays authoritative.
      await updateReport(
        id,
        {
          category,
          urgency,
          ai_summary: summary,
          status,
          partner: partner || null,
        },
        trimmedUpdate
          ? {
              status,
              date: formatDateTime(new Date()),
              note: trimmedUpdate,
            }
          : undefined
      );

      setSaved(true);
      setPublicUpdate("");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save the changes.");
    } finally {
      setSaving(false);
    }
  };

  const statusTone =
    status.toLowerCase() === "resolved"
      ? "badge-emerald"
      : status.toLowerCase() === "rejected"
        ? "badge-danger"
        : "badge-warn";

  return (
    <div className="mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px]">
        <Link
          href="/admin"
          className="font-semibold text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
        >
          {t("review.back")}
        </Link>
        <Icon name="chevronRight" size={9} className="text-[var(--gov-muted)]" />
        <span className="font-mono font-bold text-[var(--gov-heading)]">{report.id}</span>
      </nav>

      <div className="card-gov mb-4 overflow-hidden">
        <div className="h-1 w-full bg-[var(--gov-gold)]" aria-hidden="true" />
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="badge badge-navy font-mono">{report.id}</span>
            <span className={`badge ${statusTone}`}>{t(statusKey(report.status)) || report.status}</span>
            {report.urgency === "High" && <span className="badge badge-danger">{t("urg.highShort")}</span>}
            <span className="badge badge-gold">
              {t(categoryKey(report.category)) || report.category}
            </span>
          </div>
          <h1 className="mt-1.5 text-lg font-extrabold leading-snug text-[var(--gov-heading)] sm:text-xl">
            {report.title}
          </h1>
          <p className="mt-0.5 text-[10.5px] text-[var(--gov-muted)]">
            {report.district} · {formatDateTime(report.created_at)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form onSubmit={saveAdminReview} className="card-gov p-4 sm:p-5" aria-labelledby={`${formId}-heading`}>
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--gov-navy)] text-white">
              <Icon name="scale" size={14} />
            </span>
            <div>
              <h2 id={`${formId}-heading`} className="text-[13px] font-extrabold text-[var(--gov-heading)]">
                {t("review.h2")}
              </h2>
              <p className="text-[10px] text-[var(--gov-muted)]">
                Corrections are recorded in the public action timeline.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`${formId}-category`} className="label-gov">
                {t("review.category")}
              </label>
              <select
                id={`${formId}-category`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-gov"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {t(categoryKey(c)) || c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${formId}-urgency`} className="label-gov">
                {t("review.urgencyPriority")}
              </label>
              <select
                id={`${formId}-urgency`}
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="select-gov"
              >
                <option value="Normal">{t("urg.normalPriority")}</option>
                <option value="High">{t("urg.highPriority")}</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor={`${formId}-summary`} className="label-gov">
              {t("review.summary")}
            </label>
            <textarea
              id={`${formId}-summary`}
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="textarea-gov resize-y"
            />
          </div>

          <div className="mt-3">
            <label htmlFor={`${formId}-partner`} className="label-gov">
              {t("review.partner")}
            </label>
            <select
              id={`${formId}-partner`}
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="select-gov"
            >
              <option value="">{t("review.noPartner")}</option>
              {PARTNER_GROUPS.map((group, index) => (
                <optgroup key={group.label} label={t(PARTNER_GROUP_KEYS[index] ?? group.label)}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label htmlFor={`${formId}-status`} className="label-gov">
              {t("review.status")}
            </label>
            <select
              id={`${formId}-status`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select-gov"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {t(statusKey(s)) || s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label htmlFor={`${formId}-update`} className="label-gov">
              {t("review.timelineUpdate")} <span className="text-[var(--gov-muted)]">({t("report.f.optional")})</span>
            </label>
            <input
              id={`${formId}-update`}
              type="text"
              value={publicUpdate}
              onChange={(e) => setPublicUpdate(e.target.value)}
              className="input-gov"
              placeholder={t("review.timelinePh")}
            />
          </div>

          {saveError && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2 rounded border border-[var(--gov-danger)]/35 bg-[var(--gov-danger-soft)] px-3 py-2 text-[11.5px] font-semibold text-[var(--gov-danger)]"
            >
              <Icon name="alertTriangle" size={13} className="mt-0.5 shrink-0" />
              {saveError}
            </div>
          )}

          {saved && (
            <div
              role="status"
              className="mt-3 flex items-start gap-2 rounded border border-[var(--gov-emerald)]/35 bg-[var(--gov-emerald-soft)] px-3 py-2 text-[11.5px] font-semibold text-[var(--gov-link)]"
            >
              <Icon name="checkCircle" size={13} className="mt-0.5 shrink-0" />
              Changes saved. The public timeline has been updated.
            </div>
          )}

          <div className="mt-4 flex flex-col-reverse gap-2 border-t border-[var(--gov-border)] pt-3 sm:flex-row">
            <Link href="/admin" className="btn btn-outline sm:w-auto">
              {t("review.cancel")}
            </Link>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? (
                <>
                  <Icon name="refresh" size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Icon name="check" size={14} />
                  {t("review.save")}
                </>
              )}
            </button>
          </div>

          {saved && (
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="btn btn-ghost btn-sm mt-2 w-full"
            >
              {t("review.back")}
              <Icon name="arrowRight" size={12} />
            </button>
          )}
        </form>

        <aside className="space-y-3 self-start">
          <div className="overflow-hidden rounded border-2 border-[var(--gov-emerald)]/40 bg-[var(--gov-card)]">
            <div className="flex items-center justify-between gap-2 bg-[var(--gov-emerald-soft)] px-3 py-2">
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--gov-link)]">
                <Icon name="lock" size={11} />
                {t("review.confidential")}
              </p>
              <span className="badge badge-danger">{t("review.protected")}</span>
            </div>
            <dl className="space-y-2 p-3">
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                  {t("review.citizen")}
                </dt>
                <dd className="text-[11.5px] font-semibold text-[var(--gov-heading)]">
                  {report.contact_name || t("review.notGiven")}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                  {t("review.phone")}
                </dt>
                <dd className="text-[11.5px] font-semibold text-[var(--gov-heading)]">
                  {report.contact_phone || t("review.notGiven")}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                  {t("review.email")}
                </dt>
                <dd className="break-all text-[11.5px] font-semibold text-[var(--gov-heading)]">
                  {report.contact_email || t("review.notGiven")}
                </dd>
              </div>
            </dl>
            <p className="border-t border-[var(--gov-border)] bg-[var(--gov-slate)] px-3 py-2 text-[9.5px] leading-relaxed text-[var(--gov-muted)]">
              {t("report.f.secure")}
            </p>
          </div>

          <div className="card-gov p-3.5">
            <p className="eyebrow">{t("detail.location")}</p>
            <dl className="mt-1.5 space-y-1.5 text-[11px]">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--gov-muted)]">{t("detail.district")}</dt>
                <dd className="font-semibold text-[var(--gov-heading)]">{report.district}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--gov-muted)]">{t("detail.pincode")}</dt>
                <dd className="font-semibold text-[var(--gov-heading)]">
                  {report.pincode || t("detail.noneSpecified")}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--gov-muted)]">{t("detail.location")}</dt>
                <dd className="text-right font-semibold text-[var(--gov-heading)]">
                  {report.landmark || t("detail.noneSpecified")}
                </dd>
              </div>
            </dl>
          </div>

          <Link href={`/challenges/${report.id}`} className="btn btn-outline btn-sm w-full">
            <Icon name="external" size={12} />
            Open public record
          </Link>
        </aside>
      </div>
    </div>
  );
}
