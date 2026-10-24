"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import AnnouncementCarousel from "@/components/portal/announcement-carousel";
import { EMERGENCY_NUMBERS } from "@/lib/portal-data";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-lg border border-[#0a1e31] bg-[var(--gov-navy)] text-white shadow-[0_18px_50px_-24px_rgba(15,41,66,0.7)]"
    >
      {/* Blurred collage backdrop — texture behind the content, never over it. */}
      <div
        aria-hidden="true"
        className="hero-collage pointer-events-none absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-collage.svg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[var(--gov-navy)]/45 backdrop-blur-md"
      />
      <div className="watermark-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[var(--gov-emerald)]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[var(--gov-gold)]/10 blur-3xl"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-4 top-24 select-none text-[7rem] font-bold leading-none text-white/[0.035] sm:text-[10rem] lg:top-28"
        aria-hidden="true"
        lang="ta"
      >
        தமிழ்நாடு
      </span>

      <div className="relative z-10 border-b border-white/10 px-5 py-3 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gov-gold)]" />
            {t("home.badge")}
          </p>
          <div className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/45">
            <span className="rounded border border-white/15 px-1.5 py-0.5">GIGW 3.0</span>
            <span className="rounded border border-white/15 px-1.5 py-0.5">WCAG 2.1 AA</span>
            <span className="hidden rounded border border-white/15 px-1.5 py-0.5 sm:inline">UX4G</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid gap-8 p-5 pb-16 sm:p-8 sm:pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:p-10 lg:pb-24">
        <div className="flex flex-col justify-center">
          <h1
            id="hero-title"
            className="max-w-xl text-[28px] font-extrabold leading-[1.1] tracking-tight sm:text-[38px] lg:text-[42px]"
          >
            {t("home.heroTitle1")}
            <br />
            <span className="text-[var(--gov-gold)]">{t("home.heroTitle2")}</span>
          </h1>

          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-white/72 sm:text-[14px]">
            {t("home.heroBody")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Link href="/report" className="btn btn-gold">
              <Icon name="megaphone" size={16} />
              {t("home.ctaReport")}
            </Link>
            <Link
              href="/challenges"
              className="btn border-white/25 bg-white/[0.06] text-white hover:bg-white/[0.12]"
            >
              <Icon name="search" size={15} />
              {t("home.ctaTrack")}
            </Link>
            <a
              href="#grievance-flow"
              className="inline-flex items-center gap-1.5 px-2 py-2 text-[12px] font-bold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {t("home.ctaHow")}
              <Icon name="arrowRight" size={13} />
            </a>
          </div>

          <dl className="mt-7 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-4">
            <div>
              <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-white/45">
                {t("home.trust.depts")}
              </dt>
              <dd className="mt-0.5 text-xl font-extrabold tabular-nums text-white">10</dd>
            </div>
            <div className="border-l border-white/10 pl-3">
              <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-white/45">
                {t("home.trust.districts")}
              </dt>
              <dd className="mt-0.5 text-xl font-extrabold tabular-nums text-white">38</dd>
            </div>
            <div className="border-l border-white/10 pl-3">
              <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-white/45">
                {t("home.trust.sla")}
              </dt>
              <dd className="mt-0.5 text-xl font-extrabold tabular-nums text-white">15</dd>
            </div>
          </dl>

          <p className="mt-3 flex items-center gap-1.5 text-[10.5px] text-white/45">
            <Icon name="shield" size={12} className="shrink-0" />
            {t("home.trust.note")}
          </p>
        </div>

        <div className="space-y-3 self-center">
          <div className="rounded-md border border-[var(--gov-gold)]/35 bg-[#0a1e31]/70 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--gov-gold)]">
                <Icon name="siren" size={14} />
                {t("home.emergency")}
              </p>
              <span className="flex items-center gap-1 rounded bg-[#b3261e] px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-white">
                <span className="h-1 w-1 rounded-full bg-white live-dot" />
                24×7
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {EMERGENCY_NUMBERS.slice(0, 2).map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="group rounded border border-white/12 bg-white/[0.05] px-3 py-2.5 transition-colors hover:border-[var(--gov-gold)]/60 hover:bg-white/[0.09]"
                >
                  <span className="block text-[9px] font-bold uppercase tracking-[0.1em] text-white/50">
                    {item.label}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[22px] font-extrabold tabular-nums leading-none text-white">
                    <Icon name="phone" size={14} className="text-[var(--gov-gold)]" />
                    {item.number}
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-2.5 text-[10px] leading-relaxed text-white/45">
              {t("home.emergencyNote")}{" "}
              <a href="tel:112" className="font-bold text-white/70 underline underline-offset-2 hover:text-white">
                112
              </a>
            </p>
          </div>

          <AnnouncementCarousel />
        </div>
      </div>
    </section>
  );
}
