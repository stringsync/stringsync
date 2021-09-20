import { IOSMDOptions } from 'opensheetmusicdisplay';
import { AnchoredSelection } from '../../util/AnchoredSelection';
import { EventBus } from '../EventBus';
import { CursorSnapshot, SyncSettings } from './locator';
import {
  CursorPointerTarget,
  CursorSnapshotPointerTarget,
  NonePointerTarget,
  PointerTarget,
  SelectionPointerTarget,
} from './pointer';
import { ScrollBehaviorType } from './scroller';
import { SVGSettings } from './svg';

export type MusicDisplayOptions = IOSMDOptions & {
  syncSettings: SyncSettings;
  scrollContainer: HTMLDivElement;
  svgSettings: SVGSettings;
};

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
  press: {};
  longpress: {};
  measurelinechanged: {};
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
  selectionstarted: { src: PointerTarget; selection: AnchoredSelection };
  selectionupdated: { src: PointerTarget; dst: PointerTarget; selection: AnchoredSelection };
  selectionended: { src: PointerTarget; dst: PointerTarget };
}>;
