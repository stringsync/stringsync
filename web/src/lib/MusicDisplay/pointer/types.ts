import { CursorSnapshot, CursorWrapper } from '..';
import { AnchoredTimeSelection } from '../AnchoredTimeSelection';

export enum PointerTargetType {
  None,
  Cursor,
  CursorSnapshot,
}

export type NonePointerTarget = { type: PointerTargetType.None; x: number; y: number };

export type CursorPointerTarget = {
  type: PointerTargetType.Cursor;
  cursor: CursorWrapper;
  timeMs: number;
  x: number;
  y: number;
};

export type CursorSnapshotPointerTarget = {
  type: PointerTargetType.CursorSnapshot;
  cursorSnapshot: CursorSnapshot;
  timeMs: number;
  x: number;
  y: number;
};

export type PointerTarget = NonePointerTarget | CursorPointerTarget | CursorSnapshotPointerTarget;

export type PointerContext = {
  downTarget: PointerTarget;
  prevDownTarget: PointerTarget;
  hoverTarget: PointerTarget;
  prevHoverTarget: PointerTarget;
  selection: AnchoredTimeSelection | null;
};
