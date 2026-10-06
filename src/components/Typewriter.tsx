"use client";

import { useEffect, useRef, useState } from "react";
import { motionAllowed, useInView } from "./useInView";

interface Segment {
  text: string;
  className?: string;
  strong?: boolean;
}

/**
 * Types its text out like a terminal, with a block cursor, every time it comes
 * into view; once it has left the screen completely it resets for the next visit.
 *
 * The full text is always in the DOM: untyped characters are only made
 * transparent, so nothing reflows while typing. They are hidden only once the
 * inline script in layout.tsx has added `typing` to <html> (motion allowed, JS
 * running); without that, the text simply shows. Screen readers get the full
 * text at once.
 */
export function Typewriter({
  segments,
  speed = 40,
  delay = 0,
  keepCursor = false,
}: {
  segments: Segment[];
  /** Milliseconds per character. */
  speed?: number;
  /** Milliseconds before the first character, each time it starts. */
  delay?: number;
  /** Leave the cursor blinking after the last character, like a prompt. */
  keepCursor?: boolean;
}) {
  const full = segments.map((s) => s.text).join("");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, 0.5);
  const [typed, setTyped] = useState(0);
  const [state, setState] = useState<"waiting" | "typing" | "done">("waiting");

  useEffect(() => {
    if (!motionAllowed()) {
      setTyped(full.length);
      setState("done");
      return;
    }
    if (!inView) {
      setTyped(0);
      setState("waiting");
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const n = Math.min(full.length, Math.floor((now - start) / speed));
      setTyped(n);
      if (n < full.length) raf = window.requestAnimationFrame(tick);
      else setState("done");
    };
    const timer = window.setTimeout(() => {
      setState("typing");
      raf = window.requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(raf);
    };
  }, [inView, full, speed, delay]);

  // Walk the segments, splitting each into its typed and untyped parts.
  let left = typed;
  let cursorPlaced = false;
  const parts = segments.map((seg, i) => {
    const shown = seg.text.slice(0, Math.max(0, left));
    const rest = seg.text.slice(shown.length);
    left -= seg.text.length;
    const Tag = seg.strong ? "strong" : "span";
    const cursorHere = !cursorPlaced && rest.length > 0;
    if (cursorHere) cursorPlaced = true;
    return (
      <Tag key={i} className={seg.className}>
        {shown}
        {cursorHere && state !== "done" ? <span className="tw-cursor" /> : null}
        {rest ? <span className="tw-ghost">{rest}</span> : null}
      </Tag>
    );
  });
  const showEndCursor = !cursorPlaced && (state === "typing" || (state === "done" && keepCursor));

  return (
    <span ref={ref} className="tw" data-state={state}>
      <span className="visually-hidden">{full}</span>
      <span aria-hidden="true">
        {parts}
        {showEndCursor ? <span className="tw-cursor" /> : null}
      </span>
    </span>
  );
}
