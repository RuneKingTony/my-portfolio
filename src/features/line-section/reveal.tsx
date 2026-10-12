'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motionAllowed } from '@/lib/use-in-view';

/**
 * Rides the strip with the reader: as the page scrolls, a train moves down the
 * line (`--ride`, 0 to 1) and each stop it reaches is marked as passed.
 * Without JS, or with reduced motion, the strip renders fully ridden.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionAllowed()) return;

    const stops = [...el.querySelectorAll<HTMLElement>('.stop')];
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // The train sits at 55% of the viewport height; it has ridden whatever is above that.
      const eye = globalThis.innerHeight * 0.55;
      const ride = Math.min(1, Math.max(0, (eye - rect.top) / rect.height));
      el.style.setProperty('--ride', ride.toFixed(4));
      const reached = rect.top + ride * rect.height;
      for (const stop of stops) {
        const top = stop.getBoundingClientRect().top + 8;
        stop.dataset.passed = top <= reached ? 'true' : 'false';
      }
    };
    const schedule = () => {
      if (visible && !frame) frame = globalThis.requestAnimationFrame(update);
    };

    el.dataset.riding = 'true';
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) schedule();
    });
    io.observe(el);
    update();
    globalThis.addEventListener('scroll', schedule, { passive: true });
    globalThis.addEventListener('resize', schedule);
    return () => {
      io.disconnect();
      globalThis.removeEventListener('scroll', schedule);
      globalThis.removeEventListener('resize', schedule);
      if (frame) globalThis.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
