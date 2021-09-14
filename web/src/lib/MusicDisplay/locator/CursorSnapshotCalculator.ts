import $ from 'jquery';
import { first, get, groupBy, isNumber, sortBy } from 'lodash';
import { GraphicalNote } from 'opensheetmusicdisplay';
import { Box } from '../../../util/Box';
import { NumberRange } from '../../../util/NumberRange';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { END_OF_MEASURE_LINE_PADDING_PX } from './constants';
import { IteratorSnapshot } from './IteratorSnapshot';
import { CursorSnapshot, CursorSnapshotLineGroup, LocatorTarget, LocatorTargetType } from './types';

export class CursorSnapshotCalculator {
  static calculateMusicDisplayLocatorArgs(imd: InternalMusicDisplay) {
    const cursorSnapshots = CursorSnapshotCalculator.calculateCursorSnapshots(imd);
    const cursorSnapshotLineGroups = CursorSnapshotCalculator.calculateCursorSnapshotLineGroups(cursorSnapshots);
    return [imd, cursorSnapshots, cursorSnapshotLineGroups] as const;
  }

  static calculateCursorSnapshots(imd: InternalMusicDisplay) {
    const cursorSnapshots = new Array<CursorSnapshot>();

    // Initialize accounting variables
    let prevCursorSnapshot: CursorSnapshot | null = null;
    let currBeat = 0;
    let currTimeMs = imd.syncSettings.deadTimeMs;
    let measureLine = 0;

    imd.forEachCursorPosition((index, probeCursor) => {
      const iteratorSnapshot = IteratorSnapshot.create(probeCursor.iterator);

      // Get OSMD-specific references
      const entries = probeCursor.VoicesUnderCursor();
      const notes = entries.flatMap((entry) => entry.Notes);
      const engravingRules = probeCursor.iterator.CurrentMeasure.Rules;
      const graphicalNotes = notes.map((note) => GraphicalNote.FromNote(note, engravingRules));
      const probeNote = notes[0];

      const bpm = probeCursor.iterator.CurrentMeasure.TempoInBPM;
      const numBeats = probeNote.Length.RealValue;

      // Calculate beat range
      const startBeat = currBeat;
      const endBeat = startBeat + numBeats;
      const beatRange = NumberRange.from(startBeat).to(endBeat);

      // Calculate time range
      const startTimeMs = currTimeMs;
      const endTimeMs = startTimeMs + CursorSnapshotCalculator.convertNumBeatsToMs(bpm, numBeats);
      const timeMsRange = NumberRange.from(startTimeMs).to(endTimeMs);

      // Calculate position ranges
      const $element = $(probeCursor.cursorElement);
      const position = $element.position();
      const startX = position.left;
      const tmpEndX = startX + END_OF_MEASURE_LINE_PADDING_PX;
      const startY = position.top;
      const endY = startY + ($element.height() ?? 0);
      const xRange = NumberRange.from(startX).to(tmpEndX);
      const yRange = NumberRange.from(startY).to(endY);

      // Calculate locate target groups
      const targets = new Array<LocatorTarget>();
      for (const graphicalNote of graphicalNotes) {
        const vfNoteheadEl = CursorSnapshotCalculator.getVfNoteheadElement(graphicalNote);
        if (!vfNoteheadEl) {
          continue;
        }
        const box = CursorSnapshotCalculator.getBoxFromVfNoteheadElement(vfNoteheadEl);
        targets.push({
          type: LocatorTargetType.Note,
          graphicalNote,
          vfNoteheadEl,
          box,
        });
      }

      // Calculate the measure line
      if (prevCursorSnapshot && !prevCursorSnapshot.yRange.eq(yRange)) {
        measureLine++;
      }

      // Caluclate cursor snapshot
      const cursorSnapshot: CursorSnapshot = {
        index,
        next: null,
        prev: null,
        bpm,
        measureLine,
        xRange,
        yRange,
        beatRange,
        timeMsRange,
        iteratorSnapshot,
        entries,
        targets,
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
    });

    return cursorSnapshots.map((cursorSnapshot) => Object.freeze(cursorSnapshot));
  }

  static calculateCursorSnapshotLineGroups(cursorSnapshots: CursorSnapshot[]): CursorSnapshotLineGroup[] {
    const byMeasureLine = (cursorSnapshot: CursorSnapshot) => cursorSnapshot.measureLine;
    const byIndex = (cursorSnapshot: CursorSnapshot) => cursorSnapshot.index;

    const cursorSnapshotsByMeasureLine = groupBy(cursorSnapshots, byMeasureLine);
    const measureLines = Object.keys(cursorSnapshotsByMeasureLine);

    return measureLines.map((measureLine) => {
      const cursorSnapshots = sortBy(cursorSnapshotsByMeasureLine[measureLine], byIndex);
      if (cursorSnapshots.length === 0) {
        throw new Error('could not calculate line groups, empty measure line');
      }
      const yRange = first(cursorSnapshots)!.yRange;

      return { yRange, cursorSnapshots };
    });
  }

  private static convertNumBeatsToMs = (bpm: number, numBeats: number) => {
    // bpm is how many quarter notes per minute
    const trueBpm = bpm / 4;
    const mins = numBeats / trueBpm;
    const secs = mins * 60;
    const ms = secs * 1000;
    return ms;
  };

  private static getVfNoteheadElement(graphicalNote: GraphicalNote): SVGGElement | null {
    const vfnote = get(graphicalNote, 'vfnote[0]', null);
    if (!vfnote) {
      return null;
    }

    const vfnoteType = get(graphicalNote, 'vfnote[0].attrs.type', null);
    if (vfnoteType !== 'StaveNote') {
      return null;
    }

    const vfnoteIndex = get(graphicalNote, 'vfnoteIndex', null);
    if (!isNumber(vfnoteIndex)) {
      console.warn('could not get vfnote index');
      return null;
    }

    const vfStavenoteEl = get(graphicalNote, 'vfnote[0].attrs.el', null);
    if (!(vfStavenoteEl instanceof SVGGElement)) {
      console.warn('could not get vfnote element');
      return null;
    }

    return ($(vfStavenoteEl)
      .find('.vf-notehead')
      .get(vfnoteIndex) as unknown) as SVGGElement;
  }

  private static getBoxFromVfNoteheadElement(g: SVGGElement) {
    const bbox = g.getBBox();
    const x0 = bbox.x;
    const y0 = bbox.y;
    const x1 = x0 + bbox.width;
    const y1 = y0 + bbox.height;
    return Box.from(x0, y0).to(x1, y1);
  }
}
