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
  cursordragended: { target: CursorPointerTarget; hoverTarget: PointerTarget };
  cursordragstarted: { target: CursorPointerTarget };
  cursordragupdated: { target: CursorPointerTarget };
  cursorentered: { target: CursorPointerTarget };
  cursorexited: { target: CursorPointerTarget };
  cursorinfochanged: CursorInfo;
  cursorsnapshotclicked: { target: CursorSnapshotPointerTarget };
  cursorsnapshotentered: { target: CursorSnapshotPointerTarget };
  cursorsnapshotexited: { target: CursorSnapshotPointerTarget };
  interactablemoved: {};
  loadended: {};
  loadstarted: {};
  longpress: {};
  notargetentered: { target: NonePointerTarget };
  notargetexited: { target: NonePointerTarget };
  pointeractive: {};
  pointerdown: { x: number; y: number };
  pointeridle: {};
  resizeended: {};
  resizestarted: {};
  selectionended: {};
  selectionstarted: { selection: AnchoredTimeSelection };
  selectionupdated: { selection: AnchoredTimeSelection };
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
