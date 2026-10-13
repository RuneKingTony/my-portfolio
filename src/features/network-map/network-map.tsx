'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  chronological,
  interchangeById,
  interchanges,
  lineById,
  lines,
  nextStop,
} from '@/content/network';
import type { Line, LineId } from '@/content/types';
import { useInView } from '@/lib/use-in-view';
import {
  interchangeIsLit,
  lineIsLit,
  sameFocus,
  type Focus,
} from './map-focus';
import {
  describeNetwork,
  mapShapes,
  type Box,
  type ExtensionShape,
  type InterchangeShape,
  type LineShape,
  type MapShapes,
  type TextAt,
} from './map-geometry';
import './network-map.css';

const network = { lines, interchanges, nextStop };
// The content is fixed at build time, so the shapes are worked out once.
const SHAPES = mapShapes(network);
const { title, description } = describeNetwork(network);

interface DrawKey {
  id: LineId | null;
  n: number;
}

/** The map's highlight: a locked choice from the key, previewed by hovering over it. */
function useMapFocus() {
  const [locked, setLocked] = useState<Focus>(null);
  const [preview, setPreview] = useState<Focus>(null);
  const [drawKey, setDrawKey] = useState<DrawKey>({ id: null, n: 0 });

  const toggle = (next: Focus) => {
    const turningOff = sameFocus(locked, next);
    setLocked(turningOff ? null : next);
    setPreview(null);
    // Redraw the isolated line's stroke so the eye follows it along its route.
    if (!turningOff && next?.kind === 'line')
      setDrawKey((k) => ({ id: next.id, n: k.n + 1 }));
  };

  return { focus: preview ?? locked, locked, toggle, setPreview, drawKey };
}

export function NetworkMap() {
  const networkRef = useRef<HTMLDivElement>(null);
  // The network draws itself in again on every visit.
  const inView = useInView(networkRef, 0.2);
  const frameRef = useRef<HTMLDivElement>(null);
  const { focus, locked, toggle, setPreview, drawKey } = useMapFocus();
  const scroll = useSideScroll(frameRef);

  // On a phone the chosen line may be off screen, so bring its start into view.
  useEffect(() => {
    if (locked?.kind !== 'line') return;
    const start = SHAPES.lines.find((s) => s.line.id === locked.id);
    if (start) scroll.reveal(start.badge.name.x - 160);
  }, [locked, scroll]);

  return (
    <div
      className="network"
      ref={networkRef}
      data-inview={inView ? 'true' : 'false'}
    >
      <p className="map-guide">
        Each coloured line is one project. Follow it from data to screens.
        Shared tools sit where lines cross.
      </p>
      <div
        className="map-frame"
        ref={frameRef}
        data-at-end={scroll.atEnd}
        // Scrollable regions need keyboard focus so arrow keys can pan them.
        tabIndex={scroll.pages > 1 ? 0 : -1}
        role="region"
        aria-label="Network map"
      >
        <MapSvg focus={focus} drawKey={drawKey} />
      </div>
      {scroll.pages > 1 ? (
        <p className="map-swipe" data-moved={scroll.moved}>
          <span>Swipe to explore the map</span>
          <span className="map-dots" aria-hidden="true">
            {Array.from({ length: scroll.pages }, (_, i) => (
              <span key={i} data-on={i === scroll.page} />
            ))}
          </span>
        </p>
      ) : null}
      <div className="map-key">
        <LineKey locked={locked} onToggle={toggle} onPreview={setPreview} />
        <InterchangeKey
          locked={locked}
          onToggle={toggle}
          onPreview={setPreview}
        />
      </div>
      <p className="map-caption" aria-live="polite">
        <Caption focus={focus} />
      </p>
    </div>
  );
}

interface SideScroll {
  /** How many screen-widths the map spans; 1 when it fits. */
  pages: number;
  page: number;
  moved: boolean;
  atEnd: boolean;
  /** Scroll so a map x position sits at the left edge. */
  reveal: (mapX: number) => void;
}

