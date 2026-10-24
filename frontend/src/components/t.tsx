"use client";

import type { ElementType } from "react";
import { useI18n } from "@/components/language-provider";

// A tiny client-side translation node so Server Components (page shells that
// need a `metadata` export) can render translated headings and labels.
export function T({
  k,
  as: Tag = "span",
  className,
}: {
  k: string;
  as?: ElementType;
  className?: string;
}) {
  const { t } = useI18n();
  return <Tag className={className}>{t(k)}</Tag>;
}
