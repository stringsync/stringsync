import { get, set, takeRight } from 'lodash';
import { Cursor, CursorOptions, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { MusicDisplayEventBus } from '.';
import { LerpCursor } from './LerpCursor';
import { MusicDisplayProber } from './MusicDisplayProber';
import { NullCursor } from './NullCursor';
import { SVGEventProxy } from './SVGEventProxy';
import { CursorWrapper, MusicDisplayOptions, SyncSettings } from './types';

type IdentifiableCursorOptions = CursorOptions & {
  id: symbol;
};

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

    this.clearCursors();

    const { voiceSeeker } = MusicDisplayProber.probe(this);

    this.cursorWrapper = LerpCursor.create(this, voiceSeeker.clone(), {
      numMeasures: this.Sheet.SourceMeasures.length,
      scrollContainer: this.scrollContainer,
    });

    this.svgEventProxy = SVGEventProxy.install(this, voiceSeeker.clone(), ['click']);
  }

  clear() {
    super.clear();
    this.cursorWrapper.clear();
    this.svgEventProxy?.uninstall();
    const svg = this.container.firstElementChild;
    if (svg) {
      this.container.removeChild(svg);
    }
  }

  clearCursors() {
    set(this, 'cursorsOptions', []);
    this.refreshCursors();
  }

  pushCursors(additionalCursorOptions: IdentifiableCursorOptions[]): Cursor[] {
    const cursorsOptions = get(this, 'cursorsOptions', []);
    set(this, 'cursorsOptions', [...cursorsOptions, ...additionalCursorOptions]);
    this.refreshCursors();
    return takeRight(this.cursors, additionalCursorOptions.length);
  }

  removeCursor(id: symbol) {
    const cursorsOptions = get(this, 'cursorsOptions', []);
    const nextCursorOptions = cursorsOptions.filter((opt: IdentifiableCursorOptions) => opt.id !== id);
    set(this, 'cursorsOptions', nextCursorOptions);
    this.refreshCursors();
  }

  enableCursors() {
    this.enableOrDisableCursors(true);
  }

  disableCursors() {
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

    if (this.cursorWrapper) {
      this.cursorWrapper.clear();
    }

    this.cursors = [];
    this.enableCursors(); // Transforms cursor options to cursors
    if (!wasEnabled) {
      this.disableCursors();
    }
  }
}
