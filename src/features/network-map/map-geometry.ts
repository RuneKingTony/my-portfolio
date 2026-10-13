// Turns the network into the shapes the map draws. Pure:
// no React and no DOM, so the map's layout can be tested on its own.

import { zones, type MapPoint } from '@/content/map';
import type {
  Interchange,
  Line,
  LineId,
  NextStop,
  Station,
} from '@/content/types';

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
  badge: { pill: Box; code: TextAt; name: TextAt };
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

// Map units: the viewBox is 1440 × 712, and phones scroll it sideways at full size.
const NETWORK_TOP = 40;
const NETWORK_BOTTOM = 562;
const SEPARATOR_Y = 588;

const GEO = {
  viewBox: '0 0 1440 712',
  width: 1440,
  height: 712,
  gridStep: 40,
  tick: ([x, y]: MapPoint, terminus: boolean): Box =>
    terminus
      ? { x: x - 3, y: y - 15, width: 6, height: 30 }
      : { x: x - 3, y: y + 4, width: 6, height: 10 },
  stopLabel: ([x, y]: MapPoint, terminus: boolean): TextAt => ({
    x,
    y: y + (terminus ? 36 : 32),
    anchor: 'middle',
  }),
  badge: ([x, y]: MapPoint): LineShape['badge'] => ({
    pill: { x: x - 42, y: y - 11, width: 40, height: 22 },
    code: { x: x - 22, y: y + 5, anchor: 'middle' },
    name: { x: x - 50, y: y + 5, anchor: 'end' },
  }),
  interchange: (points: MapPoint[]): { capsule: Box; name: TextAt } => {
    const [x] = points[0] ?? [0, 0];
    const top = Math.min(...points.map(([, y]) => y));
    const bottom = Math.max(...points.map(([, y]) => y));
    return {
      capsule: { x: x - 14, y: top - 14, width: 28, height: bottom - top + 28 },
      name: { x, y: top - 26, anchor: 'middle' },
    };
  },
  zone: (
    zone: (typeof zones)[number],
    index: number
  ): { band: Box; name: TextAt; text: string } => ({
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
  } satisfies MapShapes['separator'],
  extensionEnd: (
    [x, y]: MapPoint,
    text: string
  ): { tick: Box; label: Label } => ({
    tick: { x: x - 3, y: y - 15, width: 6, height: 30 },
    label: { at: { x, y: y + 36, anchor: 'middle' }, text },
  }),
};

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

function lineShape(line: Line, index: number): LineShape | null {
  const route = routeOf(line);
  const start = route[0];
  if (!start) return null;
  // Interchanges are drawn as capsules across lines, not as ticks on one.
  const stops = line.stations
    .filter((s) => s.interchange === undefined)
    .map((s) => ({
      station: s,
      at: [s.x, s.y ?? line.y] satisfies MapPoint,
    }));
  return {
    line,
    index,
    path: toPath(route),
    ticks: stops.map(({ station, at }) => ({
      key: station.label,
      box: GEO.tick(at, isTerminus(station)),
    })),
    stopLabels: stops.map(({ station, at }) => ({
      key: station.label,
      at: GEO.stopLabel(at, isTerminus(station)),
      text: station.label,
    })),
    badge: GEO.badge(start),
  };
}

function interchangeShape(
  network: Network,
  interchange: Interchange
): InterchangeShape {
  const points = interchange.lines.map((id): MapPoint => [
    interchange.x,
    lineById(network, id).y,
  ]);
  const { capsule, name } = GEO.interchange(points);
  return {
    interchange,
    capsule,
    radius: Math.min(capsule.width, capsule.height) / 2,
    name,
  };
}

function extensionShape(nextStop: NextStop): ExtensionShape | null {
  const end = nextStop.route.at(-1);
  if (!end) return null;
  return {
    path: toPath(nextStop.route),
    ...GEO.extensionEnd(end, nextStop.label),
  };
}

/** Everything the map draws, in map units. */
export function mapShapes(network: Network): MapShapes {
  return {
    viewBox: GEO.viewBox,
    width: GEO.width,
    height: GEO.height,
    gridStep: GEO.gridStep,
    zones: zones.map((zone, i) => {
      const { band, name, text } = GEO.zone(zone, i);
      return {
        key: zone.name,
        title: `${zone.name}: ${zone.means}`,
        band,
        alt: i % 2 !== 0,
        label: { at: name, text },
      };
    }),
    separator: GEO.separator,
    lines: network.lines.flatMap((line, i) => lineShape(line, i) ?? []),
    extension: extensionShape(network.nextStop),
    interchanges: network.interchanges.map((ix) =>
      interchangeShape(network, ix)
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
