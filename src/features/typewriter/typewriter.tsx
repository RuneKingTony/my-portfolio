'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useInView, useMotionAllowed } from '@/lib/use-in-view';
import './typewriter.css';

interface Segment {
  text: string;
  className?: string;
  strong?: boolean;
}

type TypingState = 'waiting' | 'typing' | 'done';

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
  const full = segments.map((s) => s.text).join('');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, 0.5);
  const motion = useMotionAllowed();
  const [progress, setProgress] = useState<{
    typed: number;
    state: TypingState;
  }>({ typed: 0, state: 'waiting' });

  useEffect(() => {
    if (motion !== true || !inView) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const typed = Math.min(full.length, Math.floor((now - start) / speed));
      const finished = typed >= full.length;
      setProgress({ typed, state: finished ? 'done' : 'typing' });
      if (!finished) raf = globalThis.requestAnimationFrame(tick);
    };
    const timer = globalThis.setTimeout(() => {
      setProgress({ typed: 0, state: 'typing' });
      raf = globalThis.requestAnimationFrame(tick);
    }, delay);
    return () => {
      globalThis.clearTimeout(timer);
      globalThis.cancelAnimationFrame(raf);
      // Leaving the screen resets it, so it types again on the next visit.
      setProgress({ typed: 0, state: 'waiting' });
    };
  }, [motion, inView, full, speed, delay]);

  // Without motion there is nothing to animate: the text is simply there.
  const { typed, state } =
    motion === false
      ? { typed: full.length, state: 'done' as const }
      : progress;
  const { parts, cursorPlaced } = splitTyped(segments, typed, state);
  const showEndCursor =
    !cursorPlaced && (state === 'typing' || (state === 'done' && keepCursor));

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

/** Splits each segment into its typed and untyped parts, with the cursor after the last typed character. */
function splitTyped(
  segments: Segment[],
  typed: number,
  state: TypingState
): { parts: ReactNode[]; cursorPlaced: boolean } {
  const parts: ReactNode[] = [];
  let left = typed;
  let cursorPlaced = false;
  for (const [i, seg] of segments.entries()) {
    const shown = seg.text.slice(0, Math.max(0, left));
    const rest = seg.text.slice(shown.length);
    left -= seg.text.length;
    const Tag = seg.strong === true ? 'strong' : 'span';
    const cursorHere = !cursorPlaced && rest.length > 0;
    if (cursorHere) cursorPlaced = true;
    parts.push(
      // Segments are fixed for the component's life, so their position is their identity.
      <Tag key={i} className={seg.className}>
        {shown}
        {cursorHere && state !== 'done' ? <span className="tw-cursor" /> : null}
        {rest === '' ? null : <span className="tw-ghost">{rest}</span>}
      </Tag>
    );
  }
  return { parts, cursorPlaced };
}