/** Tracks a sideways-scrolling frame: which screen-width is showing and whether the reader has panned yet. */
function useSideScroll(ref: RefObject<HTMLDivElement | null>): SideScroll {
  const [state, setState] = useState({
    pages: 1,
    page: 0,
    moved: false,
    atEnd: false,
  });
  const [reveal] = useState(() => (mapX: number) => {
    const frame = ref.current;
    if (!frame || frame.scrollWidth <= frame.clientWidth) return;
    const scale = frame.scrollWidth / SHAPES.width;
    frame.scrollTo({ left: Math.max(0, mapX * scale), behavior: 'smooth' });
  });

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    const measure = () => {
      const { scrollLeft, scrollWidth, clientWidth } = frame;
      const pages = Math.max(1, Math.round(scrollWidth / clientWidth));
      const max = scrollWidth - clientWidth;
      setState((prev) => ({
        pages,
        page: max > 0 ? Math.round((scrollLeft / max) * (pages - 1)) : 0,
        moved: prev.moved || scrollLeft > 8,
        atEnd: scrollLeft >= max - 8,
      }));
    };
    measure();
    frame.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      frame.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [ref]);

  return { ...state, reveal };
}

function MapSvg({ focus, drawKey }: { focus: Focus; drawKey: DrawKey }) {
  const shapes = SHAPES;
  const titleId = 'map-title';
  const descId = 'map-desc';

  return (
    <svg
      className="map"
      viewBox={shapes.viewBox}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      data-focused={focus ? 'true' : 'false'}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{description}</desc>
      <MapBackdrop shapes={shapes} />
      {shapes.lines.map((shape) => (
        <MapLine
          key={shape.line.id}
          shape={shape}
          lit={lineIsLit(focus, shape.line.id)}
          drawKey={drawKey.id === shape.line.id ? drawKey.n : 0}
        />
      ))}
      {shapes.extension ? <Extension shape={shapes.extension} /> : null}
      {shapes.interchanges.map((shape) => (
        <MapInterchange
          key={shape.interchange.id}
          shape={shape}
          lit={interchangeIsLit(focus, shape.interchange)}
        />
      ))}
    </svg>
  );
}

/** The zones, the grid and the separator: everything under the lines. */
function MapBackdrop({ shapes }: { shapes: MapShapes }) {
  const { from, to, note } = shapes.separator;
  return (
    <>
      {shapes.zones.map((zone) => (
        <g key={zone.key}>
          <title>{zone.title}</title>
          <Rect
            box={zone.band}
            className={zone.alt ? 'map-zone map-zone-alt' : 'map-zone'}
          />
          <Label
            at={zone.label.at}
            text={zone.label.text}
            className="map-zone-name"
          />
        </g>
      ))}
      <Grid id="map-grid" shapes={shapes} />
      <line
        className="map-separator"
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
      />
      <Label at={note.at} text={note.text} className="map-zone-name" />
    </>
  );
}

