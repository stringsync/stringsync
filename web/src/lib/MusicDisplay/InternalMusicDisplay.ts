import { debounce, first, get, set, takeRight } from 'lodash';
import {
  BackendType,
  Cursor,
  CursorOptions,
  CursorType,
  OpenSheetMusicDisplay,
  SvgVexFlowBackend,
  VexFlowBackend,
} from 'opensheetmusicdisplay';
import { Colorer } from './colorer';
import { CursorWrapper, LerpCursor, NoopCursor } from './cursors';
import { Fx } from './fx';
import { SyncSettings } from './locator';
import { MusicDisplayLocator } from './locator/MusicDisplayLocator';
import { LerpLoop, Loop, NoopLoop } from './loop';
import { MusicDisplayMeta } from './meta';
import { BehaviorScroller, Scroller } from './scroller';
import { SVGEventProxy, SVGSettings } from './svg';
import { MusicDisplayEventBus, MusicDisplayOptions } from './types';

type IdentifiableCursorOptions = CursorOptions & {
  id: symbol;
};

type WithProbeCursorCallback = (probeCursor: Cursor) => void;

type ForEachCursorPositionCallback = (index: number, probeCursor: Cursor) => void;

const DUMMY_SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

const isSvgBackend = (backend: VexFlowBackend | undefined): backend is SvgVexFlowBackend => {
  return !!backend && backend.getOSMDBackendType() === BackendType.SVG;
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
  svgSettings: SVGSettings;
  cursorWrapper: CursorWrapper = new NoopCursor();
  loop: Loop = new NoopLoop();
  eventBus: MusicDisplayEventBus;
  svgEventProxy: SVGEventProxy | null = null;
  scroller: Scroller;
  colorer: Colorer;
  meta: MusicDisplayMeta = MusicDisplayMeta.createNull();
  fx = new Fx(DUMMY_SVG);

  isResizing = false;
  isRendered = false;

  constructor(container: string | HTMLElement, eventBus: MusicDisplayEventBus, opts: MusicDisplayOptions) {
    super(container, opts);

    this.eventBus = eventBus;
    this.syncSettings = opts.syncSettings;
    this.svgSettings = opts.svgSettings;
    this.scrollContainer = opts.scrollContainer;
    this.scroller = new BehaviorScroller(opts.scrollContainer, this);
    this.colorer = new Colorer();
  }

  async load(xmlUrl: string) {
    this.eventBus.dispatch('loadstarted', {});
    try {
      return await super.load(xmlUrl);
    } finally {
      this.eventBus.dispatch('loadended', {});
    }
  }

  dispose() {
    this.clear();
    this.container.firstElementChild?.remove();
  }

  resize() {
    if (!this.isRendered) {
      // Callers should call render() first
      return;
    }
    if (!this.isResizing) {
      this.eventBus.dispatch('resizestarted', {});
      this.isResizing = true;
    }
    this.debouncedResize();
  }

  private debouncedResize = debounce(
    () => {
      // HACK, manually resize based on:
      // https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/blob/a2309f768080a1b14f292fbf83c246f1bea00318/src/OpenSheetMusicDisplay/OpenSheetMusicDisplay.ts#L700-L705
      if (this.IsReadyToRender()) {
        this.Drawer.Backends[0].removeAllChildrenFromContainer(this.container);
        this.Drawer.Backends.clear();
        this.render();
      }

      this.isResizing = false;
      this.eventBus.dispatch('resizeended', {});
    },
    500,
    { leading: false, trailing: true }
  );

  render() {
    super.render();

    this.clearCursors();

    const locator = MusicDisplayLocator.create(this);

    const timeMs = this.cursorWrapper.timeMs;
    this.cursorWrapper = LerpCursor.create(this, locator.clone(), {
      isNoteheadColoringEnabled: true,
      defaultStyle: { opacity: '0.5', 'box-shadow': '0 0 0' },
      interactingStyle: { opacity: '1', 'box-shadow': '0 0 10px #00ffd9' },
    });
    this.cursorWrapper.update(timeMs);

    this.svgEventProxy = SVGEventProxy.install(this, locator.clone(), this.svgSettings);

    this.loop = LerpLoop.create(this, locator.clone());
    const firstCursorSnapshot = first(locator.cursorSnapshots);
    if (firstCursorSnapshot) {
      this.loop.update(firstCursorSnapshot.getMeasureTimeMsRange());
    }

    this.fx = new Fx(this.getSvg());
    this.meta = MusicDisplayMeta.create(locator.clone());

    this.eventBus.dispatch('resizeended', {});
    this.eventBus.dispatch('rendered', {});

    this.isRendered = true;
  }

  clear() {
    super.clear();
    this.cursorWrapper.clear();
    this.loop.deactivate();
    this.scroller.disable();
    this.svgEventProxy?.uninstall();
    this.getSvg().remove();
    this.isRendered = false;
  }

  getSvg() {
    const backend = this.Drawer.Backends[0];
    if (!isSvgBackend(backend)) {
      throw new Error('expected the first backend to be an svg backend');
    }
    return backend.getSvgElement();
  }

  clearCursors() {
    const cursorOptions = new Array<IdentifiableCursorOptions>();
    this.applyCursorOptions(cursorOptions);
  }

  createCursors(additionalCursorOptions: IdentifiableCursorOptions[]): Cursor[] {
    const cursorsOptions = get(this, 'cursorsOptions', []);
    const nextCursorOptions = [...cursorsOptions, ...additionalCursorOptions];
    this.applyCursorOptions(nextCursorOptions);
    return takeRight(this.cursors, additionalCursorOptions.length);
  }

  removeCursor(id: symbol) {
    const cursorsOptions = get(this, 'cursorsOptions', []) as IdentifiableCursorOptions[];
    const nextCursorOptions = cursorsOptions.filter((opt) => opt.id !== id);
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

  private applyCursorOptions(nextCursorOptions: IdentifiableCursorOptions[]) {
    const wasEnabled = this.drawingParameters.drawCursors;

    // Remove cursors that aren't in the next cursor options
    const nextCursorOptionIds = new Set(nextCursorOptions.map((cursorOption) => cursorOption.id));
    const currentCursorOptions = get(this, 'cursorsOptions', []) as IdentifiableCursorOptions[];
    const currentIdAndIndex = currentCursorOptions.map((cursorOption, index) => ({ id: cursorOption.id, index }));
    const deleteIdAndIndex = currentIdAndIndex.filter(({ id }) => !nextCursorOptionIds.has(id));

    for (const { index } of deleteIdAndIndex) {
      const cursor = this.cursors[index];
      if (cursor) {
        cursor.cursorElement.remove();
      }
    }

    // Transforms cursor options to cursors.
    set(this, 'cursorsOptions', nextCursorOptions);
    this.cursors = [];
    this.enableCursors();

    if (!wasEnabled) {
      this.disableCursors();
    }
  }
}
