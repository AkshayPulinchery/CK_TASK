"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useReports } from "@/components/providers";
import { useI18n } from "@/components/language-provider";
import { categoryKey } from "@/lib/i18n";
import { lookupPincode } from "@/lib/pincode";
import { formatDateTime, TN_DISTRICTS, TN_LOCALITIES, runAiTriage, type Report } from "@/lib/data";
import { describeCampaign, readCampaign } from "@/lib/utm";
import { downloadReceipt } from "@/lib/receipt";
import { Icon } from "@/components/icons";
import CopyButton from "@/components/portal/copy-button";
import ConfirmDialog from "@/components/portal/confirm-dialog";

const ReportLeafletMap = dynamic(() => import("./report-leaflet-map"), {
  ssr: false,
});

// Quick Tamil Nadu locations (from the prototype's "Try clicking" chips).
const QUICK_LOCATIONS = [
  { label: "Anna Salai, Chennai", name: "Anna Salai, Chennai", lat: 13.0418, lng: 80.2481, district: "Chennai" },
  { label: "Ukkadam, Coimbatore", name: "Ukkadam, Coimbatore", lat: 10.9931, lng: 76.9612, district: "Coimbatore" },
  { label: "Periyar, Madurai", name: "Periyar Bus Stand, Madurai", lat: 9.9195, lng: 78.1193, district: "Madurai" },
  { label: "Hasthampatti, Salem", name: "Hasthampatti, Salem", lat: 11.6742, lng: 78.1468, district: "Salem" },
  { label: "Srirangam, Trichy", name: "Srirangam, Trichy", lat: 10.856, lng: 78.6948, district: "Tiruchirappalli" },
];

type QuickLocateArgs = {
  name: string;
  lat: number;
  lng: number;
  district?: string;
  existingLocation: string;
  existingDistrict: string;
};

// Draft key for the crash/close recovery feature.
const DRAFT_STORAGE_KEY = "civicforce-report-draft";

type ReportDraft = {
  title: string;
  description: string;
  district: string;
  pincode: string;
  location: string;
  name: string;
  phone: string;
  email: string;
  photoCount: number;
  lat: number;
  lng: number;
  pinLabel: string;
};

/** A photo selected by the citizen, stored as a base64 data URL. */
type Photo = { id: string; dataUrl: string; name: string };

type Field =
  | "title"
  | "description"
  | "district"
  | "pincode"
  | "location"
  | "email"
  | "phone";

const MAX_PHOTOS = 3;

const DEFAULT_PIN = { lat: 13.0827, lng: 80.2707 };
const DEFAULT_PIN_LABEL = "Chennai Central (13.0827° N, 80.2707° E)";

// `useLayoutEffect` warns on the server; fall back to `useEffect` there.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Campaign data never changes mid-session (first touch wins), so there is
// nothing to subscribe to.
const subscribeToCampaign = () => () => {};

// Read the saved draft from localStorage. This is called from a post-hydration
// layout effect (never during render) so the server markup and the hydration
// render always start from the same empty form.
function readDraft(): Partial<ReportDraft> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Partial<ReportDraft>;
  } catch {
    return {};
  }
}

function fieldError(errors: Partial<Record<Field, string>>, key: Field) {
  return errors[key];
}

