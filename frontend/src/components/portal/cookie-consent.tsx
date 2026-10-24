"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";

const STORAGE_KEY = "civicforce-cookie-consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  preferences: boolean;
  decidedAt: string;
};

function persist(consent: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* storage may be unavailable in private mode */
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Read after mount so SSR and the first client render agree.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored) return;
    const t = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const acceptAll = () => {
    persist({
      necessary: true,
      analytics: true,
      preferences: true,
      decidedAt: new Date().toISOString(),
    });
    setVisible(false);
  };

  const savePreferences = () => {
    persist({
      necessary: true,
      analytics,
      preferences,
      decidedAt: new Date().toISOString(),
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="cookie-banner fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-4"
    >
      <div
        ref={panelRef}
        className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-[var(--gov-border)] bg-[var(--gov-card)] shadow-[0_-8px_40px_-12px_rgba(15,41,66,0.35)]"
      >
        <div className="h-1 w-full bg-gradient-to-r from-[var(--gov-emerald)] via-[var(--gov-gold)] to-[var(--gov-emerald)]" />
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-5">
          <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--gov-emerald-soft)] text-[var(--gov-link)] sm:grid">
            <Icon name="shield" size={18} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-extrabold text-[var(--gov-heading)]">
              This portal uses cookies to improve service delivery
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--gov-muted)]">
              Essential cookies keep the portal secure and remember your language and accessibility
              settings. Optional cookies help us understand how citizens use the grievance service.
              You can change your choice at any time.{" "}
              <Link href="/privacy" className="font-bold text-[var(--gov-link)] underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>

            {showPrefs && (
              <div className="mt-3 space-y-2 rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] p-3">
                <label className="flex items-start gap-2.5 text-[11.5px]">
                  <input type="checkbox" checked disabled className="mt-0.5 accent-[var(--gov-emerald)]" />
                  <span>
                    <span className="block font-bold text-[var(--gov-heading)]">Strictly necessary</span>
                    <span className="text-[var(--gov-muted)]">
                      Security, session integrity, language and accessibility preferences. Always on.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-[11.5px]">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-0.5 accent-[var(--gov-emerald)]"
                  />
                  <span>
                    <span className="block font-bold text-[var(--gov-heading)]">Service analytics</span>
                    <span className="text-[var(--gov-muted)]">
                      Aggregate, de-identified usage statistics to improve the portal.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-[11.5px]">
                  <input
                    type="checkbox"
                    checked={preferences}
                    onChange={(e) => setPreferences(e.target.checked)}
                    className="mt-0.5 accent-[var(--gov-emerald)]"
                  />
                  <span>
                    <span className="block font-bold text-[var(--gov-heading)]">Preference memory</span>
                    <span className="text-[var(--gov-muted)]">
                      Remembers your last district and department filters.
                    </span>
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:w-44">
            <button type="button" onClick={acceptAll} className="btn btn-primary w-full">
              <Icon name="check" size={14} /> Accept all
            </button>
            <button
              type="button"
              onClick={() => (showPrefs ? savePreferences() : setShowPrefs(true))}
              className="btn btn-outline w-full"
            >
              {showPrefs ? "Save preferences" : "Preferences"}
            </button>
            <Link
              href="/privacy"
              className="text-center text-[10.5px] font-bold text-[var(--gov-muted)] underline underline-offset-2 hover:text-[var(--gov-heading)]"
            >
              Read the privacy policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
