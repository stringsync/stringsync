import { first, groupBy, last, sortBy } from 'lodash';
import { bsearch } from '../../util/bsearch';
import { NumberRange } from '../../util/NumberRange';
import { CursorSnapshotter } from './CursorSnapshotter';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { CursorSnapshot, LocateCost, LocateResult } from './types';

type CursorSnapshotLineGroup = {
  yRange: NumberRange;
  cursorSnapshots: CursorSnapshot[];
};

export class MusicDisplayLocator {
  static create(imd: InternalMusicDisplay) {
    const cursorSnapshots = CursorSnapshotter.snapshot(imd);
    const locator = new MusicDisplayLocator(cursorSnapshots);
    locator.init();
    return locator;
  }

  static createNullSeekResult(): LocateResult {
    return { timeMs: -1, cost: LocateCost.Cheap, cursorSnapshot: null };
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
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: null };
    }

    const firstCursorSnapshot = first(this.cursorSnapshots)!;
    if (timeMs < firstCursorSnapshot.timeMsRange.start) {
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: null };
    }

    if (firstCursorSnapshot.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: firstCursorSnapshot };
    }

    // The first voice pointer may have a time range of [0, 0], so we always check
    // the second one just in case.
    const secondCursorSnapshot = firstCursorSnapshot.next;
    if (secondCursorSnapshot && secondCursorSnapshot.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: secondCursorSnapshot };
    }

    const lastCursorSnapshot = last(this.cursorSnapshots)!;
    if (timeMs > lastCursorSnapshot.timeMsRange.end) {
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: null };
    }

    const cursorSnapshot = this.cachedLocateByTimeMsResult.cursorSnapshot;
    if (!cursorSnapshot) {
      return null;
    }

    if (cursorSnapshot.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: cursorSnapshot };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (nextCursorSnapshot && nextCursorSnapshot.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: nextCursorSnapshot };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (prevCursorSnapshot && prevCursorSnapshot.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: prevCursorSnapshot };
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

    return { timeMs, cost: LocateCost.Expensive, cursorSnapshot: cursorSnapshot || null };
  }

  private cheapSeekByPosition(x: number, y: number): LocateResult | null {
    if (this.cursorSnapshots.length === 0) {
      return { timeMs: 0, cost: LocateCost.Cheap, cursorSnapshot: null };
    }

    const cursorSnapshot = this.cachedLocateByPositionResult.cursorSnapshot;
    if (!cursorSnapshot) {
      return null;
    }

    if (cursorSnapshot.xRange.contains(x) && cursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, cursorSnapshot);
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: cursorSnapshot };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (nextCursorSnapshot && nextCursorSnapshot.xRange.contains(x) && nextCursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, nextCursorSnapshot);
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: nextCursorSnapshot };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (prevCursorSnapshot && prevCursorSnapshot.xRange.contains(x) && prevCursorSnapshot.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, prevCursorSnapshot);
      return { timeMs, cost: LocateCost.Cheap, cursorSnapshot: prevCursorSnapshot };
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
      return { timeMs: -1, cost: LocateCost.Expensive, cursorSnapshot: null };
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
      return { timeMs: -1, cost: LocateCost.Expensive, cursorSnapshot: null };
    }

    const timeMs = this.lerpTimeMs(x, cursorSnapshot);
    return { timeMs, cost: LocateCost.Expensive, cursorSnapshot: cursorSnapshot };
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
