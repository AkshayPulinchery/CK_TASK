import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/portal/page-header";
import { Icon } from "@/components/icons";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Accessibility commitment, conformance status and feedback route for the CivicForce Tamil Nadu citizen portal.",
};

type Section = { id: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "commitment",
    title: "Our commitment",
    body: (
      <>
        The Government of Tamil Nadu is committed to making CivicForce TN usable by every citizen,
        including persons with disabilities, older citizens and people using assistive technology. This
        statement covers the public portal at CivicForce TN and is published in line with the Guidelines
        for Indian Government Websites (GIGW 3.0) and the UX4G design system.
      </>
    ),
  },
  {
    id: "conformance",
    title: "Conformance status",
    body: (
      <>
        The portal <strong>partially conforms</strong> to Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA. The interface has been built with semantic landmarks, labelled form controls, visible
        focus indicators, keyboard-operable dialogs and a text-scaling control. A formal third-party
        audit has not yet been completed; this statement will be updated when the audit report is
        published.
      </>
    ),
  },
  {
    id: "features",
    title: "Accessibility features available now",
    body: (
      <ul className="mt-1 space-y-1.5">
        {[
          "Every page uses a consistent heading order and landmark regions, so screen-reader users can jump straight to the content they need.",
          "Text size can be set to A-, A or A+ from the utility bar; the choice is remembered on this device.",
          "A high-contrast mode is available from the utility bar for low-vision users.",
          "The interface can be switched between English and Tamil without leaving the page.",
          "Headings, landmarks and lists follow a logical order and are announced by screen readers.",
          "Forms use persistent labels, inline error messages, an error summary and focus on the first invalid field.",
          "Dialogs trap focus, close on Escape and restore focus to the trigger.",
          "Animations respect the operating system's “reduce motion” preference.",
          "A print stylesheet produces a clean, ink-saving copy of grievance records.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Icon name="checkCircle" size={13} className="mt-[3px] shrink-0 text-[var(--gov-link)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "limitations",
    title: "Known limitations",
    body: (
      <ul className="mt-1 space-y-1.5">
        {[
          "The interactive district map is rendered with OpenStreetMap tiles and has limited keyboard support. Grievance records, coordinates and district performance are available in text form on the report and analytics pages.",
          "Map tiles are supplied by a third party and their contrast cannot be adjusted from this portal.",
          "Circulars are offered as plain-text downloads; certified copies must be obtained from the issuing department.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Icon name="alertTriangle" size={13} className="mt-[3px] shrink-0 text-[var(--gov-gold-text)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "feedback",
    title: "Feedback and enforcement",
    body: (
      <>
        If you encounter a barrier, or need information in an alternative format, write to{" "}
        <a className="font-semibold text-[var(--gov-link)] underline" href="mailto:admin@tn.gov.in">
          admin@tn.gov.in
        </a>{" "}
        or call the state emergency desk on{" "}
        <a className="font-semibold text-[var(--gov-link)] underline" href="tel:1100">
          1100
        </a>
        . We aim to acknowledge accessibility feedback within 5 working days. If the response is not
        satisfactory, the matter may be escalated to the State Grievance Redressal Council after 30 days.
      </>
    ),
  },
];

export default function AccessibilityPage() {
  return (
    <div id="page-accessibility" className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow={<T k="page.accessibility.eyebrow" />}
        title={<T k="page.accessibility.title" />}
        description="How this portal supports citizens who use assistive technology, and how to report an accessibility barrier."
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="page.accessibility.title" /> },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="card-gov h-max p-4 lg:sticky lg:top-24">
          <p className="eyebrow">On this page</p>
          <ul className="mt-2 space-y-1.5">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded px-1.5 py-1 text-[11.5px] font-semibold text-[var(--gov-muted)] transition-colors hover:bg-[var(--gov-slate)] hover:text-[var(--gov-heading)]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-[var(--gov-border)] pt-2 text-[10px] text-[var(--gov-muted)]">
            Last reviewed: October 2026
          </p>
        </nav>

        <div className="space-y-3">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="card-gov scroll-mt-24 p-5">
              <h2 className="text-[15px] font-extrabold text-[var(--gov-heading)]">{section.title}</h2>
              <div className="mt-1.5 text-[12px] leading-relaxed text-[var(--gov-ink)]">{section.body}</div>
            </section>
          ))}

          <div className="rounded border border-[var(--gov-emerald)]/25 bg-[var(--gov-emerald-soft)]/60 p-4">
            <p className="text-[12px] font-extrabold text-[var(--gov-link)]">
              Need this information in another format?
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--gov-link)]">
              Large-print, Tamil-only and screen-reader-friendly copies of the grievance procedure are
              available on request from the district nodal officer. Visit the{" "}
              <Link href="/officers" className="font-semibold underline">
                officer directory
              </Link>{" "}
              to find your district contact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
