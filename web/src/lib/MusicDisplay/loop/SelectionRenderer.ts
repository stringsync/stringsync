import { first, groupBy, identity, isNull, last, sortBy, uniq } from 'lodash';
import { Box } from '../../../util/Box';
import { NumberRange } from '../../../util/NumberRange';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { CursorSnapshot, END_OF_MEASURE_LINE_PADDING_PX, MusicDisplayLocator } from '../locator';

const DEFAULT_SELECTION_COLOR = 'rgba(244, 244, 188, 0.45)';

type MeasureLineBox = {
  measureLine: number;
  box: Box;
};

enum DiffType {
  None = 'None',
  Change = 'Change',
  Delete = 'Delete',
  Add = 'Add',
}

type MeasureLineBoxDiff = {
  type: DiffType;
  measureLineBox: MeasureLineBox;
};

export class SelectionRenderer {
  static create(imd: InternalMusicDisplay, locator: MusicDisplayLocator) {
    return new SelectionRenderer(imd.getSvg(), locator.clone(), locator.clone());
  }

  private svg: SVGElement;
  private startLocator: MusicDisplayLocator;
  private endLocator: MusicDisplayLocator;
  private startLocateResult = MusicDisplayLocator.createNullLocateResult();
  private endLocateResult = MusicDisplayLocator.createNullLocateResult();
  private rects: Record<number, SVGRectElement> = {};
  private prevMeasureLineBoxes = new Array<MeasureLineBox>();

  constructor(scrollContainer: SVGElement, startLocator: MusicDisplayLocator, endLocator: MusicDisplayLocator) {
    this.svg = scrollContainer;
    this.startLocator = startLocator;
    this.endLocator = endLocator;
  }

  update(timeMsRange: NumberRange) {
    this.startLocateResult = this.startLocator.locateByTimeMs(timeMsRange.start);
    this.endLocateResult = this.endLocator.locateByTimeMs(timeMsRange.end);
    this.render();
  }

  render() {
    const measureLineBoxes = this.calculateMeasureLineBoxes();
    const diffs = this.calculateMeasureLineBoxDiffs(this.prevMeasureLineBoxes, measureLineBoxes);
    this.applyMeasureLineBoxDiffs(diffs);
    this.prevMeasureLineBoxes = measureLineBoxes;
  }

  clear() {
    for (const rect of Object.values(this.rects)) {
      rect.remove();
    }
    this.rects = {};
    this.prevMeasureLineBoxes = [];
  }

  private removeRect(measureLine: number) {
    const rect = this.rects[measureLine];
    if (!rect) {
      return;
    }
    rect.remove();
    delete this.rects[measureLine];
  }

  private applyMeasureLineBoxDiffs(diffs: MeasureLineBoxDiff[]) {
    for (const { type, measureLineBox } of diffs) {
      switch (type) {
        case DiffType.None:
          break;
        case DiffType.Add:
        case DiffType.Change:
          const rect = this.findOrCreateRect(measureLineBox.measureLine);
          this.renderBox(measureLineBox.box, rect);
          break;
        case DiffType.Delete:
          this.removeRect(measureLineBox.measureLine);
          break;
        default:
          throw new Error(`unknown diff type: ${type}`);
      }
    }
  }

  private calculateMeasureLineBoxDiffs(srcMlbs: MeasureLineBox[], dstMlbs: MeasureLineBox[]): MeasureLineBoxDiff[] {
    const diffs = new Array<MeasureLineBoxDiff>();

    let srcNdx = 0;
    let dstNdx = 0;
    while (srcNdx < srcMlbs.length || dstNdx < dstMlbs.length) {
      const srcMlb = srcMlbs[srcNdx];
      const dstMlb = dstMlbs[dstNdx];
      if (!srcMlb) {
        diffs.push({ type: DiffType.Add, measureLineBox: dstMlb });
        dstNdx++;
        continue;
      }
      if (!dstMlb) {
        diffs.push({ type: DiffType.Delete, measureLineBox: srcMlb });
        srcNdx++;
        continue;
      }
      if (srcMlb.measureLine < dstMlb.measureLine) {
        diffs.push({ type: DiffType.Delete, measureLineBox: srcMlb });
        srcNdx++;
        continue;
      }
      if (srcMlb.measureLine > dstMlb.measureLine) {
        diffs.push({ type: DiffType.Add, measureLineBox: dstMlb });
        dstNdx++;
        continue;
      }
      if (srcMlb.box.eq(dstMlb.box)) {
        diffs.push({ type: DiffType.None, measureLineBox: dstMlb });
        dstNdx++;
        srcNdx++;
        continue;
      }
      diffs.push({ type: DiffType.Change, measureLineBox: dstMlb });
      dstNdx++;
      srcNdx++;
    }

    return diffs;
  }

  private calculateMeasureLineBoxes(): MeasureLineBox[] {
    const startCursorSnapshot = this.startLocateResult.cursorSnapshot;
    if (isNull(startCursorSnapshot)) {
      return [];
    }

    const endCursorSnapshot = this.endLocateResult.cursorSnapshot;
    if (isNull(endCursorSnapshot)) {
      return [];
    }

    const startIndex = startCursorSnapshot.index;
    const endIndex = endCursorSnapshot.index;
    const cursorSnapshots = this.startLocator.slice(startIndex, endIndex + 1);

    const byMeasureLine = (cursorSnapshot: CursorSnapshot) => cursorSnapshot.measureLine;
    const cursorSnapshotsByMeasureLine = groupBy(cursorSnapshots, byMeasureLine);
    const measureLines = uniq(sortBy(cursorSnapshots.map(byMeasureLine), identity));

    return measureLines.map((measureLine, ndx) => {
      const isFirstNdx = ndx === 0;
      const isLastNdx = ndx === measureLines.length - 1;
      const measureLineCursorSnapshots = cursorSnapshotsByMeasureLine[measureLine];

      // There's no guarantee about the sort order of lodash's groupBy, so we make sure that we get the min and max.
      const x0 = isFirstNdx
        ? this.startLocateResult.x
        : Math.min(...measureLineCursorSnapshots.map((cursorSnapshot) => cursorSnapshot.getXRange().start));
      const x1 = isLastNdx
        ? this.endLocateResult.x
        : Math.max(
            ...measureLineCursorSnapshots.map(
              (cursorSnapshot) => cursorSnapshot.getXRange().end + END_OF_MEASURE_LINE_PADDING_PX
            )
          );
      const y0 = first(measureLineCursorSnapshots)!.yRange.start;
      const y1 = last(measureLineCursorSnapshots)!.yRange.end;

      return { measureLine, box: Box.from(x0, y0).to(x1, y1) };
    });
  }

  private findOrCreateRect(measureLine: number) {
    if (!(measureLine in this.rects)) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('fill', DEFAULT_SELECTION_COLOR);
      this.svg.appendChild(rect);
      this.rects[measureLine] = rect;
    }
    return this.rects[measureLine];
  }

  private renderBox(box: Box, rect: SVGRectElement): SVGRectElement {
    rect.setAttribute('x', box.xRange.start.toString());
    rect.setAttribute('y', box.yRange.start.toString());
    rect.setAttribute('width', box.width().toString());
    rect.setAttribute('height', box.height().toString());
    rect.setAttribute('pointer-events', 'none');
    return rect;
  }
}
