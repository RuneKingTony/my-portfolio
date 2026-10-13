// What the map is highlighting: one line, one shared technology, or nothing.

import type { Interchange, InterchangeId, LineId } from '@/content/types';
import { interchangeById } from '@/content/network';

export type Focus =
  | { kind: 'line'; id: LineId }
  | { kind: 'interchange'; id: InterchangeId }
  | null;

export const lineIsLit = (focus: Focus, id: LineId): boolean => {
  if (!focus) return true;
  if (focus.kind === 'line') return focus.id === id;
  return interchangeById(focus.id).lines.includes(id);
};

export const interchangeIsLit = (
  focus: Focus,
  interchange: Interchange
): boolean => {
  if (!focus) return true;
  if (focus.kind === 'interchange') return focus.id === interchange.id;
  return interchange.lines.includes(focus.id);
};

export const sameFocus = (a: Focus, b: Focus): boolean =>
  a?.kind === b?.kind && a?.id === b?.id;
