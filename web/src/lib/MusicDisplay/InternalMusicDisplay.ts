import { merge, noop } from 'lodash';
import { CursorType, DrawingParametersEnum, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { theme } from '../../theme';
import { NullCursorWrapper } from './cursors';
import { LerpCursorWrapper } from './cursors/LerpCursorWrapper';
import { Callback, CursorWrapper, MusicDisplayOptions, SyncSettings } from './types';

const DEFAULT_OPTS: MusicDisplayOptions = {
  syncSettings: {
    deadTimeMs: 0,
    durationMs: 0,
  },
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
      alpha: 0.3,
    },
    {
      type: CursorType.Standard,
      color: 'lime',
      follow: false,
      alpha: 0.3,
    },
    {
      type: CursorType.Standard,
      color: theme['@primary-color'],
      follow: true,
      alpha: 0.5,
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
export class InternalMusicDisplay extends OpenSheetMusicDisplay {
  onLoadStart: Callback;
  onLoadEnd: Callback;

  cursorWrapper: CursorWrapper = new NullCursorWrapper();
  syncSettings: SyncSettings;

  constructor(container: string | HTMLElement, opts: MusicDisplayOptions) {
    super(container, merge({}, DEFAULT_OPTS, opts));

    this.syncSettings = opts.syncSettings;
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

  private initCursorWrapper() {
    const [lagger, leader, lerped] = this.cursors;
    if (!lagger) {
      console.debug('missing lagger cursor');
    }
    if (!leader) {
      console.debug('missing leader cursor');
    }
    if (!lerped) {
      console.debug('missing leader cursor');
    }

    this.cursorWrapper.clear();

    const lerpable = lagger && leader && lerped;
    if (lerpable) {
      this.cursorWrapper = new LerpCursorWrapper(lagger, leader, lerped);
    } else {
      this.cursorWrapper = new NullCursorWrapper();
    }

    this.cursorWrapper.init(this.Sheet, this.syncSettings);
  }
}
