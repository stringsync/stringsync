import { get, set, takeRight } from 'lodash';
import { Cursor, CursorOptions, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { MusicDisplayEventBus } from '.';
import { LerpCursor } from './LerpCursor';
import { MusicDisplayProber } from './MusicDisplayProber';
import { NullCursor } from './NullCursor';
import { SVGEventProxy } from './SVGEventProxy';
import { CursorWrapper, MusicDisplayOptions, SyncSettings } from './types';

/**
 * InternalMusicDisplay handles the logic involving rendering notations and cursors.
 *
 * The reason why this extends OpenSheetMusicDisplay (inheritance) instead of simply having an OpenSheetMusicDisplay
 * instance (composition) is because OpenSheetMusicDisplay has protected methods that we need access to. This
 * has some undesired side effects like callers being able to call whatever they want.
 *
 * Callers should instantiate a MusicDisplay object instead.
 */
export class InternalMusicDisplay extends OpenSheetMusicDisplay {
  scrollContainer: HTMLDivElement;
  syncSettings: SyncSettings;
  cursorWrapper: CursorWrapper = new NullCursor();
  eventBus: MusicDisplayEventBus;
  svgEventProxy: SVGEventProxy | null = null;

  constructor(container: string | HTMLElement, eventBus: MusicDisplayEventBus, opts: MusicDisplayOptions) {
    super(container, opts);

    this.eventBus = eventBus;
    this.syncSettings = opts.syncSettings;
    this.scrollContainer = opts.scrollContainer;
    this.handleResize(this.onResizeStart.bind(this), this.onResizeEnd.bind(this));
  }

  async load(xmlUrl: string) {
    this.eventBus.dispatch('loadstarted', {});
    try {
      return await super.load(xmlUrl);
    } finally {
      this.eventBus.dispatch('loadended', {});
    }
  }

  render() {
    super.render();

    const musicDisplayProber = new MusicDisplayProber(this);
    const probeResult = musicDisplayProber.probe();

    this.cursorWrapper = LerpCursor.create(this, {
      numMeasures: this.Sheet.SourceMeasures.length,
      scrollContainer: this.scrollContainer,
    });
    this.cursorWrapper.init(this.Sheet, this.syncSettings);

    this.svgEventProxy = SVGEventProxy.install(this, ['click']);
  }

  clear() {
    super.clear();
    this.cursorWrapper.clear();
  }

  addCursors(opts: CursorOptions[]): Cursor[] {
    const cursorsOptions = get(this, 'cursorsOptions', []);
    set(this, 'cursorsOptions', [...cursorsOptions, ...opts]);
    this.refreshCursors();
    return takeRight(this.cursors, opts.length);
  }

  private enableCursors() {
    this.enableOrDisableCursors(true);
  }

  private disableCursors() {
    this.enableOrDisableCursors(false);
  }

  private onResizeStart() {
    this.eventBus.dispatch('resizestarted', {});
  }

  private onResizeEnd() {
    this.eventBus.dispatch('resizeended', {});
  }

  private refreshCursors() {
    const wasEnabled = this.drawingParameters.drawCursors;
    this.enableCursors(); // Transforms cursor options to cursors
    if (!wasEnabled) {
      this.disableCursors();
    }
  }
}
