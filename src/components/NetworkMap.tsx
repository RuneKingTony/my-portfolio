"use client";

import { useRef, useState } from "react";
import { zones, type MapPoint } from "@/content/map";
import {
  chronological,
  interchangeById,
  interchanges,
  lineById,
  lines,
  nextStop,
  periodInWords,
  type Interchange,
  type InterchangeId,
  type Line,
  type LineId,
} from "@/content/network";
import { useInView } from "./useInView";

type Focus = { kind: "line"; id: LineId } | { kind: "interchange"; id: InterchangeId } | null;
type Orientation = "horizontal" | "vertical";
interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface TextAt {
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
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
  badge: (start: MapPoint) => { pill: Box; code: TextAt; name: TextAt | null };
  interchange: (points: MapPoint[]) => { capsule: Box; name: TextAt };
  zone: (zone: (typeof zones)[number], index: number) => { band: Box; name: TextAt; text: string };
  separator: { from: MapPoint; to: MapPoint; note: TextAt & { text: string } };
  extensionEnd: (end: MapPoint) => { tick: Box; label: TextAt; text: string };
}

const horizontal: Geometry = {
  viewBox: "0 0 1440 712",
  width: 1440,
  height: 712,
  gridStep: 40,
  project: (_line, point) => point,
  tick: ([x, y], terminus) =>
    terminus ? { x: x - 3, y: y - 15, width: 6, height: 30 } : { x: x - 3, y: y + 4, width: 6, height: 10 },
  stopLabel: ([x, y], terminus) => ({ x, y: y + (terminus ? 36 : 32), anchor: "middle" }),
  badge: ([x, y]) => ({
    pill: { x: x - 42, y: y - 11, width: 40, height: 22 },
    code: { x: x - 22, y: y + 5, anchor: "middle" },
    name: { x: x - 50, y: y + 5, anchor: "end" },
  }),
  interchange: (points) => {
    const [x] = points[0] ?? [0, 0];
    const top = Math.min(...points.map(([, y]) => y));
    const bottom = Math.max(...points.map(([, y]) => y));
    return {
      capsule: { x: x - 14, y: top - 14, width: 28, height: bottom - top + 28 },
      name: { x, y: top - 26, anchor: "middle" },
    };
  },
  zone: (zone, index) => ({
    band: { x: zone.from, y: NETWORK_TOP, width: zone.to - zone.from, height: NETWORK_BOTTOM - NETWORK_TOP },
    name: { x: zone.from + 12, y: NETWORK_TOP - 14 },
    text: `${index + 1} · ${zone.name}`,
  }),
  separator: {
    from: [40, SEPARATOR_Y],
    to: [1400, SEPARATOR_Y],
    note: {
      x: 1400,
      y: SEPARATOR_Y + 22,
      anchor: "end",
      text: "Not a web app, so it sits outside the zones: these stops are the steps I took, in order",
    },
  },
  extensionEnd: ([x, y]) => ({
    tick: { x: x - 3, y: y - 15, width: 6, height: 30 },
    label: { x, y: y + 36, anchor: "middle" },
    text: nextStop.label,
  }),
};

