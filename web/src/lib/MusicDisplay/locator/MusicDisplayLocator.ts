import { first, last } from 'lodash';
import { bsearch } from '../../../util/bsearch';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { CursorSnapshotCalculator } from './CursorSnapshotCalculator';
import {
  CursorLocatorTarget,
  CursorSnapshot,
  CursorSnapshotLineGroup,
  LocateCost,
  LocateResult,
  LocatorTarget,
  LocatorTargetType,
  SelectionEdge,
  SelectionLocatorTarget,
} from './types';

export class MusicDisplayLocator {
  static create(imd: InternalMusicDisplay) {
    const args = CursorSnapshotCalculator.calculateMusicDisplayLocatorArgs(imd);
    return new MusicDisplayLocator(...args);
  }

  static createNullLocateResult(): LocateResult {
    return { timeMs: -1, x: -1, y: -1, cost: LocateCost.Unknown, cursorSnapshot: null, targets: [] };
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
