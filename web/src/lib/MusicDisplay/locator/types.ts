import { GraphicalNote } from 'opensheetmusicdisplay';
import { AnchoredSelection } from '../../../util/AnchoredSelection';
import { Box } from '../../../util/Box';
import { NumberRange } from '../../../util/NumberRange';
import { CursorWrapper } from '../cursors';
import { CursorSnapshot } from './CursorSnapshot';

export type SyncSettings = {
  deadTimeMs: number;
  durationMs: number;
};

// Groups cursor snapshots by the y-range spans they cover. This is a natural division that makes searching
// by position easier.
export type CursorSnapshotLineGroup = {
  yRange: NumberRange;
  cursorSnapshots: CursorSnapshot[];
};

export enum LocatorTargetType {
  None,
  Cursor,
  Note,
  Selection,
}

export type VfNotehead = {
  el: SVGGElement;
  box: Box;
};

export enum SelectionEdge {
  Start,
  End,
}

export type NoneLocatorTarget = { type: LocatorTargetType.None };

export type CursorLocatorTarget = { type: LocatorTargetType.Cursor; cursor: CursorWrapper; box: Box };

export type NoteLocatorTarget = {
  type: LocatorTargetType.Note;
  graphicalNote: GraphicalNote;
  vfNoteheadEl: SVGGElement;
  box: Box;
};

export type SelectionLocatorTarget = {
  type: LocatorTargetType.Selection;
  selection: AnchoredSelection;
  box: Box;
  edge: SelectionEdge;
  cursor: CursorWrapper;
};

export type LocatorTarget = NoneLocatorTarget | CursorLocatorTarget | NoteLocatorTarget | SelectionLocatorTarget;

export enum LocateCost {
  Unknown,
  Cheap,
  Expensive,
}

export type LocateResult = {
  timeMs: number;
  x: number;
  y: number;
  cost: LocateCost;
  cursorSnapshot: CursorSnapshot | null;
  targets: LocatorTarget[];
};
