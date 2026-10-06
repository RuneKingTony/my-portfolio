"use client";

import { useEffect, useRef, useState } from "react";
import { motionAllowed, useInView } from "./useInView";
import { chronological, nextStop, statusLabel } from "@/content/network";

const FLAPS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
const TO_WIDTH = 14;
const STATUS_WIDTH = 8;
const FRAME_MS = 45;

const pad = (text: string, width: number) => text.padEnd(width, " ").slice(0, width);

/**
 * Each tile flips forward through the flap drum until it lands on its letter,
 * the way a split-flap board does. Rows settle top to bottom.
 */
function useFlaps(targets: string[], enabled: boolean, inView: boolean) {
  const [shown, setShown] = useState(targets);

  useEffect(() => {
    if (!enabled) return;
    // Off screen, the board goes blank so it flaps in again on the next visit.
    if (!inView) {
      setShown(targets.map((t) => " ".repeat(t.length)));
      return;
    }
    // Every tile starts blank and needs `start + distance` frames to land.
    const plan = targets.map((target, row) =>
      [...target].map((ch, col) => {
        const goal = Math.max(0, FLAPS.indexOf(ch));
        return { goal, start: row * 3 + Math.floor(col / 3), spin: goal === 0 ? 0 : 6 + ((row * 7 + col * 3) % 9) };
      }),
    );
    let frame = 0;
    const last = Math.max(...plan.flat().map((t) => t.start + t.spin));
    const timer = window.setInterval(() => {
      frame += 1;
      setShown(
        plan.map((tiles) =>
          tiles
            .map(({ goal, start, spin }) => {
              const t = frame - start;
              if (t <= 0) return " ";
              if (t >= spin) return FLAPS[goal];
              return FLAPS[(goal - spin + t + FLAPS.length) % FLAPS.length];
            })
            .join(""),
        ),
      );
      if (frame >= last) window.clearInterval(timer);
    }, FRAME_MS);
    return () => window.clearInterval(timer);
  }, [enabled, targets, inView]);

  return shown;
}

interface Row {
  code: string;
  to: string;
  status: string;
  isNext: boolean;
}

/** Newest first, as a board lists departures, then the stop that isn't built yet. */
const rows: Row[] = [
  ...chronological()
    .reverse()
    .map((line) => ({
      code: line.code,
      to: line.name.toUpperCase(),
      status: statusLabel[line.service.status].board,
      isNext: false,
    })),
  { code: nextStop.code, to: "YOUR TEAM", status: "BOARDING", isNext: true },
];
const targets = rows.map((r) => pad(r.to, TO_WIDTH) + pad(r.status, STATUS_WIDTH));

/** `asOf` is the build date, so the board's clock is never older than its statuses. */
export function DepartureBoard({ asOf }: { asOf: string }) {
  const ref = useRef<HTMLElement>(null);
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    setMotion(motionAllowed());
  }, []);
  const inView = useInView(ref, 0.3);
  const shown = useFlaps(targets, motion, inView);

  return (
    <figure ref={ref} className="board-panel" aria-labelledby="departures-title">
      <figcaption className="board-head">
        <span id="departures-title">Departures</span>
        <span className="board-clock">{asOf}</span>
      </figcaption>
      <table className="flap-table">
        <caption className="visually-hidden">Where each line of work stands</caption>
        <thead className="visually-hidden">
          <tr>
            <th scope="col">Line</th>
            <th scope="col">To</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const text = shown[i] ?? targets[i] ?? "";
            return (
              <tr key={row.code} data-next={row.isNext ? "true" : undefined}>
                <th scope="row">
                  <span className="flap-code">{row.code}</span>
                </th>
                <td>
                  <span className="visually-hidden">{row.to}</span>
                  <Tiles text={text.slice(0, TO_WIDTH)} />
                </td>
                <td className="flap-status">
                  <span className="visually-hidden">{row.status}</span>
                  <Tiles text={text.slice(TO_WIDTH)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}

function Tiles({ text }: { text: string }) {
  return (
    <span className="tiles" aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={i} className="tile">
          {ch}
        </span>
      ))}
    </span>
  );
}
