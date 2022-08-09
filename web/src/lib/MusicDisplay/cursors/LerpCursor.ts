import $ from 'jquery';
import { difference, intersection, isString, uniq } from 'lodash';
import { Cursor, CursorOptions, CursorType } from 'opensheetmusicdisplay';
import { Box } from '../../../util/Box';
import { Duration } from '../../../util/Duration';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { CursorSnapshot } from '../locator';
import { MusicDisplayLocator } from '../locator/MusicDisplayLocator';
import { CursorStyleType, CursorWrapper } from './types';

const CURSOR_BOX_PADDING_PX = 30;
const CURSOR_STYLE_TRANSITION_DURATION = Duration.ms(200);

const DEFAULT_CURSOR_OPTS = [
  {
    type: CursorType.ThinLeft,
    color: '#00FF7F',
    follow: false,
    alpha: 1,
  },
];

type LerpCursorStyle = Omit<Record<string, string>, 'top' | 'left' | 'x' | 'y'>;

export type LerpCursorOpts = {
  cursorOptions?: Partial<Pick<CursorOptions, 'type' | 'color' | 'alpha'>>;
  isNoteheadColoringEnabled: boolean;
  defaultStyle?: LerpCursorStyle;
  interactingStyle?: LerpCursorStyle;
};

export class LerpCursor implements CursorWrapper {
  static create(imd: InternalMusicDisplay, locator: MusicDisplayLocator, opts: LerpCursorOpts) {
    const cursorsOptions = DEFAULT_CURSOR_OPTS.map((cursorsOption) => ({ id: Symbol(), ...cursorsOption }));
    Object.assign(cursorsOptions[0], opts.cursorOptions);
    const cursors = imd.createCursors(cursorsOptions);
    if (cursors.length !== 1) {
      throw new Error(`expected 1 cursor, got: ${cursors.length}`);
    }

    const cursor = cursors[0];
    const lerpCursor = new LerpCursor(imd, cursor, opts);
    lerpCursor.init(locator);
    return lerpCursor;
  }

  imd: InternalMusicDisplay;

  cursor: Cursor;
  cursorSnapshot: CursorSnapshot | null = null;
  scrollContainer: HTMLElement;
  timeMs = -1;
  styleType = CursorStyleType.Default;
  opts: LerpCursorOpts;

  private locator: MusicDisplayLocator | null = null;
  private noteColorOpId = Symbol();
  private prevLerpX: number = 0;

  private constructor(imd: InternalMusicDisplay, cursor: Cursor, opts: LerpCursorOpts) {
    this.imd = imd;
    this.scrollContainer = imd.scrollContainer;
    this.cursor = cursor;
    this.opts = opts;
  }

  get element() {
    return this.cursor.cursorElement;
  }

  private init(locator: MusicDisplayLocator) {
    const $element = $(this.element);
    $element.css('z-index', 2);
    $element.css('pointer-events', 'none');
    $element.attr('draggable', 'false');

    const defaultStyle = this.opts.defaultStyle || {};
    for (const [prop, value] of Object.entries(defaultStyle)) {
      $element.css(prop, value);
    }

    // get only CSS styles that will transition
    const defaultStyleProps = Object.keys(defaultStyle);
    const interactingStyleProps = Object.keys(this.opts.interactingStyle || {});
    const props = uniq([...defaultStyleProps, ...interactingStyleProps]).join(', ');
    if (props) {
      $element.css('transition', `${props} ${CURSOR_STYLE_TRANSITION_DURATION.ms}ms`);
    }

    this.cursor.resetIterator();
    this.cursor.show();
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
    const prevCursorSnapshot = this.cursorSnapshot;

    if (nextCursorSnapshot === prevCursorSnapshot) {
      this.updateLerperPosition(locateResult.x);
    } else {
      this.updateCursors(nextCursorSnapshot);
      if (nextCursorSnapshot) {
        this.updateLerperPosition(locateResult.x);
      }
    }

    if (!CursorSnapshot.isOnSameMeasureLine(prevCursorSnapshot, nextCursorSnapshot)) {
      this.imd.eventBus.dispatch('measurelinechanged', {});
    }
    this.imd.eventBus.dispatch('interactablemoved', {});
  }

