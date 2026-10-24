"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_REPORTS,
  type Report,
  type TimelineEntry,
} from "@/lib/data";
import {
  ApiError,
  adminLogin,
  adminMe,
  clearAdminToken,
  createReport as apiCreateReport,
  getAdminToken,
  listReports,
  setAdminToken,
  updateReport as apiUpdateReport,
  type AdminUser,
  type CreateReportInput,
} from "@/lib/api";
import { A11yProvider } from "@/components/a11y-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { captureCampaign } from "@/lib/utm";

// ================= REPORTS STORE =================
//
// The database is the single source of truth. `ReportsProvider` loads the
// register from GET /api/reports on mount and keeps it in sync with every
// mutation the app performs.

type ReportsContextValue = {
  reports: Report[];
  /** True while the initial load is in flight. */
  loading: boolean;
  /** Message from the last failed load/mutation, or null. */
  error: string | null;
  /** Re-fetch the register from the API. */
  refresh: () => Promise<void>;
  /** Create a report through the API. Resolves with the server's record. */
  addReport: (input: CreateReportInput) => Promise<Report>;
  /** Apply an admin edit through the API. Resolves with the updated record. */
  updateReport: (
    id: string,
    changes: Partial<Report>,
    timelineEntry?: TimelineEntry
  ) => Promise<Report>;
};

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function useReports(): ReportsContextValue {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used within a ReportsProvider");
  return ctx;
}

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong while talking to the CIVICFORCE API.";
}

function ReportsProvider({ children }: { children: ReactNode }) {
  // The prerendered shell renders with the seeded rows so the first paint is
  // never empty; the live API response replaces them as soon as we mount.
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegister = useCallback(() => listReports({ limit: 100 }), []);

  const load = useCallback(
    async (showSpinner: boolean) => {
      if (showSpinner) setLoading(true);
      try {
        const { reports: fresh } = await fetchRegister();
        setReports(fresh);
        setError(null);
      } catch (err) {
        // The API is unreachable — drop the placeholder rows so the UI shows
        // the failure instead of stale seed data.
        setReports([]);
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [fetchRegister]
  );

  /** Re-fetch the register from the API. */
  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    let cancelled = false;

    // Initial load. The state updates live in the promise callbacks, so the
    // effect body itself never sets state synchronously.
    fetchRegister()
      .then(({ reports: fresh }) => {
        if (cancelled) return;
        setReports(fresh);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setReports([]);
        setError(errorMessage(err));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchRegister]);

  const addReport = useCallback(async (input: CreateReportInput) => {
    setError(null);
    try {
      const created = await apiCreateReport(input);
      setReports((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      return created;
    } catch (err) {
      const message = errorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const updateReport = useCallback(
    async (id: string, changes: Partial<Report>, timelineEntry?: TimelineEntry) => {
      setError(null);
      try {
        // The server owns the timeline: a note is appended as a new entry
        // whenever the status changes.
        const updated = await apiUpdateReport(
          id,
          changes as Parameters<typeof apiUpdateReport>[1],
          timelineEntry?.note
        );
        setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        return updated;
      } catch (err) {
        const message = errorMessage(err);
        setError(message);
        throw err;
      }
    },
    []
  );

  const value = useMemo<ReportsContextValue>(
    () => ({ reports, loading, error, refresh, addReport, updateReport }),
    [reports, loading, error, refresh, addReport, updateReport]
  );

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
}

// ================= STRICT ADMIN AUTH =================
//
// The JWT is issued by POST /api/admin/login and stored in localStorage.
// Every admin endpoint is called with `Authorization: Bearer <token>`.

type AuthContextValue = {
  isAdmin: boolean;
  admin: AdminUser | null;
  /** True while the stored session is being validated on mount. */
  checking: boolean;
  /** Resolves true when the credentials are accepted by the API. */
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  // Restore an existing session on mount: the token may still be valid even
  // after a full page reload.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (!getAdminToken()) {
        setChecking(false);
        return;
      }
      try {
        const me = await adminMe();
        if (cancelled) return;
        setAdmin(me);
        setIsAdmin(true);
      } catch (err) {
        // Only throw the token away when the server actually rejects it.
        // A transient hiccup (backend restarting, request timeout) must not
        // silently sign the administrator out — the token is still valid and
        // the next mount can restore the session with it.
        const status = err instanceof ApiError ? err.status : 0;
        if (status === 401 || status === 403) {
          clearAdminToken();
        }
        if (!cancelled) {
          setAdmin(null);
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const session = await adminLogin(email, password);
      setAdminToken(session.token);
      setAdmin(session.admin);
      setIsAdmin(true);
      return true;
    } catch {
      clearAdminToken();
      setAdmin(null);
      setIsAdmin(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setAdmin(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAdmin, admin, checking, login, logout }),
    [isAdmin, admin, checking, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <A11yProvider>
        <LanguageProvider>
          <ReportsProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReportsProvider>
        </LanguageProvider>
      </A11yProvider>
    </ThemeProvider>
  );
}

/**
 * Captures first-touch UTM parameters once the app is interactive. Rendered
 * outside the page tree so every route contributes to the same attribution.
 */
export function CampaignCapture() {
  useEffect(() => {
    captureCampaign();
  }, []);
  return null;
}
