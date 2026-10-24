"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/data";
import { Icon, TnCrest } from "@/components/icons";
import PasswordField from "@/components/portal/password-field";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailId = useId();
  const errorId = useId();

  const handleStrictLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);
    setSubmitting(true);

    try {
      // Credentials are verified by POST /api/admin/login — the browser never
      // compares the password itself.
      const ok = await login(email.trim(), password.trim());
      if (ok) {
        router.push("/admin");
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card-gov overflow-hidden">
        <div className="relative overflow-hidden bg-[var(--gov-navy)] px-6 py-7 text-center text-white">
          <div className="watermark-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/25">
              <TnCrest size={36} />
            </span>
            <h1 className="mt-3 text-lg font-extrabold sm:text-xl">{t("login.h1")}</h1>
            <p className="mx-auto mt-1 max-w-xs text-[11.5px] leading-relaxed text-white/70">
              {t("login.p")}
            </p>
          </div>
        </div>

        <form onSubmit={handleStrictLogin} noValidate className="space-y-4 p-5 sm:p-6">
          {hasError && (
            <div
              id={errorId}
              role="alert"
              className="flex items-start gap-2 rounded border border-[var(--gov-danger)]/35 bg-[var(--gov-danger-soft)] px-3 py-2.5 text-[11.5px] font-semibold text-[var(--gov-danger)]"
            >
              <Icon name="alertTriangle" size={14} className="mt-0.5 shrink-0" />
              <span>{t("login.error")}</span>
            </div>
          )}

          <div>
            <label htmlFor={emailId} className="label-gov">
              {t("login.email")} <span className="req">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 grid w-9 place-items-center text-[var(--gov-muted)]">
                <Icon name="mail" size={15} />
              </span>
              <input
                id={emailId}
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasError(false);
                }}
                className="input-gov pl-9"
                placeholder="name@tn.gov.in"
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? errorId : undefined}
              />
            </div>
          </div>

          <PasswordField
            label={t("login.password")}
            value={password}
            onChange={(value) => {
              setPassword(value);
              setHasError(false);
            }}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            error={hasError ? t("login.error") : undefined}
          />

          <div className="rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] p-3">
            <p className="flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-[var(--gov-muted)]">
              <Icon name="lock" size={11} />
              {t("login.creds")}
            </p>
            <dl className="mt-1.5 space-y-0.5 text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-[var(--gov-muted)]">{t("login.emailLabel")}</dt>
                <dd className="font-mono font-semibold text-[var(--gov-heading)]">{ADMIN_EMAIL}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-[var(--gov-muted)]">{t("login.passwordLabel")}</dt>
                <dd className="font-mono font-semibold text-[var(--gov-heading)]">{ADMIN_PASSWORD}</dd>
              </div>
            </dl>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary w-full">
            {submitting ? (
              <>
                <Icon name="refresh" size={15} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <Icon name="lock" size={14} />
                {t("login.submit")}
              </>
            )}
          </button>

          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-[var(--gov-muted)]">
            <Icon name="shield" size={12} className="mt-[1px] shrink-0 text-[var(--gov-link)]" />
            {t("login.secure")}
          </p>
        </form>
      </div>

      <p className="mt-3 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
        >
          <Icon name="arrowLeft" size={12} />
          {t("login.back")}
        </Link>
      </p>
    </div>
  );
}
