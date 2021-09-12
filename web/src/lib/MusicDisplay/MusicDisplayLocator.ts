import $ from 'jquery';
import { first, get, groupBy, isNumber, last, sortBy } from 'lodash';
import { GraphicalNote } from 'opensheetmusicdisplay';
import { LocatorTarget } from '.';
import { Box } from '../../util/Box';
import { bsearch } from '../../util/bsearch';
import { NumberRange } from '../../util/NumberRange';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { IteratorSnapshot } from './IteratorSnapshot';
import {
  CursorLocatorTarget,
  CursorSnapshot,
  LocateCost,
  LocateResult,
  LocatorTargetType,
  SelectionEdge,
  SelectionLocatorTarget,
} from './types';

// Groups cursor snapshots by the y-range spans they cover. This is a natural division that makes searching
// by position easier.
type CursorSnapshotLineGroup = {
  yRange: NumberRange;
  cursorSnapshots: CursorSnapshot[];
};

export const END_OF_MEASURE_LINE_PADDING_PX = 20;

export class MusicDisplayLocator {
  static create(imd: InternalMusicDisplay) {
    const cursorSnapshots = MusicDisplayLocator.takeCursorSnapshots(imd);
    const cursorSnapshotLineGroups = MusicDisplayLocator.calculateCursorSnapshotLineGroups(cursorSnapshots);
    return new MusicDisplayLocator(imd, cursorSnapshots, cursorSnapshotLineGroups);
  }

  static createNullLocateResult(): LocateResult {
    return { timeMs: -1, x: -1, y: -1, cost: LocateCost.Unknown, cursorSnapshot: null, targets: [] };
  }

  private static takeCursorSnapshots(imd: InternalMusicDisplay) {
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
      const endTimeMs = startTimeMs + MusicDisplayLocator.convertNumBeatsToMs(bpm, numBeats);
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
        const vfNoteheadEl = MusicDisplayLocator.getVfNoteheadElement(graphicalNote);
        if (!vfNoteheadEl) {
          continue;
        }
        const box = MusicDisplayLocator.getBoxFromVfNoteheadElement(vfNoteheadEl);
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

  private static calculateCursorSnapshotLineGroups(cursorSnapshots: CursorSnapshot[]): CursorSnapshotLineGroup[] {
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

  readonly cursorSnapshots: CursorSnapshot[];
  private imd: InternalMusicDisplay;
  private cachedLocateByTimeMsResult = MusicDisplayLocator.createNullLocateResult();
  private cachedLocateByPositionResult = MusicDisplayLocator.createNullLocateResult();
  private cursorSnapshotLineGroups: CursorSnapshotLineGroup[];

  private constructor(
    imd: InternalMusicDisplay,
    cursorSnapshots: CursorSnapshot[],
    cursorSnapshotLineGroups: CursorSnapshotLineGroup[]
  ) {
    this.imd = imd;
    this.cursorSnapshots = cursorSnapshots;
    this.cursorSnapshotLineGroups = cursorSnapshotLineGroups;
  }

  clone() {
    return new MusicDisplayLocator(this.imd, this.cursorSnapshots, this.cursorSnapshotLineGroups);
  }

  slice(startIndex: number, endIndex: number) {
    return this.cursorSnapshots.slice(startIndex, endIndex);
  }

  locateByTimeMs(timeMs: number): LocateResult {
    const cheapLocateResult = this.cheapLocateByTimeMs(timeMs);
    if (cheapLocateResult) {
      this.cachedLocateByTimeMsResult = cheapLocateResult;
      return cheapLocateResult;
    }

    const expensiveLocateResult = this.expensiveLocateByTimeMs(timeMs);
    this.cachedLocateByTimeMsResult = expensiveLocateResult;
    return expensiveLocateResult;
  }

  locateByPosition(x: number, y: number): LocateResult {
    const cheapLocateResult = this.cheapSeekByPosition(x, y);
    if (cheapLocateResult) {
      this.cachedLocateByPositionResult = cheapLocateResult;
      return cheapLocateResult;
    }

    const expensiveLocateResult = this.expensiveLocateByPosition(x, y);
    this.cachedLocateByPositionResult = expensiveLocateResult;
    return expensiveLocateResult;
  }

  private cheapLocateByTimeMs(timeMs: number): LocateResult | null {
    if (this.cursorSnapshots.length === 0) {
      return {
        timeMs,
        x: -1,
        y: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: [],
      };
    }

    const firstCursorSnapshot = first(this.cursorSnapshots)!;
    if (timeMs < firstCursorSnapshot.timeMsRange.start) {
      return {
        timeMs,
        x: -1,
        y: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: [],
      };
    }

    if (firstCursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, firstCursorSnapshot);
      return {
        timeMs,
        x,
        y: firstCursorSnapshot.yRange.midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: firstCursorSnapshot,
        targets: firstCursorSnapshot.targets,
      };
    }

    // The first cursor snapshot may have a time range of [0, 0], so we always check
    // the second one just in case.
    const secondCursorSnapshot = firstCursorSnapshot.next;
    if (secondCursorSnapshot && secondCursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, secondCursorSnapshot);
      return {
        timeMs,
        x,
        y: secondCursorSnapshot.timeMsRange.midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: secondCursorSnapshot,
        targets: secondCursorSnapshot.targets,
      };
    }

    const lastCursorSnapshot = last(this.cursorSnapshots)!;
    if (timeMs > lastCursorSnapshot.timeMsRange.end) {
      return {
        timeMs,
        x: -1,
        y: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: lastCursorSnapshot.targets,
      };
    }

    const cursorSnapshot = this.cachedLocateByTimeMsResult.cursorSnapshot;
    if (!cursorSnapshot) {
      return null;
    }

    if (cursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, cursorSnapshot);
      return {
        timeMs,
        x,
        y: cursorSnapshot.yRange.midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: cursorSnapshot,
        targets: cursorSnapshot.targets,
      };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (nextCursorSnapshot && nextCursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, nextCursorSnapshot);
      return {
        timeMs,
        x,
        y: nextCursorSnapshot.yRange.midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: nextCursorSnapshot,
        targets: nextCursorSnapshot.targets,
      };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (prevCursorSnapshot && prevCursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, prevCursorSnapshot);
      return {
        timeMs,
        x,
        y: prevCursorSnapshot.yRange.midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: prevCursorSnapshot,
        targets: prevCursorSnapshot.targets,
      };
    }

