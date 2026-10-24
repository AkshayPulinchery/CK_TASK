// Typed client for the CIVICFORCE backend API.
//
// The backend (societal-challenges) is an Express + Prisma + PostgreSQL
// service that owns every write to the database. This module is the single
// place the browser talks to it, so the rest of the app never has to deal
// with URLs, auth headers, or the `{ data, meta }` response envelope.
//
// Endpoints (see the backend README for the full reference):
//
//   GET    /api/reports                 list + filter
//   GET    /api/reports/:id             fetch one (TNCR-#### or UUID)
//   POST   /api/reports                 create (server runs AI triage)
//   PUT    /api/reports/:id             admin edit            (auth)
//   PATCH  /api/reports/:id/status      status transition     (auth)
//   POST   /api/reports/:id/photos      attach base64 photos
//   POST   /api/reports/:id/vote        upvote (idempotent)
//   POST   /api/admin/login            email + password -> JWT
//   GET    /api/admin/me                validate the token    (auth)
//   GET    /api/admin/stats             dashboard counters    (auth)

import type { Report, Urgency } from "@/lib/data";

// Point this at the deployed API in production, e.g.
//   NEXT_PUBLIC_API_BASE_URL=https://civicforce.vercel.app
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

const TOKEN_STORAGE_KEY = "civicforce-admin-token";
const VOTER_KEY_STORAGE_KEY = "civicforce-voter-key";

/** Error thrown for any non-2xx response or a failed network call. */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: string,
    status: number,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// ================= AUTH TOKEN =================

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* storage unavailable — the session simply won't survive a reload */
  }
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * A stable per-browser identifier used for anonymous, one-per-device voting.
 * The backend enforces one vote per voter key.
 */
export function getVoterKey(): string {
  if (typeof window === "undefined") return "server";
  try {
    let key = window.localStorage.getItem(VOTER_KEY_STORAGE_KEY);
    if (!key) {
      key = `voter-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
      window.localStorage.setItem(VOTER_KEY_STORAGE_KEY, key);
    }
    return key;
  } catch {
    return "anonymous";
  }
}

// ================= CORE REQUEST =================

type ApiInit = RequestInit & {
  /** Attach the stored admin JWT as a Bearer token. */
  auth?: boolean;
};

type ApiErrorBody = {
  error?: { code?: string; message?: string; details?: unknown };
};

async function apiFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const { auth, headers: initHeaders, ...rest } = init;

  const headers = new Headers(initHeaders);
  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getAdminToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers });
  } catch {
    throw new ApiError(
      `Cannot reach the CIVICFORCE API at ${API_BASE_URL}. Is the backend running?`,
      "NETWORK_ERROR",
      0
    );
  }

  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const body = payload as ApiErrorBody | null;
    throw new ApiError(
      body?.error?.message ?? `Request failed with status ${res.status}.`,
      body?.error?.code ?? "HTTP_ERROR",
      res.status,
      body?.error?.details
    );
  }

  return payload as T;
}

// ================= REPORTS =================

export type ListReportsParams = {
  district?: string;
  status?: string;
  category?: string;
  urgency?: Urgency | string;
  pincode?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: "newest" | "oldest" | "votes";
};

export type ReportsMeta = {
  total: number;
  limit: number;
  offset: number;
  count: number;
};

export async function listReports(
  params: ListReportsParams = {}
): Promise<{ reports: Report[]; meta: ReportsMeta }> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }
  const suffix = query.toString() ? `?${query.toString()}` : "";

  const body = await apiFetch<{ data: Report[]; meta: ReportsMeta }>(
    `/api/reports${suffix}`
  );
  return { reports: body.data ?? [], meta: body.meta };
}

export async function getReport(id: string): Promise<Report> {
  const body = await apiFetch<{ data: Report }>(
    `/api/reports/${encodeURIComponent(id)}`
  );
  return body.data;
}

export type CreateReportInput = {
  title: string;
  description: string;
  district: string;
  pincode?: string | null;
  landmark?: string | null;
  category?: string;
  urgency?: Urgency | string;
  lat?: number;
  lng?: number;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  /** Base64 data URLs, at most 3. */
  photos?: string[];
};

export async function createReport(input: CreateReportInput): Promise<Report> {
  const body = await apiFetch<{ data: Report }>("/api/reports", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return body.data;
}

export type UpdateReportInput = Partial<CreateReportInput>;

/**
 * Admin edit. `note` becomes a public timeline entry when the status changes.
 */
export async function updateReport(
  id: string,
  changes: UpdateReportInput,
  note?: string
): Promise<Report> {
  const body = await apiFetch<{ data: Report }>(
    `/api/reports/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      auth: true,
      body: JSON.stringify({ ...changes, ...(note ? { note } : {}) }),
    }
  );
  return body.data;
}

export async function updateReportStatus(
  id: string,
  status: string,
  note?: string
): Promise<Report> {
  const body = await apiFetch<{ data: Report }>(
    `/api/reports/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    }
  );
  return body.data;
}

export async function attachPhotos(
  id: string,
  photos: { data: string; mimeType?: string }[]
): Promise<number> {
  const body = await apiFetch<{ data: unknown[]; meta: { photo_count: number } }>(
    `/api/reports/${encodeURIComponent(id)}/photos`,
    { method: "POST", body: JSON.stringify({ photos }) }
  );
  return body.meta?.photo_count ?? body.data?.length ?? 0;
}

export async function voteReport(id: string): Promise<number> {
  const body = await apiFetch<{ data: { votes: number } }>(
    `/api/reports/${encodeURIComponent(id)}/vote`,
    { method: "POST", body: JSON.stringify({ voterKey: getVoterKey() }) }
  );
  return body.data.votes;
}

// ================= ADMIN =================

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type AdminSession = {
  token: string;
  role: string;
  admin: AdminUser;
};

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminSession> {
  const body = await apiFetch<AdminSession>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return body;
}

export async function adminMe(): Promise<AdminUser> {
  const body = await apiFetch<{ data: AdminUser }>("/api/admin/me", { auth: true });
  return body.data;
}

export async function adminStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byDistrict: Record<string, number>;
}> {
  const body = await apiFetch<{
    data: {
      total: number;
      byStatus: Record<string, number>;
      byDistrict: Record<string, number>;
    };
  }>("/api/admin/stats", { auth: true });
  return body.data;
}
