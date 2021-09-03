import $ from 'jquery';
import { Cursor, CursorType } from 'opensheetmusicdisplay';
import { CursorSnapshot } from '.';
import { NumberRange } from '../../util/NumberRange';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { IteratorSnapshot } from './IteratorSnapshot';

const END_OF_LINE_PADDING_PX = 100;

export class CursorSnapshotter {
  static snapshot(imd: InternalMusicDisplay) {
    const voicePointerCalculator = new CursorSnapshotter(imd);
    return voicePointerCalculator.snapshot();
  }

  private imd: InternalMusicDisplay;

  private constructor(imd: InternalMusicDisplay) {
    this.imd = imd;
  }

  private withProbeCursor(callback: (probeCursor: Cursor) => void) {
    const cursorOption = {
      id: Symbol(),
      type: CursorType.Standard,
      color: 'black',
      follow: false,
      alpha: 0,
    };
    const [probeCursor] = this.imd.pushCursors([cursorOption]);
    try {
      probeCursor.show();
      callback(probeCursor);
    } finally {
      this.imd.removeCursor(cursorOption.id);
    }
  }

  private forEachCursorPosition(callback: (index: number, probeCursor: Cursor) => void) {
    let index = 0;
    this.withProbeCursor((probeCursor: Cursor) => {
      while (!probeCursor.iterator.EndReached) {
        callback(index, probeCursor);
        probeCursor.next();
        index++;
      }
    });
  }

  /**
   * Scans through all the voice entries using the probe cursor, then creates
   * snapshots of each iteration. Consumers may use the snapshots to move a
   * cursor to a given point.
   */
  private snapshot(): CursorSnapshot[] {
    if (this.shouldSkipPointerCalculations()) {
      console.warn('skipping pointer calculations');
      return [];
    }

    const cursorSnapshots = new Array<CursorSnapshot>();

    // Initialize accounting variables
    let prevCursorSnapshot: CursorSnapshot | null = null;
    let currBeat = 0;
    let currTimeMs = this.imd.syncSettings.deadTimeMs;

    this.forEachCursorPosition((index, probeCursor) => {
      const iteratorSnapshot = IteratorSnapshot.create(probeCursor.iterator);

      // Get OSMD-specific references
      const entries = probeCursor.VoicesUnderCursor();
      const note = entries[0].Notes[0];

      const bpm = probeCursor.iterator.CurrentMeasure.TempoInBPM;
      const numBeats = note.Length.RealValue;

      // Calculate beat range
      const startBeat = currBeat;
      const endBeat = startBeat + numBeats;
      const beatRange = NumberRange.from(startBeat).to(endBeat);

      // Calculate time range
      const startTimeMs = currTimeMs;
      const endTimeMs = startTimeMs + this.convertNumBeatsToMs(bpm, numBeats);
      const timeMsRange = NumberRange.from(startTimeMs).to(endTimeMs);

      // Calculate position ranges
      const $element = $(probeCursor.cursorElement);
      const position = $element.position();
      const startX = position.left;
      const tmpEndX = startX + END_OF_LINE_PADDING_PX;
      const startY = position.top;
      const endY = startY + ($element.height() ?? 0);

      // Caluclate voice pointer
      const cursorSnapshot: CursorSnapshot = {
        next: null,
        prev: null,
        xRange: NumberRange.from(startX).to(tmpEndX),
        yRange: NumberRange.from(startY).to(endY),
        beatRange,
        timeMsRange,
        iteratorSnapshot,
        entries,
      };
      cursorSnapshots.push(cursorSnapshot);

      // Perform linking and fix the xRange of the previous voice pointer if necessary
      if (prevCursorSnapshot) {
        cursorSnapshot.prev = prevCursorSnapshot;
        prevCursorSnapshot.next = cursorSnapshot;

        const isPrevCursorSnapshotOnSameLine = prevCursorSnapshot.yRange.start === startY;
        const prevStartX = prevCursorSnapshot.xRange.start;
        const endStartX = isPrevCursorSnapshotOnSameLine ? startX : prevCursorSnapshot.xRange.end;
        prevCursorSnapshot.xRange = NumberRange.from(prevStartX).to(endStartX);
      }

      // Update accounting variables
      prevCursorSnapshot = cursorSnapshot;
      currBeat = endBeat;
      currTimeMs = endTimeMs;
      index++;
    });

    return cursorSnapshots.map((voicePointer) => Object.freeze(voicePointer));
  }

  private shouldSkipPointerCalculations(): boolean {
    const parts = this.imd.Sheet.Parts;
    if (parts.length === 0) {
      console.warn('music sheet has no parts');
      return true;
    }

    const voices = parts[0].Voices;
    if (voices.length === 0) {
      console.warn('music sheet has no voices');
      return true;
    }

    const voiceEntries = voices[0].VoiceEntries;
    if (voiceEntries.length === 0) {
      console.warn('music sheet has no voice entries');
      return true;
    }

    const sourceMeasures = this.imd.Sheet.SourceMeasures;
    if (sourceMeasures.length === 0) {
      console.warn('music sheet has no source measures');
      return true;
    }

    return false;
  }

  private convertNumBeatsToMs(bpm: number, numBeats: number) {
    // bpm is how many quarter notes per minute
    const trueBpm = bpm / 4;
    const mins = numBeats / trueBpm;
    const secs = mins * 60;
    const ms = secs * 1000;
    return ms;
  }
}
