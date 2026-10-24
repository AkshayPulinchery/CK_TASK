"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import { CIRCULARS, formatGovDate, type Circular } from "@/lib/portal-data";
import { downloadCircular } from "@/lib/document-download";

const KIND_STYLES: Record<Circular["kind"], string> = {
  Circular: "badge-emerald",
  Notification: "badge-gold",
  "Press Release": "badge-navy",
  Order: "badge-warn",
};

export default function Circulars({ limit = 5 }: { limit?: number }) {
  const { t } = useI18n();
  const items = CIRCULARS.slice(0, limit);

  return (
    <section aria-labelledby="circulars-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{t("circ.eyebrow")}</p>
          <h2 id="circulars-title" className="section-title mt-1">
            {t("circ.title")}
          </h2>
          <span className="title-rule" aria-hidden="true" />
        </div>
        <Link
          href="/circulars"
          className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[var(--gov-link)] hover:underline"
        >
          {t("circ.viewAll")}
          <Icon name="arrowRight" size={13} />
        </Link>
      </div>

      <div className="card-gov divide-y divide-[var(--gov-border)] overflow-hidden">
        {items.map((item) => {
          const date = new Date(`${item.date}T00:00:00Z`);
          const day = String(date.getUTCDate()).padStart(2, "0");
          const month = formatGovDate(item.date).split(" ")[1];

          return (
            <article
              key={item.id}
              className="group flex gap-3 p-3.5 transition-colors hover:bg-[var(--gov-slate)] sm:gap-4"
            >
              <div className="grid h-12 w-11 shrink-0 place-content-center rounded border border-[var(--gov-border)] bg-[var(--gov-card)] text-center shadow-sm">
                <span className="text-[16px] font-extrabold leading-none tabular-nums text-[var(--gov-heading)]">
                  {day}
                </span>
                <span className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                  {month}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`badge ${KIND_STYLES[item.kind]}`}>{item.kind}</span>
                  <span className="text-[10px] font-bold text-[var(--gov-muted)]">{item.number}</span>
                </div>
                <h3 className="mt-1 text-[12.5px] font-extrabold leading-snug text-[var(--gov-heading)]">
                  <Link href="/circulars" className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[10.5px] text-[var(--gov-muted)]">
                  {item.department}
                </p>
              </div>

              <button
                type="button"
                onClick={() => downloadCircular(item)}
                aria-label={`Download ${item.number}`}
                title="Download document"
                className="grid h-8 w-8 shrink-0 self-center place-items-center rounded border border-[var(--gov-border)] bg-[var(--gov-card)] text-[var(--gov-muted)] transition-colors hover:border-[var(--gov-emerald)] hover:text-[var(--gov-link)]"
              >
                <Icon name="download" size={14} />
              </button>
            </article>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--gov-slate)] px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] text-[var(--gov-muted)]">
            <Icon name="info" size={11} />
            {t("circ.note")}
          </p>
          <Link
            href="/circulars"
            className="text-[10.5px] font-extrabold text-[var(--gov-link)] hover:underline"
          >
            {t("circ.archive")}
          </Link>
        </div>
      </div>
    </section>
  );
}