const vertical: Geometry = {
  viewBox: "0 0 400 700",
  width: 400,
  height: 700,
  gridStep: 25,
  project: (line, [x, y]) => [line === "mt5" ? V_BOT_X : 130 + (y - 120) * V_SCALE, (x - 100) * V_SCALE],
  tick: ([x, y], terminus) =>
    terminus ? { x: x - 13, y: y - 3, width: 26, height: 6 } : { x: x + 4, y: y - 3, width: 8, height: 6 },
  stopLabel: () => null,
  badge: ([x, y]) => ({
    pill: { x: x - 20, y: y - 24, width: 40, height: 22 },
    code: { x, y: y - 8, anchor: "middle" },
    name: null,
  }),
  interchange: (points) => {
    const [, y] = points[0] ?? [0, 0];
    const left = Math.min(...points.map(([x]) => x));
    const right = Math.max(...points.map(([x]) => x));
    return {
      capsule: { x: left - 13, y: y - 13, width: right - left + 26, height: 26 },
      name: { x: left - 22, y: y + 5, anchor: "end" },
    };
  },
  zone: (zone, index) => {
    const top = (zone.from - 100) * V_SCALE;
    return {
      band: { x: 0, y: top, width: V_SEPARATOR_X - 10, height: (zone.to - zone.from) * V_SCALE },
      // Names sit just above their band so they never meet an interchange name inside it.
      name: { x: 8, y: index === 0 ? top + 16 : top - 6 },
      text: zone.name,
    };
  },
  separator: {
    from: [V_SEPARATOR_X, 8],
    to: [V_SEPARATOR_X, 692],
    note: { x: V_BOT_X, y: 692, anchor: "middle", text: "MQL5" },
  },
  extensionEnd: ([x, y]) => ({
    tick: { x: x - 13, y: y - 3, width: 26, height: 6 },
    label: { x, y: y + 22, anchor: "middle" },
    text: "Your team",
  }),
};

const GEOMETRY: Record<Orientation, Geometry> = { horizontal, vertical };

/** An SVG path through the given points. */
const toPath = (points: MapPoint[]) => points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

const routeOf = (line: Line): MapPoint[] => {
  if (line.route) return line.route;
  const first = line.stations[0];
  const last = line.stations[line.stations.length - 1];
  return first && last
    ? [
        [first.x - 20, line.y],
        [last.x, line.y],
      ]
    : [];
};

const lineIsLit = (focus: Focus, id: LineId): boolean => {
  if (!focus) return true;
  if (focus.kind === "line") return focus.id === id;
  return interchangeById(focus.id).lines.includes(id);
};

const interchangeIsLit = (focus: Focus, interchange: Interchange): boolean => {
  if (!focus) return true;
  if (focus.kind === "interchange") return focus.id === interchange.id;
  return interchange.lines.includes(focus.id);
};

const sameFocus = (a: Focus, b: Focus) => a?.kind === b?.kind && a?.id === b?.id;

const listNames = (names: string[]) =>
  names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

/** What a screen reader hears instead of the map, written from the data so it can't drift. */
const description = [
  `${lines.length - 1} coloured lines, one per project, run from data to screens.`,
  ...interchanges.map((i) => `${listNames(i.lines.map((id) => lineById(id).name))} share ${i.name}.`),
  "A dashed line leads to the next stop: your team.",
  `${lineById("mt5").name} sits on its own, outside the zones.`,
].join(" ");

function Label({ at, text, className = "map-label" }: { at: TextAt; text: string; className?: string }) {
  return (
    <text className={className} x={at.x} y={at.y} textAnchor={at.anchor ?? "start"}>
      {text.split("\n").map((row, i) => (
        <tspan key={row} x={at.x} dy={i === 0 ? 0 : 15}>
          {row}
        </tspan>
      ))}
    </text>
  );
}

const Rect = ({ box, className, rx }: { box: Box; className?: string; rx?: number }) => (
  <rect className={className} x={box.x} y={box.y} width={box.width} height={box.height} rx={rx} />
);

function Extension({ geo }: { geo: Geometry }) {
  const points = nextStop.route.map((p) => geo.project(nextStop.from, p));
  const end = points[points.length - 1];
  if (!end) return null;
  const { tick, label, text } = geo.extensionEnd(end);
  return (
    <a href="#contact" className="map-extension" aria-label="Next stop: your team. Get in touch">
      <path className="ext-stroke" d={toPath(points)} />
      <Rect box={tick} className="ext-tick" />
      <Label at={label} text={text} className="map-label ext-label" />
    </a>
  );
}

