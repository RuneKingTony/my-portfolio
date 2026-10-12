'use client';

import { useEffect, useRef, useState } from 'react';
import { chronological, nextStop, statusLabel } from '@/content/network';
import { useInView, useMotionAllowed } from '@/lib/use-in-view';
import './departure-board.css';

const FLAPS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
const TO_WIDTH = 14;
const STATUS_WIDTH = 8;
const FRAME_MS = 45;

const pad = (text: string, width: number) =>
  text.padEnd(width, ' ').slice(0, width);

interface Row {
  code: string;
  to: string;
  status: string;
  isNext: boolean;
}

/** Newest first, as a board lists departures, then the stop that isn't built yet. */
const rows: Row[] = [
  ...chronological()
    .toReversed()
    .map((line) => ({
      code: line.code,
      to: line.name.toUpperCase(),
      status: statusLabel[line.service.status].board,
      isNext: false,
    })),
  { code: nextStop.code, to: 'YOUR TEAM', status: 'BOARDING', isNext: true },
];
const targets = rows.map(
  (r) => pad(r.to, TO_WIDTH) + pad(r.status, STATUS_WIDTH)
);

/**
 * Each tile flips forward through the flap drum until it lands on its letter,
 * the way a split-flap board does. Rows settle top to bottom: every tile starts
 * blank and needs `start + spin` frames to land.
 */
const plan = targets.map((target, row) =>
  Array.from(target, (ch, col) => {
    const goal = Math.max(0, FLAPS.indexOf(ch));
    return {
      goal,
      start: row * 3 + Math.floor(col / 3),
      spin: goal === 0 ? 0 : 6 + ((row * 7 + col * 3) % 9),
    };
  })
);
const lastFrame = Math.max(...plan.flat().map((t) => t.start + t.spin));

const flapAt = (frame: number, { goal, start, spin }: (typeof plan)[0][0]) => {
  const t = frame - start;
  if (t <= 0) return ' ';
  if (t >= spin) return FLAPS[goal];
  return FLAPS[(goal - spin + t + FLAPS.length) % FLAPS.length];
};

/** The board's text at a given frame; frame 0 is blank. */
const boardAt = (frame: number) =>
  plan.map((tiles) => tiles.map((tile) => flapAt(frame, tile)).join(''));

/** Off screen the board goes blank, so it flaps in again on the next visit. */
function useFlapFrame(enabled: boolean, inView: boolean) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!enabled || !inView) return;
    let current = 0;
    const timer = globalThis.setInterval(() => {
      current += 1;
      setFrame(current);
      if (current >= lastFrame) globalThis.clearInterval(timer);
    }, FRAME_MS);
    return () => {
      globalThis.clearInterval(timer);
      setFrame(0);
    };
  }, [enabled, inView]);

  return frame;
}

/** `asOf` is the build date, so the board's clock is never older than its statuses. */
export function DepartureBoard({ asOf }: { asOf: string }) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionAllowed() === true;
  const inView = useInView(ref, 0.3);
  const frame = useFlapFrame(motion, inView);
  const shown = motion ? boardAt(frame) : targets;

  return (
    <figure
      ref={ref}
      className="board-panel"
      aria-labelledby="departures-title"
    >
      <figcaption className="board-head">
        <span id="departures-title">Departures</span>
        <span className="board-clock">{asOf}</span>
      </figcaption>
      <table className="flap-table">
        <caption className="visually-hidden">
          Where each line of work stands
        </caption>
        <thead className="visually-hidden">
          <tr>
            <th scope="col">Line</th>
            <th scope="col">To</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <BoardRow key={row.code} row={row} text={shown[i] ?? ''} />
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function BoardRow({ row, text }: { row: Row; text: string }) {
  return (
    <tr data-next={row.isNext ? 'true' : undefined}>
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
}

function Tiles({ text }: { text: string }) {
  return (
    <span className="tiles" aria-hidden="true">
      {Array.from(text, (ch, i) => (
        // A tile is a fixed slot on the board: its position is its identity.
        <span key={i} className="tile">
          {ch}
        </span>
      ))}
    </span>
  );
}
