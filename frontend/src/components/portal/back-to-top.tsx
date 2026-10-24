"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";

/** Floating scroll-to-top control, shown after 300px of scrolling. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      setVisible(window.scrollY > 300);
    };
    const onScroll = () => {
      if (raf.current) return;
      raf.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  const scrollTop = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      title="Back to top"
      className={`back-to-top fixed bottom-24 right-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-[var(--gov-border)] bg-[var(--gov-card)] text-[var(--gov-heading)] shadow-lg transition-all duration-300 hover:bg-[var(--gov-navy)] hover:text-white ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <Icon name="arrowUp" size={18} />
    </button>
  );
}
