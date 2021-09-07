import { get, isNumber } from 'lodash';
import { CursorPointerTarget, CursorSnapshotPointerTarget, NonePointerTarget, PointerTargetType } from './types';

type UnknownTarget = {
  type: PointerTargetType;
};

type Positional = UnknownTarget & {
  x: number;
  y: number;
  relX: number;
  relY: number;
};

type Temporal = UnknownTarget & {
  timeMs: number;
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

export const isPositional = (target: UnknownTarget): target is Positional => {
  return (
    isNumber(get(target, 'x')) &&
    isNumber(get(target, 'y')) &&
    isNumber(get(target, 'relX')) &&
    isNumber(get(target, 'relY'))
  );
};

export const isTemporal = (target: UnknownTarget): target is Temporal => {
  return isNumber(get(target, 'timeMs'));
};