  updateStyle(styleType: CursorStyleType) {
    if (styleType === this.styleType) {
      return;
    }
    this.changeStyle(styleType);
  }

  scrollIntoView() {
    this.imd.scroller.scrollToCursor(this.cursor);
  }

  show() {
    if (this.cursor.hidden) {
      this.cursor.show();
    }
    this.updateLerperPosition(this.prevLerpX);
  }

  clear() {
    this.imd.colorer.undo(this.noteColorOpId);
    this.cursor.hide();
  }

  getBox(): Box {
    if (this.cursor.hidden) {
      return Box.from(-1, -1).to(-1, -1);
    }

    const leftSidePxStr = this.cursor.cursorElement.style.left;
    const leftSidePx = parseFloat(leftSidePxStr.replace('px', ''));
    if (isNaN(leftSidePx)) {
      return Box.from(-1, -1).to(-1, -1);
    }

    const topSidePxStr = this.cursor.cursorElement.style.top;
    const topSidePx = parseFloat(topSidePxStr.replace('px', ''));
    if (isNaN(leftSidePx)) {
      return Box.from(-1, -1).to(-1, -1);
    }

    const widthPx = this.cursor.cursorElement.width;
    const heightPx = this.cursor.cursorElement.height;
    const rightSidePx = leftSidePx + widthPx;
    const bottomSidePx = topSidePx + heightPx;

    const x0 = Math.max(0, leftSidePx - CURSOR_BOX_PADDING_PX);
    const x1 = Math.max(0, rightSidePx + CURSOR_BOX_PADDING_PX);
    const y0 = Math.max(0, topSidePx - CURSOR_BOX_PADDING_PX);
    const y1 = Math.max(0, bottomSidePx + CURSOR_BOX_PADDING_PX);

    return Box.from(x0, y0).to(x1, y1);
  }

  private changeStyle(nextStyleType: CursorStyleType) {
    const currentStyle = this.getStyle(this.styleType);
    const nextStyle = this.getStyle(nextStyleType);

    const currentProps = Object.keys(currentStyle);
    const nextProps = Object.keys(nextStyle);

    const removedProps = difference(currentProps, nextProps);
    const changedProps = intersection(currentProps, nextProps);
    const addedProps = difference(nextProps, currentProps);

    const $element = $(this.element);
    for (const prop of removedProps) {
      $element.css(prop, '');
    }
    for (const prop of [...changedProps, ...addedProps]) {
      const value = nextStyle[prop];
      if (isString(value)) {
        $element.css(prop, value);
      }
    }
    this.styleType = nextStyleType;
  }

  private getStyle(styleType: CursorStyleType): LerpCursorStyle {
    switch (styleType) {
      case CursorStyleType.Interacting:
        return this.opts.interactingStyle || {};
      default:
        return this.opts.defaultStyle || {};
    }
  }

  private updateCursors(nextCursorSnapshot: CursorSnapshot | null) {
    if (!nextCursorSnapshot) {
      this.clear();
    } else {
      nextCursorSnapshot.getIteratorSnapshot().apply(this.cursor);
      this.show();
    }

    this.cursorSnapshot = nextCursorSnapshot;

    if (this.opts.isNoteheadColoringEnabled) {
      this.imd.colorer.undo(this.noteColorOpId);

      if (nextCursorSnapshot) {
        this.noteColorOpId = this.imd.colorer.colorNotesUnderCursorSnapshot('#ff6677', nextCursorSnapshot);
      }
    }

    this.imd.eventBus.dispatch('cursorsnapshotchanged', {
      cursorSnapshot: nextCursorSnapshot,
    });
  }

  private updateLerperPosition(x: number) {
    this.prevLerpX = x;
    this.element.style.left = `${x}px`;
  }
}
