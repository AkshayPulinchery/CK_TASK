"use client";

/**
 * First-touch campaign attribution.
 *
 * UTM parameters are captured on the first page view of a session and kept in
 * `sessionStorage`, so a citizen who lands on a campaign link and navigates
 * through the portal still carries the campaign into their report receipt.
 * Nothing is sent to a third-party analytics service.
 */

export type Campaign = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  id?: string;
  gclid?: string;
  referrer?: string;
  landedAt?: string;
};

const STORAGE_KEY = "civicforce-campaign";

const PARAM_MAP: Record<string, keyof Campaign> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_term: "term",
  utm_content: "content",
  utm_id: "id",
  gclid: "gclid",
};

function readStorage(): Campaign {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Campaign;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Captures campaign parameters from the current URL. Called once from the
 * provider tree. Existing first-touch values win unless the new URL carries
 * explicit UTM parameters.
 */
export function captureCampaign(): Campaign {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const found: Campaign = {};
  let hasCampaign = false;

  for (const [param, key] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (value) {
      found[key] = value.slice(0, 200);
      hasCampaign = true;
    }
  }

  const existing = readStorage();
  if (!hasCampaign && Object.keys(existing).length > 0) return existing;

  const next: Campaign = hasCampaign
    ? {
        ...existing,
        ...found,
      }
    : existing;

  if (hasCampaign) {
    next.landedAt = new Date().toISOString();
    if (!next.referrer && document.referrer) {
      try {
        next.referrer = new URL(document.referrer).hostname.slice(0, 120);
      } catch {
        /* ignore malformed referrer */
      }
    }
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — campaign is simply not persisted */
    }
  }

  return next;
}

export function readCampaign(): Campaign {
  return readStorage();
}

/** Human-readable one-liner, e.g. "whatsapp / social / monsoon-2026". */
export function describeCampaign(campaign: Campaign): string {
  const parts = [campaign.source, campaign.medium, campaign.campaign].filter(Boolean);
  if (parts.length > 0) return parts.join(" / ");
  if (campaign.gclid) return `google / cpc / ${campaign.gclid.slice(0, 18)}`;
  if (campaign.referrer) return `referral / ${campaign.referrer}`;
  return "Direct visit";
}
