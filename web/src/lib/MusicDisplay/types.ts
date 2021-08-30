import { IOSMDOptions, VoiceEntry } from 'opensheetmusicdisplay';
import { NumberRange } from '../../util/NumberRange';
import { EventBus } from '../EventBus';
import { IteratorSnapshot } from './IteratorSnapshot';

export type MusicDisplayEventBus = EventBus<{
  loadstarted: {};
  loadended: {};
  resizestarted: {};
  resizeended: {};
  cursorinfochanged: CursorInfo;
  autoscrollstarted: {};
  autoscrollended: {};
  voicepointerclicked: { srcEvent: SVGElementEventMap['click']; voicePointer: VoicePointer };
}>;

export type SyncSettings = {
  deadTimeMs: number;
  durationMs: number;
};

export interface CursorWrapper {
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

/**
 * The purpose of this type is to keep track of a value and its
 * position in an array.
 *
 * Index must be tracked because it is the mechanism by which the
 * cursor iterator is set. We store these in an array, which is
 * what distiguishes this data structure from a classic doubly
 * linked list.
 */
export type VoicePointer = {
  index: number;
  next: VoicePointer | null;
  prev: VoicePointer | null;
  iteratorSnapshot: IteratorSnapshot;
  xRange: NumberRange;
  yRange: NumberRange;
  beatRange: NumberRange;
  timeMsRange: NumberRange;
  entries: VoiceEntry[];
};

export enum SeekCost {
  Unknown,
  Cheap,
  Expensive,
}

export type SeekResult = Readonly<{
  cost: SeekCost;
  voicePointer: Readonly<VoicePointer> | null;
}>;
