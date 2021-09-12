import { StyleType } from '..';
import { AnchoredSelection } from '../../../util/AnchoredSelection';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { LerpCursor } from '../LerpCursor';
import { MusicDisplayLocator } from '../MusicDisplayLocator';
import { CursorWrapper } from '../types';
import { Loop } from './types';

export class LerpLoop implements Loop {
  static create(imd: InternalMusicDisplay, locator: MusicDisplayLocator) {
    const startCursor = LerpCursor.create(imd, locator.clone(), {
      numMeasures: imd.Sheet.SourceMeasures.length,
      cursorOptions: { color: '#e3e362', alpha: 1 },
      isNoteheadColoringEnabled: false,
      defaultStyle: { opacity: '0' },
      interactingStyle: { opacity: '0.75' },
    });

    const endCursor = LerpCursor.create(imd, locator.clone(), {
      numMeasures: imd.Sheet.SourceMeasures.length,
      cursorOptions: { color: '#e3e362', alpha: 1 },
      isNoteheadColoringEnabled: false,
      defaultStyle: { opacity: '0' },
      interactingStyle: { opacity: '0.75' },
    });

    const loop = new LerpLoop(imd, startCursor, endCursor);
    loop.deactivate();

    return loop;
  }

  imd: InternalMusicDisplay;
  startCursor: CursorWrapper;
  endCursor: CursorWrapper;
  isActive = true;

  selection = AnchoredSelection.init(0);

  private constructor(imd: InternalMusicDisplay, startCursor: CursorWrapper, endCursor: CursorWrapper) {
    this.imd = imd;
    this.startCursor = startCursor;
    this.endCursor = endCursor;
  }

  activate() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.update(this.selection.anchorTimeMs);
    this.startCursor.show();
    this.endCursor.show();
  }

  deactivate() {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.startCursor.clear();
    this.endCursor.clear();
    this.imd.selectionRenderer?.clear();
  }

  get timeMsRange() {
    return this.selection.toRange();
  }

  anchor(timeMs: number) {
    this.selection = AnchoredSelection.init(timeMs);
  }

  update(timeMs: number) {
    this.selection = this.selection.update(timeMs);

    if (!this.isActive) {
      return;
    }

    const timeMsRange = this.timeMsRange;

    if (this.imd.selectionRenderer) {
      this.imd.selectionRenderer.update(timeMsRange);
    }

    if (timeMsRange.start !== this.startCursor.timeMs) {
      this.startCursor.update(timeMsRange.start);
      this.startCursor.updateStyle(StyleType.Interacting);
      this.endCursor.updateStyle(StyleType.Default);
    }

    if (timeMsRange.end !== this.endCursor.timeMs) {
      this.endCursor.update(timeMsRange.end);
      this.endCursor.updateStyle(StyleType.Interacting);
      this.startCursor.updateStyle(StyleType.Default);
    }
  }

  resetStyles() {
    this.startCursor.updateStyle(StyleType.Default);
    this.endCursor.updateStyle(StyleType.Default);
  }

  isStartCursor(cursor: CursorWrapper) {
    return this.startCursor === cursor;
  }

  isEndCursor(cursor: CursorWrapper) {
    return this.endCursor === cursor;
  }
}
