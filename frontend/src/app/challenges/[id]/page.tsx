import { Suspense } from "react";
import type { Metadata } from "next";
import ChallengeDetail from "@/components/challenge-detail";
import { Skeleton } from "@/components/portal/skeleton";

export async function generateMetadata({
  params,
}: PageProps<"/challenges/[id]">): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Grievance ${id}`,
    description:
      "Track the departmental action, assigned officer and resolution timeline for this citizen grievance.",
  };
}

// Skeleton shown while the dynamic param streams in during prerendering
// (Next 16 Cache Components requires `params` reads behind a Suspense boundary).
function DetailFallback() {
  return (
    <div className="mx-auto max-w-5xl">
      <Skeleton className="mb-4 h-3 w-40" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="card-gov space-y-3 p-5 sm:p-6">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
}

async function ChallengeDetailShell({
  params,
}: {
  params: PageProps<"/challenges/[id]">["params"];
}) {
  const { id } = await params;
  return <ChallengeDetail id={id} />;
}

// This route has a dynamic param that is not known at build time. The root
// layout reads the pathname with `usePathname()`, so the route is allowed to
// block (rendered per request) instead of being prerendered — that keeps the
// layout free of a dynamic hole, which would leave the header un-hydrated.
export const instant = false;

export default function ChallengeDetailPage(
  props: PageProps<"/challenges/[id]">,
) {
  return (
    <Suspense fallback={<DetailFallback />}>
      <ChallengeDetailShell params={props.params} />
    </Suspense>
  );
}
