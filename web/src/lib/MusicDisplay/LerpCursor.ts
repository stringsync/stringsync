import $ from 'jquery';
import { Cursor, CursorType } from 'opensheetmusicdisplay';
import { Box } from '../../util/Box';
import { ColoringOperation } from './ColoringOperation';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayLocator } from './MusicDisplayLocator';
import { ScrollRequestType } from './Scroller';
import { CursorSnapshot } from './types';

const CURSOR_BOX_PADDING_PX = 20;

const DEFAULT_CURSOR_OPTS = [
  {
    type: CursorType.Standard,
    color: 'blue',
    follow: false,
    alpha: 0,
  },
  {
    type: CursorType.Standard,
    color: 'lime',
    follow: false,
    alpha: 0,
  },
  {
    type: CursorType.ThinLeft,
    color: '#00ffd9',
    follow: false,
    alpha: 0.5,
  },
];

type Cursors = {
  lagger: Cursor;
  leader: Cursor;
  lerper: Cursor;
};

export type LerpCursorOpts = {
  scrollContainer: HTMLElement;
  numMeasures: number;
  color: string;
};

export class LerpCursor {
  static create(imd: InternalMusicDisplay, locator: MusicDisplayLocator, opts: LerpCursorOpts) {
    const cursorsOptions = DEFAULT_CURSOR_OPTS.map((cursorsOption) => ({ id: Symbol(), ...cursorsOption }));
    cursorsOptions[2].color = opts.color;
    const cursors = imd.createCursors(cursorsOptions);
    if (cursors.length !== 3) {
      throw new Error(`expected 3 cursors, got: ${cursors.length}`);
    }

    const [lagger, leader, lerper] = cursors;

    const lerpCursor = new LerpCursor(imd, { lagger, leader, lerper }, opts);
    lerpCursor.init(locator);
    return lerpCursor;
  }

  imd: InternalMusicDisplay;

  lagger: Cursor;
  leader: Cursor;
  lerper: Cursor;
  scrollContainer: HTMLElement;
  numMeasures: number;
  timeMs = 0;

  private locator: MusicDisplayLocator | null = null;
  private prevCursorSnapshot: CursorSnapshot | null = null;
  private prevColoringOperation: ColoringOperation | null = null;

  private constructor(imd: InternalMusicDisplay, cursors: Cursors, opts: LerpCursorOpts) {
    this.imd = imd;
    this.lagger = cursors.lagger;
    this.leader = cursors.leader;
    this.lerper = cursors.lerper;
    this.numMeasures = opts.numMeasures;
    this.scrollContainer = opts.scrollContainer;
  }

  get element() {
    return this.lerper.cursorElement;
  }

  private init(locator: MusicDisplayLocator) {
    const $element = $(this.element);
    $element.css('z-index', 2);
    $element.css('pointer-events', 'none');
    $element.attr('draggable', 'false');

    this.lagger.resetIterator();
    this.leader.resetIterator();
    this.leader.next();
    this.lerper.resetIterator();

    this.lagger.show();
    this.leader.show();
    this.lerper.show();

    this.locator = locator;
  }

  update(timeMs: number) {
    if (!this.locator) {
      console.warn('cannot update cursors, must call init first');
      return;
    }
    if (timeMs === this.timeMs) {
      return;
    }
    this.timeMs = timeMs;

    const locateResult = this.locator.locateByTimeMs(timeMs);

    const nextCursorSnapshot = locateResult.cursorSnapshot;
    const prevCursorSnapshot = this.prevCursorSnapshot;

    if (nextCursorSnapshot === prevCursorSnapshot) {
      this.updateLerperPosition(locateResult.x);
    } else {
      this.updateCursors(nextCursorSnapshot);
      this.updateLerperPosition(locateResult.x);
    }

    this.imd.eventBus.dispatch('interactablemoved', {});
  }

  show() {
    if (this.leader.hidden) {
      this.leader.show();
    }
    if (this.lagger.hidden) {
      this.lagger.show();
    }
    if (this.lerper.hidden) {
      this.lerper.show();
    }
  }

  clear() {
    this.prevColoringOperation?.restore();

    this.leader.hide();
    this.lagger.hide();
    this.lerper.hide();
  }

  getBox(): Box {
    if (this.lerper.hidden) {
      return Box.from(-1, -1).to(-1, -1);
    }

    const leftSidePxStr = this.lerper.cursorElement.style.left;
    const leftSidePx = parseFloat(leftSidePxStr.replace('px', ''));
    if (isNaN(leftSidePx)) {
      return Box.from(-1, -1).to(-1, -1);
    }

    const topSidePxStr = this.lerper.cursorElement.style.top;
    const topSidePx = parseFloat(topSidePxStr.replace('px', ''));
    if (isNaN(leftSidePx)) {
      return Box.from(-1, -1).to(-1, -1);
    }

    const widthPx = this.lerper.cursorElement.width;
    const heightPx = this.lerper.cursorElement.height;
    const rightSidePx = leftSidePx + widthPx;
    const bottomSidePx = topSidePx + heightPx;

    const x0 = Math.max(0, leftSidePx - CURSOR_BOX_PADDING_PX);
    const x1 = Math.max(0, rightSidePx + CURSOR_BOX_PADDING_PX);
    const y0 = Math.max(0, topSidePx - CURSOR_BOX_PADDING_PX);
    const y1 = Math.max(0, bottomSidePx + CURSOR_BOX_PADDING_PX);

    return Box.from(x0, y0).to(x1, y1);
  }

  scrollIntoView() {
    const scroller = this.imd.scroller;
    scroller.send({ type: ScrollRequestType.Cursor, cursor: this.lagger });
  }

  private updateCursors(nextCursorSnapshot: CursorSnapshot | null) {
    if (!nextCursorSnapshot) {
      this.clear();
    } else {
      nextCursorSnapshot.iteratorSnapshot.apply(this.lagger);
      nextCursorSnapshot.iteratorSnapshot.apply(this.leader);
      this.leader.next();
      nextCursorSnapshot.iteratorSnapshot.apply(this.lerper);

      this.show();
    }

    this.scrollIntoView();

    this.prevCursorSnapshot = nextCursorSnapshot;

    this.prevColoringOperation?.restore();

    if (nextCursorSnapshot) {
      const coloringOperation = ColoringOperation.init(this.lagger);
      coloringOperation.perform();
      this.prevColoringOperation = coloringOperation;
    } else {
      this.prevColoringOperation = null;
    }

    this.imd.eventBus.dispatch('cursorinfochanged', {
      currentMeasureIndex: this.lagger.iterator.CurrentMeasureIndex,
      currentMeasureNumber: this.lagger.iterator.CurrentMeasure.MeasureNumber,
      numMeasures: this.numMeasures,
    });
  }

  private updateLerperPosition(x: number) {
    this.lerper.cursorElement.style.left = `${x}px`;
  }
}
