// Turns the network into the shapes the map draws, for one orientation. Pure:
// no React and no DOM, so the map's layout can be tested on its own.

import { zones, type MapPoint } from '@/content/map';
import type {
  Interchange,
  Line,
  LineId,
  NextStop,
  Station,
} from '@/content/types';

export type Orientation = 'horizontal' | 'vertical';

interface Network {
  lines: readonly Line[];
  interchanges: readonly Interchange[];
  nextStop: NextStop;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextAt {
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
}

export interface Label {
  at: TextAt;
  text: string;
}

export interface ZoneShape {
  key: string;
  /** Hover text: the zone and what it means. */
  title: string;
  band: Box;
  /** Every other zone is shaded. */
  alt: boolean;
  label: Label;
}

export interface LineShape {
  line: Line;
  /** Position in the network, which staggers the draw-in animation. */
  index: number;
  path: string;
  ticks: { key: string; box: Box }[];
  stopLabels: (Label & { key: string })[];
  badge: { pill: Box; code: TextAt; name: TextAt | null };
}

export interface InterchangeShape {
  interchange: Interchange;
  capsule: Box;
  radius: number;
  name: TextAt;
}

export interface ExtensionShape {
  path: string;
  tick: Box;
  label: Label;
}

export interface MapShapes {
  viewBox: string;
  width: number;
  height: number;
  gridStep: number;
  zones: ZoneShape[];
  separator: { from: MapPoint; to: MapPoint; note: Label };
  lines: LineShape[];
  extension: ExtensionShape | null;
  interchanges: InterchangeShape[];
}

// The network is authored once, in horizontal map units. The vertical map (phones)
// is the same network turned a quarter: one uniform scale keeps every 45° move at 45°.
const NETWORK_TOP = 40;
const NETWORK_BOTTOM = 562;
const SEPARATOR_Y = 588;
const V_SCALE = 0.5;
const V_BOT_X = 374;
const V_SEPARATOR_X = 346;

/** Everything that differs between the two orientations, in one place. */
interface Geometry {
  viewBox: string;
  width: number;
  height: number;
  gridStep: number;
  project: (line: LineId, point: MapPoint) => MapPoint;
  tick: (point: MapPoint, terminus: boolean) => Box;
  /** Where a stop's name goes, or null when the orientation has no room for names. */
  stopLabel: (point: MapPoint, terminus: boolean) => TextAt | null;
  badge: (start: MapPoint) => LineShape['badge'];
  interchange: (points: MapPoint[]) => { capsule: Box; name: TextAt };
  zone: (
    zone: (typeof zones)[number],
    index: number
  ) => { band: Box; name: TextAt; text: string };
  separator: MapShapes['separator'];
  extensionEnd: (
    end: MapPoint,
    nextStopLabel: string
  ) => { tick: Box; label: Label };
}

const horizontal: Geometry = {
  viewBox: '0 0 1440 712',
  width: 1440,
  height: 712,
  gridStep: 40,
  project: (_line, point) => point,
  tick: ([x, y], terminus) =>
    terminus
      ? { x: x - 3, y: y - 15, width: 6, height: 30 }
      : { x: x - 3, y: y + 4, width: 6, height: 10 },
  stopLabel: ([x, y], terminus) => ({
    x,
    y: y + (terminus ? 36 : 32),
    anchor: 'middle',
  }),
  badge: ([x, y]) => ({
    pill: { x: x - 42, y: y - 11, width: 40, height: 22 },
    code: { x: x - 22, y: y + 5, anchor: 'middle' },
    name: { x: x - 50, y: y + 5, anchor: 'end' },
  }),
  interchange: (points) => {
    const [x] = points[0] ?? [0, 0];
    const top = Math.min(...points.map(([, y]) => y));
    const bottom = Math.max(...points.map(([, y]) => y));
    return {
      capsule: { x: x - 14, y: top - 14, width: 28, height: bottom - top + 28 },
      name: { x, y: top - 26, anchor: 'middle' },
    };
  },
  zone: (zone, index) => ({
    band: {
      x: zone.from,
      y: NETWORK_TOP,
      width: zone.to - zone.from,
      height: NETWORK_BOTTOM - NETWORK_TOP,
    },
    name: { x: zone.from + 12, y: NETWORK_TOP - 14 },
    text: `${index + 1} · ${zone.name}`,
  }),
  separator: {
    from: [40, SEPARATOR_Y],
    to: [1400, SEPARATOR_Y],
    note: {
      at: { x: 1400, y: SEPARATOR_Y + 22, anchor: 'end' },
      text: 'Not a web app, so it sits outside the zones: these stops are the steps I took, in order',
    },
  },
  extensionEnd: ([x, y], nextStopLabel) => ({
    tick: { x: x - 3, y: y - 15, width: 6, height: 30 },
    label: { at: { x, y: y + 36, anchor: 'middle' }, text: nextStopLabel },
  }),
};

const vertical: Geometry = {
  viewBox: '0 0 400 700',
  width: 400,
  height: 700,
  gridStep: 25,
  project: (line, [x, y]) => [
    line === 'mt5' ? V_BOT_X : 130 + (y - 120) * V_SCALE,
    (x - 100) * V_SCALE,
  ],
  tick: ([x, y], terminus) =>
    terminus
      ? { x: x - 13, y: y - 3, width: 26, height: 6 }
      : { x: x + 4, y: y - 3, width: 8, height: 6 },
  stopLabel: () => null,
  badge: ([x, y]) => ({
    pill: { x: x - 20, y: y - 24, width: 40, height: 22 },
    code: { x, y: y - 8, anchor: 'middle' },
    name: null,
  }),
  interchange: (points) => {
    const [, y] = points[0] ?? [0, 0];
    const left = Math.min(...points.map(([x]) => x));
    const right = Math.max(...points.map(([x]) => x));
    return {
      capsule: {
        x: left - 13,
        y: y - 13,
        width: right - left + 26,
        height: 26,
      },
      name: { x: left - 22, y: y + 5, anchor: 'end' },
    };
  },
  zone: (zone, index) => {
    const top = (zone.from - 100) * V_SCALE;
    return {
      band: {
        x: 0,
        y: top,
        width: V_SEPARATOR_X - 10,
        height: (zone.to - zone.from) * V_SCALE,
      },
      // Names sit just above their band so they never meet an interchange name inside it.
      name: { x: 8, y: index === 0 ? top + 16 : top - 6 },
      text: zone.name,
    };
  },
  separator: {
    from: [V_SEPARATOR_X, 8],
    to: [V_SEPARATOR_X, 692],
    note: { at: { x: V_BOT_X, y: 692, anchor: 'middle' }, text: 'MQL5' },
  },
  extensionEnd: ([x, y]) => ({
    tick: { x: x - 13, y: y - 3, width: 26, height: 6 },
    label: { at: { x, y: y + 22, anchor: 'middle' }, text: 'Your team' },
  }),
};

const GEOMETRY: Record<Orientation, Geometry> = { horizontal, vertical };

/** An SVG path through the given points. */
const toPath = (points: MapPoint[]): string =>
  points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

/** A line's track: its own route, or a straight run along its row from the first stop to the last. */
const routeOf = (line: Line): MapPoint[] => {
  if (line.route !== undefined) return line.route;
  const first = line.stations[0];
  const last = line.stations.at(-1);
  return first && last
    ? [
        [first.x - 20, line.y],
        [last.x, line.y],
      ]
    : [];
};

const lineById = (network: Network, id: LineId): Line => {
  const line = network.lines.find((l) => l.id === id);
  if (!line) throw new Error(`Unknown line ${id}`);
  return line;
};

const isTerminus = (station: Station) => station.terminus === true;

function lineShape(geo: Geometry, line: Line, index: number): LineShape | null {
  const route = routeOf(line).map((p) => geo.project(line.id, p));
  const start = route[0];
  if (!start) return null;
  // Interchanges are drawn as capsules across lines, not as ticks on one.
  const stops = line.stations
    .filter((s) => s.interchange === undefined)
    .map((s) => ({
      station: s,
      at: geo.project(line.id, [s.x, s.y ?? line.y]),
    }));
  return {
    line,
    index,
    path: toPath(route),
    ticks: stops.map(({ station, at }) => ({
      key: station.label,
      box: geo.tick(at, isTerminus(station)),
    })),
    stopLabels: stops.flatMap(({ station, at }) => {
      const labelAt = geo.stopLabel(at, isTerminus(station));
      return labelAt
        ? [{ key: station.label, at: labelAt, text: station.label }]
        : [];
    }),
    badge: geo.badge(start),
  };
}

function interchangeShape(
  geo: Geometry,
  network: Network,
  interchange: Interchange
): InterchangeShape {
  const points = interchange.lines.map((id) =>
    geo.project(id, [interchange.x, lineById(network, id).y])
  );
  const { capsule, name } = geo.interchange(points);
  return {
    interchange,
    capsule,
    radius: Math.min(capsule.width, capsule.height) / 2,
    name,
  };
}

function extensionShape(
  geo: Geometry,
  nextStop: NextStop
): ExtensionShape | null {
  const points = nextStop.route.map((p) => geo.project(nextStop.from, p));
  const end = points.at(-1);
  if (!end) return null;
  return { path: toPath(points), ...geo.extensionEnd(end, nextStop.label) };
}

/** Everything the map draws in one orientation, in map units. */
export function mapShapes(
  network: Network,
  orientation: Orientation
): MapShapes {
  const geo = GEOMETRY[orientation];
  return {
    viewBox: geo.viewBox,
    width: geo.width,
    height: geo.height,
    gridStep: geo.gridStep,
    zones: zones.map((zone, i) => {
      const { band, name, text } = geo.zone(zone, i);
      return {
        key: zone.name,
        title: `${zone.name}: ${zone.means}`,
        band,
        alt: i % 2 !== 0,
        label: { at: name, text },
      };
    }),
    separator: geo.separator,
    lines: network.lines.flatMap((line, i) => lineShape(geo, line, i) ?? []),
    extension: extensionShape(geo, network.nextStop),
    interchanges: network.interchanges.map((ix) =>
      interchangeShape(geo, network, ix)
    ),
  };
}

const listNames = (names: string[]) =>
  names.length < 2
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} and ${names.at(-1) ?? ''}`;

/** What a screen reader hears instead of the map, written from the data so it can't drift. */
export function describeNetwork(network: Network): {
  title: string;
  description: string;
} {
  const lineName = (id: LineId) => lineById(network, id).name;
  return {
    title: `The network: ${network.lines.length} lines of work`,
    description: [
      `${network.lines.length - 1} coloured lines, one per project, run from data to screens.`,
      ...network.interchanges.map(
        (i) =>
          `${listNames(i.lines.map((id) => lineName(id)))} share ${i.name}.`
      ),
      'A dashed line leads to the next stop: your team.',
      `${lineName('mt5')} sits on its own, outside the zones.`,
    ].join(' '),
  };
}
