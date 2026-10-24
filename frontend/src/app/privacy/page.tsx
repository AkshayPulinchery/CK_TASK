import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/portal/page-header";
import LastUpdated from "@/components/portal/last-updated";
import { Icon } from "@/components/icons";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CivicForce Tamil Nadu collects, protects and publishes citizen grievance data.",
};

const SECTIONS = [
  {
    id: "scope",
    title: "1. Scope of this policy",
    body: "This policy applies to the public CivicForce TN portal, the grievance submission form, the public register, the district map, and the restricted administrative console. It explains what is collected, why it is collected, where it is published and how a citizen can ask for a correction.",
  },
  {
    id: "collect",
    title: "2. What we collect",
    body: "When a grievance is submitted we store: the issue title and description, the district, pincode and landmark, the pin coordinates, the selected category and urgency, and up to three photographs where supplied. Separately, and only if the citizen chooses to provide them, we store a name, telephone number and email address. A random device key is kept in the browser so anonymous votes and status lookups work without an account. We never ask for Aadhaar, caste, religion or income details.",
  },
  {
    id: "photos",
    title: "3. Photographs and evidence",
    body: "Photographs are attached to the grievance record and used only for verification and audit. Citizens should not upload images of people, identity documents, number plates or any personal information. Where such content is identified, the department may redact or remove it. Photographs are not shown on the public register; only the photo count is published.",
  },
  {
    id: "public",
    title: "4. What is published publicly",
    body: "The public record shows the reference ID, title, description, district, coordinates, category, urgency, current status, responsible department and the action timeline. Contact name, telephone number and email address are never published. The action timeline is written by departmental reviewers and must not contain personal information.",
  },
  {
    id: "anonymous",
    title: "5. Anonymous reporting",
    body: "A citizen may file a grievance without providing any contact details. In that case the report is marked anonymous and remains fully trackable by reference ID. Providing contact details is optional and is used only to reach the citizen for site verification or clarification.",
  },
  {
    id: "triage",
    title: "6. Automated triage",
    body: "Every submission receives a keyword-based triage suggestion for category, urgency and responsible department. The suggestion is advisory. An authorised departmental reviewer confirms or corrects it before action is recorded, and corrections appear on the public timeline.",
  },
  {
    id: "storage",
    title: "7. Cookies and local storage",
    body: "The portal uses browser storage for the selected language, text size and contrast settings, the cookie acknowledgement, an unfinished report draft, and the campaign source of the current visit. The campaign value is held in session storage and is discarded when the tab closes. No advertising, profiling or third-party analytics cookies are set.",
  },
  {
    id: "retention",
    title: "8. Retention",
    body: "In this demonstration deployment, grievances are stored in a departmental PostgreSQL database and can be reset by the system administrator. In production, records are retained for the period prescribed by the departmental records schedule and the audit requirements of the State Grievance Redressal Council. Contact details are deleted or anonymised once the grievance is closed and the audit window has expired.",
  },
  {
    id: "rights",
    title: "9. Your rights",
    body: "You may ask for a copy, correction or deletion of your grievance and contact details by writing to admin@tn.gov.in or by calling the state emergency desk on 1100. State the reference ID in your request. If the response is unsatisfactory, the matter may be escalated to the State Grievance Redressal Council after 30 days.",
  },
  {
    id: "contact",
    title: "10. Grievance officer",
    body: "The State Coordinator, CivicForce TN, Information Technology & Digital Services Department, Government of Tamil Nadu, is the designated grievance officer for this portal. Enquiries: admin@tn.gov.in · 1100 (state emergency desk) · 1913 (women's helpline).",
  },
];

export default function PrivacyPage() {
  return (
    <div id="page-privacy" className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow={<T k="page.privacy.eyebrow" />}
        title={<T k="privacy.h1" />}
        description={<T k="privacy.updated" />}
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="privacy.h1" /> },
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
            <LastUpdated />
          </p>
        </nav>

        <div className="space-y-3">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="card-gov scroll-mt-24 p-5">
              <h2 className="text-[14px] font-extrabold text-[var(--gov-heading)]">{section.title}</h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--gov-ink)]">{section.body}</p>
            </section>
          ))}

          <div className="flex flex-wrap gap-2">
            <Link href="/terms" className="btn btn-outline btn-sm">
              <Icon name="fileText" size={12} />
              <T k="terms.h1" />
            </Link>
            <Link href="/accessibility" className="btn btn-ghost btn-sm">
              <Icon name="globe" size={12} />
              Accessibility statement
            </Link>
            <Link href="/" className="btn btn-ghost btn-sm">
              <Icon name="arrowLeft" size={12} />
              <T k="common.returnHome" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
