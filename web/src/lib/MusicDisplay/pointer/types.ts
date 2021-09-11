import { CursorSnapshot, CursorWrapper, SelectionEdge } from '..';
import { AnchoredTimeSelection } from '../AnchoredTimeSelection';

export enum PointerTargetType {
  None,
  Cursor,
  CursorSnapshot,
  Selection,
}

export type PointerPosition = {
  x: number;
  y: number;
  relX: number;
  relY: number;
};

export type NonePointerTarget = { type: PointerTargetType.None; position: PointerPosition };

export type CursorPointerTarget = {
  type: PointerTargetType.Cursor;
  cursor: CursorWrapper;
  timeMs: number;
  position: PointerPosition;
};

export type CursorSnapshotPointerTarget = {
  type: PointerTargetType.CursorSnapshot;
  cursorSnapshot: CursorSnapshot;
  timeMs: number;
  position: PointerPosition;
};

export type SelectionPointerTarget = {
  type: PointerTargetType.Selection;
  selection: AnchoredTimeSelection;
  edge: SelectionEdge;
  timeMs: number;
  position: PointerPosition;
};

export type PointerTarget =
  | NonePointerTarget
  | CursorPointerTarget
  | CursorSnapshotPointerTarget
  | SelectionPointerTarget;

export type PointerContext = {
  downTarget: PointerTarget;
  prevDownTarget: PointerTarget;
  hoverTarget: PointerTarget;
  prevHoverTarget: PointerTarget;
  selection: AnchoredTimeSelection | null;
};
