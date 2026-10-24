import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

export type Crumb = { href?: string; label: ReactNode };

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
};

/** Shared page masthead: breadcrumb, eyebrow, title, rule and optional actions. */
export default function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-5">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1.5 text-[10.5px]">
          {crumbs.map((crumb, index) => (
            <span key={index} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <Icon name="chevronRight" size={9} className="text-[var(--gov-muted)]" aria-hidden="true" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="font-semibold text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-semibold text-[var(--gov-heading)]">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-tight text-[var(--gov-heading)] sm:text-[30px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-[var(--gov-muted)]">
              {description}
            </p>
          )}
          <div className="title-rule mt-3" aria-hidden="true" />
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
