import { GraphicalNote, IOSMDOptions, VoiceEntry } from 'opensheetmusicdisplay';
import { Box } from '../../util/Box';
import { NumberRange } from '../../util/NumberRange';
import { EventBus } from '../EventBus';
import { AnchoredTimeSelection } from './AnchoredTimeSelection';
import { IteratorSnapshot } from './IteratorSnapshot';

export type MusicDisplayEventBus = EventBus<{
  loadstarted: {};
  loadended: {};
  resizestarted: {};
  resizeended: {};
  cursorinfochanged: CursorInfo;
  autoscrollstarted: {};
  autoscrollended: {};
  longpress: {};
  click: SVGElementEventMap['click'];
  touchstart: SVGElementEventMap['touchstart'];
  touchmove: SVGElementEventMap['touchmove'];
  touchend: SVGElementEventMap['touchend'];
  mousedown: SVGElementEventMap['mousedown'];
  mousemove: SVGElementEventMap['mousemove'];
  mouseup: SVGElementEventMap['mouseup'];
  cursorentered: { cursor: CursorWrapper };
  cursorexited: { cursor: CursorWrapper };
  cursordragstarted: { cursor: CursorWrapper };
  cursordragupdated: { cursor: CursorWrapper; timeMs: number };
  cursordragended: { cursor: CursorWrapper; hoveredCursor: CursorWrapper | null };
  selectionstarted: { selection: AnchoredTimeSelection };
  selectionupdated: { selection: AnchoredTimeSelection };
  selectionended: {};
  cursorsnapshotclicked: { cursorSnapshot: CursorSnapshot; timeMs: number };
  cursorsnapshotentered: { cursorSnapshot: CursorSnapshot; timeMs: number };
  cursorsnapshotexited: { cursorSnapshot: CursorSnapshot; timeMs: number };
  notargetentered: {};
  notargetexited: {};
  pointeridle: {};
  pointeractive: {};
}>;

export type SyncSettings = {
  deadTimeMs: number;
  durationMs: number;
};

export interface CursorWrapper {
  element: HTMLElement;
  update(timeMs: number): void;
  clear(): void;
  disableAutoScroll(): void;
  enableAutoScroll(): void;
  getBox(): Box;
}

export type Callback = () => void;

export type CursorInfo = {
  currentMeasureIndex: number;
  currentMeasureNumber: number;
  numMeasures: number;
};

export type MusicDisplayOptions = IOSMDOptions & {
  syncSettings: SyncSettings;
  scrollContainer: HTMLDivElement;
};

export type CursorSnapshot = {
  next: CursorSnapshot | null;
  prev: CursorSnapshot | null;
  iteratorSnapshot: IteratorSnapshot;
  xRange: NumberRange;
  yRange: NumberRange;
  bpm: number;
  beatRange: NumberRange;
  timeMsRange: NumberRange;
  entries: VoiceEntry[];
  targets: LocatorTarget[];
};

export enum LocatorTargetType {
  None,
  Cursor,
  Note,
}

export type VfNotehead = {
  el: SVGGElement;
  box: Box;
};

export type LocatorTarget =
  | { type: LocatorTargetType.None }
  | { type: LocatorTargetType.Cursor; cursor: CursorWrapper; box: Box }
  | { type: LocatorTargetType.Note; graphicalNote: GraphicalNote; vfNoteheadEl: SVGGElement; box: Box };

export enum LocateCost {
  Unknown,
  Cheap,
  Expensive,
}

export type LocateResult = {
  timeMs: number;
  x: number;
  y: number | undefined;
  cost: LocateCost;
  cursorSnapshot: Readonly<CursorSnapshot> | null;
  targets: LocatorTarget[];
};
