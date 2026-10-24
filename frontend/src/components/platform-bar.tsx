"use client";

import { useAuth } from "@/components/providers";
import { useI18n } from "@/components/language-provider";

export default function PlatformBar() {
  const { isAdmin } = useAuth();
  const { t } = useI18n();

  return (
    <div className="bg-[#073B31] text-[#E8F8F5] text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold">{t("bar.network")}</span>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-emerald-200">
        <span>
          {t("bar.emergency")} <strong>1100</strong> / <strong>1913</strong>
        </span>
        <span>•</span>
        {isAdmin ? (
          <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold">
            {t("bar.adminMode")}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300">
            {t("bar.citizenMode")}
          </span>
        )}
      </div>
    </div>
  );
}
