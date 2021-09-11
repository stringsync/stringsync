import { AnchoredTimeSelection } from '../AnchoredTimeSelection';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { LerpCursor } from '../LerpCursor';
import { MusicDisplayLocator } from '../MusicDisplayLocator';
import { CursorWrapper } from '../types';
import { Loop } from './types';

export class LerpLoop implements Loop {
  static create(imd: InternalMusicDisplay, locator: MusicDisplayLocator) {
    const startCursor = LerpCursor.create(imd, locator.clone(), {
      numMeasures: imd.Sheet.SourceMeasures.length,
      scrollContainer: imd.scrollContainer,
      cursorOptions: { color: 'lime' },
    });

    const endCursor = LerpCursor.create(imd, locator.clone(), {
      numMeasures: imd.Sheet.SourceMeasures.length,
      scrollContainer: imd.scrollContainer,
      cursorOptions: { color: 'red' },
    });

    const loop = new LerpLoop(imd, startCursor, endCursor);
    loop.deactivate();

    return loop;
  }

  imd: InternalMusicDisplay;
  startCursor: CursorWrapper;
  endCursor: CursorWrapper;
  isActive = true;

  private selection = AnchoredTimeSelection.init(0);

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
    this.update(this.selection.seekerTimeMs);
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
  }

  get timeMsRange() {
    return this.selection.toRange();
  }

  anchor(timeMs: number) {
    this.selection = AnchoredTimeSelection.init(timeMs);
  }

  update(timeMs: number) {
    this.selection = this.selection.update(timeMs);
    if (!this.isActive) {
      return;
    }
    const timeMsRange = this.timeMsRange;
    this.startCursor.update(timeMsRange.start);
    this.endCursor.update(timeMsRange.end);
    if (this.imd.selectionRenderer) {
      this.imd.selectionRenderer.update(this.timeMsRange);
    }
  }

  isStartCursor(cursor: CursorWrapper) {
    return this.startCursor === cursor;
  }

  isEndCursor(cursor: CursorWrapper) {
    return this.endCursor === cursor;
  }
}