function MapLine({
  geo,
  line,
  index,
  lit,
  drawKey,
}: {
  geo: Geometry;
  line: Line;
  index: number;
  lit: boolean;
  drawKey: number;
}) {
  const route = routeOf(line).map((p) => geo.project(line.id, p));
  const start = route[0];
  if (!start) return null;
  const badge = geo.badge(start);
  const stops = line.stations
    .filter((s) => !s.interchange)
    .map((s) => ({ station: s, at: geo.project(line.id, [s.x, s.y ?? line.y]) }));

  return (
    <g className="map-line" data-lit={lit} style={{ ["--line" as string]: line.color, ["--i" as string]: index }}>
      <path key={drawKey} className="map-stroke" d={toPath(route)} pathLength={1} />
      {stops.map(({ station, at }) => (
        <Rect key={station.label} box={geo.tick(at, Boolean(station.terminus))} className="map-tick" />
      ))}
      {stops.map(({ station, at }) => {
        const label = geo.stopLabel(at, Boolean(station.terminus));
        return label ? <Label key={station.label} at={label} text={station.label} /> : null;
      })}
      <a href={`#line-${line.id}`} className="map-line-link" aria-label={`${line.name}: see the details`}>
        <Rect box={badge.pill} className="map-badge" rx={11} />
        <text
          className="map-badge-code"
          x={badge.code.x}
          y={badge.code.y}
          textAnchor={badge.code.anchor}
          style={{ fill: line.ink }}
        >
          {line.code}
        </text>
        {badge.name ? <Label at={badge.name} text={line.name} className="map-line-name" /> : null}
      </a>
    </g>
  );
}

function MapInterchange({ geo, interchange, lit }: { geo: Geometry; interchange: Interchange; lit: boolean }) {
  const points = interchange.lines.map((id) => geo.project(id, [interchange.x, lineById(id).y]));
  const { capsule, name } = geo.interchange(points);
  const radius = Math.min(capsule.width, capsule.height) / 2;
  return (
    <g className="map-interchange" data-lit={lit}>
      <Rect box={capsule} rx={radius} />
      <Label at={name} text={interchange.name} className="map-ix-name" />
    </g>
  );
}

function Grid({ id, geo }: { id: string; geo: Geometry }) {
  const step = geo.gridStep;
  return (
    <>
      <defs>
        <pattern id={id} width={step} height={step} patternUnits="userSpaceOnUse">
          <path d={`M ${step} 0 V ${step} M 0 ${step} H ${step}`} className="map-grid-rule" />
        </pattern>
      </defs>
      <rect width={geo.width} height={geo.height} fill={`url(#${id})`} />
    </>
  );
}

function MapSvg({
  orientation,
  focus,
  drawKey,
}: {
  orientation: Orientation;
  focus: Focus;
  drawKey: { id: LineId | null; n: number };
}) {
  const geo = GEOMETRY[orientation];
  const keyFor = (id: LineId) => (drawKey.id === id ? drawKey.n : 0);
  const titleId = `map-title-${orientation}`;
  const descId = `map-desc-${orientation}`;
  const { from, to, note } = geo.separator;

  return (
    <svg
      className={`map map-${orientation}`}
      viewBox={geo.viewBox}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      data-focused={focus ? "true" : "false"}
    >
      <title id={titleId}>{`The network: ${lines.length} lines of work`}</title>
      <desc id={descId}>{description}</desc>

      {zones.map((zone, i) => {
        const { band, name, text } = geo.zone(zone, i);
        return (
          <g key={zone.name}>
            <title>{`${zone.name}: ${zone.means}`}</title>
            <Rect box={band} className={i % 2 === 0 ? "map-zone" : "map-zone map-zone-alt"} />
            <Label at={name} text={text} className="map-zone-name" />
          </g>
        );
      })}
      <Grid id={`grid-${orientation}`} geo={geo} />
      <line className="map-separator" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
      <Label at={note} text={note.text} className="map-zone-name" />

      {lines.map((line, i) => (
        <MapLine
          key={line.id}
          geo={geo}
          line={line}
          index={i}
          lit={lineIsLit(focus, line.id)}
          drawKey={keyFor(line.id)}
        />
      ))}
      <Extension geo={geo} />
      {interchanges.map((interchange) => (
        <MapInterchange
          key={interchange.id}
          geo={geo}
          interchange={interchange}
          lit={interchangeIsLit(focus, interchange)}
        />
      ))}
    </svg>
  );
}

