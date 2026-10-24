"use client";

import { Icon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import { LEADERSHIP } from "@/lib/portal-data";

export default function Leadership() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="leadership-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{t("lead.eyebrow")}</p>
          <h2 id="leadership-title" className="section-title mt-1">
            {t("lead.title")}
          </h2>
          <span className="title-rule" aria-hidden="true" />
        </div>
        <p className="max-w-md text-[11.5px] leading-relaxed text-[var(--gov-muted)]">
          {t("lead.note")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {LEADERSHIP.map((person) => (
          <article
            key={person.role}
            className="card-gov card-hover group overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-[var(--gov-border)] bg-[var(--gov-slate)] p-3">
              <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#dbe4ee] to-[#c3d0de] shadow-inner">
                <Icon name="user" size={30} className="text-[var(--gov-muted)]" strokeWidth={1.4} />
                <span className="absolute bottom-0 w-full bg-[var(--gov-navy)]/85 py-[2px] text-center text-[8px] font-extrabold tracking-[0.1em] text-white">
                  {person.initials}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[var(--gov-link)]">
                  {t("lead.official")}
                </p>
                <h3 className="mt-0.5 text-[12.5px] font-extrabold leading-snug text-[var(--gov-heading)]">
                  {person.role}
                </h3>
                <p className="mt-0.5 text-[10.5px] text-[var(--gov-muted)]" lang="ta">
                  {person.roleTa}
                </p>
              </div>
            </div>

            <div className="p-3">
              <p className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[var(--gov-muted)]">
                <Icon name="mapPin" size={11} className="mt-[2px] shrink-0" />
                {person.office}
              </p>
              <p className="mt-1.5 border-t border-dashed border-[var(--gov-border)] pt-1.5 text-[10.5px] font-semibold leading-snug text-[var(--gov-ink)]">
                {person.portfolio}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[var(--gov-border)] bg-[var(--gov-slate)] px-3 py-1.5">
              <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                {t("lead.placeholder")}
              </span>
              <span className="h-1.5 w-6 rounded-full bg-[var(--gov-gold)]/70 transition-all duration-300 group-hover:w-10" />
            </div>
          </article>
        ))}
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-[var(--gov-muted)]">
        <Icon name="info" size={12} className="mt-[1px] shrink-0" />
        {t("lead.disclaimer")}
      </p>
    </section>
  );
}
