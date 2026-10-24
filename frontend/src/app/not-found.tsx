import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-16 text-center sm:py-20">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--gov-slate)] text-[var(--gov-muted)]">
        <Icon name="search" size={24} />
      </span>
      <p className="eyebrow mt-4">Error 404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-[var(--gov-heading)] sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[var(--gov-muted)]">
        The address you followed does not match any page on this portal. The link may have
        changed, or the grievance record may have been removed.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/challenges" className="btn btn-outline">
          Browse the register
        </Link>
        <Link href="/report" className="btn btn-outline">
          Report an issue
        </Link>
      </div>
    </div>
  );
}
