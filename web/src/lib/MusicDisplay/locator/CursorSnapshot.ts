import { first, isNull, isUndefined, last } from 'lodash';
import { Note, VoiceEntry } from 'opensheetmusicdisplay';
import { Box } from '../../../util/Box';
import { memoize } from '../../../util/memoize';
import { NumberRange } from '../../../util/NumberRange';
import { Position } from '../../guitar/Position';
import * as helpers from '../helpers';
import { KeyInfo } from '../helpers';
import { END_OF_MEASURE_LINE_PADDING_PX } from './constants';
import { IteratorSnapshot } from './IteratorSnapshot';
import { LocatorTarget, Tie } from './types';

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
  getMeasureTimeMsRange() {
    const measureCursorSnapshots = this.getMeasureCursorSnapshots();
    const firstCursorSnapshot = first(measureCursorSnapshots);
    const lastCursorSnapshot = last(measureCursorSnapshots);

    const start = firstCursorSnapshot?.getTimeMsRange().start || 0;
    const end = lastCursorSnapshot?.getTimeMsRange().end || start;

    return NumberRange.from(start).to(end);
  }

  @memoize()
  getNotes(): Note[] {
    return this.entries
      .flatMap((entry) => entry.Notes)
      .filter((note) => !note.ParentStaff.isTab)
      .filter((note) => !note.IsGraceNote);
  }

  @memoize()
  getTabNotes(): Note[] {
    return this.entries
      .flatMap((entry) => entry.Notes)
      .filter((note) => note.ParentStaff.isTab)
      .filter((note) => !note.IsGraceNote);
  }

  @memoize()
  getGraceNotes(): Note[] {
    return this.entries.flatMap((entry) => entry.Notes).filter((note) => note.IsGraceNote);
  }

  @memoize()
  getPositions(): Position[] {
    return this.getTabNotes().map(helpers.toPosition).filter(helpers.isPosition);
  }

  @memoize()
  getTies(): Tie[] {
    return this.entries
      .filter((entry) => entry.hasTie())
      .flatMap((entry) => entry.Notes)
      .filter((note) => note.ParentStaff.isTab)
      .filter((tabNote) => tabNote.NoteTie)
      .map((tabNote) => tabNote.NoteTie.Notes)
      .filter((tiedTabNotes) => tiedTabNotes.length >= 2) // disallow articulating to/from nothing
      .map((tiedTabNotes) =>
        tiedTabNotes
          .map((tiedTabNote) => {
            const type = helpers.toPositionTransitionType(tiedTabNote);
            const position = helpers.toPosition(tiedTabNote);
            return { type, position };
          })
          .filter((tiePart) => !isNull(tiePart.position))
      )
      .flatMap((tieParts) => {
        const ties = new Array<Tie>();
        // The last element is skipped.
        for (let ndx = 0; ndx < tieParts.length - 1; ndx++) {
          const type = tieParts[ndx].type;
          const from = tieParts[ndx].position!;
          const to = tieParts[ndx + 1].position!;
          ties.push({ type, from, to });
        }
        return ties;
      });
  }

  @memoize()
  getGracePositions(): Position[] {
    return this.entries
      .flatMap((entry) => entry.Notes)
      .filter((note) => note.ParentStaff.isTab)
      .filter((note) => note.IsGraceNote)
      .map(helpers.toPosition)
      .filter(helpers.isPosition);
  }

  @memoize()
  getKeyInfo(): KeyInfo {
    // TODO(jared) make this work for multiple parts
    const keyInstruction = this.iteratorSnapshot.clone().CurrentMeasure.getKeyInstruction(0);
    return isUndefined(keyInstruction) ? this.getFallbackKeyInstruction() : helpers.getKeyInfo(keyInstruction);
  }

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

  private getFallbackKeyInstruction() {
    if (!this.prev) {
      throw new Error('could not get key instruction for the first cursor snapshot');
    }
    return this.prev.getKeyInfo();
  }
}
