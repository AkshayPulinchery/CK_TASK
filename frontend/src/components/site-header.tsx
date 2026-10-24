"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { useA11y } from "@/components/a11y-provider";
import { useTheme, type ThemeMode } from "@/components/theme-provider";
import { FlagBadge, Icon, TnCrest, type IconName } from "@/components/icons";
import { LANGUAGES } from "@/lib/i18n";
import SearchModal from "@/components/portal/search-modal";

type NavItem = { href: string; key: string; icon: IconName };

const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "gov.nav.home", icon: "home" },
  { href: "/challenges", key: "gov.nav.issues", icon: "list" },
  { href: "/map", key: "gov.nav.map", icon: "mapPin" },
  { href: "/analytics", key: "gov.nav.analytics", icon: "chart" },
  { href: "/officers", key: "gov.nav.officers", icon: "users" },
];

const THEME_OPTIONS: { mode: ThemeMode; icon: IconName; labelKey: string }[] = [
  { mode: "light", icon: "sun", labelKey: "gov.utility.themeLight" },
  { mode: "dark", icon: "moon", labelKey: "gov.utility.themeDark" },
  { mode: "system", icon: "monitor", labelKey: "gov.utility.themeSystem" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const { contrast, toggleContrast, decreaseScale, increaseScale, resetScale, canDecrease, canIncrease, scale } =
    useA11y();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notice, setNotice] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const noticeTimer = useRef<number | null>(null);

  // Close the drawer on navigation. Adjusting state during render (rather
  // than in an effect) is React's documented pattern for reacting to a new
  // prop/pathname and avoids a cascading render.
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setDrawerOpen(false);
  }

  // Header shadow after a short scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Search can be opened from anywhere via the `/` shortcut.
  useEffect(() => {
    const open = () => setSearchOpen(true);
    window.addEventListener("civicforce:open-search", open);
    return () => window.removeEventListener("civicforce:open-search", open);
  }, []);

  // Drawer: focus, Escape, scroll lock and a simple focus trap.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const handleSignOut = useCallback(() => {
    logout();
    setDrawerOpen(false);
    setNotice("You have signed out of the departmental queue.");
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 5000);
    router.push("/");
  }, [logout, router]);

  const openSearch = () => setSearchOpen(true);

  return (
    <>
      <header className="site-header relative z-40">
        {/* ---------- Tier 1: Government utility bar ---------- */}
        <div className="bg-[var(--gov-utility)] text-white">
          <div className="container-gov flex h-9 items-center justify-between gap-2 text-[11.5px]">
            <div className="flex min-w-0 items-center gap-2.5">
              <FlagBadge className="shrink-0 rounded-[1px] shadow-sm ring-1 ring-white/20" />
              <span className="truncate font-semibold tracking-wide">
                {t("gov.utility.govOfTn")}
              </span>
              <span className="hidden text-white/30 sm:inline">|</span>
              <span className="hidden shrink-0 text-white/80 sm:inline" lang="ta">
                தமிழ்நாடு அரசு
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <div className="hidden items-center gap-0.5 md:flex" role="group" aria-label={t("gov.utility.textSize")}>
                <button
                  type="button"
                  onClick={decreaseScale}
                  disabled={!canDecrease}
                  aria-label={t("gov.utility.textSmaller")}
                  title={t("gov.utility.textSmaller")}
                  className="grid h-6 w-6 place-items-center rounded text-[10px] font-bold text-white/85 transition-colors hover:bg-white/10 disabled:opacity-35"
                >
                  A−
                </button>
                <button
                  type="button"
                  onClick={resetScale}
                  aria-label={t("gov.utility.textNormal")}
                  title={t("gov.utility.textNormal")}
                  aria-pressed={scale === 1}
                  className={`grid h-6 w-6 place-items-center rounded text-[11px] font-bold transition-colors hover:bg-white/10 ${
                    scale === 1 ? "bg-white/15 text-white" : "text-white/85"
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={increaseScale}
                  disabled={!canIncrease}
                  aria-label={t("gov.utility.textLarger")}
                  title={t("gov.utility.textLarger")}
                  className="grid h-6 w-6 place-items-center rounded text-[12px] font-bold text-white/85 transition-colors hover:bg-white/10 disabled:opacity-35"
                >
                  A+
                </button>
              </div>

              <span className="mx-1 hidden h-4 w-px bg-white/20 md:inline" />

              <button
                type="button"
                onClick={toggleContrast}
                aria-pressed={contrast}
                aria-label={contrast ? t("gov.utility.contrastOff") : t("gov.utility.contrastOn")}
                title={contrast ? t("gov.utility.contrastOff") : t("gov.utility.contrastOn")}
                className={`grid h-6 w-6 place-items-center rounded transition-colors hover:bg-white/10 ${
                  contrast ? "bg-[var(--gov-gold)] text-[var(--gov-navy-deep)]" : "text-white/85"
                }`}
              >
                <Icon name="contrast" size={14} />
              </button>

              <span className="mx-1 hidden h-4 w-px bg-white/20 sm:inline" />

              <div className="flex items-center gap-0.5" role="group" aria-label={t("gov.utility.theme")}>
                {THEME_OPTIONS.map((option) => {
                  const active = theme === option.mode;
                  return (
                    <button
                      key={option.mode}
                      type="button"
                      onClick={() => setTheme(option.mode)}
                      aria-pressed={active}
                      aria-label={t(option.labelKey)}
                      title={t(option.labelKey)}
                      className={`grid h-6 w-6 place-items-center rounded transition-colors hover:bg-white/10 ${
                        active ? "bg-white/20 text-white" : "text-white/75"
                      }`}
                    >
                      <Icon name={option.icon} size={13} />
                    </button>
                  );
                })}
              </div>

              <span className="mx-1 hidden h-4 w-px bg-white/20 sm:inline" />

              <div className="flex items-center gap-0.5" role="group" aria-label={t("gov.utility.lang")}>
                {LANGUAGES.map((option) => {
                  const active = option.code === lang;
                  if (option.code === "hi") return null;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      lang={option.code}
                      onClick={() => setLang(option.code)}
                      aria-pressed={active}
                      className={`rounded px-1.5 py-1 text-[11px] font-bold transition-colors ${
                        active
                          ? "bg-white/15 text-white underline decoration-[var(--gov-gold)] decoration-2 underline-offset-4"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {option.code === "en" ? "English" : option.label}
                    </button>
                  );
                })}
              </div>

              <span className="mx-1 hidden h-4 w-px bg-white/20 sm:inline" />

              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hidden items-center gap-1 rounded px-2 py-1 text-[11px] font-bold text-[var(--gov-gold)] transition-colors hover:bg-white/10 sm:inline-flex"
                >
                  <Icon name="logout" size={12} />
                  {t("gov.signOut")}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden items-center gap-1 rounded px-2 py-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
                >
                  <Icon name="lock" size={11} />
                  {t("gov.admin")}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="gold-rule h-[2px]" aria-hidden="true" />
      </header>

      {/* ---------- Tier 2: Main navigation (sticky) ---------- */}
      <div
        className={`site-header site-nav-glass sticky top-0 z-50 border-b border-[var(--gov-border)] backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_18px_-8px_rgba(15,41,66,0.35)]" : ""
        }`}
      >
          <div className="container-gov flex h-[68px] items-center gap-3">
            <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label={t("gov.brandHome")}>
              <TnCrest size={40} className="shrink-0 transition-transform duration-300 group-hover:scale-105" />
              <span className="min-w-0">
                <span className="flex items-baseline gap-1.5">
                  <span className="truncate text-[18px] font-extrabold leading-none tracking-tight text-[var(--gov-heading)] sm:text-[20px]">
                    CivicForce <span className="text-[var(--gov-link)]">TN</span>
                  </span>
                  <span className="hidden rounded-[2px] border border-[var(--gov-gold)] bg-[var(--gov-gold-soft)] px-1 py-[1px] text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--gov-gold-ink)] sm:inline">
                    Govt
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--gov-muted)]">
                  {t("gov.tagline")}
                </span>
              </span>
            </Link>

            <nav className="ml-3 hidden flex-1 items-stretch self-stretch lg:flex" aria-label="Primary">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center px-3 text-[12.5px] font-bold transition-colors ${
                      active
                        ? "text-[var(--gov-link)]"
                        : "text-[var(--gov-ink)] hover:text-[var(--gov-link)]"
                    }`}
                  >
                    {t(item.key)}
                    <span
                      className={`absolute inset-x-2.5 bottom-0 h-[3px] rounded-t bg-[var(--gov-gold)] transition-transform duration-200 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={openSearch}
                aria-label={t("gov.search")}
                className="hidden h-9 w-[190px] items-center gap-2 rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] px-2.5 text-left text-[12px] text-[var(--gov-muted)] transition-colors hover:border-[var(--gov-border)] hover:bg-[var(--gov-card)] xl:flex"
              >
                <Icon name="search" size={15} />
                <span className="flex-1 truncate">{t("gov.searchPlaceholder")}</span>
                <kbd className="rounded border border-[var(--gov-border)] bg-[var(--gov-card)] px-1 text-[10px] font-bold">
                  /
                </kbd>
              </button>

              <button
                type="button"
                onClick={openSearch}
                aria-label={t("gov.search")}
                className="grid h-9 w-9 place-items-center rounded border border-[var(--gov-border)] text-[var(--gov-heading)] transition-colors hover:bg-[var(--gov-slate)] xl:hidden"
              >
                <Icon name="search" size={17} />
              </button>

              <Link href="/report" className="btn btn-primary hidden sm:inline-flex">
                <Icon name="megaphone" size={15} />
                {t("gov.report")}
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={t("gov.openMenu")}
                aria-expanded={drawerOpen}
                className="grid h-9 w-9 place-items-center rounded border border-[var(--gov-border)] text-[var(--gov-heading)] transition-colors hover:bg-[var(--gov-slate)] lg:hidden"
              >
                <Icon name="menu" size={18} />
              </button>
            </div>
          </div>

        {notice && (
          <div className="container-gov">
            <p
              role="status"
              className="mb-2 mt-2 flex items-center gap-2 rounded border border-[var(--gov-emerald)]/30 bg-[var(--gov-emerald-soft)] px-3 py-2 text-[12px] font-bold text-[var(--gov-link)]"
            >
              <Icon name="checkCircle" size={15} />
              {notice}
            </p>
          </div>
        )}
      </div>

      {/* ---------- Mobile drawer ---------- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[85] lg:hidden">
          <button
            type="button"
            aria-label={t("gov.closeMenu")}
            className="absolute inset-0 bg-[rgba(10,30,49,0.6)] backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            tabIndex={-1}
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("gov.menu")}
            className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-[var(--gov-card)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--gov-border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <TnCrest size={32} />
                <div>
                  <p className="text-sm font-extrabold leading-none text-[var(--gov-heading)]">
                    CivicForce <span className="text-[var(--gov-link)]">TN</span>
                  </p>
                  <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[var(--gov-muted)]">
                    {t("gov.tagline")}
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t("gov.closeMenu")}
                className="grid h-8 w-8 place-items-center rounded border border-[var(--gov-border)] text-[var(--gov-heading)] hover:bg-[var(--gov-slate)]"
              >
                <Icon name="close" size={17} />
              </button>
            </div>

            <div className="thin-scroll flex-1 overflow-y-auto px-3 py-3">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  openSearch();
                }}
                className="mb-3 flex w-full items-center gap-2 rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] px-3 py-2.5 text-left text-[12.5px] text-[var(--gov-muted)]"
              >
                <Icon name="search" size={15} />
                {t("gov.searchPlaceholder")}
              </button>

              <nav aria-label="Mobile primary">
                <ul className="space-y-0.5">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setDrawerOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-2.5 rounded px-3 py-2.5 text-[13px] font-bold transition-colors ${
                            active
                              ? "bg-[var(--gov-emerald-soft)] text-[var(--gov-link)]"
                              : "text-[var(--gov-ink)] hover:bg-[var(--gov-slate)]"
                          }`}
                        >
                          <Icon name={item.icon} size={16} />
                          {t(item.key)}
                          {active && <Icon name="chevronRight" size={14} className="ml-auto" />}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      href="/circulars"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-2.5 rounded px-3 py-2.5 text-[13px] font-bold text-[var(--gov-ink)] transition-colors hover:bg-[var(--gov-slate)]"
                    >
                      <Icon name="newspaper" size={16} />
                      {t("gov.nav.circulars")}
                    </Link>
                  </li>
                </ul>
              </nav>

              <Link
                href="/report"
                onClick={() => setDrawerOpen(false)}
                className="btn btn-primary mt-4 w-full"
              >
                <Icon name="megaphone" size={15} />
                {t("gov.report")}
              </Link>

              <div className="mt-5 rounded border border-[var(--gov-border)]">
                <div className="border-b border-[var(--gov-border)] px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--gov-muted)]">
                    {t("gov.utility.textSize")} &amp; {t("gov.a11y.contrast")}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex overflow-hidden rounded border border-[var(--gov-border)]">
                      <button
                        type="button"
                        onClick={decreaseScale}
                        disabled={!canDecrease}
                        className="px-3 py-1 text-[11px] font-bold text-[var(--gov-heading)] disabled:opacity-40"
                        aria-label={t("gov.utility.textSmaller")}
                      >
                        A−
                      </button>
                      <button
                        type="button"
                        onClick={resetScale}
                        className="border-x border-[var(--gov-border)] px-3 py-1 text-[11px] font-bold text-[var(--gov-heading)]"
                        aria-label={t("gov.utility.textNormal")}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={increaseScale}
                        disabled={!canIncrease}
                        className="px-3 py-1 text-[11px] font-bold text-[var(--gov-heading)] disabled:opacity-40"
                        aria-label={t("gov.utility.textLarger")}
                      >
                        A+
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={toggleContrast}
                      aria-pressed={contrast}
                      className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-bold ${
                        contrast
                          ? "border-[var(--gov-emerald)] bg-[var(--gov-emerald-soft)] text-[var(--gov-link)]"
                          : "border-[var(--gov-border)] text-[var(--gov-heading)]"
                      }`}
                    >
                      <Icon name="contrast" size={13} />
                      {t("gov.a11y.contrast")}
                    </button>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--gov-muted)]">
                    {t("gov.utility.lang")}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {LANGUAGES.filter((l) => l.code !== "hi").map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        lang={option.code}
                        onClick={() => setLang(option.code)}
                        aria-pressed={lang === option.code}
                        className={`flex-1 rounded border px-2 py-1.5 text-[11.5px] font-bold transition-colors ${
                          lang === option.code
                            ? "border-[var(--gov-emerald)] bg-[var(--gov-emerald-soft)] text-[var(--gov-link)]"
                            : "border-[var(--gov-border)] text-[var(--gov-heading)]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--gov-border)] bg-[var(--gov-slate)] px-3 py-3">
              {isAdmin ? (
                <button type="button" onClick={handleSignOut} className="btn btn-navy w-full">
                  <Icon name="logout" size={15} />
                  {t("gov.signOut")}
                </button>
              ) : (
                <Link href="/login" onClick={() => setDrawerOpen(false)} className="btn btn-outline w-full">
                  <Icon name="lock" size={14} />
                  {t("gov.admin")}
                </Link>
              )}
              <p className="mt-2.5 text-center text-[9.5px] leading-snug text-[var(--gov-muted)]">
                {t("gov.utility.govOfTn")} · {t("gov.tagline")}
              </p>
            </div>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
