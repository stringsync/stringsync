import { VoiceEntry } from 'opensheetmusicdisplay';
import { END_OF_MEASURE_LINE_PADDING_PX, LocatorTarget } from '.';
import { Box } from '../../../util/Box';
import { NumberRange } from '../../../util/NumberRange';
import { IteratorSnapshot } from './IteratorSnapshot';

type CursorSnapshotAttrs = {
  measureLine: number;
  iteratorSnapshot: IteratorSnapshot;
  x: number;
  yRange: NumberRange;
  bpm: number;
  beatRange: NumberRange;
  timeMsRange: NumberRange;
  entries: VoiceEntry[];
  targets: LocatorTarget[];
};

export class CursorSnapshot {
  /**
   * Validates that the startCursorSnapshot is connected to the endCursorSnapshot via the next and prev properties.
   * It also implicity checks for infinite loops by independently tracking the index.
   */
  static validateContinuity(startCursorSnapshot: CursorSnapshot, endCursorSnapshot: CursorSnapshot) {
    let prevCursorSnapshot: CursorSnapshot | null = startCursorSnapshot.prev;
    let currentCursorSnapshot = startCursorSnapshot;
    let index = currentCursorSnapshot.index;
    while (currentCursorSnapshot !== endCursorSnapshot) {
      if (currentCursorSnapshot.index !== index) {
        throw new Error(`index skipped at: ${index}`);
      }
      if (prevCursorSnapshot !== currentCursorSnapshot.prev) {
        throw new Error(`previous cursor snapshot incorrect at index: ${index}`);
      }
      const nextCursorSnapshot = currentCursorSnapshot.next;
      if (!nextCursorSnapshot) {
        throw new Error(`did not reach end cursor snapshot, stopped at index: ${index}`);
      }
      prevCursorSnapshot = currentCursorSnapshot;
      currentCursorSnapshot = nextCursorSnapshot;
      index++;
    }
  }

  readonly index: number;
  next: CursorSnapshot | null = null;
  prev: CursorSnapshot | null = null;

  readonly measureLine: number;
  readonly iteratorSnapshot: IteratorSnapshot;
  readonly x: number;
  readonly yRange: NumberRange;
  readonly bpm: number;
  readonly beatRange: NumberRange;
  readonly timeMsRange: NumberRange;
  readonly entries: VoiceEntry[];
  readonly targets: LocatorTarget[];

  constructor(index: number, attrs: CursorSnapshotAttrs) {
    this.index = index;
    this.measureLine = attrs.measureLine;
    this.iteratorSnapshot = attrs.iteratorSnapshot;
    this.x = attrs.x;
    this.yRange = attrs.yRange;
    this.bpm = attrs.bpm;
    this.beatRange = attrs.beatRange;
    this.timeMsRange = attrs.timeMsRange;
    this.entries = attrs.entries;
    this.targets = attrs.targets;
  }

  linkPrev(cursorSnapshot: CursorSnapshot): void {
    cursorSnapshot.next = this;
    this.prev = cursorSnapshot;
  }

  get xRange() {
    const x0 = this.x;
    const x1 = this.next ? this.next.x : this.x + END_OF_MEASURE_LINE_PADDING_PX;
    return NumberRange.from(x0).to(x1);
  }

  get box() {
    return new Box(this.xRange, this.yRange);
  }

  isOnSameMeasureLine(cursorSnapshot: CursorSnapshot) {
    return this.measureLine === cursorSnapshot.measureLine;
  }
}
