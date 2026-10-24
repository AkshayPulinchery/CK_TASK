"use client";

import { useEffect, useRef, useState } from "react";

/** Thin gold/emerald reading-progress bar fixed to the top of the viewport. */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(next);
    };

    const onScroll = () => {
      if (raf.current) return;
      raf.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      className="scroll-progress fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-[#006a4e] via-[#d4af37] to-[#006a4e]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
