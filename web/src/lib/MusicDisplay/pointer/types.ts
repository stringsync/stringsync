import { CursorSnapshot, CursorWrapper } from '..';
import { AnchoredTimeSelection } from '../AnchoredTimeSelection';

export enum PointerTargetType {
  None,
  Cursor,
  CursorSnapshot,
}

export type NonePointerTarget = { type: PointerTargetType.None };

export type CursorPointerTarget = { type: PointerTargetType.Cursor; cursor: CursorWrapper; timeMs: number };

export type CursorSnapshotPointerTarget = {
  type: PointerTargetType.CursorSnapshot;
  cursorSnapshot: CursorSnapshot;
  timeMs: number;
};

export type PointerTarget = NonePointerTarget | CursorPointerTarget | CursorSnapshotPointerTarget;

export type PointerContext = {
  isActive: boolean;
  downTarget: PointerTarget;
  prevDownTarget: PointerTarget;
  hoverTarget: PointerTarget;
  prevHoverTarget: PointerTarget;
  selection: AnchoredTimeSelection | null;
};
