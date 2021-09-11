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
  static create(scrollContainer: HTMLElement, locator: MusicDisplayLocator) {
    return new SelectionRenderer(scrollContainer, locator.clone(), locator.clone());
  }

  private scrollContainer: HTMLElement;
  private startLocator: MusicDisplayLocator;
  private endLocator: MusicDisplayLocator;
  private startLocateResult = MusicDisplayLocator.createNullLocateResult();
  private endLocateResult = MusicDisplayLocator.createNullLocateResult();
  private divs: Record<number, HTMLDivElement> = {};

  constructor(scrollContainer: HTMLElement, startLocator: MusicDisplayLocator, endLocator: MusicDisplayLocator) {
    this.scrollContainer = scrollContainer;
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
      const div = this.findOrCreateDiv(measureLine);
      this.renderBox(box, div);
    }
  }

  clear() {
    for (const div of Object.values(this.divs)) {
      div.remove();
    }
    this.divs = {};
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

    measureLineBoxes.push({
      measureLine,
      box: box.to(this.endLocateResult.x, this.endLocateResult.cursorSnapshot.yRange.end),
    });

    return measureLineBoxes;
  }

  private findOrCreateDiv(measureLine: number) {
    if (!(measureLine in this.divs)) {
      const div = document.createElement('div');
      this.scrollContainer.appendChild(div);
      this.divs[measureLine] = div;
    }
    return this.divs[measureLine];
  }

  private renderBox(box: Box, div: HTMLDivElement): HTMLDivElement {
    div.style.position = 'absolute';
    div.style.zIndex = '2';
    div.style.pointerEvents = 'none';
    div.style.backgroundColor = DEFAULT_SELECTION_COLOR;
    div.style.height = `${box.height()}px`;
    div.style.width = `${box.width()}px`;
    div.style.top = `${box.yRange.start + 146}px`;
    div.style.left = `${box.xRange.start}px`;
    return div;
  }
}