function ChangeGlyph() {
  return (
    <svg className="key-glyph" viewBox="0 0 26 20" aria-hidden="true">
      <path d="M 0 6 H 26 M 0 14 H 26" />
      <rect x={8} y={1} width={10} height={18} rx={5} />
    </svg>
  );
}

export function NetworkMap() {
  const [locked, setLocked] = useState<Focus>(null);
  const [preview, setPreview] = useState<Focus>(null);
  const focus = preview ?? locked;
  const networkRef = useRef<HTMLDivElement>(null);
  // The network draws itself in again on every visit.
  const inView = useInView(networkRef, 0.2);
  const [drawKey, setDrawKey] = useState<{ id: LineId | null; n: number }>({ id: null, n: 0 });

  const toggle = (next: Focus) => {
    const turningOff = sameFocus(locked, next);
    setLocked(turningOff ? null : next);
    setPreview(null);
    // Redraw the isolated line's stroke so the eye follows it along its route.
    if (!turningOff && next?.kind === "line") setDrawKey((k) => ({ id: next.id, n: k.n + 1 }));
  };

  const focusedLine = focus?.kind === "line" ? lineById(focus.id) : null;
  const focusedInterchange = focus?.kind === "interchange" ? interchangeById(focus.id) : null;

  return (
    <div className="network" ref={networkRef} data-inview={inView ? "true" : "false"}>
      <p className="map-guide">
        Each coloured line is one project. Follow it from data to screens. Shared tools sit where lines cross.
      </p>
      <MapSvg orientation="horizontal" focus={focus} drawKey={drawKey} />
      <MapSvg orientation="vertical" focus={focus} drawKey={drawKey} />

      <div className="map-key">
        <div className="map-key-group" role="group" aria-label="Highlight a project">
          {chronological().map((line) => (
            <button
              key={line.id}
              type="button"
              className="key-line"
              style={{ ["--line" as string]: line.color }}
              aria-pressed={locked?.kind === "line" && locked.id === line.id}
              onClick={() => toggle({ kind: "line", id: line.id })}
              onPointerEnter={(e) => e.pointerType === "mouse" && setPreview({ kind: "line", id: line.id })}
              onPointerLeave={() => setPreview(null)}
            >
              <span className="key-swatch" aria-hidden="true" />
              {line.name}
            </button>
          ))}
        </div>
        <div className="map-key-group" role="group" aria-label="Highlight a shared technology">
          <span className="key-heading">Shared tech</span>
          {interchanges.map((interchange) => (
            <button
              key={interchange.id}
              type="button"
              className="key-ix"
              aria-pressed={locked?.kind === "interchange" && locked.id === interchange.id}
              onClick={() => toggle({ kind: "interchange", id: interchange.id })}
              onPointerEnter={(e) =>
                e.pointerType === "mouse" && setPreview({ kind: "interchange", id: interchange.id })
              }
              onPointerLeave={() => setPreview(null)}
            >
              <ChangeGlyph />
              {interchange.name}
            </button>
          ))}
        </div>
      </div>

      <p className="map-caption" aria-live="polite">
        {focusedLine ? (
          <>
            <strong>{focusedLine.name}.</strong> {focusedLine.role}, {periodInWords(focusedLine)}.{" "}
            <a href={`#line-${focusedLine.id}`}>See the details</a>
          </>
        ) : focusedInterchange ? (
          <>
            <strong>{focusedInterchange.name}.</strong> {focusedInterchange.note}
          </>
        ) : (
          <>Tap a project or a technology to highlight it on the map.</>
        )}
      </p>
    </div>
  );
}
