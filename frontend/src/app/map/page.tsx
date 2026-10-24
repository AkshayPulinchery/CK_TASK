import type { Metadata } from "next";
import Link from "next/link";
import DistrictMapView from "@/components/district-map-view";
import PageHeader from "@/components/portal/page-header";
import { Icon } from "@/components/icons";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Live District Map",
  description:
    "Live district map of Tamil Nadu showing active civic grievances, urgency markers and departmental coverage.",
};

export default function MapPage() {
  return (
    <div id="page-map">
      <PageHeader
        eyebrow={<T k="page.map.eyebrow" />}
        title={<T k="map.h1" />}
        description={<T k="map.p" />}
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="gov.nav.map" /> },
        ]}
        actions={
          <Link href="/analytics" className="btn btn-outline btn-sm">
            <Icon name="chart" size={13} />
            <T k="gov.nav.analytics" />
          </Link>
        }
      />

      <DistrictMapView />
    </div>
  );
}
