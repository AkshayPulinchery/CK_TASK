"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/icons";
import { FAQS, type Faq } from "@/lib/portal-data";

/** Accessible single-open FAQ accordion. */
export default function FaqAccordion({
  items = FAQS,
  defaultOpen = 0,
}: {
  items?: Faq[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-[var(--gov-border)] overflow-hidden rounded border border-[var(--gov-border)] bg-[var(--gov-card)]">
      {items.map((faq, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-faq-button-${index}`;
        const panelId = `${baseId}-faq-panel-${index}`;

        return (
          <div key={faq.q} className={isOpen ? "bg-[var(--gov-slate)]/60" : "bg-[var(--gov-card)]"}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[var(--gov-slate)] sm:px-5"
              >
                <span className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-extrabold ${
                      isOpen
                        ? "bg-[var(--gov-emerald)] text-white"
                        : "bg-[var(--gov-slate)] text-[var(--gov-muted)]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] font-bold leading-snug text-[var(--gov-heading)] sm:text-sm">
                    {faq.q}
                  </span>
                </span>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                    isOpen
                      ? "rotate-180 border-[var(--gov-emerald)] bg-[var(--gov-emerald)] text-white"
                      : "border-[var(--gov-border)] text-[var(--gov-muted)]"
                  }`}
                >
                  <Icon name="chevronDown" size={14} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 pl-12 text-[12.5px] leading-relaxed text-[var(--gov-muted)] sm:px-5 sm:pl-13">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
