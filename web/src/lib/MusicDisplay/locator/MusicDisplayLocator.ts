import { first, last } from 'lodash';
import { bsearch } from '../../../util/bsearch';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { CursorSnapshot } from './CursorSnapshot';
import { CursorSnapshotCalculator } from './CursorSnapshotCalculator';
import {
  CursorLocatorTarget,
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
    if (timeMs < firstCursorSnapshot.getTimeMsRange().start) {
      return {
        timeMs,
        x: -1,
        y: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: [],
      };
    }

    if (firstCursorSnapshot.getTimeMsRange().contains(timeMs)) {
      return {
        timeMs,
        x: firstCursorSnapshot.lerpX(timeMs),
        y: firstCursorSnapshot.getYRange().midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: firstCursorSnapshot,
        targets: firstCursorSnapshot.getTargets(),
      };
    }

    // The first cursor snapshot may have a time range of [0, 0], so we always check
    // the second one just in case.
    const secondCursorSnapshot = firstCursorSnapshot.next;
    if (secondCursorSnapshot && secondCursorSnapshot.getTimeMsRange().contains(timeMs)) {
      return {
        timeMs,
        x: secondCursorSnapshot.lerpX(timeMs),
        y: secondCursorSnapshot.getTimeMsRange().midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: secondCursorSnapshot,
        targets: secondCursorSnapshot.getTargets(),
      };
    }

    const lastCursorSnapshot = last(this.cursorSnapshots)!;
    if (timeMs > lastCursorSnapshot.getTimeMsRange().end) {
      return {
        timeMs,
        x: -1,
        y: -1,
        cost: LocateCost.Cheap,
        cursorSnapshot: null,
        targets: lastCursorSnapshot.getTargets(),
      };
    }

    const cursorSnapshot = this.cachedLocateByTimeMsResult.cursorSnapshot;
    if (!cursorSnapshot) {
      return null;
    }

    if (cursorSnapshot.getTimeMsRange().contains(timeMs)) {
      return {
        timeMs,
        x: cursorSnapshot.lerpX(timeMs),
        y: cursorSnapshot.getYRange().midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: cursorSnapshot,
        targets: cursorSnapshot.getTargets(),
      };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (nextCursorSnapshot && nextCursorSnapshot.getTimeMsRange().contains(timeMs)) {
      return {
        timeMs,
        x: nextCursorSnapshot.lerpX(timeMs),
        y: nextCursorSnapshot.getYRange().midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: nextCursorSnapshot,
        targets: nextCursorSnapshot.getTargets(),
      };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (prevCursorSnapshot && prevCursorSnapshot.getTimeMsRange().contains(timeMs)) {
      return {
        timeMs,
        x: prevCursorSnapshot.lerpX(timeMs),
        y: prevCursorSnapshot.getYRange().midpoint,
        cost: LocateCost.Cheap,
        cursorSnapshot: prevCursorSnapshot,
        targets: prevCursorSnapshot.getTargets(),
      };
    }

    return null;
  }

  /**
   * Seeks a voice pointer containing the timeMs using the binary search algorithm.
   */
  private expensiveLocateByTimeMs(timeMs: number): LocateResult {
    const cursorSnapshot = bsearch(this.cursorSnapshots, (cursorSnapshot) => {
      const { start, end } = cursorSnapshot.getTimeMsRange();
      if (start > timeMs) {
        return -1;
      } else if (end < timeMs) {
        return 1;
      } else {
        return 0;
      }
    });

    if (cursorSnapshot) {
      return {
        timeMs,
        x: cursorSnapshot.lerpX(timeMs),
        y: cursorSnapshot.getYRange().midpoint,
        cost: LocateCost.Expensive,
        cursorSnapshot: cursorSnapshot,
        targets: cursorSnapshot.getTargets(),
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

    if (cursorSnapshot.getXRange().contains(x) && cursorSnapshot.getYRange().contains(y)) {
      return {
        timeMs: cursorSnapshot.lerpTimeMs(x),
        x,
        y,
        cost: LocateCost.Cheap,
        cursorSnapshot: cursorSnapshot,
        targets: this.selectTargetsContainingXY(x, y, cursorSnapshot),
      };
    }

    const nextCursorSnapshot = cursorSnapshot.next;
    if (
      nextCursorSnapshot &&
      nextCursorSnapshot.getXRange().contains(x) &&
      nextCursorSnapshot.getYRange().contains(y)
    ) {
      return {
        timeMs: nextCursorSnapshot.lerpTimeMs(x),
        x,
        y,
        cost: LocateCost.Cheap,
        cursorSnapshot: nextCursorSnapshot,
        targets: [],
      };
    }

    const prevCursorSnapshot = cursorSnapshot.prev;
    if (
      prevCursorSnapshot &&
      prevCursorSnapshot.getXRange().contains(x) &&
      prevCursorSnapshot.getYRange().contains(y)
    ) {
      return {
        timeMs: prevCursorSnapshot.lerpTimeMs(x),
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
      const { start, end } = cursorSnapshot.getXRange();
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

    return {
      timeMs: cursorSnapshot.lerpTimeMs(x),
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
      ...cursorSnapshot.getTargets().filter((target) => {
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
        box: endBox,
        cursor: endCursor,
      });
    }

    return hits;
  }
}
