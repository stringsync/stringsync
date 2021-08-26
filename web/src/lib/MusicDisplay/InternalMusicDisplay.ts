import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { MusicDisplayEventBus } from '.';
import { LerpCursor } from './LerpCursor';
import { NullCursor } from './NullCursor';
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

  scrollContainer: HTMLDivElement;
  syncSettings: SyncSettings;
  cursorWrapper: CursorWrapper = new NullCursor();
  eventBus: MusicDisplayEventBus;

  constructor(container: string | HTMLElement, eventBus: MusicDisplayEventBus, opts: MusicDisplayOptions) {
    super(container, opts);

    this.eventBus = eventBus;
    this.syncSettings = opts.syncSettings;
    this.scrollContainer = opts.scrollContainer;
    this.onLoadStart = opts.onLoadStart;
    this.onLoadEnd = opts.onLoadEnd;
    this.handleResize(opts.onResizeStart, opts.onResizeEnd);
  }

  async load(xmlUrl: string) {
    this.eventBus.dispatch('loadStarted', {});
    this.onLoadStart();
    try {
      return await super.load(xmlUrl);
    } finally {
      this.eventBus.dispatch('loadEnded', {});
      this.onLoadEnd();
    }
  }

  render() {
    super.render();
    this.initCursor();
  }

  clear() {
    super.clear();
    this.cursorWrapper.clear();
  }

  updateCursor(timeMs: number) {
    this.cursorWrapper.update(timeMs);
  }

  private initCursor() {
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

    const lerpable = lagger && leader && lerper && probe;
    if (!lerpable) {
      throw new Error('could not init cursor');
    }

    this.cursorWrapper = new LerpCursor(this.eventBus, {
      lagger,
      leader,
      lerper,
      probe,
      numMeasures: this.Sheet.SourceMeasures.length,
      scrollContainer: this.scrollContainer,
    });

    this.cursorWrapper.init(this.Sheet, this.syncSettings);
  }
}
