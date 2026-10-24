"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useReports } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { Icon } from "@/components/icons";
import { MapSkeleton } from "@/components/portal/skeleton";
import type { FlyRequest } from "@/components/live-map";

const LiveMap = dynamic(() => import("./live-map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// Quick district centers (click a card to smooth-zoom the live map).
const DISTRICT_CENTERS = [
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Salem", lat: 11.6643, lng: 78.146 },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
];

export default function DistrictMapView() {
  const { reports } = useReports();
  const router = useRouter();
  const { t, tCount } = useI18n();
  const [flyRequest, setFlyRequest] = useState<FlyRequest | null>(null);

  const handleOpenReport = useCallback(
    (id: string) => router.push(`/challenges/${id}`),
    [router]
  );

  const flyToDistrict = (lat: number, lng: number) => {
    setFlyRequest((prev) => ({ lat, lng, seq: (prev?.seq ?? 0) + 1 }));
  };

  return (
    <div className="space-y-4">
      <div className="card-gov overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--gov-border)] bg-[var(--gov-slate)] px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-[var(--gov-heading)]">
            <span className="live-dot" aria-hidden="true" />
            {t("map.pins")}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-[var(--gov-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--gov-emerald)]" aria-hidden="true" />
              {t("map.normalPin")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--gov-danger)]" aria-hidden="true" />
              {t("map.urgentPin")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--gov-gold)]" aria-hidden="true" />
              {t("map.clusterPin")}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <LiveMap reports={reports} flyRequest={flyRequest} onOpenReport={handleOpenReport} />

          <p className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[10px] text-[var(--gov-muted)]">
            <span>
              {t("map.attribution")}{" "}
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-[var(--gov-heading)]"
              >
                OpenStreetMap
              </a>{" "}
              {t("map.attributionAfter")}
            </span>
            <span>
              {reports.length} {t("stats.total").toLowerCase()}
            </span>
          </p>
        </div>
      </div>

      <section aria-labelledby="map-centers">
        <div className="mb-2.5 flex items-end justify-between gap-2">
          <h2 id="map-centers" className="section-title">
            {t("map.centers")}
          </h2>
          <p className="text-[10.5px] text-[var(--gov-muted)]">
            <Icon name="mapPin" size={10} className="mr-0.5 inline" />
            Zoom to a district centre
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {DISTRICT_CENTERS.map((d) => {
            const count = reports.filter((r) => r.district === d.name).length;
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => flyToDistrict(d.lat, d.lng)}
                className="group rounded border border-[var(--gov-border)] bg-[var(--gov-card)] p-3 text-left transition-colors hover:border-[var(--gov-emerald)] hover:bg-[var(--gov-emerald-soft)]/40 focus-visible:border-[var(--gov-emerald)]"
              >
                <span className="block text-[11.5px] font-extrabold text-[var(--gov-heading)]">
                  {d.name}
                </span>
                <span className="mt-0.5 block text-[10px] font-bold text-[var(--gov-link)]">
                  {tCount(count === 1 ? "map.reportCountOne" : "map.reportCount", count)}
                </span>
                <span className="mt-1.5 flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--gov-muted)] transition-colors group-hover:text-[var(--gov-link)]">
                  <Icon name="arrowRight" size={9} />
                  Locate
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
