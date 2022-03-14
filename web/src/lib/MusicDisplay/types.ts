import { MusicXML } from '@stringsync/musicxml';
import { IOSMDOptions } from 'opensheetmusicdisplay';
import { Nullable } from '../../util/types';
import { EventBus } from '../EventBus';
import { CursorWrapper } from './cursors';
import { Fx } from './fx';
import { CursorSnapshot, MusicDisplayLocator, SyncSettings } from './locator';
import { Loop } from './loop';
import { Meta } from './meta';
import {
  CursorPointerTarget,
  CursorSnapshotPointerTarget,
  NonePointerTarget,
  PointerTarget,
  SelectionPointerTarget,
} from './pointer';
import { ScrollBehaviorType, Scroller } from './scroller';
import { SVGSettings } from './svg';

export enum DisplayMode {
  TabsOnly,
  NotesOnly,
  NotesAndTabs,
}

export type MusicDisplayOptions = IOSMDOptions & {
  syncSettings: SyncSettings;
  scrollContainer: HTMLDivElement;
  svgSettings: SVGSettings;
};

export interface MusicDisplay {
  eventBus: MusicDisplayEventBus;
  musicXml: Nullable<MusicXML>;
  load(musicXml: MusicXML): Promise<void>;
  resize(): void;
  dispose(): void;
  getFx(): Fx;
  getScroller(): Scroller;
  getCursor(): CursorWrapper;
  getLoop(): Loop;
  getMeta(): Meta;
  getLocator(): MusicDisplayLocator | null;
  setDisplayMode(displayMode: DisplayMode): void;
}

export type MusicDisplayEventBus = EventBus<{
  click: { src: PointerTarget };
  cursordragstarted: { src: CursorPointerTarget };
  cursordragupdated: { src: CursorPointerTarget; dst: PointerTarget };
  cursordragended: { src: CursorPointerTarget; dst: PointerTarget };
  cursorentered: { src: CursorPointerTarget };
  cursorexited: { src: CursorPointerTarget };
  cursorsnapshotchanged: { cursorSnapshot: CursorSnapshot | null };
  cursorsnapshotentered: { src: CursorSnapshotPointerTarget };
  cursorsnapshotexited: { src: CursorSnapshotPointerTarget };
  externalscrolldetected: {};
  interactablemoved: {};
  loadended: {};
  loadstarted: {};
  longpress: { src: PointerTarget };
  loopactivated: { loop: Loop };
  loopupdated: { loop: Loop };
  loopdeactivated: { loop: Loop };
  press: { src: PointerTarget };
  measurelinechanged: {};
  rendered: {};
  nummeasureschanged: { numMeasures: number };
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
  selectionstarted: { src: PointerTarget };
  selectionupdated: { src: PointerTarget; dst: PointerTarget };
  selectionended: { src: PointerTarget; dst: PointerTarget };
}>;
