import { AnchoredSelection } from '../../../util/AnchoredSelection';
import { CursorStyleType, CursorWrapper } from '../cursors';
import { LerpCursor } from '../cursors/LerpCursor';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { MusicDisplayLocator } from '../locator/MusicDisplayLocator';
import { SelectionRenderer } from './SelectionRenderer';
import { Loop } from './types';

export class LerpLoop implements Loop {
  static create(imd: InternalMusicDisplay, locator: MusicDisplayLocator) {
    const startCursor = LerpCursor.create(imd, locator.clone(), {
      cursorOptions: { color: '#e3e362', alpha: 1 },
      isNoteheadColoringEnabled: false,
      defaultStyle: { opacity: '0' },
      interactingStyle: { opacity: '0.75' },
    });

    const endCursor = LerpCursor.create(imd, locator.clone(), {
      cursorOptions: { color: '#e3e362', alpha: 1 },
      isNoteheadColoringEnabled: false,
      defaultStyle: { opacity: '0' },
      interactingStyle: { opacity: '0.75' },
    });

    const selectionRenderer = SelectionRenderer.create(imd, locator.clone());

    const loop = new LerpLoop(imd, startCursor, endCursor, selectionRenderer);
    loop.deactivate();

    return loop;
  }

  imd: InternalMusicDisplay;
  startCursor: CursorWrapper;
  endCursor: CursorWrapper;
  selectionRenderer: SelectionRenderer;

  isActive = true;

  selection = AnchoredSelection.init(0);

  private constructor(
    imd: InternalMusicDisplay,
    startCursor: CursorWrapper,
    endCursor: CursorWrapper,
    selectionRenderer: SelectionRenderer
  ) {
    this.imd = imd;
    this.startCursor = startCursor;
    this.endCursor = endCursor;
    this.selectionRenderer = selectionRenderer;
  }

  activate() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.update(this.selection.anchorValue);
    this.startCursor.show();
    this.endCursor.show();
    this.imd.eventBus.dispatch('loopactivated', { loop: this });
  }

  deactivate() {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.startCursor.clear();
    this.endCursor.clear();
    this.selectionRenderer.clear();
    this.imd.eventBus.dispatch('loopdeactivated', { loop: this });
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

    this.selectionRenderer.update(timeMsRange);

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
