import { isNull } from 'lodash';
import { VoiceEntry } from 'opensheetmusicdisplay';
import { Box } from '../../../util/Box';
import { NumberRange } from '../../../util/NumberRange';
import { END_OF_MEASURE_LINE_PADDING_PX } from './constants';
import { IteratorSnapshot } from './IteratorSnapshot';
import { LocatorTarget } from './types';

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
  static isOnSameMeasureLine(cursorSnapshot1: CursorSnapshot | null, cursorSnapshot2: CursorSnapshot | null) {
    return cursorSnapshot1?.measureLine === cursorSnapshot2?.measureLine;
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

  private xRangeCache: NumberRange | null = null;
  private boxCache: Box | null = null;
  private measureIndexCache: number | null = null;
  private measureNumberCache: number | null = null;

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

  get xRange() {
    if (!this.xRangeCache) {
      this.xRangeCache = this.calculateXRange();
    }
    return this.xRangeCache;
  }

  get box() {
    if (!this.boxCache) {
      this.boxCache = this.calculateBox();
    }
    return this.boxCache;
  }

  get measureIndex() {
    if (isNull(this.measureIndexCache)) {
      this.measureIndexCache = this.iteratorSnapshot.get().CurrentMeasureIndex;
    }
    return this.measureIndexCache;
  }

  get measureNumber() {
    if (isNull(this.measureNumberCache)) {
      this.measureNumberCache = this.iteratorSnapshot.get().CurrentMeasure.MeasureNumber;
    }
    return this.measureNumberCache;
  }

  linkPrev(cursorSnapshot: CursorSnapshot): void {
    cursorSnapshot.next = this;
    this.prev = cursorSnapshot;
  }

  lerpX(timeMs: number) {
    const t0 = this.timeMsRange.start;
    const t1 = this.timeMsRange.end;
    const x0 = this.xRange.start;
    const x1 = this.xRange.end;

    const x = x1 + ((timeMs - t1) * (x1 - x0)) / (t1 - t0);

    return x;
  }

  lerpTimeMs(x: number) {
    const t0 = this.timeMsRange.start;
    const t1 = this.timeMsRange.end;
    const x0 = this.xRange.start;
    const x1 = this.xRange.end;

    const t = t1 + ((x - x1) * (t1 - t0)) / (x1 - x0);

    return t;
  }

  private calculateXRange() {
    const x0 = this.x;
    const x1 =
      this.next && CursorSnapshot.isOnSameMeasureLine(this, this.next)
        ? this.next.x
        : this.x + END_OF_MEASURE_LINE_PADDING_PX;
    return NumberRange.from(x0).to(x1);
  }

  private calculateBox() {
    return new Box(this.xRange, this.yRange);
  }
}
