"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import type { Report } from "@/lib/data";
import { useI18n } from "@/components/language-provider";
import { categoryKey, statusKey } from "@/lib/i18n";

L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
});

export type FlyRequest = { lat: number; lng: number; seq: number };

type Props = {
  reports: Report[];
  flyRequest: FlyRequest | null;
  onOpenReport: (id: string) => void;
};

// Live fully functional district map with pulsing urgency pins and popups.
export default function LiveMap({ reports, flyRequest, onOpenReport }: Props) {
  const { t } = useI18n();
  const viewLabel = t("map.viewChallenge");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const onOpenReportRef = useRef(onOpenReport);
  useEffect(() => {
    onOpenReportRef.current = onOpenReport;
  }, [onOpenReport]);

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([11.1271, 78.6569], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    const layer = L.layerGroup().addTo(map);

    mapRef.current = map;
    layerRef.current = layer;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // (Re)draw incident pins whenever reports change.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    reports.forEach((r) => {
      if (r.lat === null || r.lng === null) return;
      const isUrgent = r.urgency === "High";
      const icon = L.divIcon({
        className: isUrgent ? "custom-pulse-pin" : "custom-norm-pin",
        iconSize: isUrgent ? [16, 16] : [14, 14],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([r.lat, r.lng], { icon }).addTo(layer);

      // Build the popup with DOM nodes and textContent. Report titles are
      // citizen-supplied, so they must never be interpolated into innerHTML.
      const content = document.createElement("div");
      content.className = "cf-popup";

      const ref = document.createElement("p");
      ref.className = "cf-popup-ref";
      ref.textContent = `${r.id} · ${r.district}`;

      const heading = document.createElement("h4");
      heading.className = "cf-popup-title";
      heading.textContent = r.title;

      const tags = document.createElement("div");
      tags.className = "cf-popup-tags";

      const category = document.createElement("span");
      category.className = "cf-popup-tag";
      category.textContent = t(categoryKey(r.category)) || r.category;

      const status = document.createElement("span");
      status.className = `cf-popup-tag ${isUrgent ? "is-urgent" : "is-normal"}`;
      status.textContent = t(statusKey(r.status)) || r.status;

      tags.append(category, status);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "cf-popup-btn";
      button.textContent = viewLabel;
      button.addEventListener("click", () => onOpenReportRef.current(r.id));

      content.append(ref, heading, tags, button);
      marker.bindPopup(content);
    });
  }, [reports, t, viewLabel]);

  // Smooth zoom to a district center on demand.
  useEffect(() => {
    if (flyRequest && mapRef.current) {
      mapRef.current.flyTo([flyRequest.lat, flyRequest.lng], 12, {
        duration: 1.2,
      });
    }
  }, [flyRequest]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Map of civic grievances across Tamil Nadu"
      className="h-[420px] w-full rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] shadow-[inset_0_2px_8px_rgba(15,41,66,0.08)]"
    />
  );
}