function Grid({ id, shapes }: { id: string; shapes: MapShapes }) {
  const step = shapes.gridStep;
  return (
    <>
      <defs>
        <pattern
          id={id}
          width={step}
          height={step}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${step} 0 V ${step} M 0 ${step} H ${step}`}
            className="map-grid-rule"
          />
        </pattern>
      </defs>
      <rect width={shapes.width} height={shapes.height} fill={`url(#${id})`} />
    </>
  );
}

function MapLine({
  shape,
  lit,
  drawKey,
}: {
  shape: LineShape;
  lit: boolean;
  drawKey: number;
}) {
  const { line, badge } = shape;
  return (
    <g
      className="map-line"
      data-lit={lit}
      style={{
        ['--line' as string]: line.color,
        ['--i' as string]: shape.index,
      }}
    >
      <path
        key={drawKey}
        className="map-stroke"
        d={shape.path}
        pathLength={1}
      />
      {shape.ticks.map((tick) => (
        <Rect key={tick.key} box={tick.box} className="map-tick" />
      ))}
      {shape.stopLabels.map((label) => (
        <Label key={label.key} at={label.at} text={label.text} />
      ))}
      <a
        href={`#line-${line.id}`}
        className="map-line-link"
        aria-label={`${line.name}: see the details`}
      >
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
        <Label at={badge.name} text={line.name} className="map-line-name" />
      </a>
    </g>
  );
}

function Extension({ shape }: { shape: ExtensionShape }) {
  return (
    <a
      href="#contact"
      className="map-extension"
      aria-label="Next stop: your team. Get in touch"
    >
      <path className="ext-stroke" d={shape.path} />
      <Rect box={shape.tick} className="ext-tick" />
      <Label
        at={shape.label.at}
        text={shape.label.text}
        className="map-label ext-label"
      />
    </a>
  );
}

function MapInterchange({
  shape,
  lit,
}: {
  shape: InterchangeShape;
  lit: boolean;
}) {
  return (
    <g className="map-interchange" data-lit={lit}>
      <Rect box={shape.capsule} rx={shape.radius} />
      <Label
        at={shape.name}
        text={shape.interchange.name}
        className="map-ix-name"
      />
    </g>
  );
}

function Label({
  at,
  text,
  className = 'map-label',
}: {
  at: TextAt;
  text: string;
  className?: string;
}) {
  return (
    <text
      className={className}
      x={at.x}
      y={at.y}
      textAnchor={at.anchor ?? 'start'}
    >
      {text.split('\n').map((row, i) => (
        <tspan key={row} x={at.x} dy={i === 0 ? 0 : 15}>
          {row}
        </tspan>
      ))}
    </text>
  );
}

function Rect({
  box,
  className,
  rx,
}: {
  box: Box;
  className?: string;
  rx?: number;
}) {
  return (
    <rect
      className={className}
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      rx={rx}
    />
  );
}

interface KeyProps {
  locked: Focus;
  onToggle: (next: Focus) => void;
  onPreview: (next: Focus) => void;
}

function LineKey({ locked, onToggle, onPreview }: KeyProps) {
  return (
    <div
      className="map-key-group"
      role="group"
      aria-label="Highlight a project"
    >
      {chronological().map((line) => (
        <button
          key={line.id}
          type="button"
          className="key-line"
          style={{ ['--line' as string]: line.color }}
          aria-pressed={locked?.kind === 'line' && locked.id === line.id}
          onClick={() => {
            onToggle({ kind: 'line', id: line.id });
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse')
              onPreview({ kind: 'line', id: line.id });
          }}
          onPointerLeave={() => {
            onPreview(null);
          }}
        >
          <span className="key-swatch" aria-hidden="true" />
          {line.name}
        </button>
      ))}
    </div>
  );
}

function InterchangeKey({ locked, onToggle, onPreview }: KeyProps) {
  return (
    <div
      className="map-key-group"
      role="group"
      aria-label="Highlight a shared technology"
    >
      <span className="key-heading">Shared tech</span>
      {interchanges.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          className="key-ix"
          aria-pressed={locked?.kind === 'interchange' && locked.id === id}
          onClick={() => {
            onToggle({ kind: 'interchange', id });
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse')
              onPreview({ kind: 'interchange', id });
          }}
          onPointerLeave={() => {
            onPreview(null);
          }}
        >
          <ChangeGlyph />
          {name}
        </button>
      ))}
    </div>
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

/** A period in words, for sentences: "Aug 2024 to Aug 2026". */
const periodInWords = (line: Line): string => line.period.replace('→', 'to');

/** What the highlight is, in a sentence under the map. */
function Caption({ focus }: { focus: Focus }) {
  if (focus?.kind === 'line') {
    const line = lineById(focus.id);
    return (
      <>
        <strong>{line.name}.</strong> {line.role}, {periodInWords(line)}.{' '}
        <a href={`#line-${line.id}`}>See the details</a>
      </>
    );
  }
  if (focus?.kind === 'interchange') {
    const interchange = interchangeById(focus.id);
    return (
      <>
        <strong>{interchange.name}.</strong> {interchange.note}
      </>
    );
  }
  return <>Tap a project or a technology to highlight it on the map.</>;
}
