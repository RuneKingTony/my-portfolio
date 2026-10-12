// The shapes every line of work, station and interchange is written in.

import type { MapPoint } from './map';

export type LineId = 'gvr' | 'fin' | 'edu' | 'anc' | 'pha' | 'ecm' | 'mt5';
export type InterchangeId = 'postgres' | 'node' | 'react' | 'next';

export interface Station {
  /** Map x position; stations on an interchange take its x. */
  x: number;
  /** Map y position when the station sits off the line's main row (after a bend). */
  y?: number;
  /** Name on the map. Use "\n" to break a label across two lines. */
  label: string;
  /** Full name in the line section, when it differs from the map label. */
  name?: string;
  detail: string;
  interchange?: InterchangeId;
  terminus?: boolean;
  /** Live sites for this stop. Each ships only if the build can open it (see lib/links.ts). */
  links?: { label: string; href: string }[];
}

export interface Shot {
  src: string;
  alt: string;
  caption: string;
}

export interface Service {
  /** What the work was, in a few words. Titles are descriptive, not employer job titles. */
  title: string;
  status: 'running' | 'ended' | 'shipped' | 'side';
  /** Start date for ordering, YYYY-MM. */
  since: string;
  bullets: string[];
}

export interface Line {
  id: LineId;
  code: string;
  name: string;
  role: string;
  color: string;
  /** Text colour that passes contrast on the line colour. */
  ink: string;
  /** Map y position of the line's main row. */
  y: number;
  /** Track as map points, 90° and 45° moves only. Defaults to a straight run along y. */
  route?: MapPoint[];
  period: string;
  stack: string[];
  summary: string;
  stations: Station[];
  shots?: Shot[];
  service: Service;
}

export interface Interchange {
  id: InterchangeId;
  name: string;
  x: number;
  lines: LineId[];
  note: string;
}

/** The planned extension past the last line: drawn, but not built yet. */
export interface NextStop {
  code: string;
  label: string;
  from: LineId;
  route: MapPoint[];
}
