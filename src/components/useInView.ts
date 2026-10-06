"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once `enter` of the element is on screen, false again only after it has
 * left completely, so animations replay on each visit without flickering at the edge.
 * Returns true straight away when motion is reduced or IntersectionObserver is missing.
 */
export function useInView(ref: RefObject<Element | null>, enter = 0.15): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || !motionAllowed()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio >= enter) setInView(true);
        else if (!entry.isIntersecting) setInView(false);
      },
      { threshold: [0, enter] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enter]);

  return inView;
}

/**
 * Motion is allowed: the pre-paint script in layout.tsx adds `typing` to <html> only when
 * JavaScript runs and the visitor hasn't asked for reduced motion. Every component asks here.
 */
export function motionAllowed(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("typing");
}
