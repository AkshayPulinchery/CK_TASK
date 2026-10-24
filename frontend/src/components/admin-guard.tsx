"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { Skeleton } from "@/components/portal/skeleton";

// STRICT AUTH PROTECTION: blocks the Admin Queue and Admin Review pages
// until administrator credentials have been verified.
//
// `checking` is true while a stored JWT is being validated against
// GET /api/admin/me. During that window the guard must wait — bouncing to
// /login would sign out a valid session on every page refresh.
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, checking } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (checking || isAdmin || redirectedRef.current) return;
    redirectedRef.current = true;
    router.replace("/login");
  }, [isAdmin, checking, router]);

  if (checking) {
    return (
      <div className="mx-auto max-w-4xl space-y-3" role="status" aria-label="Verifying administrator session">
        <div className="card-gov p-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        </div>
        <div className="card-gov space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <span className="sr-only">Verifying administrator session…</span>
      </div>
    );
  }

  if (!isAdmin) return null;
  return <>{children}</>;
}
