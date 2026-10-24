"use client";

import type { Report } from "@/lib/data";
import { describeCampaign, readCampaign } from "@/lib/utm";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function stamp(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

/**
 * Builds a plain-text acknowledgement receipt for a submitted grievance.
 * The receipt is generated in the browser — no citizen data leaves the device.
 */
export function buildReceipt(report: Report): string {
  const campaign = readCampaign();
  const line = "=".repeat(64);
  const thin = "-".repeat(64);

  const timeline = report.timeline
    .map((entry) => `  • ${stamp(entry.date)} — ${entry.status}${entry.note ? `: ${entry.note}` : ""}`)
    .join("\n");

  return [
    line,
    "GOVERNMENT OF TAMIL NADU",
    "CivicForce TN — Citizen Action Engine",
    "Grievance Acknowledgement Receipt",
    line,
    "",
    `Reference ID        : ${report.id}`,
    `Submitted on        : ${stamp(report.created_at)}`,
    `Current status      : ${report.status}`,
    `Urgency             : ${report.urgency}`,
    `Category            : ${report.category}`,
    `Department          : ${report.partner ?? "Pending allocation"}`,
    `District            : ${report.district}${report.pincode ? ` (PIN ${report.pincode})` : ""}`,
    `Location            : ${report.landmark ?? "Not specified"}`,
    "",
    thin,
    "GRIEVANCE",
    thin,
    report.title,
    "",
    report.description,
    "",
    thin,
    "ACTION TIMELINE",
    thin,
    timeline || "  No action recorded yet.",
    "",
    thin,
    "TRACKING",
    thin,
    `Public status page  : /challenges/${report.id}`,
    "",
    `Campaign source     : ${describeCampaign(campaign)}`,
    `Receipt generated   : ${stamp(new Date())}`,
    "",
    line,
    "This is a system-generated acknowledgement. It is not a legal document.",
    "Service standard    : acknowledgement within 24 hours; closure within 15 working days.",
    "Escalation          : District Nodal Officer, then the State Grievance Redressal Council.",
    "Helpline            : 1100 (state emergency desk) · 1913 (women's helpline) · 112 (emergency)",
    line,
  ].join("\n");
}

/** Triggers a `.txt` download of the receipt. */
export function downloadReceipt(report: Report): void {
  const text = buildReceipt(report);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.id}-acknowledgement.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
