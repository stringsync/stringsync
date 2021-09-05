import { CursorPointerTarget, CursorSnapshotPointerTarget, NonePointerTarget, PointerTargetType } from './types';

type UnknownTarget = {
  type: PointerTargetType;
};

export const isNonePointerTarget = (target: UnknownTarget): target is NonePointerTarget => {
  return target.type === PointerTargetType.None;
};

export const isCursorPointerTarget = (target: UnknownTarget): target is CursorPointerTarget => {
  return target.type === PointerTargetType.Cursor;
};

export const isCursorSnapshotPointerTarget = (target: UnknownTarget): target is CursorSnapshotPointerTarget => {
  return target.type === PointerTargetType.CursorSnapshot;
};
