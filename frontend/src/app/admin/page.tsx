import type { Metadata } from "next";
import AdminQueue from "@/components/admin-queue";

export const metadata: Metadata = {
  title: "Administrator Review Queue",
  description: "Restricted departmental queue for reviewing and acting on citizen grievances.",
  robots: { index: false, follow: false },
};

// The admin queue renders behind a client-side auth guard and loads its rows
// from the API in the browser, so the segment cannot be validated for
// "instant navigation" in dev. Opt it out of that validation instead of
// dropping the segment from the render.
// See https://nextjs.org/docs/messages/instant-unrendered-segment
export const instant = false;

export default function AdminPage() {
  return (
    <div id="page-admin" className="mx-auto max-w-6xl">
      <AdminQueue />
    </div>
  );
}
