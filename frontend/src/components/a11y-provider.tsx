"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Accessibility preferences: text scale and high-contrast mode.
 *
 * These replace the old light/dark theme toggle. The server cannot know the
 * visitor's preferences, so it always renders the defaults (100% text,
 * standard contrast). The pre-paint script in `layout.tsx` applies the stored
 * values before the first paint; this provider adopts the same values after
 * the hydration commit, exactly like the previous theme provider did.
 */

export const A11Y_CONTRAST_KEY = "civicforce-a11y-contrast";
export const A11Y_SCALE_KEY = "civicforce-a11y-scale";

export const SCALE_STEPS = [0.9, 1, 1.15] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

type A11yContextValue = {
  /** High-contrast display is on. */
  contrast: boolean;
  toggleContrast: () => void;
  /** Root font scale, 1 = 100%. */
  scale: number;
  setScale: (scale: number) => void;
  /** Move one step down / up through SCALE_STEPS. */
  decreaseScale: () => void;
  increaseScale: () => void;
  resetScale: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
};

const A11yContext = createContext<A11yContextValue | null>(null);

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within an A11yProvider");
  return ctx;
}

function applyContrast(on: boolean) {
  document.documentElement.classList.toggle("hc", on);
}

function applyScale(scale: number) {
  document.documentElement.style.setProperty("--a11y-scale", String(scale));
}

function readContrast(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(A11Y_CONTRAST_KEY) === "1";
  } catch {
    return false;
  }
}

function readScale(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = Number(localStorage.getItem(A11Y_SCALE_KEY));
    if (SCALE_STEPS.includes(raw as ScaleStep)) return raw;
  } catch {
    /* ignore */
  }
  return 1;
}

function nearestStep(scale: number): number {
  return SCALE_STEPS.reduce((best, step) =>
    Math.abs(step - scale) < Math.abs(best - scale) ? step : best
  );
}

export function A11yProvider({ children }: { children: ReactNode }) {
  // Must match the server output on the first render.
  const [contrast, setContrast] = useState(false);
  const [scale, setScaleState] = useState<number>(1);
  const pending = useRef<number | null>(null);

  useEffect(() => {
    const nextContrast = readContrast();
    const nextScale = readScale();
    applyContrast(nextContrast);
    applyScale(nextScale);

    pending.current = window.setTimeout(() => {
      pending.current = null;
      setContrast(nextContrast);
      setScaleState(nextScale);
    }, 0);

    return () => {
      if (pending.current !== null) {
        window.clearTimeout(pending.current);
        pending.current = null;
      }
    };
  }, []);

  const cancelPending = useCallback(() => {
    if (pending.current !== null) {
      window.clearTimeout(pending.current);
      pending.current = null;
    }
  }, []);

  const toggleContrast = useCallback(() => {
    cancelPending();
    setContrast((prev) => {
      const next = !prev;
      applyContrast(next);
      try {
        localStorage.setItem(A11Y_CONTRAST_KEY, next ? "1" : "0");
      } catch {
        /* ignore persistence failures */
      }
      return next;
    });
  }, [cancelPending]);

  const setScale = useCallback(
    (next: number) => {
      cancelPending();
      const clamped = nearestStep(Math.min(1.15, Math.max(0.9, next)));
      setScaleState(clamped);
      applyScale(clamped);
      try {
        localStorage.setItem(A11Y_SCALE_KEY, String(clamped));
      } catch {
        /* ignore persistence failures */
      }
    },
    [cancelPending]
  );

  const value = useMemo<A11yContextValue>(() => {
    const index = SCALE_STEPS.indexOf(nearestStep(scale) as ScaleStep);
    return {
      contrast,
      toggleContrast,
      scale,
      setScale,
      decreaseScale: () => setScale(SCALE_STEPS[Math.max(0, index - 1)]),
      increaseScale: () => setScale(SCALE_STEPS[Math.min(SCALE_STEPS.length - 1, index + 1)]),
      resetScale: () => setScale(1),
      canDecrease: index > 0,
      canIncrease: index < SCALE_STEPS.length - 1,
    };
  }, [contrast, scale, setScale, toggleContrast]);

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}
