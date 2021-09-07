import { NumberRange } from '../../../util/NumberRange';
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
      color: 'lime',
    });

    const endCursor = LerpCursor.create(imd, locator.clone(), {
      numMeasures: imd.Sheet.SourceMeasures.length,
      scrollContainer: imd.scrollContainer,
      color: 'red',
    });

    const loop = new LerpLoop(imd, startCursor, endCursor);
    loop.deactivate();

    return loop;
  }

  imd: InternalMusicDisplay;
  startCursor: CursorWrapper;
  endCursor: CursorWrapper;
  timeMsRange = NumberRange.from(0).to(0);

  isActive = true;

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
    this.update(this.timeMsRange);
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

  update(timeMsRange: NumberRange) {
    this.timeMsRange = timeMsRange;
    if (!this.isActive) {
      return;
    }
    this.startCursor.update(timeMsRange.start);
    this.endCursor.update(timeMsRange.end);
  }

  isStartCursor(cursor: CursorWrapper) {
    return this.startCursor === cursor;
  }

  isEndCursor(cursor: CursorWrapper) {
    return this.endCursor === cursor;
  }
}
