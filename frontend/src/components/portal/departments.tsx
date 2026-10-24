"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import { DEPARTMENTS } from "@/lib/portal-data";

const ICONS: Record<string, IconName> = {
  MAWS: "building",
  HMP: "road",
  TANGEDCO: "bolt",
  "RD&PR": "home",
  "H&FW": "shield",
  SE: "fileText",
  TNSTC: "mapPin",
  "ECC&F": "leaf",
  TNPCB: "droplet",
  GCC: "grid",
};

export default function Departments() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="departments-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{t("dept.eyebrow")}</p>
          <h2 id="departments-title" className="section-title mt-1">
            {t("dept.title")}
          </h2>
          <span className="title-rule" aria-hidden="true" />
        </div>
        <Link
          href="/analytics"
          className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[var(--gov-link)] hover:underline"
        >
          {t("dept.viewPerformance")}
          <Icon name="arrowRight" size={13} />
        </Link>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {DEPARTMENTS.map((dept) => (
          <Link
            key={dept.code}
            href={`/challenges?category=${encodeURIComponent(dept.categories[0])}`}
            className="card-gov card-hover group flex flex-col p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-9 w-9 place-items-center rounded bg-[var(--gov-emerald-soft)] text-[var(--gov-link)] transition-colors group-hover:bg-[var(--gov-emerald)] group-hover:text-white">
                <Icon name={ICONS[dept.code] ?? "building"} size={17} />
              </span>
              <span className="rounded-[2px] border border-[var(--gov-border)] bg-[var(--gov-slate)] px-1.5 py-0.5 text-[8.5px] font-extrabold tracking-[0.06em] text-[var(--gov-muted)]">
                {dept.code}
              </span>
            </div>

            <h3 className="mt-2.5 text-[12px] font-extrabold leading-snug text-[var(--gov-heading)]">
              {dept.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
              {dept.focus}
            </p>

            <div className="mt-auto flex items-center justify-between gap-1 pt-2.5">
              <span className="flex flex-wrap gap-1">
                {dept.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    className="rounded-[2px] bg-[var(--gov-slate)] px-1.5 py-0.5 text-[8.5px] font-bold text-[var(--gov-muted)]"
                  >
                    {category}
                  </span>
                ))}
              </span>
              <Icon
                name="arrowRight"
                size={13}
                className="shrink-0 text-[var(--gov-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--gov-link)]"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
