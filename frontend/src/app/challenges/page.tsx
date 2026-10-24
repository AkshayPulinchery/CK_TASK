import type { Metadata } from "next";
import Link from "next/link";
import ChallengeBrowser from "@/components/challenge-browser";
import PageHeader from "@/components/portal/page-header";
import { Icon } from "@/components/icons";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Public Grievance Register",
  description:
    "Browse, search and filter civic grievances submitted across Tamil Nadu, with live status and departmental action timelines.",
};

export default function ChallengesPage() {
  return (
    <div id="page-challenges">
      <PageHeader
        eyebrow={<T k="page.challenges.eyebrow" />}
        title={<T k="ch.h1" />}
        description={<T k="ch.p" />}
        crumbs={[
          { href: "/", label: <T k="gov.nav.home" /> },
          { label: <T k="gov.nav.issues" /> },
        ]}
        actions={
          <Link href="/report" className="btn btn-primary btn-sm">
            <Icon name="plus" size={13} />
            <T k="gov.report" />
          </Link>
        }
      />

      <ChallengeBrowser />
    </div>
  );
}
