"use client";

import Link from "next/link";
import { Icon, TnCrest } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import LastUpdated from "@/components/portal/last-updated";
import { EMERGENCY_NUMBERS } from "@/lib/portal-data";

const QUICK_LINKS = [
  { href: "/", key: "gov.nav.home" },
  { href: "/challenges", key: "gov.nav.issues" },
  { href: "/map", key: "gov.nav.map" },
  { href: "/analytics", key: "gov.nav.analytics" },
  { href: "/officers", key: "gov.nav.officers" },
  { href: "/circulars", key: "gov.nav.circulars" },
];

const SERVICE_LINKS = [
  { href: "/report", label: "Report an Issue" },
  { href: "/challenges", label: "Track a Grievance" },
  { href: "/officers", label: "Nodal Officer Directory" },
  { href: "/circulars", label: "Circulars & Orders" },
  { href: "/login", label: "Departmental Sign-in" },
];

export default function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="site-footer mt-auto bg-[var(--gov-navy-deep)] text-white/75">
      <div className="gold-rule h-[3px]" aria-hidden="true" />

      <div className="container-gov py-10">
        <div className="grid gap-9 lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded bg-white/95 shadow-sm">
                <TnCrest size={40} />
              </span>
              <div>
                <p className="text-[17px] font-extrabold leading-none tracking-tight text-white">
                  CivicForce <span className="text-[var(--gov-gold)]">TN</span>
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  {t("gov.tagline")}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-white/60">
              An official citizen action channel of the Government of Tamil Nadu for reporting
              non-emergency civic grievances, tracking departmental action and holding public
              services accountable.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {["GIGW 3.0 aligned", "WCAG 2.1 AA", "UX4G design system"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-[3px] border border-white/15 bg-white/5 px-1.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.06em] text-white/70"
                >
                  <Icon name="shield" size={10} />
                  {badge}
                </span>
              ))}
            </div>

            <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-white/55">
              <Icon name="mapPin" size={13} className="mt-0.5 shrink-0" />
              Secretariat, Fort St. George, Chennai 600 009, Tamil Nadu, India
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Portal links">
            <h2 className="mb-3 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--gov-gold)]">
              Portal
            </h2>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[12px] text-white/65 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/25 transition-colors group-hover:bg-[var(--gov-gold)]" />
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Citizen services */}
          <nav aria-label="Citizen services">
            <h2 className="mb-3 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--gov-gold)]">
              Citizen Services
            </h2>
            <ul className="space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[12px] text-white/65 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/25 transition-colors group-hover:bg-[var(--gov-gold)]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Emergency + policies */}
          <div>
            <h2 className="mb-3 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--gov-gold)]">
              Emergency Desk
            </h2>
            <ul className="space-y-2">
              {EMERGENCY_NUMBERS.map((item) => (
                <li key={item.number}>
                  <a
                    href={`tel:${item.number}`}
                    className="flex items-center justify-between gap-2 rounded border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition-colors hover:border-[var(--gov-gold)]/50 hover:bg-white/[0.07]"
                  >
                    <span className="text-[11px] text-white/65">{item.label}</span>
                    <span className="flex items-center gap-1 text-[12.5px] font-extrabold tabular-nums text-[var(--gov-gold)]">
                      <Icon name="phone" size={11} />
                      {item.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mb-2 mt-5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--gov-gold)]">
              Policies
            </h2>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <li>
                <Link href="/privacy" className="text-[11.5px] text-white/60 hover:text-white hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[11.5px] text-white/60 hover:text-white hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-[11.5px] text-white/60 hover:text-white hover:underline">
                  Accessibility
                </Link>
              </li>
              <li>
                <a
                  href="https://www.tn.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11.5px] text-white/60 hover:text-white hover:underline"
                >
                  TN Gov
                  <Icon name="external" size={10} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-9 hairline bg-white/10" />

        <div className="mt-5 flex flex-col gap-3 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Government of Tamil Nadu · CivicForce TN. Content owned by the respective
            departments.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <LastUpdated label="Page Last Updated" className="text-white/50" />
            <span className="hidden h-3 w-px bg-white/15 sm:inline" />
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-semibold text-white/45 transition-colors hover:text-[var(--gov-gold)]"
            >
              <Icon name="sparkle" size={11} className="opacity-70" />
              Follow Cristiano builds for more
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
