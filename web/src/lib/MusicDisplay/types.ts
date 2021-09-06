import { GraphicalNote, IOSMDOptions, VoiceEntry } from 'opensheetmusicdisplay';
import { Box } from '../../util/Box';
import { NumberRange } from '../../util/NumberRange';
import { EventBus } from '../EventBus';
import { AnchoredTimeSelection } from './AnchoredTimeSelection';
import { IteratorSnapshot } from './IteratorSnapshot';
import { CursorPointerTarget, CursorSnapshotPointerTarget, NonePointerTarget, PointerTarget } from './pointer';

export type MusicDisplayEventBus = EventBus<{
  autoscrollended: {};
  autoscrollstarted: {};
  cursordragstarted: { src: CursorPointerTarget };
  cursordragupdated: { src: CursorPointerTarget; dst: PointerTarget };
  cursordragended: { src: CursorPointerTarget; dst: PointerTarget };
  cursorentered: { src: CursorPointerTarget };
  cursorexited: { src: CursorPointerTarget };
  cursorinfochanged: CursorInfo;
  cursorsnapshotclicked: { src: CursorSnapshotPointerTarget };
  cursorsnapshotentered: { src: CursorSnapshotPointerTarget };
  cursorsnapshotexited: { src: CursorSnapshotPointerTarget };
  interactablemoved: {};
  loadended: {};
  loadstarted: {};
  longpress: {};
  notargetentered: { src: NonePointerTarget };
  notargetexited: { src: NonePointerTarget };
  pointeractive: {};
  pointerdown: { x: number; y: number };
  pointeridle: {};
  resizeended: {};
  resizestarted: {};
  selectionstarted: { src: PointerTarget; selection: AnchoredTimeSelection };
  selectionupdated: { src: PointerTarget; dst: PointerTarget; selection: AnchoredTimeSelection };
  selectionended: { src: PointerTarget; dst: PointerTarget };
}>;

export type SyncSettings = {
  deadTimeMs: number;
  durationMs: number;
};

export interface CursorWrapper {
  element: HTMLElement;
  update(timeMs: number): void;
  clear(): void;
  getBox(): Box;
  disableAutoScroll(): void;
  enableAutoScroll(): void;
  updateScrollAlignment(scrollAlignment: ScrollAlignment): void;
}

export interface Loop {
  readonly isActive: boolean;
  readonly timeMsRange: NumberRange;
  activate(): void;
  deactivate(): void;
  update(timeMsRange: NumberRange): void;
}

export type Callback = () => void;

export type CursorInfo = {
  currentMeasureIndex: number;
  currentMeasureNumber: number;
  numMeasures: number;
};

export type SupportedSVGEventNames = keyof Pick<
  SVGElementEventMap,
  'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup'
>;

export type SVGSettings = {
  eventNames: SupportedSVGEventNames[];
};

export type MusicDisplayOptions = IOSMDOptions & {
  syncSettings: SyncSettings;
  scrollContainer: HTMLDivElement;
  svgSettings: SVGSettings;
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
  y: number;
  cost: LocateCost;
  cursorSnapshot: Readonly<CursorSnapshot> | null;
  targets: LocatorTarget[];
};

export enum ScrollAlignment {
  Top,
  Center,
  Bottom,
}
