import { get, isNumber } from 'lodash';
import { SelectionPointerTarget } from '.';
import {
  CursorPointerTarget,
  CursorSnapshotPointerTarget,
  NonePointerTarget,
  PointerPosition,
  PointerTargetType,
} from './types';

type UnknownTarget = {
  type: PointerTargetType;
};

type Positional = UnknownTarget & {
  position: PointerPosition;
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

export const isSelectionPointerTarget = (target: UnknownTarget): target is SelectionPointerTarget => {
  return target.type === PointerTargetType.Selection;
};

export const isPositional = (target: UnknownTarget): target is Positional => {
  const position = get(target, 'position');
  return (
    position &&
    isNumber(get(position, 'x')) &&
    isNumber(get(position, 'y')) &&
    isNumber(get(position, 'relX')) &&
    isNumber(get(position, 'relY'))
  );
};

export const isTemporal = (target: UnknownTarget): target is Temporal => {
  return isNumber(get(target, 'timeMs'));
};
