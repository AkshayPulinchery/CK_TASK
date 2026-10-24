import type { Metadata } from "next";
import CircularsArchive from "@/components/circulars-archive";
import PageHeader from "@/components/portal/page-header";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Circulars & Press Releases",
  description:
    "Government orders, notifications, circulars and press releases relating to civic grievance redressal in Tamil Nadu.",
};

export default function CircularsPage() {
  return (
    <div id="page-circulars">
      <PageHeader
        eyebrow={<T k="page.circulars.eyebrow" />}
        title={<T k="page.circulars.title" />}
        description="Official communications on grievance timelines, evidence standards, accessibility and district-level coordination."
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="gov.nav.circulars" /> },
        ]}
      />
      <CircularsArchive />
    </div>
  );
}
