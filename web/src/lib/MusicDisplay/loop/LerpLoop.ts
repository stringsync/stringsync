import { NumberRange } from '../../../util/NumberRange';
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
      defaultStyle: { opacity: '0.5' },
      interactingStyle: { opacity: '1' },
    });

    const endCursor = LerpCursor.create(imd, locator.clone(), {
      cursorOptions: { color: '#e3e362', alpha: 1 },
      isNoteheadColoringEnabled: false,
      defaultStyle: { opacity: '0.5' },
      interactingStyle: { opacity: '1' },
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
  timeMsRange = NumberRange.from(0).to(0);

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
    this.startCursor.show();
    this.endCursor.show();
    this.render();
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

  update(timeMsRange: NumberRange) {
    this.timeMsRange = timeMsRange;
    this.render();
    this.imd.eventBus.dispatch('loopupdated', { loop: this });
  }

  resetStyles() {
    this.startCursor.updateStyle(CursorStyleType.Default);
    this.endCursor.updateStyle(CursorStyleType.Default);
  }

  private render() {
    if (!this.isActive) {
      return;
    }

    this.selectionRenderer.update(this.timeMsRange);

    if (this.timeMsRange.start !== this.startCursor.timeMs) {
      this.startCursor.update(this.timeMsRange.start);
      this.startCursor.updateStyle(CursorStyleType.Interacting);
      this.endCursor.updateStyle(CursorStyleType.Default);
    }

    if (this.timeMsRange.end !== this.endCursor.timeMs) {
      this.endCursor.update(this.timeMsRange.end);
      this.endCursor.updateStyle(CursorStyleType.Interacting);
      this.startCursor.updateStyle(CursorStyleType.Default);
    }
  }
}
