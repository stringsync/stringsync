import { IOSMDOptions, VoiceEntry } from 'opensheetmusicdisplay';
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
  cursordragupdated: { cursor: CursorWrapper };
  cursordragended: { cursor: CursorWrapper };
  selectionstarted: { selection: AnchoredTimeSelection };
  selectionupdated: { selection: AnchoredTimeSelection };
  selectionended: {};
  cursorsnapshotclicked: { cursorSnapshot: CursorSnapshot; timeMs: number };
  cursorsnapshothovered: { cursorSnapshot: CursorSnapshot; timeMs: number };
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
};

export enum LocatorTargetType {
  None,
  Cursor,
  Notehead,
  Stem,
}

export type LocatorTarget =
  | { type: LocatorTargetType.None }
  | { type: LocatorTargetType.Cursor; cursor: CursorWrapper }
  | { type: LocatorTargetType.Notehead }
  | { type: LocatorTargetType.Stem };

export enum LocateCost {
  Unknown,
  Cheap,
  Expensive,
}

export type LocateResultTargets = {
  positional: {
    behind: LocatorTarget[];
    colocated: LocatorTarget[];
    ahead: LocatorTarget[];
  };
  temporal: {
    past: LocatorTarget[];
    present: LocatorTarget[];
    future: LocatorTarget[];
  };
};

export type LocateResult = {
  timeMs: number;
  x: number;
  cost: LocateCost;
  cursorSnapshot: Readonly<CursorSnapshot> | null;
  targets: LocateResultTargets;
};
