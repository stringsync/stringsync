import { get, isNumber, isUndefined } from 'lodash';
import { VoiceEntry } from 'opensheetmusicdisplay';
import { InternalError } from '../../../errors';
import { Box } from '../../../util/Box';
import { memoize } from '../../../util/memoize';
import { NumberRange } from '../../../util/NumberRange';
import { Position } from '../../guitar/Position';
import * as helpers from '../helpers';
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

  private measureLine: number;
  private iteratorSnapshot: IteratorSnapshot;
  private x: number;
  private yRange: NumberRange;
  private bpm: number;
  private beatRange: NumberRange;
  private timeMsRange: NumberRange;
  private entries: VoiceEntry[];
  private targets: LocatorTarget[];

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

  getIteratorSnapshot() {
    return this.iteratorSnapshot;
  }

  getBpm() {
    return this.bpm;
  }

  getBeatRange() {
    return this.beatRange;
  }

  getTimeMsRange() {
    return this.timeMsRange;
  }

  getTargets() {
    return this.targets;
  }

  getEntries() {
    return this.entries;
  }

  @memoize()
  getXRange() {
    const x0 = this.x;
    const x1 =
      this.next && CursorSnapshot.isOnSameMeasureLine(this, this.next)
        ? this.next.x
        : this.x + END_OF_MEASURE_LINE_PADDING_PX;
    return NumberRange.unsorted(x0, x1);
  }

  getYRange() {
    return this.yRange;
  }

  @memoize()
  getBox() {
    return new Box(this.getXRange(), this.getYRange());
  }

  @memoize()
  getMeasureIndex() {
    return this.iteratorSnapshot.clone().CurrentMeasureIndex;
  }

  @memoize()
  getMeasureNumber() {
    return this.iteratorSnapshot.clone().CurrentMeasure.MeasureNumber;
  }

  getMeasureLine() {
    return this.measureLine;
  }

  @memoize()
  getGuitarPositions(): Position[] {
    return this.entries
      .flatMap((entry) => entry.Notes)
      .filter((note) => note.ParentStaff.isTab)
      .map<{ fret: number | null; str: number | null }>((tabNote) => ({
        str: get(tabNote, 'stringNumberTab', null),
        fret: get(tabNote, 'fretNumber', null),
      }))
      .filter((pos): pos is { fret: number; str: number } => isNumber(pos.str) && isNumber(pos.fret))
      .map((pos) => new Position(pos.fret, pos.str));
  }

  @memoize()
  getKeyInfo() {
    // TODO(jared) make this work for multiple parts
    const keyInstruction = this.iteratorSnapshot.clone().CurrentMeasure.getKeyInstruction(0);
    if (isUndefined(keyInstruction)) {
      throw new InternalError('could not get key instruction from snapshot');
    }
    return helpers.getKeyInfo(keyInstruction);
  }

  @memoize()
  getMainScale() {}

  @memoize()
  getMeasureCursorSnapshots(): CursorSnapshot[] {
    const before = [...this.getPrevMeasureCursorSnapshots()];
    const middle = [this];
    const after = [...this.getNextMeasureCursorSnapshots()];
    return [...before, ...middle, ...after];
  }

  @memoize()
  getPrevMeasureCursorSnapshots(): CursorSnapshot[] {
    const prevMeasureCursorSnapshots = new Array<CursorSnapshot>();
    const prev = this.prev;
    if (prev && prev.getMeasureIndex() === this.getMeasureIndex()) {
      prevMeasureCursorSnapshots.push(...prev.getPrevMeasureCursorSnapshots(), prev);
    }
    return prevMeasureCursorSnapshots;
  }

  @memoize()
  getNextMeasureCursorSnapshots(): CursorSnapshot[] {
    const nextMeasureCursorSnapshots = new Array<CursorSnapshot>();
    let next = this.next;
    if (next && next.getMeasureIndex() === this.getMeasureIndex()) {
      nextMeasureCursorSnapshots.push(next, ...next.getNextMeasureCursorSnapshots());
    }
    return nextMeasureCursorSnapshots;
  }

  linkPrev(cursorSnapshot: CursorSnapshot): void {
    cursorSnapshot.next = this;
    this.prev = cursorSnapshot;
  }

  lerpX(timeMs: number) {
    const t0 = this.timeMsRange.start;
    const t1 = this.timeMsRange.end;

    const xRange = this.getXRange();
    const x0 = xRange.start;
    const x1 = xRange.end;

    const x = x1 + ((timeMs - t1) * (x1 - x0)) / (t1 - t0);

    return x;
  }

  lerpTimeMs(x: number) {
    const t0 = this.timeMsRange.start;
    const t1 = this.timeMsRange.end;

    const xRange = this.getXRange();
    const x0 = xRange.start;
    const x1 = xRange.end;

    const t = t1 + ((x - x1) * (t1 - t0)) / (x1 - x0);

    return t;
  }
}
