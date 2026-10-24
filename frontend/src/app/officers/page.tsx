import type { Metadata } from "next";
import Link from "next/link";
import OfficersDirectory from "@/components/officers-directory";
import PageHeader from "@/components/portal/page-header";
import { Icon } from "@/components/icons";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "District Nodal Officers",
  description:
    "Contact directory for district grievance nodal officers in Tamil Nadu.",
};

export default function OfficersPage() {
  return (
    <div id="page-officers">
      <PageHeader
        eyebrow={<T k="page.officers.eyebrow" />}
        title={<T k="page.officers.title" />}
        description="Each district has a nodal officer responsible for grievance triage, data quality and escalation. Contact the officer for a case that has crossed the service standard."
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="gov.nav.officers" /> },
        ]}
        actions={
          <Link href="/challenges" className="btn btn-outline btn-sm">
            <Icon name="list" size={13} />
            <T k="gov.nav.issues" />
          </Link>
        }
      />
      <OfficersDirectory />
    </div>
  );
}
