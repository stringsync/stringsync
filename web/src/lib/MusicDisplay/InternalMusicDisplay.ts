import { get, set, takeRight } from 'lodash';
import { Cursor, CursorOptions, CursorType, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { LerpCursor } from './LerpCursor';
import { LerpLoop, Loop, NoopLoop } from './Loop';
import { MusicDisplayLocator } from './MusicDisplayLocator';
import { NoopCursor } from './NoopCursor';
import { Scroller } from './Scroller/Scroller';
import { SVGEventProxy } from './SVGEventProxy';
import { CursorWrapper, MusicDisplayEventBus, MusicDisplayOptions, SVGSettings, SyncSettings } from './types';

type IdentifiableCursorOptions = CursorOptions & {
  id: symbol;
};

type WithProbeCursorCallback = (probeCursor: Cursor) => void;

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
  cursorWrapper: CursorWrapper = new NoopCursor();
  loop: Loop = new NoopLoop();
  eventBus: MusicDisplayEventBus;
  svgEventProxy: SVGEventProxy | null = null;
  scroller: Scroller;

  constructor(container: string | HTMLElement, eventBus: MusicDisplayEventBus, opts: MusicDisplayOptions) {
    super(container, opts);

    this.eventBus = eventBus;
    this.syncSettings = opts.syncSettings;
    this.svgSettings = opts.svgSettings;
    this.scrollContainer = opts.scrollContainer;
    this.scroller = new Scroller(opts.scrollContainer, this);
    this.handleResize(this.onResizeStart.bind(this), this.onResizeEnd.bind(this));

    (window as any).imd = this;
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
      color: '#00ffd9',
    });

    this.svgEventProxy = SVGEventProxy.install(this, locator.clone(), this.svgSettings);

    this.loop = LerpLoop.create(this, locator.clone());
  }

  clear() {
    super.clear();
    this.cursorWrapper.clear();
    this.loop.deactivate();
    this.scroller.stop();
    this.svgEventProxy?.uninstall();
    const svg = this.container.firstElementChild;
    if (svg) {
      this.container.removeChild(svg);
    }
  }

  clearCursors() {
    const cursorOptions = new Array<IdentifiableCursorOptions>();
    set(this, 'cursorsOptions', cursorOptions);
    this.applyCursorOptions(cursorOptions);
  }

  createCursors(additionalCursorOptions: IdentifiableCursorOptions[]): Cursor[] {
    const cursorsOptions = get(this, 'cursorsOptions', []);
    const nextCursorOptions = [...cursorsOptions, ...additionalCursorOptions];
    this.applyCursorOptions(nextCursorOptions);
    return takeRight(this.cursors, additionalCursorOptions.length);
  }

  removeCursor(id: symbol) {
    const cursorsOptions = get(this, 'cursorsOptions', []);
    const cursorIndex = cursorsOptions.findIndex((opt: IdentifiableCursorOptions) => opt.id === id);

    if (cursorIndex > -1) {
      const cursor = this.cursors[cursorIndex];
      if (cursor) {
        cursor.cursorElement.remove();
      }
    }

    const nextCursorOptions = cursorsOptions.filter((opt: IdentifiableCursorOptions) => opt.id !== id);
    this.applyCursorOptions(nextCursorOptions);
  }

  enableCursors() {
    this.enableOrDisableCursors(true);
  }

  disableCursors() {
    this.enableOrDisableCursors(false);
  }

  withProbeCursor(callback: WithProbeCursorCallback) {
    const cursorOption = {
      id: Symbol(),
      type: CursorType.Standard,
      color: 'black',
      follow: false,
      alpha: 0,
    };

    const [probeCursor] = this.createCursors([cursorOption]);

    try {
      probeCursor.show();
      callback(probeCursor);
    } finally {
      this.removeCursor(cursorOption.id);
    }
  }

  forEachCursorPosition(callback: ForEachCursorPositionCallback) {
    this.withProbeCursor((probeCursor) => {
      let index = 0;
      while (!probeCursor.iterator.EndReached) {
        callback(index, probeCursor);
        probeCursor.next();
        index++;
      }
    });
  }

  private onResizeStart() {
    this.eventBus.dispatch('resizestarted', {});
  }

  private onResizeEnd() {
    this.eventBus.dispatch('resizeended', {});
  }

  private applyCursorOptions(nextCursorOptions: IdentifiableCursorOptions[]) {
    const wasEnabled = this.drawingParameters.drawCursors;

    // Transforms cursor options to cursors.
    set(this, 'cursorsOptions', nextCursorOptions);
    this.cursors = [];
    this.enableCursors();

    if (!wasEnabled) {
      this.disableCursors();
    }
  }
}
