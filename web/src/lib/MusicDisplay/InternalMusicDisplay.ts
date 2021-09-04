import { get, set, takeRight } from 'lodash';
import { Cursor, CursorOptions, CursorType, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { MusicDisplayEventBus, SVGSettings } from '.';
import { LerpCursor } from './LerpCursor';
import { MusicDisplayLocator } from './MusicDisplayLocator';
import { NullCursor } from './NullCursor';
import { SVGEventProxy } from './SVGEventProxy';
import { CursorWrapper, MusicDisplayOptions, SyncSettings } from './types';

type IdentifiableCursorOptions = CursorOptions & {
  id: symbol;
};

type ForEachCursorPositionCallback = (index: number, probeCursor: Cursor) => void;

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
  svgSettings: SVGSettings;
  cursorWrapper: CursorWrapper = new NullCursor();
  eventBus: MusicDisplayEventBus;
  svgEventProxy: SVGEventProxy | null = null;

  constructor(container: string | HTMLElement, eventBus: MusicDisplayEventBus, opts: MusicDisplayOptions) {
    super(container, opts);

    this.eventBus = eventBus;
    this.syncSettings = opts.syncSettings;
    this.svgSettings = opts.svgSettings;
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

    const locator = MusicDisplayLocator.create(this);

    this.cursorWrapper = LerpCursor.create(this, locator.clone(), {
      numMeasures: this.Sheet.SourceMeasures.length,
      scrollContainer: this.scrollContainer,
    });

    this.svgEventProxy = SVGEventProxy.install(this, locator.clone(), this.svgSettings);
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

  forEachCursorPosition(callback: ForEachCursorPositionCallback) {
    const cursorOption = {
      id: Symbol(),
      type: CursorType.Standard,
      color: 'black',
      follow: false,
      alpha: 0,
    };

    const [probeCursor] = this.pushCursors([cursorOption]);

    let index = 0;
    try {
      probeCursor.show();
      while (!probeCursor.iterator.EndReached) {
        callback(index, probeCursor);
        probeCursor.next();
        index++;
      }
    } finally {
      this.removeCursor(cursorOption.id);
    }
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
