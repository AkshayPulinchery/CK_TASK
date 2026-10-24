import { Suspense } from "react";
import type { Metadata } from "next";
import AdminReviewForm from "@/components/admin-review-form";
import { Skeleton } from "@/components/portal/skeleton";

export const metadata: Metadata = {
  title: "Grievance Review",
  robots: { index: false, follow: false },
};

// Skeleton shown while the dynamic param streams in during prerendering
// (Next 16 Cache Components requires `params` reads behind a Suspense boundary).
function ReviewFallback() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Skeleton className="h-3 w-36" />
      <div className="card-gov p-5">
        <div className="mb-2 flex gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="card-gov space-y-3 p-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
}

async function AdminReviewShell({
  params,
}: {
  params: PageProps<"/admin/[id]">["params"];
}) {
  const { id } = await params;
  return <AdminReviewForm id={id} />;
}

// This route has a dynamic param that is not known at build time. The root
// layout reads the pathname with `usePathname()`, so the route is allowed to
// block (rendered per request) instead of being prerendered — that keeps the
// layout free of a dynamic hole, which would leave the header un-hydrated.
export const instant = false;

export default function AdminReviewPage(props: PageProps<"/admin/[id]">) {
  return (
    <Suspense fallback={<ReviewFallback />}>
      <AdminReviewShell params={props.params} />
    </Suspense>
  );
}