    return null;
  }

  /**
   * Seeks a voice pointer containing the timeMs using the binary search algorithm.
   */
  private expensiveLocateByTimeMs(timeMs: number): LocateResult {
    const cursorSnapshot = bsearch(this.cursorSnapshots, (cursorSnapshot) => {
      const { start, end } = cursorSnapshot.timeMsRange;
      if (start > timeMs) {
        return -1;
      } else if (end < timeMs) {
        return 1;
      } else {
        return 0;
      }
    });

    if (cursorSnapshot) {
      const x = this.lerpX(timeMs, cursorSnapshot);
      return {
        timeMs,
        x,
        y: cursorSnapshot.yRange.midpoint,
        cost: LocateCost.Expensive,
        cursorSnapshot: cursorSnapshot,
        targets: cursorSnapshot.targets,
      };
    }

    return {
      timeMs,
      x: -1,
      y: -1,
      cost: LocateCost.Expensive,
      cursorSnapshot: null,
      targets: [],
    };
  }

  private cheapSeekByPosition(x: number, y: number): LocateResult | null {
    if (this.cursorSnapshots.length === 0) {
      return {
        timeMs: 0,
        x,
        y,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: [],
      };
    }

    const cursorSnapshot = this.cachedLocateByPositionResult.cursorSnapshot;
    if (!cursorSnapshot) {
      return null;
    }

    if (cursorSnapshot.xRange.contains(x) && cursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, cursorSnapshot);
      return {
        timeMs,
        x,
        y,
        cost: LocateCost.Cheap,
        cursorSnapshot: cursorSnapshot,
        targets: this.selectTargetsContainingXY(x, y, cursorSnapshot),
      };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (nextCursorSnapshot && nextCursorSnapshot.xRange.contains(x) && nextCursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, nextCursorSnapshot);
      return {
        timeMs,
        x,
        y,
        cost: LocateCost.Cheap,
        cursorSnapshot: nextCursorSnapshot,
        targets: [],
      };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (prevCursorSnapshot && prevCursorSnapshot.xRange.contains(x) && prevCursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, prevCursorSnapshot);
      return {
        timeMs,
        x,
        y,
        cost: LocateCost.Cheap,
        cursorSnapshot: prevCursorSnapshot,
        targets: this.selectTargetsContainingXY(x, y, prevCursorSnapshot),
      };
    }

    return null;
  }

  private expensiveLocateByPosition(x: number, y: number): LocateResult {
    const cursorSnapshotLineGroup = bsearch(this.cursorSnapshotLineGroups, (cursorSnapshotLineGroup) => {
      const { start, end } = cursorSnapshotLineGroup.yRange;
      if (start > y) {
        return -1;
      } else if (end < y) {
        return 1;
      } else {
        return 0;
      }
    });

    if (!cursorSnapshotLineGroup) {
      return {
        timeMs: -1,
        x,
        y,
        cost: LocateCost.Expensive,
        cursorSnapshot: null,
        targets: [],
      };
    }

    const cursorSnapshot = bsearch(cursorSnapshotLineGroup.cursorSnapshots, (cursorSnapshot) => {
      const { start, end } = cursorSnapshot.xRange;
      if (start > x) {
        return -1;
      } else if (end < x) {
        return 1;
      } else {
        return 0;
      }
    });

    if (!cursorSnapshot) {
      return {
        timeMs: -1,
        x,
        y,
        cost: LocateCost.Expensive,
        cursorSnapshot: null,
        targets: [],
      };
    }

    const timeMs = this.lerpTimeMs(x, cursorSnapshot);
    return {
      timeMs,
      x,
      y,
      cost: LocateCost.Expensive,
      cursorSnapshot: cursorSnapshot,
      targets: this.selectTargetsContainingXY(x, y, cursorSnapshot),
    };
  }

  private selectTargetsContainingXY(x: number, y: number, cursorSnapshot: CursorSnapshot): LocatorTarget[] {
    const targets = new Array<LocatorTarget>();

    const selectionHits = this.getSelectionHits(x, y);
    targets.push(...selectionHits);

    const cursorHits = this.getCursorHits(x, y);
    targets.push(...cursorHits);

    targets.push(
      ...cursorSnapshot.targets.filter((target) => {
        switch (target.type) {
          case LocatorTargetType.Note:
            return target.box.contains(x, y);
          default:
            return false;
        }
      })
    );

    return targets;
  }

  private getCursorHits(x: number, y: number): CursorLocatorTarget[] {
    const hits = new Array<CursorLocatorTarget>();

    const cursors = [this.imd.cursorWrapper];

    for (const cursor of cursors) {
      const box = cursor.getBox();
      if (box.contains(x, y)) {
        hits.push({ type: LocatorTargetType.Cursor, cursor, box });
      }
    }

    return hits;
  }

  private getSelectionHits(x: number, y: number): SelectionLocatorTarget[] {
    if (!this.imd.loop.isActive) {
      return [];
    }

    const hits = new Array<SelectionLocatorTarget>();

    const startCursor = this.imd.loop.startCursor;
    const startBox = startCursor.getBox();
    if (startBox.contains(x, y)) {
      hits.push({
        type: LocatorTargetType.Selection,
        edge: SelectionEdge.Start,
        selection: this.imd.loop.selection,
        box: startBox,
        cursor: startCursor,
      });
    }

    const endCursor = this.imd.loop.endCursor;
    const endBox = endCursor.getBox();
    if (endBox.contains(x, y)) {
      hits.push({
        type: LocatorTargetType.Selection,
        edge: SelectionEdge.End,
        selection: this.imd.loop.selection,
        box: endBox,
        cursor: endCursor,
      });
    }

    return hits;
  }

  private lerpX(timeMs: number, cursorSnapshot: CursorSnapshot) {
    const t0 = cursorSnapshot.timeMsRange.start;
    const t1 = cursorSnapshot.timeMsRange.end;
    const x0 = cursorSnapshot.xRange.start;
    const x1 = cursorSnapshot.xRange.end;

    const x = x1 + ((timeMs - t1) * (x1 - x0)) / (t1 - t0);

    return x;
  }

  private lerpTimeMs(x: number, cursorSnapshot: CursorSnapshot) {
    const t0 = cursorSnapshot.timeMsRange.start;
    const t1 = cursorSnapshot.timeMsRange.end;
    const x0 = cursorSnapshot.xRange.start;
    const x1 = cursorSnapshot.xRange.end;

    const t = t1 + ((x - x1) * (t1 - t0)) / (x1 - x0);

    return t;
  }
}
