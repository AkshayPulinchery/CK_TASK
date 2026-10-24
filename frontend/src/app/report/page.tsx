import type { Metadata } from "next";
import Link from "next/link";
import ReportForm from "@/components/report-form";
import PageHeader from "@/components/portal/page-header";
import { Icon } from "@/components/icons";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Report a Civic Issue",
  description:
    "Report a civic issue in Tamil Nadu. Pin the exact location, attach evidence and receive a public reference ID instantly.",
};

export default function ReportPage() {
  return (
    <div id="page-report" className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={<T k="page.report.eyebrow" />}
        title={<T k="report.h1" />}
        description={
          <>
            <T k="report.intro.a" /> <strong className="font-semibold text-[var(--gov-heading)]"><T k="report.intro.strong" /></strong>{" "}
            <T k="report.intro.b" />
          </>
        }
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="gov.report" /> },
        ]}
        actions={
          <Link href="/challenges" className="btn btn-outline btn-sm">
            <Icon name="list" size={13} />
            <T k="gov.nav.issues" />
          </Link>
        }
      />

      <ReportForm />
    </div>
  );
}
