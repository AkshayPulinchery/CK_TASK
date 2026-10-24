import type { Metadata } from "next";
import AnalyticsView from "@/components/analytics-view";
import PageHeader from "@/components/portal/page-header";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "District Performance Analytics",
  description:
    "Live resolution performance across Tamil Nadu districts, categories and responsible departments.",
};

export default function AnalyticsPage() {
  return (
    <div id="page-analytics">
      <PageHeader
        eyebrow={<T k="page.analytics.eyebrow" />}
        title={<T k="page.analytics.title" />}
        description="Every figure on this page is computed from the public grievance register. No sampled or modelled values are displayed."
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="gov.nav.analytics" /> },
        ]}
      />
      <AnalyticsView />
    </div>
  );
}
