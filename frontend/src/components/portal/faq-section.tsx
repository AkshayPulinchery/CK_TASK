"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import FaqAccordion from "@/components/portal/faq-accordion";
import { FAQS } from "@/lib/portal-data";

export default function FaqSection({ limit = 5 }: { limit?: number }) {
  const { t } = useI18n();

  return (
    <section aria-labelledby="faq-title" className="flex flex-col">
      <div className="mb-4">
        <p className="eyebrow">{t("faq.eyebrow")}</p>
        <h2 id="faq-title" className="section-title mt-1">
          {t("faq.title")}
        </h2>
        <span className="title-rule" aria-hidden="true" />
      </div>

      <FaqAccordion items={FAQS.slice(0, limit)} defaultOpen={0} />

      <div className="mt-3 flex flex-col gap-2 rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--gov-card)] text-[var(--gov-link)] shadow-sm">
            <Icon name="headset" size={14} />
          </span>
          <div>
            <p className="text-[11.5px] font-extrabold text-[var(--gov-heading)]">{t("faq.helpTitle")}</p>
            <p className="text-[10px] text-[var(--gov-muted)]">{t("faq.helpBody")}</p>
          </div>
        </div>
        <Link href="/officers" className="btn btn-outline btn-sm shrink-0">
          {t("faq.helpCta")}
          <Icon name="arrowRight" size={12} />
        </Link>
      </div>
    </section>
  );
}
