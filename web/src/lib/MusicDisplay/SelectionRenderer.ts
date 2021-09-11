import { isNull } from 'lodash';
import { CursorSnapshot } from '.';
import { Box } from '../../util/Box';
import { NumberRange } from '../../util/NumberRange';
import { MusicDisplayLocator } from './MusicDisplayLocator';

const DEFAULT_SELECTION_COLOR = 'rgba(244, 244, 188, 0.45)';

type MeasureLineBox = {
  measureLine: number;
  box: Box;
};

export class SelectionRenderer {
  static create(svg: SVGElement, locator: MusicDisplayLocator) {
    return new SelectionRenderer(svg, locator.clone(), locator.clone());
  }

  private svg: SVGElement;
  private startLocator: MusicDisplayLocator;
  private endLocator: MusicDisplayLocator;
  private startLocateResult = MusicDisplayLocator.createNullLocateResult();
  private endLocateResult = MusicDisplayLocator.createNullLocateResult();
  private rects: Record<number, SVGRectElement> = {};

  constructor(scrollContainer: SVGElement, startLocator: MusicDisplayLocator, endLocator: MusicDisplayLocator) {
    this.svg = scrollContainer;
    this.startLocator = startLocator;
    this.endLocator = endLocator;
  }

  update(timeMsRange: NumberRange) {
    this.startLocateResult = this.startLocator.locateByTimeMs(timeMsRange.start);
    this.endLocateResult = this.endLocator.locateByTimeMs(timeMsRange.end);
    this.clear();
    this.show();
  }

  show() {
    const measureLineBoxes = this.calculateMeasureLineBoxes();
    for (const { measureLine, box } of measureLineBoxes) {
      const div = this.findOrCreateRect(measureLine);
      this.renderBox(box, div);
    }
  }

  clear() {
    for (const div of Object.values(this.rects)) {
      div.remove();
    }
    this.rects = {};
  }

  private calculateMeasureLineBoxes(): MeasureLineBox[] {
    if (isNull(this.startLocateResult.cursorSnapshot)) {
      return [];
    }
    if (isNull(this.endLocateResult.cursorSnapshot)) {
      return [];
    }

    const measureLineBoxes = new Array<MeasureLineBox>();

    let cursorSnapshot: CursorSnapshot = this.startLocateResult.cursorSnapshot;
    let measureLine = cursorSnapshot.measureLine;
    let box = Box.from(this.startLocateResult.x, cursorSnapshot.yRange.start);

    while (cursorSnapshot !== this.endLocateResult.cursorSnapshot) {
      const nextCursorSnapshot = cursorSnapshot.next;
      if (!nextCursorSnapshot) {
        break;
      }

      const prevCursorSnapshot = cursorSnapshot.prev;
      if (!prevCursorSnapshot) {
        cursorSnapshot = nextCursorSnapshot;
        continue;
      }

      const measureLineChanged = cursorSnapshot.measureLine !== measureLine;
      if (measureLineChanged) {
        measureLineBoxes.push({
          measureLine,
          box: box.to(prevCursorSnapshot.xRange.end, prevCursorSnapshot.yRange.end),
        });
        measureLine = cursorSnapshot.measureLine;
        box = Box.from(cursorSnapshot.xRange.start, cursorSnapshot.yRange.start);
      }

      cursorSnapshot = nextCursorSnapshot;
    }

    // TODO(jared) Fix trying to seek before the first note on the next line

    measureLineBoxes.push({
      measureLine,
      box: box.to(this.endLocateResult.x, this.endLocateResult.cursorSnapshot.yRange.end),
    });

    return measureLineBoxes;
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
    return rect;
  }
}
