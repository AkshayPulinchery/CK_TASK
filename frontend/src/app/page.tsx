import Link from "next/link";
import Hero from "@/components/portal/hero";
import StatsTicker from "@/components/portal/stats-ticker";
import Leadership from "@/components/portal/leadership";
import Departments from "@/components/portal/departments";
import DistrictIndex from "@/components/portal/district-index";
import GrievanceFlow from "@/components/portal/grievance-flow";
import RecentReports from "@/components/recent-reports";
import Circulars from "@/components/portal/circulars";
import FaqSection from "@/components/portal/faq-section";
import { Icon } from "@/components/icons";
import { T } from "@/components/t";

export default function HomePage() {
  return (
    <div id="page-home" className="space-y-11 sm:space-y-14">
      <Hero />
      <StatsTicker />

      <Leadership />
      <Departments />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
        <DistrictIndex />
        <GrievanceFlow />
      </div>

      <RecentReports />

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
        <Circulars />
        <FaqSection />
      </div>

      {/* Closing action band */}
      <section
        aria-labelledby="home-cta-title"
        className="relative overflow-hidden rounded-lg border border-[#0a1e31] bg-[var(--gov-navy)] text-white"
      >
        <div className="watermark-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="gold-rule absolute inset-x-0 top-0 h-[3px]" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--gov-gold)]">
              <span className="h-1 w-1 rounded-full bg-[var(--gov-gold)]" />
              <T k="home.bandEyebrow" />
            </p>
            <h2
              id="home-cta-title"
              className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl"
            >
              <T k="home.bandTitle" />
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-white/65">
              <T k="home.bandBody" />
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/45">
              <span className="flex items-center gap-1">
                <Icon name="checkCircle" size={11} /> <T k="home.bandPoint1" />
              </span>
              <span className="flex items-center gap-1">
                <Icon name="checkCircle" size={11} /> <T k="home.bandPoint2" />
              </span>
              <span className="flex items-center gap-1">
                <Icon name="checkCircle" size={11} /> <T k="home.bandPoint3" />
              </span>
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            <Link href="/report" className="btn btn-gold">
              <Icon name="megaphone" size={15} />
              <T k="home.ctaReport" />
            </Link>
            <Link
              href="/challenges"
              className="btn border-white/25 bg-white/[0.06] text-white hover:bg-white/[0.12]"
            >
              <Icon name="search" size={14} />
              <T k="home.ctaTrack" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
