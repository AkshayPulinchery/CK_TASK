"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useReports } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { categoryKey, statusKey } from "@/lib/i18n";
import { QUEUE_TABS, formatDateTime } from "@/lib/data";
import { Icon } from "@/components/icons";
import { Skeleton } from "@/components/portal/skeleton";

export default function AdminQueue() {
  const { reports, loading } = useReports();
  const { logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [queueTab, setQueueTab] = useState("All");

  const counts: Record<string, number> = { All: reports.length };
  for (const tab of QUEUE_TABS) {
    if (tab !== "All") counts[tab] = reports.filter((r) => r.status === tab).length;
  }

  const list = (queueTab === "All" ? reports : reports.filter((r) => r.status === queueTab))
    .slice()
    .sort(
      (a, b) => (a.urgency === "High" ? 0 : 1) - (b.urgency === "High" ? 0 : 1)
    );

  const urgent = reports.filter((r) => r.urgency === "High").length;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="space-y-4">
      <div className="card-gov p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="badge badge-emerald">
              <Icon name="shield" size={11} />
              {t("admin.badge")}
            </span>
            <h1 className="mt-1.5 text-xl font-extrabold text-[var(--gov-heading)] sm:text-2xl">
              {t("admin.h1")}
            </h1>
            <p className="mt-0.5 text-[11.5px] text-[var(--gov-muted)]">
              {t("admin.loggedInAs")} <strong className="font-bold">{t("admin.coordinator")}</strong>{" "}
              · <span className="font-mono">admin@tn.gov.in</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {urgent > 0 && (
              <span className="badge badge-danger">
                <Icon name="siren" size={11} />
                {urgent} high priority
              </span>
            )}
            <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
              <Icon name="logout" size={12} />
              {t("admin.signOut")}
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded border border-[var(--gov-border)] bg-[var(--gov-border)]">
          {[
            { label: "Total reports", value: reports.length },
            { label: "Awaiting review", value: counts["New"] ?? 0 },
            { label: "Resolved", value: counts["Resolved"] ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--gov-card)] px-3 py-2">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                {stat.label}
              </p>
              <p className="text-lg font-extrabold tabular-nums text-[var(--gov-heading)]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Filter queue by status"
        className="thin-scroll flex gap-1.5 overflow-x-auto border-b border-[var(--gov-border)] pb-2"
      >
        {QUEUE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={queueTab === tab}
            onClick={() => setQueueTab(tab)}
            data-tab={tab}
            className={`shrink-0 rounded px-3 py-1.5 text-[11px] font-bold transition-colors ${
              queueTab === tab
                ? "bg-[var(--gov-navy)] text-white"
                : "text-[var(--gov-muted)] hover:bg-[var(--gov-slate)] hover:text-[var(--gov-heading)]"
            }`}
          >
            {tab === "All" ? t("admin.allQueue") : t(statusKey(tab)) || tab}{" "}
            <span className="ml-0.5 tabular-nums opacity-70">{counts[tab] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="card-gov overflow-hidden">
        {loading && reports.length === 0 ? (
          <div className="space-y-2 p-4" role="status" aria-label="Loading queue">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
              <Icon name="checkCircle" size={20} />
            </span>
            <p className="text-[13px] font-extrabold text-[var(--gov-heading)]">{t("ch.empty")}</p>
            <p className="mt-0.5 text-[11px] text-[var(--gov-muted)]">
              No reports are in this queue right now.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="gov-table min-w-[900px]">
              <caption className="sr-only">Grievance review queue</caption>
              <thead>
                <tr>
                  <th scope="col">{t("admin.thId")}</th>
                  <th scope="col">{t("admin.thTitle")}</th>
                  <th scope="col">{t("admin.thDistrict")}</th>
                  <th scope="col">{t("admin.thCategory")}</th>
                  <th scope="col">{t("admin.thUrgency")}</th>
                  <th scope="col">{t("admin.thStatus")}</th>
                  <th scope="col">{t("admin.thContact")}</th>
                  <th scope="col" className="text-right">
                    {t("admin.thAction")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className={r.urgency === "High" ? "bg-[var(--gov-danger-soft)]" : ""}>
                    <td className="whitespace-nowrap font-mono text-[10.5px] font-bold text-[var(--gov-link)]">
                      {r.id}
                    </td>
                    <td className="max-w-[240px]">
                      <span className="block truncate font-bold text-[var(--gov-heading)]">{r.title}</span>
                      <span className="text-[9.5px] text-[var(--gov-muted)]">
                        {formatDateTime(r.created_at)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap font-semibold">{r.district}</td>
                    <td>
                      <span className="badge badge-navy">
                        {t(categoryKey(r.category)) || r.category}
                      </span>
                    </td>
                    <td>
                      {r.urgency === "High" ? (
                        <span className="font-extrabold text-[var(--gov-danger)]">
                          {t("urg.highShort")}
                        </span>
                      ) : (
                        <span className="text-[var(--gov-muted)]">{t("urg.normal")}</span>
                      )}
                    </td>
                    <td>
                      <span className="font-bold">{t(statusKey(r.status)) || r.status}</span>
                    </td>
                    <td className="text-[10.5px] text-[var(--gov-muted)]">
                      {r.contact_name ? (
                        <>
                          <strong className="block text-[var(--gov-heading)]">{r.contact_name}</strong>
                          {r.contact_phone || ""}
                        </>
                      ) : (
                        <em>{t("admin.anonymous")}</em>
                      )}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/admin/${r.id}`}
                        className="btn btn-primary btn-sm whitespace-nowrap"
                      >
                        {t("admin.review")}
                        <Icon name="arrowRight" size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-[var(--gov-muted)]">
        <Icon name="lock" size={11} className="mt-[1px] shrink-0" />
        {t("review.confidential")}. Public pages never display contact details.
      </p>
    </div>
  );
}
