"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
});

type Props = {
  lat: number;
  lng: number;
  onPinChange: (lat: number, lng: number) => void;
};

// Live interactive Leaflet map for the report form — glides to the pinned
// location as the citizen types; the marker can also be dragged manually.
export default function ReportLeafletMap({ lat, lng, onPinChange }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onPinChangeRef = useRef(onPinChange);
  useEffect(() => {
    onPinChangeRef.current = onPinChange;
  }, [onPinChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([lat, lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onPinChangeRef.current(Number(pos.lat.toFixed(5)), Number(pos.lng.toFixed(5)));
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Initialize the map once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-glide the map whenever the pinned coordinates change.
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.flyTo([lat, lng], 14, { duration: 1.2 });
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive map: drag the pin to the exact grievance location"
      className="h-[260px] w-full bg-[var(--gov-slate)]"
    />
  );
}
