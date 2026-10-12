import { describe, expect, it } from 'vitest';
import { chronological, lines } from './network';

describe('chronological', () => {
  it('lists every line, oldest first', () => {
    const starts = chronological().map((line) => line.service.since);
    expect(starts).toHaveLength(lines.length);
    expect(starts).toStrictEqual(starts.toSorted((a, b) => a.localeCompare(b)));
  });

  it('leaves the map order alone', () => {
    const mapOrder = lines.map((line) => line.id);
    chronological();
    expect(lines.map((line) => line.id)).toStrictEqual(mapOrder);
  });
});
