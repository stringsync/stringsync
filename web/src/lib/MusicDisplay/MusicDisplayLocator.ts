import { first, groupBy, last, sortBy } from 'lodash';
import { LocateResultTargets } from '.';
import { bsearch } from '../../util/bsearch';
import { NumberRange } from '../../util/NumberRange';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { IteratorSnapshot } from './IteratorSnapshot';
import { CursorSnapshot, LocateCost, LocateResult } from './types';

type CursorSnapshotLineGroup = {
  yRange: NumberRange;
  cursorSnapshots: CursorSnapshot[];
};

const END_OF_LINE_PADDING_PX = 100;

const convertNumBeatsToMs = (bpm: number, numBeats: number) => {
  // bpm is how many quarter notes per minute
  const trueBpm = bpm / 4;
  const mins = numBeats / trueBpm;
  const secs = mins * 60;
  const ms = secs * 1000;
  return ms;
};

export class MusicDisplayLocator {
  static create(imd: InternalMusicDisplay) {
    const cursorSnapshots = MusicDisplayLocator.takeCursorSnapshots(imd);
    const locator = new MusicDisplayLocator(cursorSnapshots);
    locator.init();
    return locator;
  }

  static createNullSeekResult(): LocateResult {
    const targets = MusicDisplayLocator.createNullLocateResultTargets();
    return { timeMs: -1, x: -1, cost: LocateCost.Unknown, cursorSnapshot: null, targets };
  }

  private static createNullLocateResultTargets(): LocateResultTargets {
    return {
      positional: {
        behind: [],
        colocated: [],
        ahead: [],
      },
      temporal: {
        past: [],
        present: [],
        future: [],
      },
    };
  }

  private static takeCursorSnapshots(imd: InternalMusicDisplay) {
    const cursorSnapshots = new Array<CursorSnapshot>();

    // Initialize accounting variables
    let prevCursorSnapshot: CursorSnapshot | null = null;
    let currBeat = 0;
    let currTimeMs = imd.syncSettings.deadTimeMs;

    imd.forEachCursorPosition((index, probeCursor) => {
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
      const endTimeMs = startTimeMs + convertNumBeatsToMs(bpm, numBeats);
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
        bpm,
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

  readonly cursorSnapshots: CursorSnapshot[];
  private cachedLocateByTimeMsResult = MusicDisplayLocator.createNullSeekResult();
  private cachedLocateByPositionResult = MusicDisplayLocator.createNullSeekResult();
  private cursorSnapshotLineGroups: CursorSnapshotLineGroup[];

  private constructor(cursorSnapshots: CursorSnapshot[], cursorSnapshotLineGroups: CursorSnapshotLineGroup[] = []) {
    this.cursorSnapshots = cursorSnapshots;
    this.cursorSnapshotLineGroups = cursorSnapshotLineGroups;
  }

  clone() {
    return new MusicDisplayLocator(this.cursorSnapshots, this.cursorSnapshotLineGroups);
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

  private init() {
    const toStr = (range: NumberRange) => `${range.start}-${range.end}`;
    const toRange = (str: string) => {
      const [start, end] = str.split('-').map(parseFloat);
      return NumberRange.from(start).to(end);
    };

    const cursorSnapshotsByYRangeStr = groupBy(this.cursorSnapshots, (cursorSnapshot) => toStr(cursorSnapshot.yRange));
    const yRangeStrs = sortBy(
      Object.keys(cursorSnapshotsByYRangeStr),
      (str) => toRange(str).start,
      (str) => toRange(str).end
    );

    this.cursorSnapshotLineGroups = yRangeStrs.map((yRangeStr) => {
      return {
        yRange: toRange(yRangeStr),
        cursorSnapshots: cursorSnapshotsByYRangeStr[yRangeStr],
      };
    });
  }

  private cheapLocateByTimeMs(timeMs: number): LocateResult | null {
    if (this.cursorSnapshots.length === 0) {
      return {
        timeMs,
        x: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    const firstCursorSnapshot = first(this.cursorSnapshots)!;
    if (timeMs < firstCursorSnapshot.timeMsRange.start) {
      return {
        timeMs,
        x: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    if (firstCursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, firstCursorSnapshot);
      return {
        timeMs,
        x,
        cost: LocateCost.Cheap,
        cursorSnapshot: firstCursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
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
        cost: LocateCost.Cheap,
        cursorSnapshot: secondCursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    const lastCursorSnapshot = last(this.cursorSnapshots)!;
    if (timeMs > lastCursorSnapshot.timeMsRange.end) {
      return {
        timeMs,
        x: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
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
        cost: LocateCost.Cheap,
        cursorSnapshot: cursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (nextCursorSnapshot && nextCursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, nextCursorSnapshot);
      return {
        timeMs,
        x,
        cost: LocateCost.Cheap,
        cursorSnapshot: nextCursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (prevCursorSnapshot && prevCursorSnapshot.timeMsRange.contains(timeMs)) {
      const x = this.lerpX(timeMs, prevCursorSnapshot);
      return {
        timeMs,
        x,
        cost: LocateCost.Cheap,
        cursorSnapshot: prevCursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
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
        cost: LocateCost.Expensive,
        cursorSnapshot: cursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    return {
      timeMs,
      x: -1,
      cost: LocateCost.Expensive,
      cursorSnapshot: null,
      targets: MusicDisplayLocator.createNullLocateResultTargets(),
    };
  }

  private cheapSeekByPosition(x: number, y: number): LocateResult | null {
    if (this.cursorSnapshots.length === 0) {
      return {
        timeMs: 0,
        x,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
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
        cost: LocateCost.Cheap,
        cursorSnapshot: cursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (nextCursorSnapshot && nextCursorSnapshot.xRange.contains(x) && nextCursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, nextCursorSnapshot);
      return {
        timeMs,
        x,
        cost: LocateCost.Cheap,
        cursorSnapshot: nextCursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (prevCursorSnapshot && prevCursorSnapshot.xRange.contains(x) && prevCursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, prevCursorSnapshot);
      return {
        timeMs,
        x,
        cost: LocateCost.Cheap,
        cursorSnapshot: prevCursorSnapshot,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
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
        cost: LocateCost.Expensive,
        cursorSnapshot: null,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
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
        cost: LocateCost.Expensive,
        cursorSnapshot: null,
        targets: MusicDisplayLocator.createNullLocateResultTargets(),
      };
    }

    const timeMs = this.lerpTimeMs(x, cursorSnapshot);
    return {
      timeMs,
      x,
      cost: LocateCost.Expensive,
      cursorSnapshot: cursorSnapshot,
      targets: MusicDisplayLocator.createNullLocateResultTargets(),
    };
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
