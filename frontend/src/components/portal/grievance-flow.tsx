"use client";

import { Icon, type IconName } from "@/components/icons";
import { useI18n } from "@/components/language-provider";

type Step = {
  icon: IconName;
  title: string;
  body: string;
  sla: string;
};

export default function GrievanceFlow() {
  const { t } = useI18n();

  const steps: Step[] = [
    {
      icon: "megaphone",
      title: t("flow.s1"),
      body: t("flow.s1Body"),
      sla: t("flow.s1Sla"),
    },
    {
      icon: "filter",
      title: t("flow.s2"),
      body: t("flow.s2Body"),
      sla: t("flow.s2Sla"),
    },
    {
      icon: "building",
      title: t("flow.s3"),
      body: t("flow.s3Body"),
      sla: t("flow.s3Sla"),
    },
    {
      icon: "user",
      title: t("flow.s4"),
      body: t("flow.s4Body"),
      sla: t("flow.s4Sla"),
    },
    {
      icon: "checkCircle",
      title: t("flow.s5"),
      body: t("flow.s5Body"),
      sla: t("flow.s5Sla"),
    },
  ];

  return (
    <section id="grievance-flow" aria-labelledby="flow-title" className="flex flex-col scroll-mt-28">
      <div className="mb-4">
        <p className="eyebrow">{t("flow.eyebrow")}</p>
        <h2 id="flow-title" className="section-title mt-1">
          {t("flow.title")}
        </h2>
        <span className="title-rule" aria-hidden="true" />
      </div>

      <div className="card-gov flex flex-1 flex-col overflow-hidden">
        <div className="relative flex-1 p-4">
          <div
            className="absolute bottom-8 left-[2.05rem] top-8 w-px bg-gradient-to-b from-[var(--gov-emerald)] via-[var(--gov-gold)] to-[var(--gov-border)]"
            aria-hidden="true"
          />
          <ol className="relative space-y-3.5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-white bg-[var(--gov-navy)] text-white shadow-sm">
                  <Icon name={step.icon} size={13} />
                </span>
                <div className="min-w-0 flex-1 pb-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <h3 className="text-[11.5px] font-extrabold text-[var(--gov-heading)]">
                      <span className="mr-1 text-[9px] font-extrabold text-[var(--gov-gold-dark)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </h3>
                    <span className="rounded-[2px] border border-[var(--gov-border)] bg-[var(--gov-slate)] px-1.5 py-[1px] text-[8.5px] font-bold text-[var(--gov-muted)]">
                      {step.sla}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-start gap-1.5 border-t border-[var(--gov-border)] bg-[var(--gov-gold-soft)]/60 px-4 py-2.5">
          <Icon name="scale" size={12} className="mt-[2px] shrink-0 text-[var(--gov-gold-text)]" />
          <p className="text-[10px] leading-relaxed text-[var(--gov-gold-ink)]">{t("flow.escalation")}</p>
        </div>
      </div>
    </section>
  );
}
