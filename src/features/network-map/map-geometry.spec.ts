import { describe, expect, it } from 'vitest';
import type { MapPoint } from '@/content/map';
import { interchanges, lines, nextStop } from '@/content/network';
import type { Line } from '@/content/types';
import { describeNetwork, mapShapes } from './map-geometry';

const network = { lines, interchanges, nextStop };
const orientations = ['horizontal', 'vertical'] as const;

/** The corner points of an SVG path made of M and L commands. */
const pointsOf = (path: string): MapPoint[] =>
  [...path.matchAll(/[ML] (-?[\d.]+) (-?[\d.]+)/g)].map(([, x, y]) => [
    Number(x),
    Number(y),
  ]);

/** Every move along a path in degrees, folded into 0 to 180. */
const anglesOf = (path: string): number[] =>
  pointsOf(path)
    .slice(1)
    .map(([x, y], i) => {
      const [px, py] = pointsOf(path)[i] ?? [x, y];
      return ((Math.atan2(y - py, x - px) * 180) / Math.PI + 360) % 180;
    });

const line = (overrides: Partial<Line>): Line => ({
  id: 'gvr',
  code: 'TST',
  name: 'Test',
  role: 'Test line',
  color: 'var(--l-gvr)',
  ink: 'var(--l-gvr-ink)',
  y: 100,
  period: '2026',
  stack: [],
  summary: '',
  service: { title: '', status: 'side', since: '2026-01', bullets: [] },
  stations: [],
  ...overrides,
});

describe.each(orientations)('mapShapes (%s)', (orientation) => {
  const shapes = mapShapes(network, orientation);

  it('draws every line, in network order', () => {
    expect(shapes.lines.map((s) => s.line.id)).toStrictEqual(
      lines.map((l) => l.id)
    );
    expect(shapes.lines.map((s) => s.index)).toStrictEqual(
      lines.map((_, i) => i)
    );
  });

  it('only ever moves at 90° and 45°, like a transit diagram', () => {
    const paths = [
      ...shapes.lines.map((s) => s.path),
      shapes.extension?.path ?? '',
    ];
    for (const angle of paths.flatMap((path) => anglesOf(path))) {
      expect([0, 45, 90, 135]).toContain(Math.round(angle));
    }
  });

  it('ticks every stop that is not an interchange', () => {
    for (const shape of shapes.lines) {
      const stops = shape.line.stations.filter(
        (s) => s.interchange === undefined
      );
      expect(shape.ticks.map((t) => t.key)).toStrictEqual(
        stops.map((s) => s.label)
      );
    }
  });

  it('shades every other zone', () => {
    expect(shapes.zones.map((z) => z.alt)).toStrictEqual([
      false,
      true,
      false,
      true,
    ]);
  });

  it('ends the dashed extension at the next stop', () => {
    expect(shapes.extension?.path).toMatch(/^M /);
    expect(shapes.extension?.label.text).toBe(
      orientation === 'horizontal' ? nextStop.label : 'Your team'
    );
  });
});

describe('mapShapes', () => {
  it('names stops and lines on the wide map only', () => {
    const wide = mapShapes(network, 'horizontal');
    const tall = mapShapes(network, 'vertical');
    expect(wide.lines.every((s) => s.badge.name !== null)).toBe(true);
    expect(wide.lines.flatMap((s) => s.stopLabels)).not.toHaveLength(0);
    expect(tall.lines.every((s) => s.badge.name === null)).toBe(true);
    expect(tall.lines.flatMap((s) => s.stopLabels)).toHaveLength(0);
  });

  it('wraps each interchange capsule around the rows of the lines it joins', () => {
    for (const shape of mapShapes(network, 'horizontal').interchanges) {
      const rows = shape.interchange.lines.map(
        (id) => lines.find((l) => l.id === id)?.y ?? Number.NaN
      );
      const { y, height } = shape.capsule;
      expect(y).toBeLessThan(Math.min(...rows));
      expect(y + height).toBeGreaterThan(Math.max(...rows));
      expect(shape.radius).toBe(shape.capsule.width / 2);
    }
  });

  it('runs a line without a route straight along its row, from just before its first stop', () => {
    const straight = line({
      stations: [
        { x: 200, label: 'A', detail: '' },
        { x: 500, label: 'B', detail: '', terminus: true },
      ],
    });
    const [shape] = mapShapes(
      { lines: [straight], interchanges: [], nextStop },
      'horizontal'
    ).lines;
    expect(shape?.path).toBe('M 180 100 L 500 100');
  });

  it('skips a line with nothing to draw', () => {
    const shapes = mapShapes(
      { lines: [line({ stations: [] })], interchanges: [], nextStop },
      'horizontal'
    );
    expect(shapes.lines).toHaveLength(0);
  });
});

describe('describeNetwork', () => {
  it('describes the map in words, from the data', () => {
    const { title, description } = describeNetwork(network);
    expect(title).toBe(`The network: ${lines.length} lines of work`);
    for (const interchange of interchanges) {
      expect(description).toContain(`share ${interchange.name}.`);
    }
    expect(description).toContain('EduVault and Anchor Fit share PostgreSQL.');
  });
});
