import { GraphicalNote, IOSMDOptions, VoiceEntry } from 'opensheetmusicdisplay';
import { AnchoredSelection } from '../../util/AnchoredSelection';
import { Box } from '../../util/Box';
import { NumberRange } from '../../util/NumberRange';
import { EventBus } from '../EventBus';
import { IteratorSnapshot } from './IteratorSnapshot';
import {
  CursorPointerTarget,
  CursorSnapshotPointerTarget,
  NonePointerTarget,
  PointerTarget,
  SelectionPointerTarget,
} from './pointer';
import { ScrollBehaviorType } from './scroller';

export type MusicDisplayEventBus = EventBus<{
  click: { src: PointerTarget };
  cursordragstarted: { src: CursorPointerTarget };
  cursordragupdated: { src: CursorPointerTarget; dst: PointerTarget };
  cursordragended: { src: CursorPointerTarget; dst: PointerTarget };
  cursorentered: { src: CursorPointerTarget };
  cursorexited: { src: CursorPointerTarget };
  cursorinfochanged: CursorInfo;
  cursorsnapshotentered: { src: CursorSnapshotPointerTarget };
  cursorsnapshotexited: { src: CursorSnapshotPointerTarget };
  externalscrolldetected: {};
  interactablemoved: {};
  loadended: {};
  loadstarted: {};
  press: {};
  longpress: {};
  measurelinechanged: {};
  notargetentered: { src: NonePointerTarget };
  notargetexited: { src: NonePointerTarget };
  pointeractive: {};
  pointerdown: { src: PointerTarget };
  pointeridle: {};
  resizeended: {};
  resizestarted: {};
  scrollbehaviorchanged: { type: ScrollBehaviorType };
  selectionentered: { src: SelectionPointerTarget };
  selectionexited: { src: SelectionPointerTarget };
  selectionstarted: { src: PointerTarget; selection: AnchoredSelection };
  selectionupdated: { src: PointerTarget; dst: PointerTarget; selection: AnchoredSelection };
  selectionended: { src: PointerTarget; dst: PointerTarget };
}>;

export type SyncSettings = {
  deadTimeMs: number;
  durationMs: number;
};

export enum StyleType {
  Default,
  Interacting,
}

export interface CursorWrapper {
  element: HTMLElement;
  timeMs: number;
  update(timeMs: number): void;
  updateStyle(styleType: StyleType): void;
  show(): void;
  clear(): void;
  getBox(): Box;
  scrollIntoView(): void;
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
  index: number;
  next: CursorSnapshot | null;
  prev: CursorSnapshot | null;
  measureLine: number;
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
  Selection,
}

export type VfNotehead = {
  el: SVGGElement;
  box: Box;
};

export enum SelectionEdge {
  Start,
  End,
}

export type NoneLocatorTarget = { type: LocatorTargetType.None };

export type CursorLocatorTarget = { type: LocatorTargetType.Cursor; cursor: CursorWrapper; box: Box };

export type NoteLocatorTarget = {
  type: LocatorTargetType.Note;
  graphicalNote: GraphicalNote;
  vfNoteheadEl: SVGGElement;
  box: Box;
};

export type SelectionLocatorTarget = {
  type: LocatorTargetType.Selection;
  selection: AnchoredSelection;
  box: Box;
  edge: SelectionEdge;
  cursor: CursorWrapper;
};

export type LocatorTarget = NoneLocatorTarget | CursorLocatorTarget | NoteLocatorTarget | SelectionLocatorTarget;

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
