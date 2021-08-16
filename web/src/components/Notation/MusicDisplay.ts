import { merge, noop } from 'lodash';
import { CursorType, DrawingParametersEnum, IOSMDOptions, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { NullCursor } from './NullCursor';
import { CursorWrapper } from './types';

type Callback = () => void;

type MusicDisplayOptions = IOSMDOptions & {
  onLoadStart?: Callback;
  onLoadEnd?: Callback;
  onResizeStart?: Callback;
  onResizeEnd?: Callback;
};

const DEFAULT_OPTS: MusicDisplayOptions = {
  autoResize: true,
  backend: 'svg',
  drawTitle: false,
  drawSubtitle: false,
  drawingParameters: DrawingParametersEnum.default,
  drawPartNames: false,
  followCursor: true,
  pageBackgroundColor: 'white',
  cursorsOptions: [
    {
      type: CursorType.Standard,
      color: 'blue',
      follow: false,
      alpha: 0.25,
    },
    {
      type: CursorType.Standard,
      color: 'lime',
      follow: false,
      alpha: 0.25,
    },
  ],
};

/**
 * InternalMusicDisplay handles the logic involving rendering notations and cursors.
 *
 * The reason why this extends OpenSheetMusicDisplay (inheritance) instead of
 * simply having an OpenSheetMusicDisplay instance (composition) is because
 * OpenSheetMusicDisplay has protected methods that we need access to. This
 * has some unwanted side effects like callers being able to call whatever
 * they want.
 */
class InternalMusicDisplay extends OpenSheetMusicDisplay {
  onLoadStart: Callback;
  onLoadEnd: Callback;
  cursorWrapper: CursorWrapper = new NullCursor();

  constructor(container: string | HTMLElement, opts: MusicDisplayOptions) {
    super(container, merge({}, DEFAULT_OPTS, opts));

    this.onLoadStart = opts.onLoadStart || noop;
    this.onLoadEnd = opts.onLoadEnd || noop;
    this.handleResize(opts.onResizeStart || noop, opts.onResizeEnd || noop);
  }

  async load(xmlUrl: string) {
    this.onLoadStart();
    try {
      return await super.load(xmlUrl);
    } finally {
      this.onLoadEnd();
    }
  }

  renderCursor() {
    // Cursors are only created after render is called. We
    // ensure that they will be visible when they are ready
    // to be shown.
    for (const cursor of this.cursors) {
      cursor.cursorElement.style.zIndex = '2';
      cursor.show();
    }
  }
}

/**
 * MusicDisplay limits the public interface from InternalMusicDisplay.
 */
export class MusicDisplay {
  imd: InternalMusicDisplay;

  constructor(container: HTMLDivElement, opts: MusicDisplayOptions) {
    this.imd = new InternalMusicDisplay(container, opts);
  }

  async load(xmlUrl: string) {
    await this.imd.load(xmlUrl);
  }

  clear() {
    this.imd.clear();
  }

  renderNotation() {
    this.imd.render();
  }

  renderCursor() {
    this.imd.renderCursor();
  }
}
