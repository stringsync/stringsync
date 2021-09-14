import { AnchoredSelection } from '../../../util/AnchoredSelection';
import { CursorStyleType, CursorWrapper } from '../cursors';
import { LerpCursor } from '../cursors/LerpCursor';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { MusicDisplayLocator } from '../locator/MusicDisplayLocator';
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
      this.startCursor.updateStyle(CursorStyleType.Interacting);
      this.endCursor.updateStyle(CursorStyleType.Default);
    }

    if (timeMsRange.end !== this.endCursor.timeMs) {
      this.endCursor.update(timeMsRange.end);
      this.endCursor.updateStyle(CursorStyleType.Interacting);
      this.startCursor.updateStyle(CursorStyleType.Default);
    }
  }

  resetStyles() {
    this.startCursor.updateStyle(CursorStyleType.Default);
    this.endCursor.updateStyle(CursorStyleType.Default);
  }

  isStartCursor(cursor: CursorWrapper) {
    return this.startCursor === cursor;
  }

  isEndCursor(cursor: CursorWrapper) {
    return this.endCursor === cursor;
  }
}