function Section({
  step,
  title,
  id,
  children,
}: {
  step: number;
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-[var(--gov-border)] pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--gov-navy)] text-[10px] font-extrabold tabular-nums text-white">
          {step}
        </span>
        <h2 id={id} className="text-[13px] font-extrabold text-[var(--gov-heading)]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function ReportForm() {
  const { addReport } = useReports();
  const { t, tCount, tFill } = useI18n();

  // Fields start empty so the server HTML and the hydration render agree. A
  // saved draft is adopted after hydration (below), before first paint.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [pinStatus, setPinStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "found"; district: string }
    | { kind: "not-found" }
    | { kind: "out-of-state"; state: string }
    | { kind: "error" }
  >({ kind: "idle" });
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [pendingRemove, setPendingRemove] = useState<Photo | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [created, setCreated] = useState<Report | null>(null);
  // Campaign attribution is client-only. Reading it through a store snapshot
  // keeps the server HTML ("") and the hydrated client in agreement without a
  // setState-in-effect cascade.
  const campaign = useSyncExternalStore(
    subscribeToCampaign,
    () => describeCampaign(readCampaign()),
    () => ""
  );

  const photoCount = photos.length;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Chennai Central by default — the map auto-points from here.
  const [pin, setPin] = useState(DEFAULT_PIN);
  const [pinLabel, setPinLabel] = useState(DEFAULT_PIN_LABEL);

  // Restore a saved draft only after hydration. Running in a layout effect
  // means the restored values are in place before the browser paints, while
  // the server markup and the hydration render remain identical.
  const [mounted, setMounted] = useState(false);
  useIsoLayoutEffect(() => {
    const draft = readDraft();
    if (draft.title) setTitle(draft.title);
    if (draft.description) setDescription(draft.description);
    if (draft.district) setDistrict(draft.district);
    if (draft.pincode) setPincode(draft.pincode);
    if (draft.location) setLocation(draft.location);
    if (draft.name) setName(draft.name);
    if (draft.phone) setPhone(draft.phone);
    if (draft.email) setEmail(draft.email);
    if (typeof draft.lat === "number" && typeof draft.lng === "number") {
      setPin({ lat: draft.lat, lng: draft.lng });
    }
    if (draft.pinLabel) setPinLabel(draft.pinLabel);
    setMounted(true);
  }, []);

  const draftRestored =
    mounted && Boolean(title || description || district || pincode || location);

  // Live AI triage preview, recomputed as the citizen types.
  const aiPreview = useMemo(() => runAiTriage(title, description), [title, description]);

  const quickLocate = ({
    name: locateName,
    lat,
    lng,
    district: locateDistrict,
    existingLocation,
    existingDistrict,
  }: QuickLocateArgs) => {
    setPin({ lat, lng });
    setPinLabel(`${locateName} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`);

    if (locateDistrict && !existingDistrict) setDistrict(locateDistrict);
    if (!existingLocation) setLocation(locateName);
  };

  const handleLocationInput = (text: string) => {
    setLocation(text);
    setErrors((prev) => ({ ...prev, location: undefined }));
    if (!text || text.trim().length < 3) return;
    const lower = text.toLowerCase();

    const matched = TN_LOCALITIES.find(
      (l) =>
        l.name.toLowerCase().includes(lower) ||
        lower.includes(l.name.toLowerCase().split(",")[0])
    );
    if (matched) {
      quickLocate({
        name: matched.name,
        lat: matched.lat,
        lng: matched.lng,
        district: matched.district,
        existingLocation: text,
        existingDistrict: district,
      });
      return;
    }

    const distMatch = TN_DISTRICTS.find((d) => lower.includes(d.name.toLowerCase()));
    if (distMatch) {
      quickLocate({
        name: `${distMatch.name} District Center`,
        lat: distMatch.lat,
        lng: distMatch.lng,
        district: distMatch.name,
        existingLocation: text,
        existingDistrict: district,
      });
    }
  };

  const onDistrictSelected = (districtName: string) => {
    setDistrict(districtName);
    setErrors((prev) => ({ ...prev, district: undefined }));
    const dist = TN_DISTRICTS.find((d) => d.name === districtName);
    if (dist) {
      quickLocate({
        name: `${dist.name} District Center`,
        lat: dist.lat,
        lng: dist.lng,
        district: dist.name,
        existingLocation: location,
        existingDistrict: districtName,
      });
    }
  };

  // Digits only, capped at 6. A complete pincode kicks off a debounced auto
  // district lookup; superseded requests are aborted.
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lookupController = useRef<AbortController | null>(null);

  const cancelLookup = () => {
    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    lookupTimer.current = null;
    lookupController.current?.abort();
    lookupController.current = null;
  };

  const handlePincodeInput = (text: string) => {
    const next = text.replace(/\D/g, "").slice(0, 6);
    setPincode(next);
    setErrors((prev) => ({ ...prev, pincode: undefined }));
    cancelLookup();

    if (next.length !== 6) {
      setPinStatus({ kind: "idle" });
      return;
    }

    const controller = new AbortController();
    lookupController.current = controller;
    setPinStatus({ kind: "loading" });

    lookupTimer.current = setTimeout(async () => {
      const result = await lookupPincode(next, controller.signal);
      if (controller.signal.aborted) return;

      if (result.status === "found") {
        setPinStatus({ kind: "found", district: result.district });
        setDistrict(result.district);
        const dist = TN_DISTRICTS.find((d) => d.name === result.district);
        if (dist) {
          setPin({
            lat: dist.lat,
            lng: dist.lng,
          });
          setPinLabel(
            `${dist.name} District Center (${dist.lat.toFixed(4)}° N, ${dist.lng.toFixed(4)}° E)`
          );
        }
      } else if (result.status === "out-of-state") {
        setPinStatus({ kind: "out-of-state", state: result.state });
      } else if (result.status === "not-found") {
        setPinStatus({ kind: "not-found" });
      } else {
        setPinStatus({ kind: "error" });
      }
    }, 400);
  };

  useEffect(() => cancelLookup, []);

  const handlePinChange = (lat: number, lng: number) => {
    setPin({ lat, lng });
    setPinLabel(`Manual Pin (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E)`);
  };

  // Persist the in-progress report as the citizen types.
  const isFirstSave = useRef(true);
  useEffect(() => {
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }

    const draft: ReportDraft = {
      title,
      description,
      district,
      pincode,
      location,
      name,
      phone,
      email,
      photoCount,
      lat: pin.lat,
      lng: pin.lng,
      pinLabel,
    };

    const isEmpty = !title && !description && !district && !pincode && !location;
    try {
      if (isEmpty) localStorage.removeItem(DRAFT_STORAGE_KEY);
      else localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable — draft saving is best-effort */
    }
  }, [title, description, district, pincode, location, name, phone, email, photoCount, pin, pinLabel]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setTitle("");
    setDescription("");
    setDistrict("");
    setPincode("");
    setPinStatus({ kind: "idle" });
    setLocation("");
    setName("");
    setPhone("");
    setEmail("");
    setPhotos([]);
    setPin(DEFAULT_PIN);
    setPinLabel(DEFAULT_PIN_LABEL);
    setPhotoError("");
  };

  // Read selected images as base64 data URLs so they can be posted directly.
  const handlePhotoFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPhotoError("");

    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      setPhotoError(t("report.f.photoLimit"));
      return;
    }

    const selected = Array.from(files).slice(0, room);
    if (files.length > room) setPhotoError(t("report.f.photoLimit"));

    const readAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

    try {
      const loaded = await Promise.all(
        selected.map(async (file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          dataUrl: await readAsDataUrl(file),
          name: file.name,
        }))
      );
      setPhotos((prev) => [...prev, ...loaded].slice(0, MAX_PHOTOS));
    } catch {
      setPhotoError(t("report.f.photoReadError"));
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setPendingRemove(null);
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};

    if (title.trim().length < 6) next.title = t("report.f.errTitle");
    if (description.trim().length < 20) next.description = t("report.f.errDescription");
    if (!district) next.district = t("report.f.errDistrict");
    if (!/^\d{6}$/.test(pincode) || pinStatus.kind === "out-of-state")
      next.pincode = t("report.f.errPincode");
    if (location.trim().length < 3) next.location = t("report.f.errLocation");

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      next.email = t("report.f.errEmail");
    }
    const digits = phone.replace(/\D/g, "");
    if (phone.trim() && !(digits.length === 10 || (digits.length === 12 && digits.startsWith("91")))) {
      next.phone = t("report.f.errPhone");
    }

    return next;
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const order: { key: Field; ref: React.RefObject<HTMLElement | null> }[] = [
        { key: "title", ref: titleRef },
        { key: "description", ref: descriptionRef },
        { key: "district", ref: districtRef },
        { key: "pincode", ref: pincodeRef },
        { key: "location", ref: locationRef },
        { key: "email", ref: emailRef },
        { key: "phone", ref: phoneRef },
      ];
      order.find((item) => nextErrors[item.key])?.ref.current?.focus();
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const report = await addReport({
        title: title.trim(),
        description: description.trim(),
        district,
        pincode: pincode || null,
        landmark: location.trim() || null,
        lat: pin.lat,
        lng: pin.lng,
        contact_name: name.trim() || null,
        contact_phone: phone.trim() || null,
        contact_email: email.trim() || null,
        photos: photos.map((p) => p.dataUrl),
      });

      clearDraft();
      setCreated(report);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not submit the report. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------- success ------------------------------- */
  if (created) {
    return (
      <div className="card-gov fade-up mx-auto max-w-3xl overflow-hidden">
        <div className="relative overflow-hidden bg-[var(--gov-navy)] px-5 py-8 text-center text-white sm:px-8">
          <div className="watermark-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <svg
              viewBox="0 0 52 52"
              className="mx-auto h-16 w-16 text-[var(--gov-gold)]"
              role="img"
              aria-label="Submission successful"
            >
              <circle
                className="check-ring"
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="check-path"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l8 8 16-16"
              />
            </svg>
            <h2 className="mt-4 text-xl font-extrabold sm:text-2xl">
              {t("report.f.successTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-[12px] leading-relaxed text-white/70">
              {t("report.f.successBody")}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 rounded border border-[var(--gov-gold)]/50 bg-[var(--gov-gold-soft)]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--gov-gold-ink)]">
                {t("report.f.reference")}
              </p>
              <p className="mt-0.5 font-mono text-xl font-extrabold tracking-wide text-[var(--gov-heading)]">
                {created.id}
              </p>
            </div>
            <CopyButton value={created.id} label="Copy reference" className="btn btn-outline btn-sm" />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded border border-[var(--gov-border)] bg-[var(--gov-border)] sm:grid-cols-3">
            {[
              { label: "Category", value: t(categoryKey(created.category)) || created.category },
              {
                label: "Urgency",
                value: t(created.urgency === "High" ? "urg.high" : "urg.normal"),
              },
              { label: "District", value: created.district },
              { label: "Status", value: created.status },
              { label: "Department", value: created.partner ?? "Pending allocation" },
              { label: "Submitted", value: formatDateTime(created.created_at) },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--gov-card)] px-3 py-2.5">
                <dt className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
                  {item.label}
                </dt>
                <dd className="mt-0.5 truncate text-[11.5px] font-bold text-[var(--gov-heading)]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          {campaign && (
            <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[var(--gov-muted)]">
              <Icon name="flag" size={11} />
              {t("report.f.campaign")}: <span className="font-semibold">{campaign}</span>
            </p>
          )}

          <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-[var(--gov-muted)]">
            <Icon name="info" size={12} className="mt-[1px] shrink-0" />
            {t("report.f.receiptNote")}
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link href={`/challenges/${created.id}`} className="btn btn-primary">
              {t("report.f.track")}
              <Icon name="arrowRight" size={14} />
            </Link>
            <button type="button" onClick={() => downloadReceipt(created)} className="btn btn-outline">
              <Icon name="download" size={14} />
              {t("report.f.downloadReceipt")}
            </button>
            <button type="button" onClick={() => window.print()} className="btn btn-ghost">
              <Icon name="printer" size={14} />
              Print
            </button>
            <button
              type="button"
              onClick={() => {
                setCreated(null);
                setSubmitError(null);
                setErrors({});
              }}
              className="btn btn-ghost sm:ml-auto"
            >
              <Icon name="plus" size={14} />
              {t("report.f.another")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- form -------------------------------- */
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="card-gov overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--gov-border)] bg-[var(--gov-slate)] px-5 py-2.5">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[var(--gov-muted)]">
            <Icon name="shield" size={12} />
            {t("report.f.confidential")}
          </p>
          <p className="text-[10px] text-[var(--gov-muted)]">{t("report.f.draftNote")}</p>
        </div>

        <form ref={formRef} onSubmit={handleFormSubmit} noValidate className="p-5 sm:p-6">
          {draftRestored && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--gov-emerald)]/30 bg-[var(--gov-emerald-soft)] px-3 py-2 text-[11px] font-semibold text-[var(--gov-link)]">
              <span className="flex items-center gap-1.5">
                <Icon name="refresh" size={12} />
                {t("report.f.draftRestored")}
              </span>
              <button
                type="button"
                onClick={clearDraft}
                className="rounded border border-[var(--gov-emerald)]/40 px-2 py-0.5 text-[10.5px] font-bold hover:bg-white/20"
              >
                {t("report.f.draftClear")}
              </button>
            </div>
          )}

          {hasErrors && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded border border-[var(--gov-danger)]/35 bg-[var(--gov-danger-soft)] px-3 py-2.5"
            >
              <Icon name="alertTriangle" size={15} className="mt-0.5 shrink-0 text-[var(--gov-danger)]" />
              <div>
                <p className="text-[12px] font-extrabold text-[var(--gov-danger)]">
                  {t("report.f.errorTitle")}
                </p>
                <p className="text-[10.5px] text-[var(--gov-danger-text)]">
                  {tFill("report.f.errorCount", { n: Object.keys(errors).length })}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <Section step={1} id="report-title-label" title={t("report.f.section1")}>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="report-title" className="label-gov">
                    {t("report.f.title")} <span className="req">*</span>
                  </label>
                  <input
                    id="report-title"
                    ref={titleRef}
                    type="text"
                    value={mounted ? title : ""}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    className={`input-gov ${fieldError(errors, "title") ? "input-error" : ""}`}
                    placeholder={t("report.f.titlePh")}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? "report-title-error" : undefined}
                  />
                  {errors.title && (
                    <p id="report-title-error" className="field-error">
                      <Icon name="alertTriangle" size={12} />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="report-description" className="label-gov">
                    {t("report.f.description")} <span className="req">*</span>
                  </label>
                  <textarea
                    id="report-description"
                    ref={descriptionRef}
                    rows={5}
                    value={mounted ? description : ""}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((prev) => ({ ...prev, description: undefined }));
                    }}
                    className={`input-gov resize-y ${fieldError(errors, "description") ? "input-error" : ""}`}
                    placeholder={t("report.f.descriptionPh")}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? "report-description-error" : undefined}
                  />
                  <div className="mt-1 flex items-center justify-between gap-2">
                    {errors.description ? (
                      <p id="report-description-error" className="field-error">
                        <Icon name="alertTriangle" size={12} />
                        {errors.description}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] tabular-nums text-[var(--gov-muted)]">
                      {description.trim().length} · {t("report.f.minHint")}
                    </span>
                  </div>
                </div>
              </div>
            </Section>

            <Section step={2} id="report-location-label" title={t("report.f.section2")}>
              <div className="space-y-3.5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label htmlFor="report-district" className="label-gov">
                      {t("report.f.district")} <span className="req">*</span>
                    </label>
                    <select
                      id="report-district"
                      ref={districtRef}
                      value={mounted ? district : ""}
                      onChange={(e) => onDistrictSelected(e.target.value)}
                      className={`select-gov ${fieldError(errors, "district") ? "input-error" : ""}`}
                      aria-invalid={Boolean(errors.district)}
                      aria-describedby={errors.district ? "report-district-error" : undefined}
                    >
                      <option value="">{t("report.f.districtPh")}</option>
                      {TN_DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p id="report-district-error" className="field-error">
                        <Icon name="alertTriangle" size={12} />
                        {errors.district}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="report-pincode" className="label-gov">
                      {t("report.f.pincode")} <span className="req">*</span>
                    </label>
                    <input
                      id="report-pincode"
                      ref={pincodeRef}
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={mounted ? pincode : ""}
                      onChange={(e) => handlePincodeInput(e.target.value)}
                      className={`input-gov tracking-[0.18em] ${
                        fieldError(errors, "pincode") ? "input-error" : ""
                      }`}
                      placeholder={t("report.f.pincodePh")}
                      aria-invalid={Boolean(errors.pincode)}
                      aria-describedby="report-pincode-status"
                    />
                    {errors.pincode && (
                      <p className="field-error">
                        <Icon name="alertTriangle" size={12} />
                        {errors.pincode}
                      </p>
                    )}
                    <p
                      id="report-pincode-status"
                      role="status"
                      className={`mt-1 flex items-start gap-1 text-[10.5px] leading-snug ${
                        pinStatus.kind === "found"
                          ? "font-semibold text-[var(--gov-link)]"
                          : pinStatus.kind === "idle"
                            ? "text-[var(--gov-muted)]"
                            : "text-[var(--gov-gold-text)]"
                      }`}
                    >
                      {pinStatus.kind === "loading" && (
                        <>
                          <Icon name="refresh" size={11} className="mt-[1px] shrink-0 animate-spin" />
                          {t("report.f.pinLookup")}
                        </>
                      )}
                      {pinStatus.kind === "found" && (
                        <>
                          <Icon name="checkCircle" size={11} className="mt-[1px] shrink-0" />
                          {tFill("report.f.pinFound", { district: pinStatus.district })}
                        </>
                      )}
                      {pinStatus.kind === "not-found" && (
                        <>
                          <Icon name="info" size={11} className="mt-[1px] shrink-0" />
                          {t("report.f.pinNotFound")}
                        </>
                      )}
                      {pinStatus.kind === "out-of-state" && (
                        <>
                          <Icon name="alertTriangle" size={11} className="mt-[1px] shrink-0" />
                          {tFill("report.f.pinOutOfState", { state: pinStatus.state })}
                        </>
                      )}
                      {pinStatus.kind === "error" && (
                        <>
                          <Icon name="info" size={11} className="mt-[1px] shrink-0" />
                          {t("report.f.pinError")}
                        </>
                      )}
                      {pinStatus.kind === "idle" && t("report.f.pincodePh")}
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="report-location" className="label-gov">
                    {t("report.f.locality")} <span className="req">*</span>
                  </label>
                  <input
                    id="report-location"
                    ref={locationRef}
                    type="text"
                    value={mounted ? location : ""}
                    onChange={(e) => handleLocationInput(e.target.value)}
                    className={`input-gov ${fieldError(errors, "location") ? "input-error" : ""}`}
                    placeholder={t("report.f.localityPh")}
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={errors.location ? "report-location-error" : undefined}
                  />
                  {errors.location && (
                    <p id="report-location-error" className="field-error">
                      <Icon name="alertTriangle" size={12} />
                      {errors.location}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[var(--gov-muted)]">
                      {t("report.f.tryClicking")}
                    </span>
                    {QUICK_LOCATIONS.map((q) => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() =>
                          quickLocate({
                            name: q.name,
                            lat: q.lat,
                            lng: q.lng,
                            district: q.district,
                            existingLocation: location,
                            existingDistrict: district,
                          })
                        }
                        className="rounded-[3px] border border-[var(--gov-border)] bg-[var(--gov-card)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--gov-muted)] transition-colors hover:border-[var(--gov-emerald)] hover:bg-[var(--gov-emerald-soft)] hover:text-[var(--gov-link)]"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded border border-[var(--gov-border)] bg-[var(--gov-slate)] px-2 py-1 text-[10px] font-semibold text-[var(--gov-muted)]">
                    <Icon name="mapPin" size={11} className="shrink-0 text-[var(--gov-link)]" />
                    <span className="truncate">{mounted ? pinLabel : DEFAULT_PIN_LABEL}</span>
                  </p>
                </div>

                <div>
                  <p className="label-gov">{t("report.f.map")}</p>
                  <div className="overflow-hidden rounded border border-[var(--gov-border)]">
                    <ReportLeafletMap lat={pin.lat} lng={pin.lng} onPinChange={handlePinChange} />
                  </div>
                  <p className="mt-1.5 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
                    {t("report.f.mapHelp")}
                  </p>
                </div>
              </div>
            </Section>

            <Section step={3} id="report-evidence-label" title={t("report.f.section3")}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  void handlePhotoFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoCount >= MAX_PHOTOS}
                className="w-full rounded border-2 border-dashed border-[var(--gov-border)] bg-[var(--gov-slate)]/60 p-4 text-center transition-colors hover:border-[var(--gov-emerald)] hover:bg-[var(--gov-emerald-soft)]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="mx-auto mb-1.5 grid h-9 w-9 place-items-center rounded-full bg-[var(--gov-card)] text-[var(--gov-link)] shadow-sm">
                  <Icon name="eye" size={17} />
                </span>
                <span className="block text-[12px] font-extrabold text-[var(--gov-heading)]">
                  {t("report.f.photosCta")}
                </span>
                <span className="mt-0.5 block text-[10.5px] text-[var(--gov-muted)]">
                  {tCount("report.f.photoCount", mounted ? photoCount : 0)} · {t("report.f.photos")}
                </span>
              </button>

              {photoError && (
                <p role="alert" className="field-error">
                  <Icon name="alertTriangle" size={12} />
                  {photoError}
                </p>
              )}

              {mounted && photos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {photos.map((photo, i) => (
                    <div
                      key={photo.id}
                      className="group relative h-20 w-20 overflow-hidden rounded border border-[var(--gov-border)] bg-[var(--gov-slate)]"
                      title={photo.name}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.dataUrl}
                        alt={`${t("report.f.photo")} ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPendingRemove(photo)}
                        aria-label={`${t("report.f.remove")} ${i + 1}`}
                        className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-bl bg-[rgba(10,30,49,0.8)] text-white transition-colors hover:bg-[var(--gov-danger)]"
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 rounded border border-[var(--gov-emerald)]/25 bg-[var(--gov-emerald-soft)]/50 p-3">
                <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-[var(--gov-link)]">
                  <Icon name="info" size={12} />
                  {t("report.f.aiNotice")}
                </p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-[var(--gov-muted)]">
                  {t("report.f.aiNoticeBody")}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[var(--gov-emerald)]/15 pt-2">
                  <span className="text-[10px] font-bold text-[var(--gov-muted)]">
                    {t("report.f.aiPreviewLabel")}
                  </span>
                  {photoCount === 0 || !mounted ? (
                    <span className="text-[10px] text-[var(--gov-muted)]">{t("report.f.aiPreviewHint")}</span>
                  ) : (
                    <>
                      <span className="badge badge-emerald">
                        {t(categoryKey(aiPreview.category)) || aiPreview.category}
                      </span>
                      <span className={aiPreview.urgency === "High" ? "badge badge-danger" : "badge badge-navy"}>
                        {t(aiPreview.urgency === "High" ? "urg.high" : "urg.normal")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Section>

            <Section step={4} id="report-contact-label" title={t("report.f.section4")}>
              <div className="mb-2 flex items-center gap-2">
                <span className="badge badge-navy">{t("report.f.confidential")}</span>
                <span className="text-[10px] text-[var(--gov-muted)]">{t("report.f.optional")}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="report-name" className="label-gov">
                    {t("report.f.name")}
                  </label>
                  <input
                    id="report-name"
                    type="text"
                    autoComplete="name"
                    value={mounted ? name : ""}
                    onChange={(e) => setName(e.target.value)}
                    className="input-gov"
                    placeholder={t("report.f.name")}
                  />
                </div>
                <div>
                  <label htmlFor="report-phone" className="label-gov">
                    {t("report.f.phone")}
                  </label>
                  <input
                    id="report-phone"
                    ref={phoneRef}
                    type="tel"
                    autoComplete="tel"
                    value={mounted ? phone : ""}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`input-gov ${fieldError(errors, "phone") ? "input-error" : ""}`}
                    placeholder={t("report.f.phone")}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "report-phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p id="report-phone-error" className="field-error">
                      <Icon name="alertTriangle" size={12} />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="report-email" className="label-gov">
                  {t("report.f.email")}
                </label>
                <input
                  id="report-email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  value={mounted ? email : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`input-gov ${fieldError(errors, "email") ? "input-error" : ""}`}
                  placeholder={t("report.f.email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "report-email-error" : undefined}
                />
                {errors.email && (
                  <p id="report-email-error" className="field-error">
                    <Icon name="alertTriangle" size={12} />
                    {errors.email}
                  </p>
                )}
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
                {t("report.f.contactNote")}
              </p>
            </Section>

            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded border border-[var(--gov-danger)]/35 bg-[var(--gov-danger-soft)] px-3 py-2.5 text-[11.5px] font-semibold text-[var(--gov-danger)]"
              >
                <Icon name="alertTriangle" size={14} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--gov-border)] pt-4 sm:flex-row">
              <Link href="/" className="btn btn-outline sm:w-auto">
                {t("report.f.cancel")}
              </Link>
              <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                {submitting ? (
                  <>
                    <Icon name="refresh" size={15} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Icon name="send" size={15} />
                    {t("report.f.submit")}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <aside className="space-y-3 self-start lg:sticky lg:top-24">
        <div className="card-gov p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-heading)]">
            <Icon name="list" size={13} className="text-[var(--gov-link)]" />
            {t("report.f.sidebarTitle")}
          </p>
          <ul className="mt-2.5 space-y-2">
            {[
              t("report.f.sidebarPoint1"),
              t("report.f.sidebarPoint2"),
              t("report.f.sidebarPoint3"),
            ].map((point) => (
              <li key={point} className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
                <Icon name="checkCircle" size={12} className="mt-[2px] shrink-0 text-[var(--gov-link)]" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="card-gov overflow-hidden">
          <div className="flex items-center gap-1.5 bg-[var(--gov-navy)] px-4 py-2 text-white">
            <Icon name="clockCheck" size={13} className="text-[var(--gov-gold)]" />
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.1em]">
              {t("report.f.sla")}
            </p>
          </div>
          <p className="p-4 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
            {t("report.f.slaBody")}
          </p>
        </div>

        <div className="rounded border border-[var(--gov-emerald)]/25 bg-[var(--gov-emerald-soft)]/60 p-4">
          <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-[var(--gov-link)]">
            <Icon name="shield" size={13} className="mt-[1px] shrink-0" />
            {t("report.f.secure")}
          </p>
        </div>

        <div className="card-gov p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--gov-muted)]">
            {t("faq.helpTitle")}
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-[var(--gov-muted)]">
            {t("faq.helpBody")}
          </p>
          <Link href="/officers" className="btn btn-outline btn-sm mt-2 w-full">
            {t("faq.helpCta")}
            <Icon name="arrowRight" size={12} />
          </Link>
        </div>
      </aside>

      <ConfirmDialog
        open={pendingRemove !== null}
        title={t("report.f.photoRemoveTitle")}
        description={t("report.f.photoRemoveBody")}
        confirmLabel={t("report.f.remove")}
        cancelLabel={t("report.f.keep")}
        onConfirm={() => pendingRemove && removePhoto(pendingRemove.id)}
        onCancel={() => setPendingRemove(null)}
      />
    </div>
  );
}
