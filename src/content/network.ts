// The network: every line is a body of work, every station a real component
// of it, every interchange a technology those lines actually share. Each line
// lives in its own file under lines/; this file puts them together.

import { COL } from './map';
import type {
  Interchange,
  InterchangeId,
  Line,
  LineId,
  NextStop,
  Service,
} from './types';
import { gvr } from './lines/gvr';
import { fin } from './lines/fin';
import { edu } from './lines/edu';
import { anc } from './lines/anc';
import { pha } from './lines/pha';
import { ecm } from './lines/ecm';
import { mt5 } from './lines/mt5';

export const interchanges: Interchange[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    x: COL.data,
    lines: ['edu', 'anc'],
    note: 'EduVault and Anchor Fit both store their data in PostgreSQL.',
  },
  {
    id: 'node',
    name: 'Node.js',
    x: COL.node,
    lines: ['fin', 'edu', 'anc'],
    note: "The fintech's backend and the servers behind EduVault and Anchor Fit all run on Node.js.",
  },
  {
    id: 'react',
    name: 'React',
    x: COL.react,
    lines: ['gvr', 'fin', 'edu', 'anc', 'pha', 'ecm'],
    note: 'Every web project here is built with React.',
  },
  {
    id: 'next',
    name: 'Next.js',
    x: COL.next,
    lines: ['gvr', 'fin'],
    note: "The fintech's customer apps and the GVR Labs site use Next.js.",
  },
];

/** In map order: the order the lines are drawn and their animation runs. */
export const lines: Line[] = [gvr, fin, edu, anc, pha, ecm, mt5];

/** The planned extension: drawn dashed, in signal red, because it isn't built yet. */
export const nextStop: NextStop = {
  code: 'NXT',
  label: 'Next stop:\nyour team',
  /** Continues past the GVR Labs terminus; map units, 90°/45° only. */
  from: 'gvr',
  route: [
    [1180, 120],
    [1240, 120],
    [1300, 60],
    [1400, 60],
  ],
};

/** Lines in the order they opened, oldest first: how the page lists them. */
export const chronological = (): Line[] =>
  lines.toSorted((a, b) => a.service.since.localeCompare(b.service.since));

/** How each status reads in prose and on the departure board. */
export const statusLabel: Record<
  Service['status'],
  { prose: string; board: string }
> = {
  running: { prose: 'Ongoing', board: 'RUNNING' },
  ended: { prose: 'Ended', board: 'ENDED' },
  shipped: { prose: 'Shipped', board: 'SHIPPED' },
  side: { prose: 'Side project', board: 'TESTING' },
};

export const lineById = (id: LineId): Line => {
  const line = lines.find((l) => l.id === id);
  if (!line) throw new Error(`Unknown line ${id}`);
  return line;
};

export const interchangeById = (id: InterchangeId): Interchange => {
  const ix = interchanges.find((i) => i.id === id);
  if (!ix) throw new Error(`Unknown interchange ${id}`);
  return ix;
};
