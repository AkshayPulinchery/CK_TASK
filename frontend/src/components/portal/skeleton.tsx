/** Shimmer skeletons used while the register and map load. */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function ReportCardSkeleton() {
  return (
    <div className="card-gov p-5">
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="mb-2 h-5 w-4/5" />
      <Skeleton className="mb-4 h-3.5 w-full" />
      <Skeleton className="mb-4 h-3.5 w-2/3" />
      <div className="flex items-center justify-between border-t border-[var(--gov-border)] pt-3">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-20" />
      </div>
    </div>
  );
}

export function ReportFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4" role="status" aria-label="Loading reports">
      {Array.from({ length: count }).map((_, i) => (
        <ReportCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading reports…</span>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-lg border border-[var(--gov-border)] bg-[var(--gov-slate)]"
      style={{ minHeight: 420 }}
      role="status"
      aria-label="Loading map"
    >
      <div className="watermark-grid-dark absolute inset-0" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--gov-border)] border-t-[var(--gov-emerald)]" />
          <span className="text-xs font-bold tracking-wide text-[var(--gov-muted)]">
            Loading district map…
          </span>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="card-gov overflow-hidden" role="status" aria-label="Loading records">
      <div className="flex gap-4 border-b border-[var(--gov-border)] bg-[var(--gov-navy)] px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 bg-white/20" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-[var(--gov-border)] px-4 py-3.5">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3.5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" role="status" aria-label="Loading statistics">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded border border-white/15 bg-white/5 p-4">
          <Skeleton className="mb-2 h-7 w-16 bg-white/20" />
          <Skeleton className="h-3 w-24 bg-white/15" />
        </div>
      ))}
    </div>
  );
}
