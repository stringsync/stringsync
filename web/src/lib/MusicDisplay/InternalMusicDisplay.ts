import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { NullCursorWrapper } from './cursors';
import { LerpCursorWrapper } from './cursors/LerpCursorWrapper';
import { Callback, CursorWrapper, MusicDisplayOptions, SyncSettings } from './types';

/**
 * InternalMusicDisplay handles the logic involving rendering notations and cursors.
 *
 * The reason why this extends OpenSheetMusicDisplay (inheritance) instead of
 * simply having an OpenSheetMusicDisplay instance (composition) is because
 * OpenSheetMusicDisplay has protected methods that we need access to. This
 * has some unwanted side effects like callers being able to call whatever
 * they want.
 */
export class InternalMusicDisplay extends OpenSheetMusicDisplay {
  onLoadStart: Callback;
  onLoadEnd: Callback;
  onAutoScrollStart: Callback;
  onAutoScrollEnd: Callback;

  scrollContainer: HTMLDivElement;
  syncSettings: SyncSettings;
  cursorWrapper: CursorWrapper = new NullCursorWrapper();

  constructor(container: string | HTMLElement, opts: MusicDisplayOptions) {
    super(container, opts);

    this.syncSettings = opts.syncSettings;
    this.scrollContainer = opts.scrollContainer;
    this.onLoadStart = opts.onLoadStart;
    this.onLoadEnd = opts.onLoadEnd;
    this.handleResize(opts.onResizeStart, opts.onResizeEnd);
    this.onAutoScrollStart = opts.onAutoScrollStart;
    this.onAutoScrollEnd = opts.onAutoScrollEnd;
  }

  async load(xmlUrl: string) {
    this.onLoadStart();
    try {
      return await super.load(xmlUrl);
    } finally {
      this.onLoadEnd();
    }
  }

  render() {
    super.render();
    this.initCursorWrapper();
  }

  clear() {
    super.clear();
    this.cursorWrapper.clear();
  }

  updateCursor(timeMs: number) {
    this.cursorWrapper.update(timeMs);
  }

  disableAutoScroll() {
    this.cursorWrapper.disableAutoScroll();
  }

  enableAutoScroll() {
    this.cursorWrapper.enableAutoScroll();
  }

  private initCursorWrapper() {
    const [lagger, leader, lerper, probe] = this.cursors;
    if (!lagger) {
      console.debug('missing lagger cursor');
    }
    if (!leader) {
      console.debug('missing leader cursor');
    }
    if (!lerper) {
      console.debug('missing lerper cursor');
    }
    if (!probe) {
      console.debug('missing probe cursor');
    }

    this.cursorWrapper.clear();

    const lerpable = lagger && leader && lerper && probe;
    if (lerpable) {
      this.cursorWrapper = new LerpCursorWrapper({
        scrollContainer: this.scrollContainer,
        lagger,
        leader,
        lerper,
        probe,
        onAutoScrollStart: this.onAutoScrollStart,
        onAutoScrollEnd: this.onAutoScrollEnd,
      });
    } else {
      this.cursorWrapper = new NullCursorWrapper();
    }

    this.cursorWrapper.init(this.Sheet, this.syncSettings);
  }
}
